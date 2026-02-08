<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\AreaParkir;
use App\Models\Kendaraan;
use App\Models\TarifParkir;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TransaksiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request){
        $query = Transaksi::with([
            'areaParkir',
            'kendaraan.jenis',
            'tarifParkir.jenisKendaraan',
            'user'
        ])->latest();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('kendaraan', function ($kendaraanQuery) use ($search) {
                    $kendaraanQuery->where('plat_nomor', 'like', "%{$search}%")
                        ->orWhere('pemilik', 'like', "%{$search}%");
                })
                    ->orWhereHas('areaParkir', function ($areaQuery) use ($search) {
                        $areaQuery->where('nama_area', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $transaksi = $query->paginate(10)->withQueryString();

        return Inertia::render('petugas/transaksi/index', [
            'transaksi' => $transaksi,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Ambil semua area parkir
        $areaParkir = AreaParkir::select('id', 'nama_area')->get();

        // Ambil semua kendaraan dengan jenis
        $kendaraan = Kendaraan::with('jenis')->get();

        // Ambil semua tarif parkir dengan jenis kendaraan
        $tarifParkir = TarifParkir::with('jenisKendaraan')->get();

        // Debug logging
        Log::info('Create Form Data:', [
            'kendaraan_count' => $kendaraan->count(),
            'tarif_count' => $tarifParkir->count(),
            'kendaraan_sample' => $kendaraan->first(),
            'tarif_sample' => $tarifParkir->first(),
        ]);

        return Inertia::render('petugas/transaksi/create', [
            'areaParkir' => $areaParkir,
            'kendaraan' => $kendaraan,
            'tarifParkir' => $tarifParkir,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Log request data
        Log::info('Store Request Data:', $request->all());

        $validated = $request->validate([
            'area_parkir_id' => 'required|exists:area_parkirs,id',
            'kendaraan_id' => [
                'required',
                'exists:kendaraans,id',
                // Custom validation: kendaraan tidak boleh sedang parkir
                function ($attribute, $value, $fail) {
                    if (Transaksi::isKendaraanParkir($value)) {
                        $fail('Kendaraan ini sedang parkir. Silakan checkout terlebih dahulu.');
                    }
                },
            ],
            'waktu_masuk' => 'required|date',
        ]);

        try {
            DB::beginTransaction();

            // Ambil data kendaraan untuk mendapatkan jenis kendaraan
            $kendaraan = Kendaraan::with('jenis')->findOrFail($validated['kendaraan_id']);

            Log::info('Kendaraan Data:', [
                'kendaraan_id' => $kendaraan->id,
                'jenis_id' => $kendaraan->jenis_id,
                'jenis' => $kendaraan->jenis,
            ]);

            // Cari tarif parkir berdasarkan jenis kendaraan
            // Fix: Gunakan kolom 'jenis_kendaraan_id' bukan 'jenis_id'
            $tarifParkir = TarifParkir::where('jenis_kendaraan_id', $kendaraan->jenis_kendaraan_id)->first();

            Log::info('Tarif Search:', [
                'searching_for_jenis_id' => $kendaraan->jenis_kendaraan_id,
                'found_tarif' => $tarifParkir,
                // 'all_tarif' => TarifParkir::all(), // Reduced noise
            ]);

            if (!$tarifParkir) {
                DB::rollBack();
                return back()->withErrors([
                    'kendaraan_id' => 'Tarif parkir untuk jenis kendaraan ini belum tersedia.'
                ])->withInput();
            }

            // Validasi kapasitas area parkir
            $areaParkir = AreaParkir::lockForUpdate()->findOrFail($validated['area_parkir_id']);

            if ($areaParkir->terisi >= $areaParkir->kapasitas) {
                DB::rollBack();
                return back()->withErrors([
                    'area_parkir_id' => 'Area parkir ini sudah penuh (' . $areaParkir->terisi . '/' . $areaParkir->kapasitas . ').'
                ])->withInput();
            }

            // Buat transaksi baru
            $transaksi = Transaksi::create([
                'area_parkir_id' => $validated['area_parkir_id'],
                'kendaraan_id' => $validated['kendaraan_id'],
                'waktu_masuk' => $validated['waktu_masuk'],
                'waktu_keluar' => null,
                'tarif_parkir_id' => $tarifParkir->id,
                'durasi_jam' => null,
                'biaya_total' => null,
                'status' => 'masuk',
                'user_id' => Auth::id(),
            ]);

            // Increment kapasitas terisi
            $areaParkir->increment('terisi');

            Log::info('Transaksi Created:', $transaksi->toArray());

            // Log aktivitas: Kendaraan masuk parkir
            LogAktivitas::create([
                'user_id' => Auth::id(),
                'aktivitas' => 'Kendaraan masuk parkir - Plat: ' . $kendaraan->plat_nomor . ' | Area: ' . $areaParkir->nama_area,
                'waktu_aktivitas' => now(),
            ]);

            DB::commit();

            return redirect()->route('petugas.transaksi.index')
                ->with('success', 'Kendaraan berhasil masuk area parkir!');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Store Error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors([
                'error' => 'Gagal menyimpan transaksi: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    /**
 * Update the specified resource in storage.
 */
    public function update(Request $request, string $id){
        $transaksi = Transaksi::with('tarifParkir')->findOrFail($id);

        Log::info('=== MULAI PROSES UPDATE ===');
        Log::info('Transaksi Data Before Update:', [
            'id' => $transaksi->id,
            'waktu_masuk' => $transaksi->waktu_masuk,
            'tarif_parkir_id' => $transaksi->tarif_parkir_id,
            'tarifParkir_object' => $transaksi->tarifParkir,
            'tarif_per_jam' => $transaksi->tarifParkir?->tarif_per_jam,
        ]);

        // Jika request adalah untuk checkout (mengubah status menjadi keluar)
        if ($request->has('checkout') && $request->checkout == true) {
            $validated = $request->validate([
                'waktu_keluar' => 'required|date|after:' . $transaksi->waktu_masuk,
            ]);

            try {
                DB::beginTransaction();

                // Pastikan transaksi masih berstatus 'masuk'
                if ($transaksi->status !== 'masuk') {
                    DB::rollBack();
                    return back()->with('error', 'Transaksi ini sudah checkout!');
                }

                // Set waktu keluar pada transaksi
                $transaksi->waktu_keluar = $validated['waktu_keluar'];

                Log::info('Waktu yang akan diproses:', [
                    'waktu_masuk_raw' => $transaksi->waktu_masuk,
                    'waktu_keluar_raw' => $transaksi->waktu_keluar,
                    'waktu_keluar_validated' => $validated['waktu_keluar'],
                ]);

                // Hitung durasi dan biaya berdasarkan waktu masuk dan keluar
                $waktuMasuk = Carbon::parse($transaksi->waktu_masuk);
                $waktuKeluar = Carbon::parse($transaksi->waktu_keluar);

                Log::info('Carbon Parsing:', [
                    'waktu_masuk_carbon' => $waktuMasuk->format('Y-m-d H:i:s'),
                    'waktu_keluar_carbon' => $waktuKeluar->format('Y-m-d H:i:s'),
                ]);

                // PERBAIKAN: Hitung selisih dalam MENIT, lalu konversi ke jam (desimal)
                $selisihMenit = abs($waktuKeluar->diffInMinutes($waktuMasuk));
                $selisihJam = $selisihMenit / 60;
                $durasiJam = (int) ceil($selisihJam);

                Log::info('Perhitungan Durasi:', [
                    'selisih_menit' => $selisihMenit,
                    'selisih_jam_desimal' => $selisihJam,
                    'durasi_jam_sebelum_max' => $durasiJam,
                ]);

                // Minimal 1 jam
                $durasiJam = max(1, $durasiJam);

                Log::info('Durasi Final:', [
                    'durasi_jam_setelah_max' => $durasiJam,
                ]);

                // Reload relasi untuk memastikan tarif parkir ter-load
                $transaksi->load('tarifParkir');

                // Hitung biaya total = durasi_jam * tarif_per_jam
                $tarifPerJam = $transaksi->tarifParkir->tarif_per_jam ?? 0;
                $biayaTotal = $durasiJam * $tarifPerJam;

                Log::info('Perhitungan Biaya Checkout:', [
                    'transaksi_id' => $transaksi->id,
                    'tarif_parkir_id' => $transaksi->tarif_parkir_id,
                    'tarif_parkir_object' => $transaksi->tarifParkir ? $transaksi->tarifParkir->toArray() : null,
                    'selisih_menit' => $selisihMenit,
                    'selisih_jam_desimal' => $selisihJam,
                    'durasi_jam' => $durasiJam,
                    'tarif_per_jam' => $tarifPerJam,
                    'rumus' => $durasiJam . ' jam × Rp ' . number_format($tarifPerJam, 0) . ' = Rp ' . number_format($biayaTotal, 0),
                    'biaya_total' => $biayaTotal
                ]);

                // Simpan durasi dan biaya
                $transaksi->durasi_jam = $durasiJam;
                $transaksi->biaya_total = $biayaTotal;
                $transaksi->status = 'keluar';

                Log::info('Data yang akan disimpan:', [
                    'durasi_jam' => $transaksi->durasi_jam,
                    'biaya_total' => $transaksi->biaya_total,
                    'status' => $transaksi->status,
                ]);

                $transaksi->save();

                Log::info('Data setelah disimpan:', [
                    'id' => $transaksi->id,
                    'durasi_jam' => $transaksi->durasi_jam,
                    'biaya_total' => $transaksi->biaya_total,
                ]);

                // Decrement kapasitas terisi
                $areaParkir = AreaParkir::lockForUpdate()->find($transaksi->area_parkir_id);
                if ($areaParkir && $areaParkir->terisi > 0) {
                    $areaParkir->decrement('terisi');
                }

                DB::commit();

                Log::info('=== CHECKOUT BERHASIL ===');

                // Log aktivitas: Checkout transaksi
                LogAktivitas::create([
                    'user_id' => Auth::id(),
                    'aktivitas' => 'Checkout transaksi - Plat: ' . $transaksi->kendaraan->plat_nomor . ' | Durasi: ' . $durasiJam . ' jam | Biaya: Rp ' . number_format($biayaTotal, 0),
                    'waktu_aktivitas' => now(),
                ]);

                return redirect()->route('petugas.transaksi.index')
                    ->with('success', 'Checkout berhasil! Durasi: ' . $durasiJam . ' jam | Total biaya: Rp ' . number_format($biayaTotal, 0, ',', '.'));

            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Checkout Error:', [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);

                return back()->withErrors([
                    'error' => 'Gagal melakukan checkout: ' . $e->getMessage()
                ]);
            }
        }

        // Jika request adalah untuk update biasa (edit data transaksi)
        $validated = $request->validate([
            'area_parkir_id' => 'required|exists:area_parkirs,id',
            'kendaraan_id' => [
                'required',
                'exists:kendaraans,id',
                // Validasi: kendaraan tidak boleh sedang parkir (kecuali transaksi ini sendiri)
                function ($attribute, $value, $fail) use ($id) {
                    $existing = Transaksi::where('kendaraan_id', $value)
                        ->where('status', 'masuk')
                        ->where('id', '!=', $id)
                        ->exists();

                    if ($existing) {
                        $fail('Kendaraan ini sedang parkir di transaksi lain.');
                    }
                },
            ],
            'waktu_masuk' => 'required|date',
        ]);

        try {
            DB::beginTransaction();

            // Jika kendaraan berubah, update tarif parkir
            if ($validated['kendaraan_id'] != $transaksi->kendaraan_id) {
                $kendaraan = Kendaraan::with('jenis')->findOrFail($validated['kendaraan_id']);
                $tarifParkir = TarifParkir::where('jenis_kendaraan_id', $kendaraan->jenis_kendaraan_id)->first();

                if (!$tarifParkir) {
                    DB::rollBack();
                    return back()->withErrors([
                        'kendaraan_id' => 'Tarif parkir untuk jenis kendaraan ini belum tersedia.'
                    ])->withInput();
                }

                $validated['tarif_parkir_id'] = $tarifParkir->id;
            }

            $transaksi->update($validated);

            DB::commit();

            // Log aktivitas: Edit transaksi
            LogAktivitas::create([
                'user_id' => Auth::id(),
                'aktivitas' => 'Edit transaksi - Plat: ' . $transaksi->kendaraan->plat_nomor . ' | Area: ' . $transaksi->areaParkir->nama_area,
                'waktu_aktivitas' => now(),
            ]);

            return redirect()->route('petugas.transaksi.index')
                ->with('success', 'Transaksi berhasil diperbarui!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'error' => 'Gagal memperbarui transaksi: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $transaksi = Transaksi::findOrFail($id);
            $transaksi->delete();

            return redirect()->route('petugas.transaksi.index')
                ->with('success', 'Transaksi berhasil dihapus!');
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Gagal menghapus transaksi: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Cetak struk (PDF printer)
     */
    public function cetak(string $id){
        try {
            $transaksi = Transaksi::with([
                'areaParkir',
                'kendaraan.jenis',
                'tarifParkir.jenisKendaraan',
                'user'
            ])->findOrFail($id);

            // Validasi transaksi sudah checkout
            if ($transaksi->status !== 'keluar') {
                return redirect()->route('petugas.transaksi.index')
                    ->with('error', 'Hanya transaksi yang sudah checkout yang bisa dicetak.');
            }

            // Generate PDF
            $pdf = Pdf::loadView('petugas.transaksi.struk', [
                'transaksi' => $transaksi,
            ])->setPaper([0, 0, 226, 350], 'portrait');

            $filename = 'Struk_Parkir_' . $transaksi->kendaraan->plat_nomor . '_' . now()->format('dmY_His') . '.pdf';

            // Gunakan download() untuk auto-download, atau stream() untuk view di browser
            // return $pdf->download($filename); // Untuk download langsung
            return $pdf->stream($filename); // Untuk view di browser

        } catch (\Exception $e) {
            Log::error('Cetak Struk Error:', [
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('petugas.transaksi.index')
                ->with('error', 'Gagal mencetak struk: ' . $e->getMessage());
        }
    }

    /**
     * Cetak struk masuk (bukti parkir)
     */
    public function cetakStrokMasuk(string $id)
    {
        try {
            $transaksi = Transaksi::with([
                'areaParkir',
                'kendaraan.jenis',
                'tarifParkir.jenisKendaraan',
                'user'
            ])->findOrFail($id);

            // Validasi transaksi masih status masuk
            if ($transaksi->status !== 'masuk') {
                return redirect()->route('petugas.transaksi.index')
                    ->with('error', 'Hanya transaksi yang masih masuk yang bisa dicetak struk parkir.');
            }

            // Generate PDF
            $pdf = Pdf::loadView('petugas.transaksi.struk-masuk', [
                'transaksi' => $transaksi,
            ])->setPaper([0, 0, 226, 350], 'portrait');

            $filename = 'Struk_Masuk_' . $transaksi->kendaraan->plat_nomor . '_' . now()->format('dmY_His') . '.pdf';

            return $pdf->stream($filename);

        } catch (\Exception $e) {
            Log::error('Cetak Struk Masuk Error:', [
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('petugas.transaksi.index')
                ->with('error', 'Gagal mencetak struk parkir: ' . $e->getMessage());
        }
    }
}

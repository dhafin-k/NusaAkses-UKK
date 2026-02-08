<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\AreaParkir;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class RekapTransaksiController extends Controller
{
    /**
     * Menampilkan halaman form rekap di frontend.
     */
    public function index()
    {
        return Inertia::render('owner/rekap/index');
    }

    /**
     * Menampilkan halaman form rekap tahunan di frontend.
     */
    public function tahun()
    {
        return Inertia::render('owner/rekap/year');
    }

    /**
     * Proses cetak PDF berdasarkan bulan dan tahun.
     */
    public function cetakRekapTransaksi(Request $request)
    {
        // Ambil input dari request (mendukung GET query string)
        $bulan = $request->query('bulan') ?? $request->input('bulan');
        $tahun = $request->query('tahun') ?? $request->input('tahun');

        // Pastikan input ada
        if (!$bulan || !$tahun) {
            return redirect()->back()->with('error', 'Bulan dan Tahun harus dipilih.');
        }

        // Tentukan rentang waktu awal dan akhir bulan
        $start = Carbon::create($tahun, $bulan, 1)->startOfMonth();
        $end = Carbon::create($tahun, $bulan, 1)->endOfMonth();

        // Ambil data transaksi dengan relasi yang benar sesuai Model
        // Ganti 'tarif' menjadi 'tarifParkir' sesuai model kamu
        $transaksis = Transaksi::with(['kendaraan', 'areaParkir', 'user', 'tarifParkir'])
            ->whereBetween('waktu_masuk', [$start, $end])
            ->orderBy('waktu_masuk')
            ->get();

        // Hitung Ringkasan Data
        $totalTransaksi = $transaksis->count();
        $transaksiMasuk = $transaksis->where('status', 'masuk')->count();
        $transaksiKeluar = $transaksis->where('status', 'keluar')->count();
        $totalPendapatan = $transaksis->where('status', 'keluar')->sum('biaya_total');

        // Hitung Statistik per Area Parkir
        $statistikArea = AreaParkir::all()->map(function ($area) use ($transaksis) {
            // Gunakan 'area_parkir_id' sesuai fillable di Model Transaksi
            $transaksiArea = $transaksis->where('area_parkir_id', $area->id);

            $area->total_transaksi = $transaksiArea->count();
            $area->pendapatan_area = $transaksiArea->where('status', 'keluar')->sum('biaya_total');

            return $area;
        })->where('total_transaksi', '>', 0);

        // Load View PDF
        $pdf = Pdf::loadView('pdf.rekap-transaksi', compact(
            'transaksis',
            'totalTransaksi',
            'transaksiMasuk',
            'transaksiKeluar',
            'totalPendapatan',
            'statistikArea',
            'bulan',
            'tahun'
        ));

        // Stream (Buka di browser)
        return $pdf->stream("rekap-transaksi-$bulan-$tahun.pdf");
    }

    /**
     * Proses cetak PDF tahunan berdasarkan tahun.
     */
    public function cetakRekapTahun(Request $request)
    {
        // Ambil input tahun dari request
        $tahun = $request->query('tahun') ?? $request->input('tahun');

        // Pastikan input ada
        if (!$tahun) {
            return redirect()->back()->with('error', 'Tahun harus dipilih.');
        }

        // Tentukan rentang waktu awal dan akhir tahun
        $start = Carbon::create($tahun, 1, 1)->startOfYear();
        $end = Carbon::create($tahun, 12, 31)->endOfYear();

        // Ambil data transaksi dengan relasi yang benar sesuai Model
        $transaksis = Transaksi::with(['kendaraan', 'areaParkir', 'user', 'tarifParkir'])
            ->whereBetween('waktu_masuk', [$start, $end])
            ->orderBy('waktu_masuk')
            ->get();

        // Hitung Ringkasan Data
        $totalTransaksi = $transaksis->count();
        $transaksiMasuk = $transaksis->where('status', 'masuk')->count();
        $transaksiKeluar = $transaksis->where('status', 'keluar')->count();
        $totalPendapatan = $transaksis->where('status', 'keluar')->sum('biaya_total');

        // Hitung Statistik per Area Parkir
        $statistikArea = AreaParkir::all()->map(function ($area) use ($transaksis) {
            $transaksiArea = $transaksis->where('area_parkir_id', $area->id);

            $area->total_transaksi = $transaksiArea->count();
            $area->pendapatan_area = $transaksiArea->where('status', 'keluar')->sum('biaya_total');

            return $area;
        })->where('total_transaksi', '>', 0);

        // Load View PDF
        $pdf = Pdf::loadView('pdf.rekap-transaksi-tahun', compact(
            'transaksis',
            'totalTransaksi',
            'transaksiMasuk',
            'transaksiKeluar',
            'totalPendapatan',
            'statistikArea',
            'tahun'
        ));

        // Stream (Buka di browser)
        return $pdf->stream("rekap-transaksi-$tahun.pdf");
    }
}

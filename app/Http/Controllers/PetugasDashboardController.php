<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\Kendaraan;
use App\Models\AreaParkir;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PetugasDashboardController extends Controller
{
    public function index()
    {
        // Total Transaksi
        $totalTransaksi = Transaksi::count();
        $transaksiMasuk = Transaksi::where('status', 'masuk')->count();
        $transaksiKeluar = Transaksi::where('status', 'keluar')->count();

        // Total Pendapatan
        $totalPendapatan = Transaksi::where('status', 'keluar')->sum('biaya_total');

        // Total Kendaraan
        $totalKendaraan = Kendaraan::count();

        // Kapasitas Parkir
        $totalKapasitas = AreaParkir::sum('kapasitas');
        $totalTerisi = AreaParkir::sum('terisi');
        $kapasitasTersedia = $totalKapasitas - $totalTerisi;

        // Statistik Per Area
        $statistikArea = AreaParkir::select(
            'id',
            'nama_area',
            'kapasitas',
            'terisi',
            DB::raw('(SELECT COUNT(*) FROM transaksis WHERE area_parkir_id = area_parkirs.id) as total_transaksi'),
            DB::raw('(SELECT SUM(biaya_total) FROM transaksis WHERE area_parkir_id = area_parkirs.id AND status = "keluar") as pendapatan_area')
        )->get();

        // Debug: Cek total transaksi dan tanggal range
        $allTransaksi = Transaksi::count();
        $oldestTransaction = Transaksi::whereNotNull('waktu_masuk')->min('waktu_masuk');
        $newestTransaction = Transaksi::whereNotNull('waktu_masuk')->max('waktu_masuk');

        Log::info('Transaction Summary:', [
            'total_count' => $allTransaksi,
            'oldest' => $oldestTransaction,
            'newest' => $newestTransaction,
            'date_range_start' => Carbon::now()->subMonths(5)->startOfMonth()->toDateString(),
        ]);

        // PERBAIKAN: Ambil data dari 12 bulan terakhir atau semua data jika kurang, gunakan waktu_masuk
        $transaksiPerBulan = Transaksi::selectRaw('MONTH(waktu_masuk) as bulan, YEAR(waktu_masuk) as tahun, COUNT(*) as jumlah')
            ->whereNotNull('waktu_masuk')
            ->where('waktu_masuk', '>=', Carbon::now()->subYear())  // 12 bulan ke belakang
            ->groupBy(DB::raw('YEAR(waktu_masuk), MONTH(waktu_masuk)'))
            ->orderBy(DB::raw('YEAR(waktu_masuk), MONTH(waktu_masuk)'))
            ->get();

        Log::info('Transaksi Per Bulan Query Result:', [
            'total_records' => count($transaksiPerBulan),
            'data' => $transaksiPerBulan->toArray(),
        ]);

        // Map data untuk chart (12 bulan terakhir atau sesuai data yang ada)
        $chartData = [];
        $bulanNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        // Ambil bulan dari 6 atau 12 bulan terakhir
        $monthCount = $transaksiPerBulan->count() > 0 ? 12 : 6;

        for ($i = ($monthCount - 1); $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $bulanIndex = (int) $date->format('m') - 1;
            $bulanNumber = (int) $date->format('m');
            $tahun = (int) $date->format('Y');

            $transaksi = $transaksiPerBulan->firstWhere(function ($item) use ($bulanNumber, $tahun) {
                return $item['bulan'] == $bulanNumber && $item['tahun'] == $tahun;
            });

            $jumlah = $transaksi ? (int) $transaksi['jumlah'] : 0;

            $chartData[] = [
                'month' => $bulanNames[$bulanIndex],
                'desktop' => $jumlah,
                'mobile' => 0,
            ];
        }

        Log::info('Final Chart Data:', ['chartData' => $chartData, 'total_months' => count($chartData)]);

        // Transaksi Terbaru
        $transaksiTerbaru = Transaksi::with(['kendaraan', 'areaParkir'])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('petugas/dashboard', [
            'totalTransaksi' => $totalTransaksi,
            'transaksiMasuk' => $transaksiMasuk,
            'transaksiKeluar' => $transaksiKeluar,
            'totalPendapatan' => $totalPendapatan,
            'totalKendaraan' => $totalKendaraan,
            'totalKapasitas' => $totalKapasitas,
            'totalTerisi' => $totalTerisi,
            'kapasitasTersedia' => $kapasitasTersedia,
            'statistikArea' => $statistikArea,
            'chartData' => $chartData,
            'transaksiTerbaru' => $transaksiTerbaru,
        ]);
    }
}

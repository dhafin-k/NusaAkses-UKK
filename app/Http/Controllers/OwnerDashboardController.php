<?php

namespace App\Http\Controllers;

use App\Models\AreaParkir;
use App\Models\Transaksi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OwnerDashboardController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->query('period', '30');

        // Validasi period: 30 (1 bulan), 180 (6 bulan), 365 (1 tahun)
        if (!in_array($period, ['30', '180', '365'])) {
            $period = '30';
        }

        $endDate = Carbon::now()->endOfDay();
        $startDate = match ($period) {
            '180' => Carbon::now()->subMonths(6)->startOfDay(),
            '365' => Carbon::now()->subMonths(12)->startOfDay(),
            default => Carbon::now()->subDays(29)->startOfDay(),
        };

        Log::info('Date Range:', [
            'period' => $period,
            'startDate' => $startDate->toDateTimeString(),
            'endDate' => $endDate->toDateTimeString(),
        ]);

        // Ambil area parkir
        $areas = AreaParkir::all();
        $areaIds = $areas->pluck('id')->toArray();

        if (empty($areaIds)) {
            return Inertia::render('owner/dashboard', $this->getEmptyResponse($period));
        }

        // Total Transaksi
        $totalTransaksi = Transaksi::whereBetween('waktu_masuk', [$startDate, $endDate])
            ->whereIn('area_parkir_id', $areaIds)
            ->count();

        // Transaksi Masuk & Keluar
        $transaksiMasuk = Transaksi::whereBetween('waktu_masuk', [$startDate, $endDate])
            ->whereIn('area_parkir_id', $areaIds)
            ->where('status', 'masuk')
            ->count();

        $transaksiKeluar = Transaksi::whereBetween('waktu_masuk', [$startDate, $endDate])
            ->whereIn('area_parkir_id', $areaIds)
            ->where('status', 'keluar')
            ->count();

        // Total Pendapatan
        $totalPendapatan = Transaksi::whereBetween('waktu_masuk', [$startDate, $endDate])
            ->whereIn('area_parkir_id', $areaIds)
            ->where('status', 'keluar')
            ->sum('biaya_total') ?? 0;

        // Total Kendaraan Unik
        $totalKendaraan = Transaksi::whereBetween('waktu_masuk', [$startDate, $endDate])
            ->whereIn('area_parkir_id', $areaIds)
            ->distinct('kendaraan_id')
            ->count('kendaraan_id');

        // Kapasitas Parkir
        $totalKapasitas = $areas->sum('kapasitas') ?? 0;
        $totalTerisi = $areas->sum('terisi') ?? 0;
        $kapasitasTersedia = $totalKapasitas - $totalTerisi;

        // Chart Data - berbeda untuk tiap period
        $chartData = match ($period) {
            '180', '365' => $this->getMonthlyChartData($areaIds, $startDate, $endDate, $period),
            default => $this->getDailyChartData($areaIds, $startDate, $endDate),
        };

        Log::info('Chart Data Generated:', [
            'count' => count($chartData),
            'period' => $period,
            'type' => $period === '30' ? 'daily' : 'monthly'
        ]);

        // Statistik Area (akan di-sort di frontend)
        $statistikArea = $areas->map(function ($area) use ($startDate, $endDate) {
            $transaksi = Transaksi::where('area_parkir_id', $area->id)
                ->whereBetween('waktu_masuk', [$startDate, $endDate])
                ->count();

            return [
                'id' => $area->id,
                'nama' => $area->nama_area,
                'transaksi' => $transaksi,
                'kapasitas' => $area->kapasitas ?? 0,
                'terisi' => $area->terisi ?? 0,
                'tersedia' => ($area->kapasitas ?? 0) - ($area->terisi ?? 0),
            ];
        })->toArray();

        // Transaksi Terbaru
        $transaksiTerbaru = Transaksi::whereIn('area_parkir_id', $areaIds)
            ->with(['kendaraan', 'areaParkir'])
            ->orderBy('waktu_masuk', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'plat_nomor' => $t->kendaraan?->plat_nomor ?? '-',
                    'area' => $t->areaParkir?->nama_area ?? '-',
                    'waktu_masuk' => $t->waktu_masuk ? $t->waktu_masuk->format('d/m/Y H:i') : '-',
                    'waktu_keluar' => $t->waktu_keluar ? $t->waktu_keluar->format('d/m/Y H:i') : '-',
                    'biaya' => $t->biaya_total ?? 0,
                    'status' => $t->status,
                ];
            })
            ->toArray();

        return Inertia::render('owner/dashboard', [
            'totalTransaksi' => $totalTransaksi,
            'transaksiMasuk' => $transaksiMasuk,
            'transaksiKeluar' => $transaksiKeluar,
            'totalPendapatan' => (int) $totalPendapatan,
            'totalKendaraan' => $totalKendaraan,
            'totalKapasitas' => $totalKapasitas,
            'totalTerisi' => $totalTerisi,
            'kapasitasTersedia' => $kapasitasTersedia,
            'statistikArea' => $statistikArea,
            'chartData' => $chartData,
            'transaksiTerbaru' => $transaksiTerbaru,
            'currentPeriod' => $period,
        ]);
    }

    /**
     * Get daily chart data for 1 month (30 days)
     */
    private function getDailyChartData($areaIds, $startDate, $endDate)
    {
        $period = $startDate->diffInDays($endDate);
        $data = [];

        for ($i = 0; $i <= $period; $i++) {
            $date = (clone $startDate)->addDays($i);

            $transaksiCount = Transaksi::whereDate('waktu_masuk', $date->toDateString())
                ->whereIn('area_parkir_id', $areaIds)
                ->count();

            $pendapatan = Transaksi::whereDate('waktu_masuk', $date->toDateString())
                ->whereIn('area_parkir_id', $areaIds)
                ->where('status', 'keluar')
                ->sum('biaya_total') ?? 0;

            $data[] = [
                'date' => $date->format('d/m'),
                'fullDate' => $date->format('Y-m-d'),
                'transaksi' => (int) $transaksiCount,
                'pendapatan' => (int) $pendapatan,
            ];
        }

        return $data;
    }

    /**
     * Get monthly chart data for 6 months or 1 year
     */
    private function getMonthlyChartData($areaIds, $startDate, $endDate, $period)
    {
        // Hitung berapa bulan
        $months = $period === '365' ? 12 : 6;
        $data = [];

        for ($i = 0; $i < $months; $i++) {
            $monthStart = (clone $startDate)->addMonths($i)->startOfMonth();
            $monthEnd = (clone $monthStart)->endOfMonth();

            // Pastikan tidak melewati endDate
            if ($monthEnd->greaterThan($endDate)) {
                $monthEnd = clone $endDate;
            }

            $transaksiCount = Transaksi::whereBetween('waktu_masuk', [$monthStart, $monthEnd])
                ->whereIn('area_parkir_id', $areaIds)
                ->count();

            $pendapatan = Transaksi::whereBetween('waktu_masuk', [$monthStart, $monthEnd])
                ->whereIn('area_parkir_id', $areaIds)
                ->where('status', 'keluar')
                ->sum('biaya_total') ?? 0;

            $data[] = [
                'date' => $monthStart->format('M Y'),  // Jan 2026, Feb 2026, etc
                'fullDate' => $monthStart->format('Y-m'),
                'transaksi' => (int) $transaksiCount,
                'pendapatan' => (int) $pendapatan,
            ];
        }

        return $data;
    }

    /**
     * Get empty response when no area parkir found
     */
    private function getEmptyResponse($period)
    {
        return [
            'totalTransaksi' => 0,
            'transaksiMasuk' => 0,
            'transaksiKeluar' => 0,
            'totalPendapatan' => 0,
            'totalKendaraan' => 0,
            'totalKapasitas' => 0,
            'totalTerisi' => 0,
            'kapasitasTersedia' => 0,
            'statistikArea' => [],
            'chartData' => [],
            'transaksiTerbaru' => [],
            'currentPeriod' => $period,
        ];
    }
}

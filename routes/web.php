<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AreaParkirController;
use App\Http\Controllers\JenisKendaraanController;
use App\Http\Controllers\KendaraanController;
use App\Http\Controllers\LogAktivitasController;
use App\Http\Controllers\OwnerDashboardController;
use App\Http\Controllers\TarifParkirController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\PetugasDashboardController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', fn() => Inertia::render('welcome', [
    'canRegister' => Features::enabled(Features::registration()),
]))->name('home');

// DEBUG ROUTE - HAPUS SETELAH SELESAI
Route::get('/debug-dashboard', function () {
    $transaksi = \App\Models\Transaksi::with(['kendaraan', 'areaParkir'])->get();
    return [
        'total_transaksi' => $transaksi->count(),
        'data_sample' => $transaksi->take(3)->map(fn($t) => [
            'id' => $t->id,
            'plat_nomor' => $t->kendaraan?->plat_nomor,
            'waktu_masuk' => $t->waktu_masuk,
            'status' => $t->status,
            'biaya' => $t->biaya_total,
        ]),
        'date_range' => [
            'oldest' => \App\Models\Transaksi::whereNotNull('waktu_masuk')->min('waktu_masuk'),
            'newest' => \App\Models\Transaksi::whereNotNull('waktu_masuk')->max('waktu_masuk'),
        ]
    ];
});

// Route untuk semua user yang sudah login
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard Utama - Auto redirect ke dashboard sesuai role
    Route::get('/dashboard', function () {
        return match (Auth::user()->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'petugas' => redirect()->route('petugas.dashboard'),
            'owner' => redirect()->route('owner.dashboard'),
            default => abort(403, 'Role akun tidak dikenali'),
        };
    })->name('dashboard');

    // ========== ADMIN ROUTES ==========
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::resource('users', UserController::class);
        Route::resource('area-parkir', AreaParkirController::class);
        Route::resource('tarif-parkir', TarifParkirController::class);
        Route::resource('jenis-kendaraan', JenisKendaraanController::class);
        Route::resource('kendaraan', KendaraanController::class);
        Route::resource('log-aktivitas', LogAktivitasController::class);
    });

    // ========== PETUGAS ROUTES ==========
    Route::middleware('role:petugas')->prefix('petugas')->name('petugas.')->group(function () {
        Route::get('/dashboard', [PetugasDashboardController::class, 'index'])->name('dashboard');
        Route::resource('transaksi', TransaksiController::class);
        Route::get('/transaksi/{id}/cetak', [TransaksiController::class, 'cetak'])->name('transaksi.cetak');
    });

    // ========== OWNER ROUTES ==========
    Route::middleware('role:owner')->prefix('owner')->name('owner.')->group(function () {
        Route::get('/dashboard', [OwnerDashboardController::class, 'index'])->name('dashboard');
        // Route::get('/rekap-transaksi', fn() => Inertia::render('owner/rekap-transaksi/index'))->name('rekap-transaksi.index');
    });
});


require __DIR__ . '/settings.php';

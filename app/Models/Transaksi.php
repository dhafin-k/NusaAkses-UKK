<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Log;

class Transaksi extends Model
{
    use HasFactory;

    protected $table = 'transaksis'; // Sesuaikan dengan nama tabel Anda

    protected $fillable = [
        'area_parkir_id',
        'kendaraan_id',
        'waktu_masuk',
        'waktu_keluar',
        'tarif_parkir_id',
        'durasi_jam',
        'biaya_total',
        'status',
        'user_id',
    ];

    protected $casts = [
        'waktu_masuk' => 'datetime',
        'waktu_keluar' => 'datetime',
        'durasi_jam' => 'integer',
        'biaya_total' => 'decimal:0',
    ];

    // Relationships
    public function areaParkir(): BelongsTo
    {
        return $this->belongsTo(AreaParkir::class, 'area_parkir_id');
    }

    public function kendaraan(): BelongsTo
    {
        return $this->belongsTo(Kendaraan::class, 'kendaraan_id');
    }

    public function tarifParkir(): BelongsTo
    {
        return $this->belongsTo(TarifParkir::class, 'tarif_parkir_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Scopes
    public function scopeMasuk($query)
    {
        return $query->where('status', 'masuk');
    }

    public function scopeKeluar($query)
    {
        return $query->where('status', 'keluar');
    }

    // Helper method untuk cek apakah kendaraan sedang parkir
    public static function isKendaraanParkir($kendaraanId): bool
    {
        return self::where('kendaraan_id', $kendaraanId)
            ->where('status', 'masuk')
            ->exists();
    }
}

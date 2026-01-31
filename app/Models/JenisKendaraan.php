<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisKendaraan extends Model
{
    protected $table = 'jenis_kendaraans';

    protected $guarded = [];
    protected $fillable = [
        'nama_jenis_kendaraan',
    ];

    public function kendaraan()
    {
        return $this->hasMany(Kendaraan::class);
    }
}
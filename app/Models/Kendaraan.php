<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kendaraan extends Model
{
    protected $table = 'kendaraans';

    protected $guarded = [];

    public function jenis()
    {
        return $this->belongsTo(JenisKendaraan::class, 'jenis_kendaraan_id');
    }
}

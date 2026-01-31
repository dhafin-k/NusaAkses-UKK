<?php

namespace App\Http\Controllers;

use App\Models\JenisKendaraan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JenisKendaraanController extends Controller
{
    public function index(Request $request){
        $jenisKendaraan = JenisKendaraan::orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('admin/jenis_kendaraan/index',[
            'jenisKendaraan' => $jenisKendaraan,
            'filters' => $request->all()
        ]);
    }
    
    public function store(Request $request) {
        $validated = $request->validate([
            'nama_jenis_kendaraan' => 'required|string|max:100'
        ], [
            'nama_jenis_kendaraan.required' => 'Nama jenis kendaraan wajib diisi',
            'nama_jenis_kendaraan.string' => 'Nama jenis kendaraan harus string',
            'nama_jenis_kendaraan.max' => 'Nama jenis kendaraan maksimal 100 karakter',
        ]);

        JenisKendaraan::create($validated);

        return redirect()->route('admin.jenis-kendaraan.index')->with('success', 'Data berhasil di tambahkan');
    }

    public function update(Request $request, $id) {
        $jenisKendaraan = JenisKendaraan::findOrFail($id);
        $validated = $request->validate([
           'nama_jenis_kendaraan' => 'required|string|max:100' 
        ], [
            'nama_jenis_kendaraan.required' => 'Nama jenis kendaraan wajib diisi',
            'nama_jenis_kendaraan.string' => 'Nama jenis kendaraan harus string',
            'nama_jenis_kendaraan.max' => 'Nama jenis kendaraan maksimal 100 karakter',
        ]);

        $jenisKendaraan->update($validated);

        return redirect()->route('admin.jenis-kendaraan.index')->with('success', 'Data berhasil di update');
    }
    
    public function destroy($id) {
        $jenisKendaraan = JenisKendaraan::findOrFail($id);
        $jenisKendaraan->delete();
        
        return redirect()->route('admin.jenis-kendaraan.index')->with('success', 'Data Berhasil di Hapus');
    }
}
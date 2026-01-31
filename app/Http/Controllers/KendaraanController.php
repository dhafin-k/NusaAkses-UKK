<?php

namespace App\Http\Controllers;

use App\Models\JenisKendaraan;
use App\Models\Kendaraan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class KendaraanController extends Controller
{
    public function index(Request $request)
    {
        $query = Kendaraan::with('jenis')->orderBy('created_at', 'desc');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('plat_nomor', 'like', '%' . $request->search . '%')
                    ->orWhere('pemilik', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->jenis_kendaraan_id) {
            $query->where('jenis_kendaraan_id', $request->jenis_kendaraan_id);
        }

        $kendaraan = $query->paginate(10)->withQueryString();
        $jenisKendaraan = JenisKendaraan::all();

        return Inertia::render('admin/kendaraan/index', [
            'kendaraan' => $kendaraan,
            'jenisKendaraan' => $jenisKendaraan,
            'filters' => $request->all()
        ]);
    }

    public function create()
    {
        $jenisKendaraan = JenisKendaraan::all();
        return Inertia::render('admin/kendaraan/create', [
            'jenisKendaraan' => $jenisKendaraan
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'plat_nomor' => 'required|string|unique:kendaraans,plat_nomor',
            'warna' => 'required|string',
            'jenis_kendaraan_id' => 'required|exists:jenis_kendaraans,id',
            'pemilik' => 'required|string',
        ], [
            'plat_nomor.required' => 'Plat nomor harus diisi',
            'plat_nomor.unique' => 'Plat nomor sudah terdaftar',
            'plat_nomor.max' => 'Plat nomor maksimal 255 karakter',
            'warna.required' => 'Warna kendaraan harus diisi',
            'warna.max' => 'Warna maksimal 100 karakter',
            'pemilik.required' => 'Nama pemilik harus diisi',
            'pemilik.max' => 'Nama pemilik maksimal 255 karakter',
            'jenis_kendaraan.required' => 'Jenis kendaraan harus dipilih',
            'jenis_kendaraan.exists' => 'Jenis kendaraan tidak valid',
        ]);

        $validated['user_id'] = Auth::id();

        Kendaraan::create($validated);

        return redirect()->route('admin.kendaraan.index')->with('success', 'Data kendaraan berhasil ditambahkan.');
    }

    public function edit(Kendaraan $kendaraan)
    {
        $jenisKendaraan = JenisKendaraan::all();
        return Inertia::render('admin/kendaraan/edit', [
            'kendaraan' => $kendaraan,
            'jenisKendaraan' => $jenisKendaraan
        ]);
    }

    public function update(Request $request, Kendaraan $kendaraan)
    {

        Log::info('Masuk update kendaraan', $request->all());

        $validated = $request->validate([
            'plat_nomor' => 'required|string|unique:kendaraans,plat_nomor,' . $kendaraan->id,
            'warna' => 'required|string',
            'pemilik' => 'required|string',
            'jenis_kendaraan_id' => 'required|exists:jenis_kendaraans,id',
        ], [
            'plat_nomor.required' => 'Plat nomor harus diisi',
            'plat_nomor.unique' => 'Plat nomor sudah terdaftar',
            'plat_nomor.max' => 'Plat nomor maksimal 255 karakter',
            'warna.required' => 'Warna kendaraan harus diisi',
            'warna.max' => 'Warna maksimal 100 karakter',
            'pemilik.required' => 'Nama pemilik harus diisi',
            'pemilik.max' => 'Nama pemilik maksimal 255 karakter',
            'jenis_kendaraan.required' => 'Jenis kendaraan harus dipilih',
            'jenis_kendaraan.exists' => 'Jenis kendaraan tidak valid',
        ]);

        $kendaraan->update($validated);

        return redirect()->route('admin.kendaraan.index')->with('success', 'Data kendaraan berhasil diperbarui.');
    }

    public function destroy(Kendaraan $kendaraan)
    {
        Log::info('HAPUS KENDARAAN', [
            'id' => $kendaraan->id,
            'plat' => $kendaraan->plat_nomor,
        ]);

        $kendaraan->delete();

        return redirect()
            ->route('admin.kendaraan.index')
            ->with('success', 'Data kendaraan berhasil dihapus');
    }
}

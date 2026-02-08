<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rekap Transaksi Parkir Tahunan</title>
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
            padding: 20px;
        }

        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 12px;
            margin-bottom: 25px;
        }

        .header h1 {
            font-size: 22px;
            color: #1e40af;
        }

        .period {
            text-align:center;
            margin-bottom:20px;
            color:#555;
        }

        .summary {
            display: table;
            width: 100%;
            margin-bottom: 25px;
        }

        .summary-item {
            display: table-cell;
            width:25%;
            border:1px solid #e5e7eb;
            background:#f3f4f6;
            text-align:center;
            padding:10px;
        }

        .label {
            font-size:10px;
            color:#6b7280;
        }

        .value {
            font-size:16px;
            font-weight:bold;
        }

        .highlight .value {
            color:#16a34a;
        }

        h2 {
            margin:20px 0 10px;
            color:#1e40af;
            font-size:15px;
        }

        table {
            width:100%;
            border-collapse:collapse;
            margin-bottom:15px;
        }

        thead {
            background:#1e40af;
            color:white;
        }

        th, td {
            padding:8px;
            font-size:11px;
            border-bottom:1px solid #e5e7eb;
        }

        .text-center { text-align:center; }
        .text-right { text-align:right; }

        .status {
            padding:3px 6px;
            border-radius:4px;
            font-size:9px;
            font-weight:bold;
        }

        .masuk { background:#dbeafe; color:#1e40af; }
        .keluar { background:#dcfce7; color:#166534; }

        .footer {
            margin-top:30px;
            text-align:right;
            font-size:10px;
            color:#666;
        }
    </style>
</head>
<body>

<div class="header">
    <h1>REKAP TRANSAKSI PARKIR TAHUNAN</h1>
</div>

<div class="period">
    Tahun: <strong>{{ $tahun }}</strong>
</div>

<div class="summary">
    <div class="summary-item">
        <div class="label">TOTAL TRANSAKSI</div>
        <div class="value">{{ $totalTransaksi }}</div>
    </div>
    <div class="summary-item">
        <div class="label">MASUK</div>
        <div class="value">{{ $transaksiMasuk }}</div>
    </div>
    <div class="summary-item">
        <div class="label">KELUAR</div>
        <div class="value">{{ $transaksiKeluar }}</div>
    </div>
    <div class="summary-item highlight">
        <div class="label">PENDAPATAN</div>
        <div class="value">Rp {{ number_format($totalPendapatan,0,',','.') }}</div>
    </div>
</div>

@if($statistikArea->count() > 0)
<h2>Statistik Area Parkir</h2>
<table>
    <thead>
        <tr>
            <th>Area</th>
            <th class="text-center">Transaksi</th>
            <th class="text-right">Pendapatan</th>
        </tr>
    </thead>
    <tbody>
        @foreach($statistikArea as $area)
        <tr>
            <td>{{ $area->nama_area }}</td>
            <td class="text-center">{{ $area->total_transaksi }}</td>
            <td class="text-right">
                Rp {{ number_format($area->pendapatan_area, 0, ',', '.') }}
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
@endif

<h2>Detail Transaksi</h2>
<table>
    <thead>
        <tr>
            <th>Tanggal</th>
            <th>Plat</th>
            <th>Area</th>
            <th>Status</th>
            <th class="text-right">Biaya</th>
        </tr>
    </thead>
    <tbody>
        @forelse($transaksis as $t)
        <tr>
            <td>{{ $t->waktu_masuk->format('d/m/Y H:i') }}</td>
            <td>{{ $t->kendaraan->plat_nomor ?? '-' }}</td>
            <td>{{ $t->areaParkir->nama_area ?? '-' }}</td>
            <td class="text-center">
                <span class="status {{ $t->status }}">
                    {{ strtoupper($t->status) }}
                </span>
            </td>
            <td class="text-right">
                @if($t->biaya_total)
                    Rp {{ number_format($t->biaya_total,0,',','.') }}
                @else
                    -
                @endif
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="5" class="text-center">Tidak ada data</td>
        </tr>
        @endforelse
    </tbody>
</table>

<div class="footer">
    Dicetak: {{ now()->format('d F Y H:i') }}
</div>

</body>
</html>

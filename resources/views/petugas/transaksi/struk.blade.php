<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>NusaAkses #{{ $transaksi->id }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 10px;
            line-height: 1.4;
            padding: 10px;
            background: white;
            color: black;
        }

        .header {
            text-align: center;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 2px dashed black;
        }

        .header h1 {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 3px;
            letter-spacing: 1px;
        }

        .header p {
            font-size: 9px;
        }

        .pembatas {
            border-bottom: 1px dashed black;
            margin: 8px 0;
            height: 0;
        }

        .baris-info {
            margin: 4px 0;
            font-size: 10px;
            display: table;
            width: 100%;
        }

        .label-info {
            display: table-cell;
            width: 50%;
        }

        .value-info {
            display: table-cell;
            width: 50%;
            text-align: right;
            font-weight: bold;
        }

        .total-box {
            margin: 10px 0;
            padding: 8px 0;
            border-top: 2px solid black;
            border-bottom: 2px solid black;
        }

        .total-baris {
            font-size: 12px;
            font-weight: bold;
            display: table;
            width: 100%;
        }

        .total-label {
            display: table-cell;
            width: 50%;
        }

        .total-value {
            display: table-cell;
            width: 50%;
            text-align: right;
        }

        .footer {
            text-align: center;
            margin-top: 10px;
            padding-top: 8px;
            border-top: 2px dashed black;
        }

        .footer-terimakasih {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 4px;
        }

        .footer-text {
            font-size: 9px;
            line-height: 1.3;
        }

        .footer-waktu {
            font-size: 8px;
            margin-top: 6px;
            color: #666;
        }

        .plat-box {
            text-align: center;
            padding: 5px;
            margin: 8px 0;
            border: 2px solid black;
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 2px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>SISTEM PARKIR</h1>
        <p>{{ $transaksi->areaParkir->nama_area ?? 'Area Parkir' }}</p>
    </div>

    <div class="plat-box">
        {{ $transaksi->kendaraan->plat_nomor }}
    </div>

    <div class="baris-info">
        <span class="label-info">No. Transaksi</span>
        <span class="value-info">#{{ str_pad($transaksi->id, 6, '0', STR_PAD_LEFT) }}</span>
    </div>
    <div class="baris-info">
        <span class="label-info">Petugas</span>
        <span class="value-info">{{ $transaksi->user->name ?? '-' }}</span>
    </div>

    <div class="pembatas"></div>

    <div class="baris-info">
        <span class="label-info">Jenis Kendaraan</span>
        <span class="value-info">{{ $transaksi->kendaraan->jenis->nama_jenis_kendaraan ?? 'N/A' }}</span>
    </div>
    <div class="baris-info">
        <span class="label-info">Pemilik</span>
        <span class="value-info">{{ $transaksi->kendaraan->pemilik }}</span>
    </div>
    <div class="baris-info">
        <span class="label-info">Warna</span>
        <span class="value-info">{{ $transaksi->kendaraan->warna }}</span>
    </div>
    <div class="baris-info">
        <span class="label-info">Area Parkir</span>
        <span class="value-info">{{ $transaksi->areaParkir->nama_area }}</span>
    </div>

    <div class="pembatas"></div>

    <div class="baris-info">
        <span class="label-info">Waktu Masuk</span>
        <span class="value-info">{{ \Carbon\Carbon::parse($transaksi->waktu_masuk)->format('d/m/Y H:i') }}</span>
    </div>
    <div class="baris-info">
        <span class="label-info">Waktu Keluar</span>
        <span class="value-info">{{ $transaksi->waktu_keluar ? \Carbon\Carbon::parse($transaksi->waktu_keluar)->format('d/m/Y H:i') : '-' }}</span>
    </div>
    <div class="baris-info">
        <span class="label-info">Durasi</span>
        <span class="value-info">{{ $transaksi->durasi_jam ?? '0' }} Jam</span>
    </div>
    <div class="baris-info">
        <span class="label-info">Tarif Per Jam</span>
        <span class="value-info">Rp {{ number_format($transaksi->tarifParkir->tarif_per_jam ?? 0, 0, ',', '.') }}</span>
    </div>

    <div class="total-box">
        <div class="total-baris">
            <span class="total-label">TOTAL BIAYA</span>
            <span class="total-value">Rp {{ number_format($transaksi->biaya_total ?? 0, 0, ',', '.') }}</span>
        </div>
    </div>

    <div class="footer">
        <p class="footer-terimakasih">*** TERIMA KASIH ***</p>
        <p class="footer-text">Simpan struk ini sebagai bukti pembayaran yang sah</p>
        <p class="footer-waktu">
            Dicetak pada: {{ now()->format('d/m/Y H:i:s') }}
        </p>
    </div>

</body>
</html>

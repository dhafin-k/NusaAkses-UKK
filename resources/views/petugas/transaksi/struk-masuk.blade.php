<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Tiket Masuk #{{ $transaksi->id }}</title>
    <style>
        /* Reset total agar sesuai dengan kertas thermal */
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
            border-bottom: 2px dashed black; /* Mengikuti style pertama */
        }

        .header h1 {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 3px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .header p {
            font-size: 9px;
        }

        /* Plat Nomor Gaya Kotak Bold - Identitas Utama */
        .plat-box {
            text-align: center;
            padding: 8px;
            margin: 10px 0;
            border: 2px solid black;
            font-size: 15px;
            font-weight: bold;
            letter-spacing: 2px;
        }

        .pembatas {
            border-bottom: 1px dashed black;
            margin: 8px 0;
            height: 0;
        }

        /* Struktur Baris Info menggunakan teknik Table agar sejajar rata kiri-kanan */
        .baris-info {
            margin: 4px 0;
            font-size: 10px;
            display: table;
            width: 100%;
        }

        .label-info {
            display: table-cell;
            width: 45%;
            text-align: left;
        }

        .value-info {
            display: table-cell;
            width: 55%;
            text-align: right;
            font-weight: bold;
        }

        /* Waktu Masuk Box - Menggabungkan kontras dari kode kedua */
        .waktu-box {
            text-align: center;
            margin: 10px 0;
            padding: 10px;
            background-color: #f0f0f0;
            border: 1px solid black;
        }

        .waktu-label {
            display: block;
            font-size: 8px;
            text-transform: uppercase;
            margin-bottom: 2px;
        }

        .waktu-value {
            font-size: 12px;
            font-weight: bold;
        }

        .footer {
            text-align: center;
            margin-top: 15px;
            padding-top: 8px;
            border-top: 2px dashed black;
        }

        .footer-warning {
            border: 1px solid black;
            padding: 5px;
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 8px;
            display: inline-block;
            width: 90%;
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
    </style>
</head>

<body>
    <div class="header">
        <h1>TIKET MASUK</h1>
        <p>{{ $transaksi->areaParkir->nama_area ?? 'NUSA AKSES PARKING' }}</p>
    </div>

    <div class="plat-box">
        {{ $transaksi->kendaraan->plat_nomor }}
    </div>

    <div class="baris-info">
        <span class="label-info">No. Tiket</span>
        <span class="value-info">#{{ str_pad($transaksi->id, 6, '0', STR_PAD_LEFT) }}</span>
    </div>
    <div class="baris-info">
        <span class="label-info">Jenis</span>
        <span class="value-info">{{ $transaksi->kendaraan->jenis->nama_jenis_kendaraan ?? '-' }}</span>
    </div>
    <div class="baris-info">
        <span class="label-info">Pemilik</span>
        <span class="value-info">{{ $transaksi->kendaraan->pemilik ?? '-' }}</span>
    </div>
    <div class="baris-info">
        <span class="label-info">Warna</span>
        <span class="value-info">{{ $transaksi->kendaraan->warna ?? '-' }}</span>
    </div>

    <div class="pembatas"></div>

    <div class="baris-info">
        <span class="label-info">Tarif Per Jam</span>
        <span class="value-info">Rp {{ number_format($transaksi->tarifParkir->tarif_per_jam ?? 0, 0, ',', '.') }}</span>
    </div>

    <div class="waktu-box">
        <span class="waktu-label">Waktu Masuk</span>
        <span class="waktu-value">
            {{ $transaksi->waktu_masuk->format('d/m/Y H:i:s') }}
        </span>
    </div>

    <div class="footer">
        <div class="footer-warning">
            JANGAN TINGGALKAN<br>BARANG BERHARGA!
        </div>
        <p class="footer-terimakasih">*** SIMPAN TIKET INI ***</p>
        <p class="footer-text">Sebagai bukti masuk dan keluar kendaraan</p>
        <p class="footer-waktu">
            Dicetak pada: {{ now()->format('d/m/Y H:i:s') }}
        </p>
    </div>

</body>
</html>

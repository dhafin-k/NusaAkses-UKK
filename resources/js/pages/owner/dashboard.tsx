"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { DollarSign, FileText, MapPin, Car } from 'lucide-react';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface OwnerDashboardProps {
    totalTransaksi?: number;
    transaksiMasuk?: number;
    transaksiKeluar?: number;
    totalPendapatan?: number;
    totalKendaraan?: number;
    totalKapasitas?: number;
    totalTerisi?: number;
    kapasitasTersedia?: number;
    statistikArea?: any[];
    chartData?: any[];
    transaksiTerbaru?: any[];
    currentPeriod?: string;
}

export default function Dashboard({
    totalTransaksi = 0,
    transaksiMasuk = 0,
    transaksiKeluar = 0,
    totalPendapatan = 0,
    totalKendaraan = 0,
    totalKapasitas = 0,
    totalTerisi = 0,
    kapasitasTersedia = 0,
    statistikArea = [],
    chartData = [],
    transaksiTerbaru = [],
    currentPeriod = '30',
}: OwnerDashboardProps) {
    const percentageTerisi = totalKapasitas > 0 ? (totalTerisi / totalKapasitas) * 100 : 0;
    const [activePeriod, setActivePeriod] = useState(currentPeriod);

    // Sort area by transaksi (descending)
    const sortedStatistikArea = [...statistikArea].sort((a, b) => b.transaksi - a.transaksi);

    const handlePeriodChange = (period: string) => {
        setActivePeriod(period);
        window.location.href = `?period=${period}`;
    };

    // Custom tooltip for better formatting
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-neutral-800 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg">
                    <p className="text-sm font-medium mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-xs" style={{ color: entry.color }}>
                            {entry.name}: {entry.name.includes('Pendapatan') ? `Rp${new Intl.NumberFormat('id-ID').format(entry.value)}` : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Owner" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                {/* Header */}
                <div className='flex justify-between items-center'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Dashboard Owner</h1>
                        <p className='text-muted-foreground mt-1'>Selamat datang kembali, berikut tinjauan pendapatan Anda</p>
                    </div>
                </div>

                {/* Top Stats Cards - 4 Cards */}
                <div className="grid auto-rows-min gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Transaksi */}
                    <Card className='relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20'>
                        <div className='absolute -right-3 -top-3 h-20 w-20 rounded-full bg-blue-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400'>
                                Total Transaksi
                            </CardTitle>
                            <FileText className='h-4 w-4 text-blue-600 dark:text-blue-400'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400'>{totalTransaksi}</div>
                            <p className='text-xs text-muted-foreground mt-1'>
                                <span className='text-yellow-600 dark:text-yellow-400 font-medium'>Masuk: {transaksiMasuk}</span>
                                <span className='mx-2'>•</span>
                                <span className='text-green-600 dark:text-green-400 font-medium'>Keluar: {transaksiKeluar}</span>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Pendapatan */}
                    <Card className='relative overflow-hidden bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20'>
                        <div className='absolute -right-3 -top-3 h-20 w-20 rounded-full bg-green-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-xs sm:text-sm font-medium text-green-600 dark:text-green-400'>
                                Total Pendapatan
                            </CardTitle>
                            <DollarSign className='h-4 w-4 text-green-600 dark:text-green-400'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400'>
                                Rp{new Intl.NumberFormat('id-ID').format(totalPendapatan)}
                            </div>
                            <p className='text-xs text-muted-foreground mt-1'>Dalam periode ini</p>
                        </CardContent>
                    </Card>

                    {/* Total Kendaraan */}
                    <Card className='relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20'>
                        <div className='absolute -right-3 -top-3 h-20 w-20 rounded-full bg-purple-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400'>
                                Total Kendaraan
                            </CardTitle>
                            <Car className='h-4 w-4 text-purple-600 dark:text-purple-400'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400'>{totalKendaraan}</div>
                            <p className='text-xs text-muted-foreground mt-1'>Terdaftar dalam sistem</p>
                        </CardContent>
                    </Card>

                    {/* Kapasitas Tersedia */}
                    <Card className='relative overflow-hidden bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20'>
                        <div className='absolute -right-3 -top-3 h-20 w-20 rounded-full bg-orange-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400'>
                                Kapasitas
                            </CardTitle>
                            <MapPin className='h-4 w-4 text-orange-600 dark:text-orange-400'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400'>{kapasitasTersedia} / {totalKapasitas}</div>
                            <div className='mt-2 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2'>
                                <div
                                    className='bg-orange-600 h-2 rounded-full transition-all duration-300'
                                    style={{ width: `${percentageTerisi}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart Section with Filter */}
                <Card>
                    <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 gap-3'>
                        <div>
                            <CardTitle>Transaksi & Pendapatan</CardTitle>
                            <CardDescription>
                                {activePeriod === '30' && 'Grafik per hari dalam 1 bulan'}
                                {activePeriod === '180' && 'Grafik per bulan dalam 6 bulan'}
                                {activePeriod === '365' && 'Grafik per bulan dalam 1 tahun'}
                            </CardDescription>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <button
                                onClick={() => handlePeriodChange('30')}
                                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                                    activePeriod === '30'
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                                }`}
                            >
                                1 Bulan
                            </button>
                            <button
                                onClick={() => handlePeriodChange('180')}
                                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                                    activePeriod === '180'
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                                }`}
                            >
                                6 Bulan
                            </button>
                            <button
                                onClick={() => handlePeriodChange('365')}
                                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                                    activePeriod === '365'
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                                }`}
                            >
                                1 Tahun
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {chartData && chartData.length > 0 ? (
                            <div className="w-full h-[350px] sm:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={chartData}
                                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorTransaksi" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-300 dark:stroke-neutral-700" />
                                        <XAxis
                                            dataKey="date"
                                            className="text-neutral-600 dark:text-neutral-400"
                                            tick={{ fontSize: 11 }}
                                            stroke="currentColor"
                                            angle={activePeriod === '30' ? 0 : -45}
                                            textAnchor={activePeriod === '30' ? 'middle' : 'end'}
                                            height={activePeriod === '30' ? 30 : 60}
                                        />
                                        <YAxis
                                            yAxisId="left"
                                            className="text-neutral-600 dark:text-neutral-400"
                                            tick={{ fontSize: 11 }}
                                            stroke="currentColor"
                                            width={40}
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            className="text-neutral-600 dark:text-neutral-400"
                                            tick={{ fontSize: 11 }}
                                            stroke="currentColor"
                                            width={50}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                                        <Area
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="transaksi"
                                            stroke="#3b82f6"
                                            fillOpacity={1}
                                            fill="url(#colorTransaksi)"
                                            name="Transaksi"
                                            strokeWidth={2}
                                        />
                                        <Area
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="pendapatan"
                                            stroke="#10b981"
                                            fillOpacity={1}
                                            fill="url(#colorPendapatan)"
                                            name="Pendapatan (Rp)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="w-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-lg h-[350px]">
                                <div className="text-center">
                                    <p className="text-muted-foreground text-lg">Tidak ada data untuk periode ini</p>
                                    <p className="text-muted-foreground text-sm mt-2">Coba pilih periode yang berbeda</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Area Stats & Summary */}
                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Statistik Area - WITH SCROLL */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Statistik Area Parkir</CardTitle>
                            <CardDescription>
                                Performa setiap area parkir (diurutkan dari transaksi terbanyak)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Scrollable container */}
                            <div className="relative">
                                <div
                                    className="space-y-3 overflow-y-auto pr-2"
                                    style={{
                                        maxHeight: '420px',
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: 'rgb(148 163 184) transparent',
                                    }}
                                >
                                    {sortedStatistikArea && sortedStatistikArea.length > 0 ? (
                                        sortedStatistikArea.map((area: any, index: number) => (
                                            <div
                                                key={area.id}
                                                className="group relative p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800/50 dark:to-neutral-800/30 transition-all duration-300 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-600 hover:-translate-y-1"
                                                style={{
                                                    animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
                                                }}
                                            >
                                                {/* Ranking Badge & Title */}
                                                <div className='flex justify-between items-start mb-3'>
                                                    <div className='flex items-center gap-3'>
                                                        <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold shadow-md'>
                                                            #{index + 1}
                                                        </div>
                                                        <div>
                                                            <h3 className='font-semibold text-base text-neutral-900 dark:text-neutral-100'>
                                                                {area.nama}
                                                            </h3>
                                                            <span className='text-xs text-muted-foreground'>
                                                                Area Parkir
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800'>
                                                        <svg className='h-4 w-4 text-blue-600 dark:text-blue-400' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span className='text-sm font-bold text-blue-600 dark:text-blue-400'>
                                                            {area.transaksi}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Stats Grid */}
                                                <div className='grid grid-cols-3 gap-3 mb-3'>
                                                    <div className='text-center p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700/50'>
                                                        <div className='text-xs text-muted-foreground mb-1'>Kapasitas</div>
                                                        <div className='text-lg font-bold text-neutral-900 dark:text-neutral-100'>
                                                            {area.kapasitas}
                                                        </div>
                                                    </div>
                                                    <div className='text-center p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20'>
                                                        <div className='text-xs text-muted-foreground mb-1'>Terisi</div>
                                                        <div className='text-lg font-bold text-orange-600 dark:text-orange-400'>
                                                            {area.terisi}
                                                        </div>
                                                    </div>
                                                    <div className='text-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20'>
                                                        <div className='text-xs text-muted-foreground mb-1'>Tersedia</div>
                                                        <div className='text-lg font-bold text-green-600 dark:text-green-400'>
                                                            {area.tersedia}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className='space-y-1.5'>
                                                    <div className='flex justify-between items-center text-xs'>
                                                        <span className='text-muted-foreground'>Tingkat Penggunaan</span>
                                                        <span className='font-semibold text-neutral-900 dark:text-neutral-100'>
                                                            {Math.round((area.terisi / area.kapasitas) * 100)}%
                                                        </span>
                                                    </div>
                                                    <div className='relative w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5 overflow-hidden'>
                                                        <div
                                                            className='absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out shadow-sm'
                                                            style={{ width: `${(area.terisi / area.kapasitas) * 100}%` }}
                                                        />
                                                        {/* Shimmer effect on hover */}
                                                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer' />
                                                    </div>
                                                </div>

                                                {/* Hover indicator */}
                                                <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                                    <svg className='h-5 w-5 text-blue-500' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className='rounded-full bg-neutral-100 dark:bg-neutral-800 p-4 mb-4'>
                                                <svg className='h-12 w-12 text-muted-foreground' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                            </div>
                                            <p className='font-medium text-neutral-900 dark:text-neutral-100 mb-1'>Tidak ada data area parkir</p>
                                            <p className='text-sm text-muted-foreground'>Data akan muncul setelah area parkir dibuat</p>
                                        </div>
                                    )}
                                </div>

                                {/* Gradient fade at bottom */}
                                {sortedStatistikArea.length > 4 && (
                                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none rounded-b-xl" />
                                )}
                            </div>

                            {/* Scroll hint */}
                            {sortedStatistikArea.length > 4 && (
                                <div className='flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground'>
                                    <svg className='h-4 w-4 animate-bounce' fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                    <span>Scroll untuk melihat area lainnya</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Summary Card */}
                    <Card className='relative overflow-hidden bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 border-indigo-500/20'>
                        <div className='absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/10' />
                        <CardHeader>
                            <CardTitle className='text-base'>Ringkasan</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='space-y-2'>
                                <div className='flex justify-between items-center'>
                                    <span className='text-sm text-muted-foreground'>Rata-rata per Hari</span>
                                    <span className='font-bold text-indigo-600 dark:text-indigo-400'>
                                        Rp{new Intl.NumberFormat('id-ID').format(
                                            chartData.length > 0 ? Math.round(totalPendapatan / chartData.length) : 0
                                        )}
                                    </span>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-sm text-muted-foreground'>Rata-rata Transaksi/Hari</span>
                                    <span className='font-bold text-indigo-600 dark:text-indigo-400'>
                                        {chartData.length > 0 ? Math.round(totalTransaksi / chartData.length) : 0}
                                    </span>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-sm text-muted-foreground'>Utilisasi Kapasitas</span>
                                    <span className='font-bold text-indigo-600 dark:text-indigo-400'>
                                        {Math.round(percentageTerisi)}%
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transaksi Terbaru</CardTitle>
                        <CardDescription>10 transaksi terakhir di sistem</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className='border-b border-neutral-200 dark:border-neutral-700'>
                                        <th className='text-left py-3 px-2 sm:px-4 font-medium text-xs text-muted-foreground'>Plat Nomor</th>
                                        <th className='text-left py-3 px-2 sm:px-4 font-medium text-xs text-muted-foreground'>Area</th>
                                        <th className='text-left py-3 px-2 sm:px-4 font-medium text-xs text-muted-foreground hidden sm:table-cell'>Waktu Masuk</th>
                                        <th className='text-left py-3 px-2 sm:px-4 font-medium text-xs text-muted-foreground hidden sm:table-cell'>Waktu Keluar</th>
                                        <th className='text-left py-3 px-2 sm:px-4 font-medium text-xs text-muted-foreground'>Biaya</th>
                                        <th className='text-left py-3 px-2 sm:px-4 font-medium text-xs text-muted-foreground'>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transaksiTerbaru && transaksiTerbaru.length > 0 ? (
                                        transaksiTerbaru.map((t: any) => (
                                            <tr key={t.id} className='border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'>
                                                <td className='py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm'>{t.plat_nomor}</td>
                                                <td className='py-3 px-2 sm:px-4 text-xs sm:text-sm'>{t.area}</td>
                                                <td className='py-3 px-2 sm:px-4 text-xs hidden sm:table-cell'>{t.waktu_masuk}</td>
                                                <td className='py-3 px-2 sm:px-4 text-xs hidden sm:table-cell'>{t.waktu_keluar}</td>
                                                <td className='py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm'>
                                                    Rp{new Intl.NumberFormat('id-ID').format(t.biaya)}
                                                </td>
                                                <td className='py-3 px-2 sm:px-4'>
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                                        t.status === 'masuk'
                                                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                    }`}>
                                                        {t.status === 'masuk' ? 'Masuk' : 'Keluar'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className='text-center py-6 text-muted-foreground'>
                                                Tidak ada transaksi
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </AppLayout>
    );
}

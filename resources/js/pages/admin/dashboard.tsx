"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, FileText, MapPin, DollarSign, Car, BarChart3, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface AdminDashboardProps {
    totalPetugas?: number;
    totalAdmin?: number;
    totalOwner?: number;
    totalTransaksi?: number;
    transaksiMasuk?: number;
    transaksiKeluar?: number;
    totalPendapatan?: number;
    totalKendaraan?: number;
    totalArea?: number;
    totalTarif?: number;
    totalKapasitas?: number;
    totalTerisi?: number;
    kapasitasTersedia?: number;
    statistikArea?: any[];
    statistikPetugas?: any[];
    chartData?: any[];
    transaksiTerbaru?: any[];
}

export default function Dashboard({
    totalPetugas = 0,
    totalAdmin = 0,
    totalOwner = 0,
    totalTransaksi = 0,
    transaksiMasuk = 0,
    transaksiKeluar = 0,
    totalPendapatan = 0,
    totalKendaraan = 0,
    totalArea = 0,
    totalTarif = 0,
    totalKapasitas = 0,
    totalTerisi = 0,
    kapasitasTersedia = 0,
    statistikArea = [],
    statistikPetugas = [],
    chartData = [],
    transaksiTerbaru = [],
}: AdminDashboardProps) {


    const percentageTerisi = totalKapasitas > 0 ? (totalTerisi / totalKapasitas) * 100 : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                <div className='flex justify-between items-center'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Admin Dashboard</h1>
                        <p className='text-muted-foreground mt-1'>Sistem manajemen parkir - Tinjauan lengkap</p>
                    </div>
                </div>

                {/* Top Stats - 6 Cards */}
                <div className="grid auto-rows-min gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Total Users */}
                    <Card className='relative overflow-hidden bg-linear-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20'>
                        <div className='absolute -right-3 -top-3 h-20 w-20 rounded-full bg-blue-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400'>
                                Total Petugas
                            </CardTitle>
                            <Users className='h-4 w-4 text-blue-600 dark:text-blue-400'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400'>{totalPetugas}</div>
                            <p className='text-xs text-muted-foreground mt-1'>Admin: {totalAdmin} • Owner: {totalOwner}</p>
                        </CardContent>
                    </Card>

                    {/* Total Transaksi */}
                    <Card className='relative overflow-hidden bg-linear-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20'>
                        <div className='absolute -right-3 -top-3 h-20 w-20 rounded-full bg-purple-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400'>
                                Total Transaksi
                            </CardTitle>
                            <FileText className='h-4 w-4 text-purple-600 dark:text-purple-400'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400'>{totalTransaksi}</div>
                            <p className='text-xs text-muted-foreground mt-1'>Keluar: {transaksiKeluar}</p>
                        </CardContent>
                    </Card>

                    {/* Total Pendapatan */}
                    <Card className='relative overflow-hidden bg-linear-to-br from-green-500/10 to-green-600/10 border-green-500/20'>
                        <div className='absolute -right-3 -top-3 h-20 w-20 rounded-full bg-green-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-xs sm:text-sm font-medium text-green-600 dark:text-green-400'>
                                Total Pendapatan
                            </CardTitle>
                            <DollarSign className='h-4 w-4 text-green-600 dark:text-green-400'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400'>Rp{new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(totalPendapatan)}</div>
                        </CardContent>
                    </Card>

                    {/* Total Kendaraan */}
                    <Card className='relative overflow-hidden bg-linear-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20'>
                        <div className='absolute -right-3 -top-3 h-20 w-20 rounded-full bg-orange-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400'>
                                Total Kendaraan
                            </CardTitle>
                            <Car className='h-4 w-4 text-orange-600 dark:text-orange-400'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400'>{totalKendaraan}</div>
                        </CardContent>
                    </Card>

                    {/* Total Area */}
                    <Card className='relative overflow-hidden bg-linear-to-br from-indigo-500/10 to-indigo-600/10 border-indigo-500/20'>
                        <div className='absolute -right-3 -top-3 h-20 w-20 rounded-full bg-indigo-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400'>
                                Area Parkir
                            </CardTitle>
                            <MapPin className='h-4 w-4 text-indigo-600 dark:text-indigo-400'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400'>{totalArea}</div>
                            <p className='text-xs text-muted-foreground mt-1'>Tarif: {totalTarif}</p>
                        </CardContent>
                    </Card>

                    {/* Kapasitas */}
                    <Card className='relative overflow-hidden bg-linear-to-br from-rose-500/10 to-rose-600/10 border-rose-500/20'>
                        <div className='absolute -right-3 -top-3 h-20 w-20 rounded-full bg-rose-500/10' />
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400'>
                                Kapasitas
                            </CardTitle>
                            <BarChart3 className='h-4 w-4 text-rose-600 dark:text-rose-400'/>
                        </CardHeader>
                        <CardContent>
                            <div className='text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400'>{kapasitasTersedia}/{totalKapasitas}</div>
                            <div className='mt-2 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5'>
                                <div className='bg-rose-600 h-1.5 rounded-full transition-all duration-300' style={{ width: `${percentageTerisi}%` }} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Transaksi & Pendapatan Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaksi & Pendapatan (12 Bulan)</CardTitle>
                            <CardDescription>Grafik per bulan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {chartData && chartData.length > 0 ? (
                                <div className="w-full h-[280px] bg-white dark:bg-neutral-900 rounded-lg">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-neutral-300 dark:text-neutral-700" />
                                            <XAxis
                                                dataKey="month"
                                                stroke="currentColor"
                                                className="text-neutral-600 dark:text-neutral-400"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis
                                                yAxisId="left"
                                                stroke="currentColor"
                                                className="text-neutral-600 dark:text-neutral-400"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis
                                                yAxisId="right"
                                                orientation="right"
                                                stroke="currentColor"
                                                className="text-neutral-600 dark:text-neutral-400"
                                                tick={{ fontSize: 12 }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'hsl(0 0% 100%)',
                                                    border: '1px solid hsl(0 0% 90%)',
                                                    borderRadius: '8px',
                                                }}
                                                formatter={(value: any) => new Intl.NumberFormat('id-ID').format(value)}
                                            />
                                            <Legend />
                                            <Bar yAxisId="left" dataKey="transaksi" fill="#3b82f6" name="Transaksi" radius={[4, 4, 0, 0]} />
                                            <Bar yAxisId="right" dataKey="pendapatan" fill="#10b981" name="Pendapatan (Rp)" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                                    Belum ada data
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Statistik Petugas */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Petugas</CardTitle>
                            <CardDescription>Berdasarkan transaksi keluar</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {statistikPetugas && statistikPetugas.length > 0 ? (
                                    statistikPetugas.map((petugas: any, idx: number) => (
                                        <div key={petugas.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                    {idx + 1}
                                                </div>
                                                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{petugas.name}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex-shrink-0">{petugas.transaksi_count}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">Belum ada data</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Area Stats & Recent Transactions */}
                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Statistik Area */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Statistik Per Area</CardTitle>
                            <CardDescription>Distribusi transaksi dan pendapatan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead className="border-b border-neutral-200 dark:border-neutral-700">
                                        <tr>
                                            <th className="text-left py-2 px-3 font-medium text-neutral-600 dark:text-neutral-400">Area</th>
                                            <th className="text-center py-2 px-3 font-medium text-neutral-600 dark:text-neutral-400">Kapasitas</th>
                                            <th className="text-center py-2 px-3 font-medium text-neutral-600 dark:text-neutral-400">Transaksi</th>
                                            <th className="text-right py-2 px-3 font-medium text-neutral-600 dark:text-neutral-400">Pendapatan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                        {statistikArea && statistikArea.length > 0 ? (
                                            statistikArea.map((area: any) => (
                                                <tr key={area.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                                    <td className="py-2 px-3 font-medium text-neutral-900 dark:text-neutral-100">{area.nama_area}</td>
                                                    <td className="py-2 px-3 text-center text-neutral-600 dark:text-neutral-400">{area.terisi}/{area.kapasitas}</td>
                                                    <td className="py-2 px-3 text-center font-semibold text-neutral-900 dark:text-neutral-100">{area.total_transaksi}</td>
                                                    <td className="py-2 px-3 text-right font-semibold text-green-600 dark:text-green-400">Rp {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(area.pendapatan_area ?? 0)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="py-4 text-center text-neutral-500 dark:text-neutral-400">Belum ada area</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ringkasan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Total User</span>
                                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{totalPetugas + totalAdmin + totalOwner}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Transaksi Masuk</span>
                                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">{transaksiMasuk}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Ketersediaan Parkir</span>
                                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{percentageTerisi.toFixed(1)}%</span>
                                </div>
                                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Avg Revenue/Hari</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">Rp {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(totalPendapatan / 30)}</span>
                                    </div>
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
                            <table className="w-full text-xs">
                                <thead className="border-b border-neutral-200 dark:border-neutral-700">
                                    <tr>
                                        <th className="text-left py-2 px-3 font-medium text-neutral-600 dark:text-neutral-400">Plat Nomor</th>
                                        <th className="text-left py-2 px-3 font-medium text-neutral-600 dark:text-neutral-400">Area</th>
                                        <th className="text-left py-2 px-3 font-medium text-neutral-600 dark:text-neutral-400">Petugas</th>
                                        <th className="text-left py-2 px-3 font-medium text-neutral-600 dark:text-neutral-400">Waktu Masuk</th>
                                        <th className="text-left py-2 px-3 font-medium text-neutral-600 dark:text-neutral-400">Status</th>
                                        <th className="text-right py-2 px-3 font-medium text-neutral-600 dark:text-neutral-400">Biaya</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                    {transaksiTerbaru && transaksiTerbaru.length > 0 ? (
                                        transaksiTerbaru.map((transaksi: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                                <td className="py-2 px-3 font-medium text-neutral-900 dark:text-neutral-100">{transaksi.kendaraan?.plat_nomor}</td>
                                                <td className="py-2 px-3 text-neutral-600 dark:text-neutral-400">{transaksi.areaParkir?.nama_area}</td>
                                                <td className="py-2 px-3 text-neutral-600 dark:text-neutral-400">{transaksi.user?.name}</td>
                                                <td className="py-2 px-3 text-neutral-600 dark:text-neutral-400">
                                                    {new Date(transaksi.waktu_masuk).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="py-2 px-3">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                        transaksi.status === 'masuk'
                                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    }`}>
                                                        {transaksi.status.charAt(0).toUpperCase() + transaksi.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3 text-right font-semibold text-green-600 dark:text-green-400">
                                                    {transaksi.biaya_total ? 'Rp ' + new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(transaksi.biaya_total) : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-4 text-center text-neutral-500 dark:text-neutral-400">Belum ada transaksi</td>
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

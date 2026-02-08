import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { FileText } from 'lucide-react' // Opsional: Tambah icon agar lebih manis

export default function RekapIndex() {
    const [bulan, setBulan] = useState('')
    const [tahun, setTahun] = useState('')

    const handleCetak = () => {
        if (!bulan || !tahun) {
            alert('Silakan pilih bulan dan tahun terlebih dahulu');
            return;
        }

        // Gunakan window.open agar PDF terbuka di tab baru (karena stream PDF)
        const url = `/owner/rekap-transaksi/cetak?bulan=${bulan}&tahun=${tahun}`;
        window.open(url, '_blank');
    }

    // Daftar Nama Bulan
    const namaBulan = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    return (
        <AppLayout>
            <Head title="Rekap Transaksi" />

            {/* Container Utama: Center Center */}
            <div className="flex items-center justify-center min-h-[80vh]">
                <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                            <FileText className="text-primary" size={24} />
                        </div>
                        <CardTitle className="text-2xl font-bold">Rekap Transaksi</CardTitle>
                        <CardDescription>
                            Pilih periode laporan yang ingin dicetak dalam format PDF
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Pilih Bulan */}
                        <div className="space-y-2">
                            <Label htmlFor="bulan">Bulan</Label>
                            <Select onValueChange={(value) => setBulan(value)}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Pilih Bulan..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {namaBulan.map((name, i) => (
                                        <SelectItem key={i} value={(i + 1).toString()}>
                                            {name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Pilih Tahun */}
                        <div className="space-y-2">
                            <Label htmlFor="tahun">Tahun</Label>
                            <Select onValueChange={(value) => setTahun(value)}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Pilih Tahun..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {[2024, 2025, 2026].map((y) => (
                                        <SelectItem key={y} value={y.toString()}>
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tombol Cetak */}
                        <Button
                            onClick={handleCetak}
                            className="w-full mt-4 flex gap-2"
                            disabled={!bulan || !tahun}
                        >
                            <FileText size={18} />
                            Cetak Rekapan PDF
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}

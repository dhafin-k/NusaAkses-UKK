import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { FileText } from 'lucide-react'

export default function RekapTahun() {
    const [tahun, setTahun] = useState('')

    const handleCetak = () => {
        if (!tahun) {
            alert('Silakan pilih tahun terlebih dahulu');
            return;
        }

        const url = `/owner/rekap-transaksi-tahun/cetak?tahun=${tahun}`;
        window.open(url, '_blank');
    }

    return (
        <AppLayout>
            <Head title="Rekap Transaksi Tahunan" />

            {/* Container Utama: Center Center */}
            <div className="flex items-center justify-center min-h-[80vh]">
                <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                            <FileText className="text-primary" size={24} />
                        </div>
                        <CardTitle className="text-2xl font-bold">Rekap Transaksi Tahunan</CardTitle>
                        <CardDescription>
                            Pilih tahun laporan yang ingin dicetak dalam format PDF
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
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
                            disabled={!tahun}
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

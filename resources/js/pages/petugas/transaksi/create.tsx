import React, { useEffect, useState } from 'react'
import { Head, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { ArrowLeft, Save, CheckCircle2, XCircle, Car, MapPin, DollarSign, Clock, AlertCircle, Check, ChevronsUpDown } from 'lucide-react'
import { type BreadcrumbItem } from '@/types'
import { useForm } from '@inertiajs/react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AreaParkir {
    id: number;
    nama_area: string;
}

interface JenisKendaraan {
    id: number;
    nama_jenis_kendaraan: string;
}

interface Kendaraan {
    id: number;
    plat_nomor: string;
    warna: string;
    pemilik: string;
    jenis_kendaraan_id: number;
    jenis?: JenisKendaraan;
}

interface TarifParkir {
    id: number;
    jenis_kendaraan_id: number;
    tarif_per_jam: number;
    jenis_kendaraan?: JenisKendaraan;
}

interface Props {
    areaParkir: AreaParkir[];
    kendaraan: Kendaraan[];
    tarifParkir: TarifParkir[];
    errors?: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaksi Parkir',
        href: '/petugas/transaksi'
    },
    {
        title: 'Kendaraan Masuk',
        href: '/petugas/transaksi/create'
    }
]

// Helper function to format Rupiah
const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

export default function TransaksiCreate({ areaParkir, kendaraan, tarifParkir, errors, flash }: Props) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [selectedKendaraan, setSelectedKendaraan] = useState<Kendaraan | null>(null);
    const [selectedTarif, setSelectedTarif] = useState<TarifParkir | null>(null);
    const [openKendaraanCombobox, setOpenKendaraanCombobox] = useState(false);
    const [searchKendaraan, setSearchKendaraan] = useState('');

    const { data, setData, post, processing } = useForm({
        area_parkir_id: '',
        kendaraan_id: '',
        waktu_masuk: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
    });

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    // Auto-fill tarif when kendaraan is selected
    useEffect(() => {
        if (data.kendaraan_id) {
            const kendaraanData = kendaraan.find(k => k.id === parseInt(data.kendaraan_id));
            setSelectedKendaraan(kendaraanData || null);

            if (kendaraanData?.jenis_kendaraan_id) {
                // Pastikan tipe data sama saat membandingkan
                const tarif = tarifParkir.find(t => String(t.jenis_kendaraan_id) === String(kendaraanData.jenis_kendaraan_id));
                console.log('Kendaraan ID:', kendaraanData.id, 'Jenis ID:', kendaraanData.jenis_kendaraan_id, 'Found Tarif:', tarif);
                setSelectedTarif(tarif || null);
            } else {
                setSelectedTarif(null);
            }
        } else {
            setSelectedKendaraan(null);
            setSelectedTarif(null);
        }
    }, [data.kendaraan_id, kendaraan, tarifParkir]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Data yang dikirim:', data);

        post('/petugas/transaksi', {
            onSuccess: () => {
                setToastMessage('Kendaraan berhasil masuk area parkir!');
                setToastType('success');
                setShowToast(true);
                setTimeout(() => {
                    router.visit('/petugas/transaksi');
                }, 1000);
            },
            onError: (errors) => {
                console.log('Error:', errors);
                setToastMessage('Gagal menambahkan transaksi!');
                setToastType('error');
                setShowToast(true);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Kendaraan Masuk' />

            {/* Toast Notification */}
            {showToast && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white animate-in fade-in slide-in-from-top-5`}>
                    {toastType === 'success' ? (
                        <CheckCircle2 className='h-5 w-5' />
                    ) : (
                        <XCircle className='h-5 w-5' />
                    )}
                    <span>{toastMessage}</span>
                </div>
            )}

            <div className='flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-linear-to-br from-background to-muted/20'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Kendaraan Masuk</h1>
                        <p className='text-muted-foreground mt-1'>Input data kendaraan yang masuk area parkir</p>
                    </div>
                    <Button
                        variant='outline'
                        onClick={() => router.visit('/petugas/transaksi')}
                    >
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Kembali
                    </Button>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Form Card */}
                    <Card className='lg:col-span-2'>
                        <CardHeader>
                            <CardTitle>Informasi Transaksi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className='space-y-6'>
                                {/* Area Parkir */}
                                <div className='space-y-2'>
                                    <Label htmlFor='area_parkir_id'>
                                        <MapPin className='h-4 w-4 inline mr-2' />
                                        Area Parkir <span className='text-destructive'>*</span>
                                    </Label>
                                    <Select
                                        value={data.area_parkir_id}
                                        onValueChange={(value) => setData('area_parkir_id', value)}
                                    >
                                        <SelectTrigger className='focus:ring-2 focus:ring-primary w-full'>
                                            <SelectValue placeholder='Pilih Area Parkir' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {areaParkir.map((area) => (
                                                <SelectItem key={area.id} value={area.id.toString()}>
                                                    <div className='flex flex-col'>
                                                        <span className='font-medium'>{area.nama_area}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors?.area_parkir_id && (
                                        <p className='text-destructive text-sm flex items-center gap-1'>
                                            <AlertCircle className='h-3 w-3' />
                                            {errors.area_parkir_id}
                                        </p>
                                    )}
                                </div>

                                {/* Kendaraan */}
                                <div className='space-y-2'>
                                    <Label htmlFor='kendaraan_id'>
                                        <Car className='h-4 w-4 inline mr-2' />
                                        Kendaraan <span className='text-destructive'>*</span>
                                    </Label>
                                    <Popover open={openKendaraanCombobox} onOpenChange={setOpenKendaraanCombobox}>
                                        <PopoverTrigger asChild className='w-full'>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={openKendaraanCombobox}
                                                className="w-full justify-between focus:ring-2 focus:ring-primary"
                                            >
                                                {selectedKendaraan
                                                    ? `${selectedKendaraan.plat_nomor}`
                                                    : "Pilih Kendaraan..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0 max-h-96" align="start" side="bottom">
                                            <Command shouldFilter={false}>
                                                <CommandInput
                                                    placeholder="Cari plat nomor..."
                                                    value={searchKendaraan}
                                                    onValueChange={setSearchKendaraan}
                                                />
                                                <CommandEmpty>Tidak ada kendaraan yang ditemukan.</CommandEmpty>
                                                <CommandList className="max-h-80">
                                                    <CommandGroup>
                                                        {kendaraan
                                                            .filter((kend) => {
                                                                if (!searchKendaraan) return true;
                                                                return kend.plat_nomor.toLowerCase().includes(searchKendaraan.toLowerCase());
                                                            })
                                                            .map((kend) => (
                                                                <CommandItem
                                                                    key={kend.id}
                                                                    value={kend.id.toString()}
                                                                    onSelect={() => {
                                                                        setData('kendaraan_id', kend.id.toString());
                                                                        setSelectedKendaraan(kend);
                                                                        setOpenKendaraanCombobox(false);
                                                                        setSearchKendaraan('');
                                                                    }}
                                                                    className="cursor-pointer py-3"
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            data.kendaraan_id === kend.id.toString()
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <div className='flex items-center gap-2'>
                                                                        <span className='font-mono font-bold text-sm md:text-base'>{kend.plat_nomor}</span>
                                                                        <Badge variant="outline" className='text-xs'>
                                                                            {kend.jenis?.nama_jenis_kendaraan || '-'}
                                                                        </Badge>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {errors?.kendaraan_id && (
                                        <p className='text-destructive text-sm flex items-center gap-1'>
                                            <AlertCircle className='h-3 w-3' />
                                            {errors.kendaraan_id}
                                        </p>
                                    )}
                                </div>

                                {/* Waktu Masuk */}
                                <div className='space-y-2'>
                                    <Label htmlFor='waktu_masuk'>
                                        <Clock className='h-4 w-4 inline mr-2' />
                                        Waktu Masuk <span className='text-destructive'>*</span>
                                    </Label>
                                    <Input
                                        id='waktu_masuk'
                                        type='datetime-local'
                                        value={data.waktu_masuk}
                                        onChange={(e) => setData('waktu_masuk', e.target.value)}
                                        className='focus:ring-2 focus:ring-primary'
                                    />
                                    {errors?.waktu_masuk && (
                                        <p className='text-destructive text-sm flex items-center gap-1'>
                                            <AlertCircle className='h-3 w-3' />
                                            {errors.waktu_masuk}
                                        </p>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className='flex gap-3 pt-4 justify-end border-t'>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        onClick={() => router.visit('/petugas/transaksi')}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type='submit'
                                        disabled={processing}
                                        className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'
                                    >
                                        <Save className='h-4 w-4 mr-2' />
                                        {processing ? 'Menyimpan...' : 'Simpan Transaksi'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Info Card - Kendaraan & Tarif */}
                    <div className='space-y-4'>
                        {/* Kendaraan Info */}
                        {selectedKendaraan && (
                            <Card className='border-primary/20 bg-primary/5'>
                                <CardHeader className='pb-3'>
                                    <CardTitle className='text-lg flex items-center gap-2'>
                                        <Car className='h-5 w-5' />
                                        Detail Kendaraan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-3'>
                                    <div className='space-y-2'>
                                        <Label className='text-xs text-muted-foreground'>Plat Nomor</Label>
                                        <Badge variant="outline" className='w-full justify-center py-2 text-lg font-mono font-bold'>
                                            {selectedKendaraan.plat_nomor}
                                        </Badge>
                                    </div>
                                    <div className='grid grid-cols-2 gap-3'>
                                        <div>
                                            <Label className='text-xs text-muted-foreground'>Jenis</Label>
                                            <p className='font-medium text-sm'>
                                                {selectedKendaraan.jenis?.nama_jenis_kendaraan || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className='text-xs text-muted-foreground'>Warna</Label>
                                            <p className='font-medium text-sm'>{selectedKendaraan.warna}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className='text-xs text-muted-foreground'>Pemilik</Label>
                                        <p className='font-medium text-sm'>{selectedKendaraan.pemilik}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Tarif Info */}
                        {selectedTarif ? (
                            <Card className='border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900'>
                                <CardHeader className='pb-3'>
                                    <CardTitle className='text-lg flex items-center gap-2'>
                                        <DollarSign className='h-5 w-5' />
                                        Tarif Parkir
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-3'>
                                    <div>
                                        <Label className='text-xs text-muted-foreground'>Jenis Kendaraan</Label>
                                        <p className='font-medium'>
                                            {selectedTarif.jenis_kendaraan?.nama_jenis_kendaraan || '-'}
                                        </p>
                                    </div>
                                    <div className='pt-2 border-t'>
                                        <Label className='text-xs text-muted-foreground'>Tarif Per Jam</Label>
                                        <p className='text-2xl font-bold text-green-600 dark:text-green-400 font-mono'>
                                            Rp {formatRupiah(selectedTarif.tarif_per_jam)}
                                        </p>
                                    </div>
                                    <Alert className='bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900'>
                                        <AlertCircle className='h-4 w-4 text-blue-600' />
                                        <AlertDescription className='text-xs text-blue-800 dark:text-blue-200'>
                                            Tarif dibulatkan per jam. Contoh: 30 menit = 1 jam, 1 jam 1 detik = 2 jam
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>
                        ) : (
                            data.kendaraan_id && (
                                <Alert variant="destructive">
                                    <AlertCircle className='h-4 w-4' />
                                    <AlertDescription>
                                        Tarif parkir untuk jenis kendaraan ini belum tersedia!
                                    </AlertDescription>
                                </Alert>
                            )
                        )}

                        {/* Help Card */}
                        {!selectedKendaraan && (
                            <Card className='border-muted'>
                                <CardHeader className='pb-3'>
                                    <CardTitle className='text-lg'>Panduan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className='space-y-2 text-sm text-muted-foreground'>
                                        <li className='flex items-start gap-2'>
                                            <CheckCircle2 className='h-4 w-4 mt-0.5 text-green-500 shrink-0' />
                                            <span>Pilih area parkir tempat kendaraan masuk</span>
                                        </li>
                                        <li className='flex items-start gap-2'>
                                            <CheckCircle2 className='h-4 w-4 mt-0.5 text-green-500 shrink-0' />
                                            <span>Pilih kendaraan yang akan parkir</span>
                                        </li>
                                        <li className='flex items-start gap-2'>
                                            <CheckCircle2 className='h-4 w-4 mt-0.5 text-green-500 shrink-0' />
                                            <span>Tarif akan otomatis terisi berdasarkan jenis kendaraan</span>
                                        </li>
                                        <li className='flex items-start gap-2'>
                                            <CheckCircle2 className='h-4 w-4 mt-0.5 text-green-500 shrink-0' />
                                            <span>Waktu masuk sudah diisi otomatis dengan waktu saat ini</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

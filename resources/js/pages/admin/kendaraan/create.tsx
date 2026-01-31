import React, { useEffect, useState } from 'react'
import { Head, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, CheckCircle2, XCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface JenisKendaraan {
    id: number;
    nama_jenis_kendaraan: string;
}

interface Props {
    jenisKendaraan: JenisKendaraan[];
    errors?: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage kendaraan',
        href: '/admin/kendaraan'
    },
    {
        title: 'Tambah Data kendaraan',
        href: '/admin/kendaraan/create'
    }
]

export default function KendaraanCreate({ jenisKendaraan, errors, flash }: Props) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const { data, setData, post, processing } = useForm({
        pemilik: '',
        plat_nomor: '',
        warna: '',
        jenis_kendaraan_id: '',
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Data yang dikirim:', data);

        post('/admin/kendaraan', {
            onError: (errors) => {
                console.log('Error:', errors);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Tambah Kendaraan' />
            <div className='flex h-full flex-1 flex-col gap-4 rounded-xl p-6 bg-linear-to-br from-background to-muted/20'>

                {/* Header */}
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Tambah Kendaraan</h1>
                        <p className='text-muted-foreground mt-1'>Isi form berikut untuk menambahkan kendaraan baru</p>
                    </div>
                    <Button
                        variant='outline'
                        onClick={() => router.visit('/admin/kendaraan')}
                    >
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Kembali
                    </Button>
                </div>

                {/* Form Card */}
                <Card className=' w-full'>
                    <CardHeader>
                        <CardTitle>Informasi Kendaraan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            {/* Pemilik */}
                            <div className='space-y-2'>
                                <Label htmlFor='pemilik'>
                                    Pemilik <span className='text-destructive'>*</span>
                                </Label>
                                <Input
                                    id='pemilik'
                                    value={data.pemilik}
                                    onChange={(e) => setData('pemilik', e.target.value)}
                                    placeholder='Masukkan nama pemilik kendaraan'
                                    className='focus:ring-2 focus:ring-primary'
                                />
                                {errors?.pemilik && (
                                    <p className='text-destructive text-sm'>{errors.pemilik}</p>
                                )}
                            </div>

                            {/* Plat nomor */}
                            <div className='space-y-2'>
                                <Label htmlFor='plat_nomor'>
                                    Plat nomor <span className='text-destructive'>*</span>
                                </Label>
                                <Input
                                    id='plat_nomor'
                                    value={data.plat_nomor}
                                    onChange={(e) => setData('plat_nomor', e.target.value)}
                                    placeholder='Contoh: P 1234 F'
                                    className='focus:ring-2 focus:ring-primary font-mono'
                                />
                                {errors?.plat_nomor && (
                                    <p className='text-destructive text-sm'>{errors.plat_nomor}</p>
                                )}
                            </div>

                            {/* warna Kendaran */}
                            <div className='space-y-2'>
                                <Label htmlFor='warna'>
                                    Warna Kendaraan <span className='text-destructive'>*</span>
                                </Label>
                                <Input
                                    id='warna'
                                    value={data.warna}
                                    onChange={(e) => setData('warna', e.target.value)}
                                    placeholder='Contoh: Hitam, Putih, Merah'
                                    className='focus:ring-2 focus:ring-primary'
                                />
                                {errors?.warna && (
                                    <p className='text-destructive text-sm'>{errors.warna}</p>
                                )}
                            </div>

                            {/* Jenis Kendaraan */}
                            <div className='space-y-2'>
                                <Label htmlFor='jenis_kendaraan_id'>
                                    Jenis Kendaraan <span className='text-destructive'>*</span>
                                </Label>
                                <Select
                                    value={data.jenis_kendaraan_id}
                                    onValueChange={(value) => setData('jenis_kendaraan_id', value)}>
                                    <SelectTrigger className="w-full focus:ring-2 focus:ring-primary">
                                        <SelectValue placeholder="Pilih jenis Kendaraan" />
                                    </SelectTrigger>
                                    <SelectContent >
                                        {jenisKendaraan.map((jenis) => (
                                            <SelectItem key={jenis.id} value={jenis.id.toString()}>
                                                {jenis.nama_jenis_kendaraan}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Buttons */}
                            <div className='flex gap-3 pt-4 justify-end'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => router.visit('/admin/kendaraan')}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={processing}
                                    className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'
                                >
                                    <Save className='h-4 w-4 mr-2' />
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </Button>

                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

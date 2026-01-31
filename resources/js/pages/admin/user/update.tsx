import React, { useEffect, useState } from 'react'
import { Head, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, CheckCircle2, XCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react'

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Props{
    user: User;
    roles: { id: number, nama_role: string}[];
    errors?: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title:'User Management',
        href:'/admin/users'
    },
    {
        title:'Edit User',
        href:'#'
    }
]

export default function UserUpdate({ user, roles, errors, flash }: Props) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const { data, setData, put, processing } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
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

        put(`/admin/users/${user.id}`, {
            onSuccess: () => {
                router.visit('/admin/users');
            },
            onError: (errors) => {
                console.log('Error:', errors);
            }
        });
    };

return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Edit User' />
            {/* Toast Notification */}
            {showToast && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${
                    toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
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
                        <h1 className='text-3xl font-bold tracking-tight'>Edit User</h1>
                        <p className='text-muted-foreground mt-1'>Perbarui informasi user</p>
                    </div>
                    <Button
                        variant='outline'
                        onClick={() => router.visit('/admin/users')}
                    >
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Kembali
                    </Button>
                </div>

                {/* Form Card */}
                <Card className=' w-full'>
                    <CardHeader>
                        <CardTitle>Informasi User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            {/* Nama */}
                            <div className='space-y-2'>
                                <Label htmlFor='name'>
                                    Nama Lengkap <span className='text-destructive'>*</span>
                                </Label>
                                <Input
                                    id='name'
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder='Masukkan nama lengkap'
                                    className='focus:ring-2 focus:ring-primary'
                                />
                                {errors?.name && (
                                    <p className='text-destructive text-sm'>{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className='space-y-2'>
                                <Label htmlFor='email'>
                                    Email <span className='text-destructive'>*</span>
                                </Label>
                                <Input
                                    id='email'
                                    type='email'
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder='nama@email.com'
                                    className='focus:ring-2 focus:ring-primary'
                                />
                                {errors?.email && (
                                    <p className='text-destructive text-sm'>{errors.email}</p>
                                )}
                            </div>

                            {/* Role */}
                            <div className='space-y-2'>
                                <Label htmlFor='role'>
                                    Role <span className='text-destructive'>*</span>
                                </Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value) => setData('role', value)}
                                >
                                    <SelectTrigger className='focus:ring-2 focus:ring-primary w-full'>
                                        <SelectValue placeholder='Pilih Role' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((r) => (
                                            <SelectItem key={r.id} value={r.nama_role}>
                                                {r.nama_role.charAt(0).toUpperCase() + r.nama_role.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors?.role && (
                                    <p className='text-destructive text-sm'>{errors.role}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className='space-y-2'>
                                <Label htmlFor='password'>
                                    Password <span className='text-muted-foreground'>(Kosongkan jika tidak ingin ubah)</span>
                                </Label>
                                <Input
                                    id='password'
                                    type='password'
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder='Minimal 8 karakter'
                                    className='focus:ring-2 focus:ring-primary'
                                />
                                {errors?.password && (
                                    <p className='text-destructive text-sm'>{errors.password}</p>
                                )}
                            </div>

                            {/* Konfirmasi Password */}
                            <div className='space-y-2'>
                                <Label htmlFor='password_confirmation'>
                                    Konfirmasi Password <span className='text-muted-foreground'>(Kosongkan jika tidak ingin ubah)</span>
                                </Label>
                                <Input
                                    id='password_confirmation'
                                    type='password'
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder='Ulangi password'
                                    className='focus:ring-2 focus:ring-primary'
                                />
                                {errors?.password_confirmation && (
                                    <p className='text-destructive text-sm'>{errors.password_confirmation}</p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className='flex gap-3 pt-4 justify-end'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => router.visit('/admin/users')}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={processing}
                                    className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'
                                >
                                    <Save className='h-4 w-4 mr-2' />
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>

                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, Search, ChevronLeft, ChevronRight, MapPin, Users, Save, DiamondPlus, Database, Tag } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface JenisKendaraan {
    id: number;
    nama_jenis_kendaraan: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    jenisKendaraan: {
        data: JenisKendaraan[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
    };
    errors?: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Jenis Kendaraan',
        href: '/admin/jenis-kendaraan'
    }
];

export default function JenisKendaraanIndex({ jenisKendaraan, filters, flash }: Props) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        nama_jenis_kendaraan: '',
    });

    const { data: createData, setData: setCreateData, post, processing: createProcessing, errors: createErrors, reset: resetCreate} = useForm ({
        nama_jenis_kendaraan: '',
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

    const handleCreate = () => {
        resetCreate();
        setIsCreateModalOpen(true);
    }

    const handleStore = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/jenis-kendaraan', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                resetCreate();
            },
            onError: (err: any) => {
                const msg = err?.message || 'Gagal menambahkan jenis kendaraan';
                setToastMessage(msg);
                setToastType('error');
                setShowToast(true);
            }
        });
    }

    const handleEdit = (jenis: JenisKendaraan) => {
        setEditId(jenis.id);
        setData({
            nama_jenis_kendaraan: jenis.nama_jenis_kendaraan,
        });
        setIsEditModalOpen(true);
    }

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/jenis-kendaraan/${editId}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                reset();
            },
            onError: (err: any) => {
                const msg = err?.message || 'Gagal memperbarui data';
                setToastMessage(msg);
                setToastType('error');
                setShowToast(true);
            }
        })
    }


    const handleDelete = (jenisId: number) => {
        setDeleteId(null);
        router.delete(`/admin/jenis-kendaraan/${jenisId}`, {
            onSuccess: () => {
                setToastMessage('Jenis kendaraan berhasil dihapus!');
                setToastType('success');
                setShowToast(true);
            },
            onError: (err: any) => {
                const msg = err?.message || 'Gagal menghapus jenis kendaraan';
                setToastMessage(msg);
                setToastType('error');
                setShowToast(true);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Jenis Kendaraan' />
            <div className='flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-linear-to-br from-background to-muted/20'>

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

                {/* Header Section */}
                <div className='md:flex md:flex-col md:gap-2'>
                    <div className='flex justify-between items-center'>
                        <h1 className='md:text-3xl text-xl font-bold tracking-tight'>Jenis Kendaraaan</h1>
                        <Button
                            onClick={handleCreate}
                            className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'
                        >
                            <Plus className='md:h-4 md:w-4 h-1 w-1 md:mr-2 mr-0' />
                            Tambah Data
                        </Button>
                    </div>
                    <p className='text-muted-foreground sm:text-base text-sm'>Kelola jenis kendaraan</p>
                </div>


                <div className='rounded-md border'>
                    <div className='relative w-full overflow-auto'>
                        <table className='w-full caption-bottom text-sm'>
                            <thead className='[&_tr]:border-b'>
                                <tr className='border-b transition-colors hover:bg-muted/50'>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>No</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Nama Jenis Kendaraan</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Dibuat</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Diperbarui</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Aksi</th>
                                </tr>
                            </thead>
                            <tbody className='[&_tr:last-child]:border-0'>
                                {jenisKendaraan.data.map((jenis, index) => (
                                    <tr key={jenis.id} className='border-b transition-colors hover:bg-muted/50'>
                                        <td className='p-4 align-middle font-medium'>{index + 1}</td>
                                        <td className='p-4 align-middle font-medium'>
                                            <div className='flex items-center gap-2'>
                                                {/* <Tag className='h-4 w-4 text-muted-foreground' /> */}
                                                {jenis.nama_jenis_kendaraan}
                                            </div>
                                        </td>

                                        <td className='p-4 align-middle'>
                                            {new Date(jenis.created_at).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </td>

                                        <td className='p-4 align-middle'>
                                            {new Date(jenis.updated_at).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </td>

                                        <td className='p-4 align-middle'>
                                            <div className='flex justify-center gap-2'>
                                                <Button
                                                    size='icon'
                                                    variant='ghost'
                                                    onClick={() => handleEdit(jenis)}
                                                    className='hover:bg-primary/10 hover:text-primary'
                                                >
                                                    <Pencil className='h-4 w-4' />
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    size="icon"
                                                    onClick={() => setDeleteId(jenis.id)}
                                                    className='hover:bg-destructive/10 hover:text-destructive'
                                                >
                                                    <Trash2 className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {jenisKendaraan.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className='p-12'>
                                            <div className='flex flex-col items-center justify-center gap-4'>
                                                <div className='rounded-full bg-muted p-4'>
                                                    <Database className='h-8 w-8 text-muted-foreground' />
                                                </div>
                                                <div className='text-center'>
                                                    <h3 className='font-semibold text-lg mb-1'>Belum Ada Jenis Kendaraan</h3>
                                                    <p className='text-sm text-muted-foreground'>
                                                        Mulai dengan menambahkan jenis kendaraan pertama Anda
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={handleCreate}
                                                    className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'
                                                >
                                                    <Plus className='h-4 w-4 mr-2' />
                                                    Tambahkan Data
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>


                {/* Modal Dialog create */}
                <Dialog open={isCreateModalOpen} onOpenChange={(open => {
                    if(!open) {
                        setIsCreateModalOpen(false);
                        resetCreate();
                    }
                })}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Jenis Kendaraan</DialogTitle>
                            <DialogDescription>
                                Isi form di bawah ini untuk menambahkan jenis kendaraan baru
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleStore}  className='space-y-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='create_nama_jenis_kendaraan'>
                                    Masukkan Nama Jenis Kendaraan
                                </Label>
                                <Input 
                                    id='create_nama_jenis_kendaraan'
                                    name='create_nama_jenis_kendaraan'
                                    value={createData.nama_jenis_kendaraan}
                                    onChange={(e) => setCreateData('nama_jenis_kendaraan', e.target.value)}
                                    placeholder='Contoh: Motor, Mobil, Truk'
                                />
                                {createErrors.nama_jenis_kendaraan && <p className='text-sm text-red-500'>{createErrors.nama_jenis_kendaraan}</p>}
                            </div>
                            <DialogFooter>
                                <Button variant='outline' onClick={() => setIsCreateModalOpen(false)}>Batal</Button>
                                <Button type='submit' variant='outline' className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'>
                                    <Save className='md:h-4 md:w-4 mr-0 md:mr-2 h-2 w-2'/>
                                    {createProcessing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal Dialog Edit */}
                <Dialog open={isEditModalOpen} onOpenChange={(open) => {
                    if(!open) {
                        setIsEditModalOpen(false);
                        reset();
                    }
                }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Jenis Kendaraan</DialogTitle>
                            <DialogDescription>
                                Rename jenis kendaraan
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className='space-y-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='edit_nama_jenis_kendaraan'>Nama Jenis Kendaraan</Label>
                                <Input 
                                    id='edit_nama_jenis_kendaraan'
                                    value={data.nama_jenis_kendaraan || ''}
                                    onChange={(e) => setData('nama_jenis_kendaraan', e.target.value)}
                                    placeholder='Contoh: Motor, Mobil, Truk'
                                />
                                    {errors.nama_jenis_kendaraan && <p className='text-sm text-red-500'>{errors.nama_jenis_kendaraan}</p>}
                            </div>
                            <DialogFooter>
                                <Button variant='outline' onClick={() => setIsEditModalOpen(false)}>Batal</Button>
                                <Button type='submit' variant='outline' className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'>
                                    <Save className='md:h-4 md:w-4 mr-0 md:mr-2 h-2 w-2'/>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Alert Dialog Delete */}
                <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Jenis Kendaraan?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus jenis kendaraan ini? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteId && handleDelete(deleteId)}
                                className='bg-destructive text-white hover:bg-destructive/90'
                            >
                                Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}

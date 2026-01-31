import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, Search, ChevronLeft, ChevronRight, Car, User, Palette, Save } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Kendaraan {
    id: number;
    plat_nomor: string;
    warna: string;
    pemilik: string;
    jenis_kendaraan_id: number;
    jenis?: {
        id: number;
        nama_jenis_kendaraan: string;
    };
    created_at: string;
}

interface Props {
    kendaraan: {
        data: Kendaraan[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
        jenis_kendaraan_id?: string;
    };
    jenisKendaraan: {
        id: number;
        nama_jenis_kendaraan: string;
    }[];
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Kendaraan',
        href: '/admin/kendaraan'
    }
];

export default function KendaraanIndex({ kendaraan, filters, jenisKendaraan, flash }: Props) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedJenis, setSelectedJenis] = useState(filters.jenis_kendaraan_id || 'all');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        plat_nomor: '',
        warna: '',
        pemilik: '',
        jenis_kendaraan_id: '',
    });

    const { data: createData, setData: setCreateData, post, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm({
        plat_nomor: '',
        warna: '',
        pemilik: '',
        user_id: '',
        jenis_kendaraan: '',
    })

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

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get('/admin/kendaraan', {
            search: searchTerm,
            jenis_kendaraan_id: selectedJenis === 'all' ? '' : selectedJenis,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (value: string) => {
        setSelectedJenis(value);
        router.get('/admin/kendaraan', {
            search: searchTerm,
            jenis_kendaraan_id: value === 'all' ? '' : value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get('/admin/kendaraan', {
            page,
            search: searchTerm,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        setDeleteId(null);
        router.delete(`/admin/kendaraan/${id}`, {
            onSuccess: () => {
                setToastMessage('Data kendaraan berhasil dihapus!');
                setToastType('success');
                setShowToast(true);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Kendaraan' />
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
                        <h1 className='md:text-3xl text-xl font-bold tracking-tight'>Data Kendaraan</h1>
                        <Button
                            onClick={() => router.visit('/admin/kendaraan/create')}
                            className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'
                        >
                            <Plus className='h-4 w-4 mr-2' />
                            Tambah Data
                        </Button>
                    </div>
                    <p className='text-muted-foreground sm:text-base text-sm'>Daftar kendaraan yang terdaftar dalam sistem</p>
                </div>

                {/* Search and Filter */}
                <div className='flex flex-col md:flex-row gap-4'>
                    <form onSubmit={handleSearch} className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <Input
                            placeholder='Cari Plat Nomor / Pemilik...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='pl-10'
                        />
                    </form>
                    <div>
                        <Select
                            value={selectedJenis}
                            onValueChange={handleFilterChange}
                        >
                            <SelectTrigger className="w-full md:w-60">
                                <SelectValue placeholder="Pilih Jenis Kendaraan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Jenis Kendaraan</SelectItem>
                                {jenisKendaraan.map((jenis) => (
                                    <SelectItem key={jenis.id} value={jenis.id.toString()}>
                                        {jenis.nama_jenis_kendaraan}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className='rounded-md border bg-card'>
                    <div className='relative w-full overflow-auto'>
                        <table className='w-full caption-bottom text-sm'>
                            <thead className='[&_tr]:border-b'>
                                <tr className='border-b transition-colors hover:bg-muted/50'>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>No</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Plat Nomor</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Pemilik</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Warna</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Jenis</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Daftar Pada</th>
                                    <th className='h-12 px-4 text-center align-middle font-medium text-muted-foreground'>Aksi</th>
                                </tr>
                            </thead>
                            <tbody className='[&_tr:last-child]:border-0'>
                                {kendaraan.data.map((item, index) => (
                                    <tr key={item.id} className='border-b transition-colors hover:bg-muted/50'>
                                        <td className='p-4 align-middle'>{(kendaraan.current_page - 1) * kendaraan.per_page + index + 1}</td>
                                        <td className='p-4 align-middle font-mono font-bold tracking-wider'>
                                            <Badge variant="outline" className="px-3 py-1 bg-muted/50 border-primary/20">
                                                {item.plat_nomor}
                                            </Badge>
                                        </td>
                                        <td className='p-4 align-middle font-medium'>
                                            <div className='flex items-center gap-2'>
                                                <User className='h-4 w-4 text-muted-foreground' />
                                                {item.pemilik}
                                            </div>
                                        </td>
                                        <td className='p-4 align-middle uppercase'>
                                            <div className='flex items-center gap-2'>
                                                <Palette className='h-4 w-4 text-muted-foreground' />
                                                {item.warna}
                                            </div>
                                        </td>
                                        <td className='p-4 align-middle'>
                                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                {item.jenis?.nama_jenis_kendaraan || 'N/A'}
                                            </Badge>
                                        </td>
                                        <td className='p-4 align-middle text-muted-foreground'>
                                            {new Date(item.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className='p-4 align-middle'>
                                            <div className='flex justify-center gap-2'>
                                                <Button
                                                    size='icon'
                                                    variant='ghost'
                                                    onClick={() => router.visit(`/admin/kendaraan/${item.id}/edit`)}
                                                    className='hover:bg-primary/10 hover:text-primary transition-colors'
                                                >
                                                    <Pencil className='h-4 w-4' />
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    size="icon"
                                                    onClick={() => setDeleteId(item.id)}
                                                    className='hover:bg-destructive/10 hover:text-destructive transition-colors'
                                                >
                                                    <Trash2 className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {kendaraan.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className='p-12'>
                                            <div className='flex flex-col items-center justify-center gap-4'>
                                                <div className='rounded-full bg-muted p-4'>
                                                    <Car className='h-8 w-8 text-muted-foreground' />
                                                </div>
                                                <div className='text-center'>
                                                    <h3 className='font-semibold text-lg mb-1'>Belum Ada Data Kendaraan</h3>
                                                    <p className='text-sm text-muted-foreground'>
                                                        Data kendaraan akan muncul di sini setelah ditambahkan.
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className='flex items-center justify-between px-2'>
                    <div className='text-sm text-muted-foreground'>
                        Menampilkan {kendaraan.from || 0} sampai {kendaraan.to || 0} dari {kendaraan.total} hasil
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handlePageChange(kendaraan.current_page - 1)}
                            disabled={kendaraan.current_page === 1}
                        >
                            <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <div className='flex items-center space-x-1'>
                            {Array.from({ length: kendaraan.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === kendaraan.current_page ? 'default' : 'outline'}
                                    size='sm'
                                    onClick={() => handlePageChange(page)}
                                    className="w-10 h-10"
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handlePageChange(kendaraan.current_page + 1)}
                            disabled={kendaraan.current_page === kendaraan.last_page}
                        >
                            <ChevronRight className='w-4 h-4' />
                        </Button>
                    </div>
                </div>


                {/* Alert Dialog Delete */}
                <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Data Kendaraan?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus data kendaraan ini? Tindakan ini tidak dapat dibatalkan.
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


import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, Search, ChevronLeft, ChevronRight, Car, Clock, DollarSign, MapPin, LogIn, LogOut, Filter, Printer } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Transaksi {
    id: number;
    area_parkir_id: number;
    kendaraan_id: number;
    waktu_masuk: string;
    waktu_keluar: string | null;
    tarif_parkir_id: number;
    durasi_jam: number | null;
    biaya_total: number | null;
    status: 'masuk' | 'keluar';
    user_id: number;
    created_at: string;
    area_parkir?: {
        id: number;
        nama_area: string;
        lokasi: string;
    };
    kendaraan?: {
        id: number;
        plat_nomor: string;
        warna: string;
        pemilik: string;
        jenis?: {
            id: number;
            nama_jenis_kendaraan: string;
        };
    };
    tarif_parkir?: {
        id: number;
        tarif_per_jam: number;
        jenis_kendaraan?: {
            id: number;
            nama_jenis_kendaraan: string;
        };
    };
    user?: {
        id: number;
        name: string;
    };
}

interface Props {
    transaksi: {
        data: Transaksi[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
        status?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaksi Parkir',
        href: '/petugas/transaksi'
    }
];

// Helper function to format Rupiah
const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Helper function to format date time
const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        // year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Helper function to calculate duration
const calculateDuration = (waktuMasuk: string, waktuKeluar: string | null): string => {
    if (!waktuKeluar) return '-';

    const masuk = new Date(waktuMasuk);
    const keluar = new Date(waktuKeluar);
    const diff = keluar.getTime() - masuk.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} jam ${minutes} menit`;
};

export default function TransaksiIndex({ transaksi, filters, flash }: Props) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [checkoutId, setCheckoutId] = useState<number | null>(null);
    const [isSearching, setIsSearching] = useState(false);

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

    // Debounced search effect
    useEffect(() => {
        if (searchTerm === filters.search) return;

        setIsSearching(true);
        const debounceTimer = setTimeout(() => {
            router.get('/petugas/transaksi', {
                search: searchTerm,
                status: selectedStatus === 'all' ? '' : selectedStatus,
            }, {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            });
        }, 2000);

        return () => {
            clearTimeout(debounceTimer);
            setIsSearching(false);
        };
    }, [searchTerm]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get('/petugas/transaksi', {
            search: searchTerm,
            status: selectedStatus === 'all' ? '' : selectedStatus,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (value: string) => {
        setSelectedStatus(value);
        router.get('/petugas/transaksi', {
            search: searchTerm,
            status: value === 'all' ? '' : value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get('/petugas/transaksi', {
            page,
            search: searchTerm,
            status: selectedStatus === 'all' ? '' : selectedStatus,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        setDeleteId(null);
        router.delete(`/petugas/transaksi/${id}`, {
            onSuccess: () => {
                setToastMessage('Transaksi berhasil dihapus!');
                setToastType('success');
                setShowToast(true);
            },
            onError: () => {
                setToastMessage('Gagal menghapus transaksi!');
                setToastType('error');
                setShowToast(true);
            }
        });
    };

    const handleCheckout = (id: number) => {
        setCheckoutId(null);
        router.put(`/petugas/transaksi/${id}`, {
            checkout: true,
            waktu_keluar: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }, {
            onSuccess: () => {
                setToastMessage('Checkout berhasil!');
                setToastType('success');
                setShowToast(true);
            },
            onError: () => {
                setToastMessage('Gagal melakukan checkout!');
                setToastType('error');
                setShowToast(true);
            }
        });
    };

    // Get selected transaksi for checkout dialog
    const selectedTransaksi = checkoutId
        ? transaksi.data.find(item => item.id === checkoutId)
        : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Transaksi Parkir' />
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
                        <h1 className='md:text-3xl text-xl font-bold tracking-tight'>Transaksi Parkir</h1>
                        <Button
                            onClick={() => router.visit('/petugas/transaksi/create')}
                            className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'
                        >
                            <Plus className='md:h-4 md:w-4 h-4 w-4 md:mr-2' />
                            <span className='hidden md:inline'>Kendaraan Masuk</span>
                        </Button>
                    </div>
                    <p className='text-muted-foreground sm:text-base text-sm'>Kelola transaksi kendaraan masuk dan keluar area parkir</p>
                </div>

                {/* Search and Filter */}
                <div className='flex flex-col md:flex-row gap-4'>
                    <form onSubmit={handleSearch} className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <Input
                            placeholder='Cari Plat Nomor / Pemilik / Area...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='pl-10'
                        />
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                            </div>
                        )}
                    </form>
                    <div>
                        <Select
                            value={selectedStatus}
                            onValueChange={handleFilterChange}
                        >
                            <SelectTrigger className="w-full md:w-48">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="masuk">Masuk</SelectItem>
                                <SelectItem value="keluar">Keluar</SelectItem>
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
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Plat Kendaraan</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Area Parkir</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Waktu Masuk</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Waktu Keluar</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Durasi</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Biaya</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Status</th>
                                    <th className='h-12 px-4 text-center align-middle font-medium text-muted-foreground'>Aksi</th>
                                </tr>
                            </thead>
                            <tbody className='[&_tr:last-child]:border-0'>
                                {transaksi.data.map((item, index) => (
                                    <tr key={item.id} className='border-b transition-colors hover:bg-muted/50'>
                                        <td className='p-4 align-middle'>{(transaksi.current_page - 1) * transaksi.per_page + index + 1}</td>

                                        {/* Kendaraan Info */}
                                        <td className='p-4 align-middle'>
                                            <div className='flex flex-col gap-1'>
                                                <Badge variant="outline" className="w-fit px-3 py-1 bg-muted/50 border-primary/20 font-mono font-bold">
                                                    {item.kendaraan?.plat_nomor || '-'}
                                                </Badge>
                                            </div>
                                        </td>

                                        {/* Area Parkir */}
                                        <td className='p-4 align-middle'>
                                            <div className='flex items-center gap-2'>
                                                <MapPin className='h-4 w-4 text-muted-foreground' />
                                                <div className='flex flex-col'>
                                                    <span className='font-medium'>{item.area_parkir?.nama_area || '-'}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Waktu Masuk */}
                                        <td className='p-4 align-middle'>
                                            <div className='flex items-center gap-2'>
                                                <LogIn className='h-4 w-4 text-green-500' />
                                                <span className='text-xs'>{formatDateTime(item.waktu_masuk)}</span>
                                            </div>
                                        </td>

                                        {/* Waktu Keluar */}
                                        <td className='p-4 align-middle'>
                                            {item.waktu_keluar ? (
                                                <div className='flex items-center gap-2'>
                                                    <LogOut className='h-4 w-4 text-red-500' />
                                                    <span className='text-xs'>{formatDateTime(item.waktu_keluar)}</span>
                                                </div>
                                            ) : (
                                                <span className='text-xs text-muted-foreground'>-</span>
                                            )}
                                        </td>

                                        {/* Durasi */}
                                        <td className='p-4 align-middle'>
                                            <div className='flex items-center gap-2'>
                                                <Clock className='h-4 w-4 text-muted-foreground' />
                                                <span className='text-xs'>{calculateDuration(item.waktu_masuk, item.waktu_keluar)}</span>
                                            </div>
                                        </td>

                                        {/* Biaya */}
                                        <td className='p-4 align-middle font-medium'>
                                            {item.biaya_total ? (
                                                <div className='flex items-center gap-2'>
                                                    <DollarSign className='h-4 w-4 text-muted-foreground' />
                                                    <span className='font-mono'>Rp {formatRupiah(item.biaya_total)}</span>
                                                </div>
                                            ) : (
                                                <span className='text-xs text-muted-foreground'>-</span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className='p-4 align-middle'>
                                            {item.status === 'masuk' ? (
                                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                    <LogIn className='h-3 w-3 mr-1' />
                                                    Masuk
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                    <LogOut className='h-3 w-3 mr-1' />
                                                    Keluar
                                                </Badge>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className='p-4 align-middle'>
                                            <div className='flex justify-center gap-2'>
                                                {item.status === 'masuk' && (
                                                    <Button
                                                        size='sm'
                                                        variant='outline'
                                                        onClick={() => setCheckoutId(item.id)}
                                                        className='bg-green-50 hover:bg-green-100 text-green-700 border-green-200 h-8 px-2 text-xs'
                                                    >
                                                        <LogOut className='h-3.5 w-3.5 mr-1' />
                                                        Checkout
                                                    </Button>
                                                )}
                                                {item.status === 'keluar' && (
                                                    <Button
                                                        size='sm'
                                                        variant='outline'
                                                        onClick={() => window.open(`/petugas/transaksi/${item.id}/cetak`, '_blank')}
                                                        className='bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 h-8 px-2 text-xs'
                                                    >
                                                        <Printer className='h-3.5 w-3.5 mr-1' />
                                                        Cetak
                                                    </Button>
                                                )}
                                                <Button
                                                    variant='ghost'
                                                    size="icon"
                                                    onClick={() => setDeleteId(item.id)}
                                                    className='hover:bg-destructive/10 hover:text-destructive transition-colors h-8 w-8'
                                                >
                                                    <Trash2 className='h-3.5 w-3.5' />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {transaksi.data.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className='p-12'>
                                            <div className='flex flex-col items-center justify-center gap-4'>
                                                <div className='rounded-full bg-muted p-4'>
                                                    <Car className='h-8 w-8 text-muted-foreground' />
                                                </div>
                                                <div className='text-center'>
                                                    <h3 className='font-semibold text-lg mb-1'>Belum Ada Transaksi</h3>
                                                    <p className='text-sm text-muted-foreground'>
                                                        Transaksi parkir akan muncul di sini setelah kendaraan masuk
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={() => router.visit('/petugas/transaksi/create')}
                                                    className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'
                                                >
                                                    <Plus className='h-4 w-4 mr-2' />
                                                    Kendaraan Masuk
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {transaksi.data.length > 0 && (
                    <div className='flex items-center justify-between px-2'>
                        <div className='text-sm text-muted-foreground'>
                            Menampilkan {transaksi.from || 0} sampai {transaksi.to || 0} dari {transaksi.total} hasil
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Button
                                variant='outline'
                                size='icon'
                                onClick={() => handlePageChange(transaksi.current_page - 1)}
                                disabled={transaksi.current_page === 1}
                            >
                                <ChevronLeft className='h-4 w-4' />
                            </Button>
                            <div className='flex items-center space-x-1'>
                                {Array.from({ length: transaksi.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === transaksi.current_page ? 'default' : 'outline'}
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
                                onClick={() => handlePageChange(transaksi.current_page + 1)}
                                disabled={transaksi.current_page === transaksi.last_page}
                            >
                                <ChevronRight className='w-4 h-4' />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Alert Dialog Checkout */}
                <AlertDialog open={checkoutId !== null} onOpenChange={(open) => !open && setCheckoutId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Checkout</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin melakukan checkout kendaraan ini?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        {selectedTransaksi && (
                            <div className='space-y-3 py-4'>
                                <div className='flex justify-between items-center'>
                                    <span className='text-sm text-muted-foreground'>Plat Nomor:</span>
                                    <Badge variant="outline" className='font-mono font-bold'>
                                        {selectedTransaksi.kendaraan?.plat_nomor}
                                    </Badge>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-sm text-muted-foreground'>Pemilik:</span>
                                    <span className='text-sm font-medium'>{selectedTransaksi.kendaraan?.pemilik}</span>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-sm text-muted-foreground'>Area Parkir:</span>
                                    <span className='text-sm font-medium'>{selectedTransaksi.area_parkir?.nama_area}</span>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-sm text-muted-foreground'>Waktu Masuk:</span>
                                    <span className='text-sm font-medium'>{formatDateTime(selectedTransaksi.waktu_masuk)}</span>
                                </div>
                                <div className='flex justify-between items-center pt-2 border-t'>
                                    <span className='text-sm text-muted-foreground'>Tarif Per Jam:</span>
                                    <span className='text-sm font-bold font-mono'>
                                        Rp {formatRupiah(selectedTransaksi.tarif_parkir?.tarif_per_jam || 0)}
                                    </span>
                                </div>
                            </div>
                        )}
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => checkoutId && handleCheckout(checkoutId)}
                                className='bg-green-600 text-white hover:bg-green-700'
                            >
                                <LogOut className='h-4 w-4 mr-2' />
                                Checkout
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Alert Dialog Delete */}
                <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Transaksi?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
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

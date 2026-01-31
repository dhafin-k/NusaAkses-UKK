import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight, Activity, User, Calendar } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface LogAktivitas {
    id: number;
    user_id: number;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    aktivitas: string;
    waktu_aktivitas: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    logs: {
        data: LogAktivitas[];
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
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Log Aktivitas',
        href: '/admin/log-aktivitas'
    }
];

export default function LogAktivitasIndex({ logs, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);

    // Debounced search effect
    useEffect(() => {
        if (searchTerm === filters.search) return;

        setIsSearching(true);
        const debounceTimer = setTimeout(() => {
            router.get('/admin/log-aktivitas', {
                search: searchTerm,
            }, {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            });
        }, 800);

        return () => {
            clearTimeout(debounceTimer);
            setIsSearching(false);
        };
    }, [searchTerm]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get('/admin/log-aktivitas', {
            search: searchTerm,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get('/admin/log-aktivitas', {
            page,
            search: searchTerm,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Log Aktivitas' />
            <div className='flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-linear-to-br from-background to-muted/20'>

                {/* Header Section */}
                <div className='md:flex md:flex-col md:gap-2'>
                    <div className='flex justify-between items-center'>
                        <h1 className='md:text-3xl text-xl font-bold tracking-tight'>Log Aktivitas</h1>
                    </div>
                    <p className='text-muted-foreground sm:text-base text-sm'>
                        Riwayat aktivitas pengguna dalam sistem
                    </p>
                </div>

                {/* Search */}
                <div className='flex gap-4'>
                    <form onSubmit={handleSearch} className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <Input
                            placeholder='Cari Aktivitas / Pengguna...'
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
                </div>

                <div className='rounded-md border bg-card'>
                    <div className='relative w-full overflow-auto'>
                        <table className='w-full caption-bottom text-sm'>
                            <thead className='[&_tr]:border-b'>
                                <tr className='border-b transition-colors hover:bg-muted/50'>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>No</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Pengguna</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Aktivitas</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Waktu</th>
                                </tr>
                            </thead>
                            <tbody className='[&_tr:last-child]:border-0'>
                                {logs.data.map((log, index) => (
                                    <tr key={log.id} className='border-b transition-colors hover:bg-muted/50'>
                                        <td className='p-4 align-middle text-muted-foreground'>
                                            {(logs.current_page - 1) * logs.per_page + index + 1}
                                        </td>
                                        <td className='p-4 align-middle font-medium'>
                                            <div className='flex items-center gap-2'>
                                                <User className='h-4 w-4 text-muted-foreground' />
                                                <span className="font-semibold">{log.user?.name || 'Unknown User'}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground ml-6">
                                                {log.user?.email}
                                            </div>
                                        </td>
                                        <td className='p-4 align-middle'>
                                            <div className='flex items-center gap-2'>
                                                <Activity className='h-4 w-4 text-primary' />
                                                <span>{log.aktivitas}</span>
                                            </div>
                                        </td>
                                        <td className='p-4 align-middle text-muted-foreground'>
                                            <div className='flex items-center gap-2'>
                                                <Calendar className='h-4 w-4' />
                                                {new Date(log.waktu_aktivitas).toLocaleString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {logs.data.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className='p-12'>
                                            <div className='flex flex-col items-center justify-center gap-4'>
                                                <div className='rounded-full bg-muted p-4'>
                                                    <Activity className='h-8 w-8 text-muted-foreground' />
                                                </div>
                                                <div className='text-center'>
                                                    <h3 className='font-semibold text-lg mb-1'>Belum Ada Log Aktivitas</h3>
                                                    <p className='text-sm text-muted-foreground'>
                                                        Belum ada aktivitas yang tercatat dalam sistem.
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
                        Menampilkan {logs.from || 0} sampai {logs.to || 0} dari {logs.total} hasil
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handlePageChange(logs.current_page - 1)}
                            disabled={logs.current_page === 1}
                        >
                            <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <div className='flex items-center space-x-1'>
                            {Array.from({ length: logs.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === logs.current_page ? 'default' : 'outline'}
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
                            onClick={() => handlePageChange(logs.current_page + 1)}
                            disabled={logs.current_page === logs.last_page}
                        >
                            <ChevronRight className='w-4 h-4' />
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

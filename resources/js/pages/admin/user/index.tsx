import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, User, Mail, Search, ChevronLeft, ChevronRight, Crown, Zap, Shield } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { index } from '@/routes/admin/users';

interface User {
    id: number;
    name: string;
    email: string;
    role: string | { nama_role: string } | null;
    created_at: string;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search: string;
        role: string;
    };
    roles: { id: number; nama_role: string }[];
    errors?: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
}

const handleEdit = (user: User) => {
       router.visit(`/admin/users/${user.id}/edit`);
   }

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/admin/users'
    }
];

export default function UsersIndex({ users, filters, flash, roles }: Props) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [roleFilter, setRoleFilter] = useState<'all' | string>(filters.role as 'all' | string);
    const [deleteId, setDeleteId] = useState<number | null>(null);

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
        router.get('/admin/users', {
            search: searchTerm,
            role: roleFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (value: string) => {
        setRoleFilter(value);
        router.get('/admin/users', {
            search: searchTerm,
            role: value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get('/admin/users', {
            page,
            search: searchTerm,
            role: roleFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (userId: number) => {
        setDeleteId(null);
        router.delete(`/admin/users/${userId}`, {
            onSuccess: () => {
                setToastMessage('User berhasil dihapus!');
                setToastType('success');
                setShowToast(true);
            },
            onError: (err: any) => {
                const msg = err?.message || 'Gagal menghapus user';
                setToastMessage(msg);
                setToastType('error');
                setShowToast(true);
            }
        });
    };

    const getRoleBadge = (roleName: string | null) => {
        if (roleName === 'admin') {
            return 'bg-purple-100 text-purple-900';
        } else if (roleName === 'petugas') {
            return 'bg-blue-100 text-blue-900';
        } else if (roleName === 'owner') {
            return 'bg-orange-100 text-orange-900';
        }
        return 'bg-gray-100 text-gray-900';
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='User Management' />
            <div className='flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-linear-to-br from-background to-muted/20'>

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

                {/* Header Section */}
                <div className='flex flex-col gap-2'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-3xl font-bold tracking-tight'>User Management</h1>
                        <Button
                            onClick={() => router.visit('/admin/users/create')}
                            className='bg-primary hover:bg-primary/90 text-white shadow-lg dark:bg-neutral-800 dark:hover:bg-neutral-700'
                        >
                            <Plus className='h-4 w-4 mr-2' />
                            Tambah User
                        </Button>
                    </div>
                    <p className='text-muted-foreground'>Kelola user dan hak akses aplikasi</p>
                </div>

                {/* Search & Filter */}
                <div className='flex gap-4'>
                    <form onSubmit={handleSearch} className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <Input
                            placeholder='Cari User...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='pl-10'
                        />
                    </form>

                    <Select value={roleFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className='w-45'>
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>Semua Role</SelectItem>
                            {roles.map((r) => (
                                <SelectItem key={r.id} value={r.nama_role}>
                                    {r.nama_role.charAt(0).toUpperCase() + r.nama_role.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                 <div className='rounded-md border'>
                    <div className='relative w-full overflow-auto'>
                        <table className='w-full caption-bottom text-sm'>
                            <thead className='[&_tr]:border-b'>
                                <tr className='border-b transition-colors hover:bg-muted/50'>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>No</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Nama</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Email</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Role</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Akun Dibuat</th>
                                    <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Aksi</th>
                                </tr>
                            </thead>
                            <tbody className='[&_tr:last-child]:border-0'>
                                {users.data.map((user, index) => {
                                    const roleName = typeof user.role === 'string' ? user.role : user.role?.nama_role ?? null;
                                    return (
                                        <tr key={user.id} className='border-b transition-colors hover:bg-muted/50'>
                                            <td className='p-4 align-middle font-medium'>
                                                {index + 1}
                                            </td>
                                            <td className='p-4 align-middle font-medium'>
                                                <div className='flex items-center gap-2'>
                                                    <User className='h-4 w-4 text-muted-foreground' />
                                                    {user.name}
                                                </div>
                                            </td>

                                            <td className='p-4 align-middle'>
                                                <div className='flex items-center gap-2'>
                                                    <Mail className='h-4 w-4 text-muted-foreground' />
                                                    {user.email}
                                                </div>
                                            </td>

                                            <td className='p-4 align-middle'>
                                                <div className='flex items-center gap-2'>
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadge(roleName)}`}>
                                                        {roleName ? (roleName.charAt(0).toUpperCase() + roleName.slice(1)) : '—'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className='p-4 align-middle'>
                                                {new Date(user.created_at).toLocaleDateString('id-ID', {
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
                                                        onClick={() => handleEdit(user)}
                                                        className='hover:bg-primary/10 hover:text-primary'
                                                    >
                                                        <Pencil className='h-4 w-4' />
                                                    </Button>
                                                    <Button
                                                        variant='ghost'
                                                        size="icon"
                                                        onClick={() => setDeleteId(user.id)}
                                                        className='hover:bg-destructive/10 hover:text-destructive'
                                                    >
                                                        <Trash2 className='h-4 w-4' />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {users.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className='p-8 text-center text-muted-foreground'>
                                            Tidak Ada User
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
                        Menampilkan {users.from} sampai {users.to} dari {users.total} hasil
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handlePageChange(users.current_page - 1)}
                            disabled={users.current_page === 1}
                        >
                            <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <div className='flex items-center space-x-1'>
                            {Array.from({ length: users.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === users.current_page ? 'default' : 'outline'}
                                    size='icon'
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => handlePageChange(users.current_page + 1)}
                            disabled={users.current_page === users.last_page}
                        >
                            <ChevronRight className='w-4 h-4' />
                        </Button>
                    </div>
                </div>

                {/* Alert Dialog Delete */}
                <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hapus User?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.
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

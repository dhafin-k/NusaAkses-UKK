import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    Users,
    DollarSign,
    Car,
    MapPin,
    Package,
    Truck,
    Bike,
    Activity,
    ParkingCircle
} from 'lucide-react';
import AppLogo from './app-logo';


export function AppSidebar() {
    const { auth } = usePage().props as any;
    const role = auth?.user?.role;

    // Cek role -> return nav items
    let mainNavItems: NavItem[] = [];

    if (role === 'admin') {
        mainNavItems = [
            { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
            { title: 'Users Manage', href: '/admin/users', icon: Users },
            {
                title: 'Data Kendaraan',
                href: '#',
                icon: Truck,
                items: [
                    { title: 'Jenis Kendaraan', href: '/admin/jenis-kendaraan', icon: Bike },
                    { title: 'Kendaraan', href: '/admin/kendaraan', icon: Car },
                ]
            },
            {
                title: 'Data Parkir',
                href: '#',
                icon: Package,
                items: [
                    { title: 'Area Parkir', href: '/admin/area-parkir', icon: MapPin },
                    { title: 'Tarif Parkir', href: '/admin/tarif-parkir', icon: DollarSign },
                ]
            },
            { title: 'Log Aktivitas', href: '/admin/log-aktivitas', icon: Activity },

        ];
    } else if (role === 'petugas') {
        mainNavItems = [
            { title: 'Dashboard', href: '/petugas/dashboard', icon: LayoutGrid },
            { title: 'Transaksi', href: '/petugas/transaksi', icon: ParkingCircle },
            // { title: 'Transaksi', href: '/petugas/transaksi', icon: ShoppingCart },
            // { title: 'Buat Transaksi', href: '/petugas/transaksi/create', icon: FileText },
        ];
    } else if (role === 'owner') {
        mainNavItems = [
            { title: 'Dashboard', href: '/owner/dashboard', icon: LayoutGrid },
            // { title: 'Rekap Transaksi', href: '/owner/rekap-transaksi', icon: BarChart3 },
        ];
    } else {
        mainNavItems = [
            { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        ];
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

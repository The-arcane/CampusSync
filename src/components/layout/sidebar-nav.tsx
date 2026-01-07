"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarCheck,
  Wallet,
  BookOpen,
  BarChart,
  Settings,
  ShieldCheck,
  School,
  User,
  HeartHandshake
} from 'lucide-react';
import { useRole } from '@/hooks/use-role';
import type { Role } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
};

const navItemsByRole: Record<Role, NavItem[]> = {
  'Super Admin': [
    { href: '/super-admin/dashboard', icon: ShieldCheck, label: 'Dashboard' },
    { href: '/super-admin/students', icon: Users, label: 'Students' },
    { href: '/super-admin/staff', icon: UserCheck, label: 'Staff' },
    { href: '/super-admin/attendance', icon: CalendarCheck, label: 'Attendance' },
    { href: '/super-admin/payroll', icon: Wallet, label: 'Payroll' },
    { href: '/super-admin/settings', icon: Settings, label: 'System Settings' },
  ],
  'Admin': [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/students', icon: Users, label: 'Students' },
    { href: '/admin/staff', icon: UserCheck, label: 'Staff' },
    { href: '/admin/attendance', icon: CalendarCheck, label: 'Attendance' },
  ],
  'Teacher': [
    { href: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/teacher/my-classes', icon: School, label: 'My Classes' },
    { href: '/teacher/attendance', icon: CalendarCheck, label: 'Take Attendance' },
    { href: '/teacher/academics', icon: BookOpen, label: 'Academic Records' },
  ],
  'Security/Staff': [
    { href: '/security/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/security/scan-qr', icon: CalendarCheck, label: 'Log Attendance' },
    { href: '/security/reports', icon: BarChart, label: 'Attendance Reports' },
  ],
  'Parent': [
    { href: '/parent/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/parent/child-profile', icon: User, label: 'Child Profile' },
    { href: '/parent/academics', icon: BookOpen, label: 'Academics' },
    { href: '/parent/communication', icon: HeartHandshake, label: 'Teacher Communication' },
  ],
};

export function SidebarNav() {
  const { role } = useRole();
  const pathname = usePathname();
  const currentNavItems = role ? navItemsByRole[role] : [];
  
  const getDashboardHome = () => {
    if (!role) return '/';
    switch (role) {
      case 'Super Admin': return '/super-admin/dashboard';
      case 'Admin': return '/admin/dashboard';
      case 'Teacher': return '/teacher/dashboard';
      case 'Security/Staff': return '/security/dashboard';
      case 'Parent': return '/parent/dashboard';
      default: return '/';
    }
  }

  const Logo = () => (
    <Link href={getDashboardHome()} className="flex items-center gap-2 px-2">
      <BookOpenCheck className="h-7 w-7 text-primary" />
      <span className="font-bold text-lg font-headline text-primary">CampusSync</span>
    </Link>
  );

  if (!role) {
    return (
        <div className="flex flex-col h-full">
         <div className="p-2">
            <Logo />
         </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-2">
         <Logo />
      </div>
     
      <SidebarGroup className="flex-1">
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarMenu>
          {currentNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
         <SidebarGroupLabel>Settings</SidebarGroupLabel>
         <SidebarMenu>
          <SidebarMenuItem>
            <Link href="#" legacyBehavior passHref>
              <SidebarMenuButton tooltip="Settings">
                <Settings/>
                <span>Settings</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
         </SidebarMenu>
      </SidebarGroup>
    </div>
  );
}

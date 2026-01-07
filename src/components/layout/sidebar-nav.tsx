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
    { href: '/dashboard/super-admin', icon: ShieldCheck, label: 'Dashboard' },
    { href: '/dashboard/admin/students', icon: Users, label: 'Students' },
    { href: '/dashboard/admin/staff', icon: UserCheck, label: 'Staff' },
    { href: '/dashboard/admin/attendance', icon: CalendarCheck, label: 'Attendance' },
    { href: '/dashboard/admin/payroll', icon: Wallet, label: 'Payroll' },
    { href: '/dashboard/admin/settings', icon: Settings, label: 'System Settings' },
  ],
  'Admin': [
    { href: '/dashboard/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/admin/students', icon: Users, label: 'Students' },
    { href: '/dashboard/admin/staff', icon: UserCheck, label: 'Staff' },
    { href: '/dashboard/admin/attendance', icon: CalendarCheck, label: 'Attendance' },
  ],
  'Teacher': [
    { href: '/dashboard/teacher', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/teacher/my-classes', icon: School, label: 'My Classes' },
    { href: '/dashboard/teacher/attendance', icon: CalendarCheck, label: 'Take Attendance' },
    { href: '/dashboard/teacher/academics', icon: BookOpen, label: 'Academic Records' },
  ],
  'Security/Staff': [
    { href: '/dashboard/security', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/security/scan-qr', icon: CalendarCheck, label: 'Log Attendance' },
    { href: '/dashboard/security/reports', icon: BarChart, label: 'Attendance Reports' },
  ],
  'Parent': [
    { href: '/dashboard/parent', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/parent/child-profile', icon: User, label: 'Child Profile' },
    { href: '/dashboard/parent/academics', icon: BookOpen, label: 'Academics' },
    { href: '/dashboard/parent/communication', icon: HeartHandshake, label: 'Teacher Communication' },
  ],
};

export function SidebarNav() {
  const { role } = useRole();
  const pathname = usePathname();
  const currentNavItems = role ? navItemsByRole[role] : [];
  
  // Use a simple logo
  const Logo = () => (
    <Link href="/dashboard" className="flex items-center gap-2 px-2">
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

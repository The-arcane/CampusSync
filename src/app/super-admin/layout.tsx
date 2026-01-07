
'use client';
import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Header } from '@/components/layout/header';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute role="Super Admin">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar>
            <SidebarHeader />
            <SidebarContent>
              <SidebarNav />
            </SidebarContent>
            <SidebarFooter />
          </Sidebar>
          <SidebarInset>
            <Header />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

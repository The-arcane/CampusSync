"use client";

import { usePathname } from 'next/navigation';
import { Search, Bell } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { UserNav } from '@/components/auth/user-nav';
import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';

export function Header() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  
  // A simple function to generate a title from the pathname
  const getTitle = (path: string) => {
    const parts = path.split('/').filter(Boolean);
    if (parts.length < 2) return 'Dashboard';
    const title = parts[parts.length - 1];
    // Capitalize first letter and handle camelCase or dashes
    return title.replace(/([A-Z])/g, ' $1').replace(/-/g, ' ').replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-8 peer-data-[state=collapsed]:peer-data-[variant=inset]:md:left-[5rem] peer-data-[variant=inset]:md:left-[17rem] transition-[left] duration-200">
      {isMobile && <SidebarTrigger />}
      
      <h1 className="text-lg font-semibold md:text-xl font-headline hidden md:block">{getTitle(pathname)}</h1>
      
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background"
            />
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <UserNav />
      </div>
    </header>
  );
}

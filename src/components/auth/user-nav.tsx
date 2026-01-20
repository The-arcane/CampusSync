
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRole } from "@/hooks/use-role";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';
import { useSidebar } from "../ui/sidebar";
import { cn } from "@/lib/utils";

export function UserNav() {
  const { user, loading } = useRole();
  const router = useRouter();
  const { state: sidebarState } = useSidebar();

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isCollapsed = sidebarState === 'collapsed';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "w-full h-auto justify-start p-2",
            isCollapsed && "w-10 h-10 rounded-full"
          )}
        >
          <div className="flex items-center w-full">
            <Avatar className={cn("h-8 w-8", isCollapsed && "h-10 w-10")}>
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.full_name || ''} />}
              <AvatarFallback>{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className={cn("ml-2 flex-1 text-left truncate", isCollapsed && "hidden")}>
              <p className="text-sm font-medium leading-none truncate">{user.full_name}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

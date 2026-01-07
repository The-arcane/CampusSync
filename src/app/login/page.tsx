
'use client';
import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { ShieldCheck, UserCog, Briefcase, User, GraduationCap } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Role } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { BookOpenCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const roleIcons: Record<Role, React.ElementType> = {
  'super_admin': ShieldCheck,
  'admin': UserCog,
  'teacher': Briefcase,
  'security_staff': User,
  'parent': GraduationCap,
};

const roleLabels: Record<Role, string> = {
  'super_admin': 'Super Admin',
  'admin': 'Admin',
  'teacher': 'Teacher',
  'security_staff': 'Security/Staff',
  'parent': 'Parent',
};

export default function LoginPage() {
  const heroImage = placeholderImages.placeholderImages.find(p => p.id === "login-hero");
  const [selectedRole, setSelectedRole] = useState<Role>('super_admin');
  const router = useRouter();

  // Redirect if a user is already logged in. The middleware doesn't run on this page.
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // If there's a session, redirect to the root,
        // and the middleware will handle redirection to the correct dashboard.
        router.replace('/');
      }
    };
    checkSession();
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-4">
              <BookOpenCheck className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter text-primary">
                CampusSync
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md">
              Streamlining school management for a connected and efficient
              educational experience.
            </p>
            <Card className="w-full max-w-sm">
                <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as Role)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 h-auto flex-wrap justify-center mb-4">
                    {(Object.keys(roleIcons) as Role[]).map(role => {
                       const Icon = roleIcons[role];
                       return (
                         <TabsTrigger key={role} value={role} className="flex-col h-14 md:h-16 gap-1.5 text-xs md:text-sm">
                            <Icon className="h-4 w-4 md:h-5 md:w-5"/>
                            <span className="hidden md:inline">{roleLabels[role]}</span>
                         </TabsTrigger>
                       )
                    })}
                  </TabsList>
                 <LoginForm role={selectedRole} />
                </Tabs>
            </Card>
          </div>
          <div className="hidden md:block">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={600}
                height={400}
                className="rounded-lg shadow-2xl object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

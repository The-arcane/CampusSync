
'use client';
import Link from 'next/link';
import { ShieldCheck, UserCog, Briefcase, User, GraduationCap, BookOpenCheck } from 'lucide-react';
import type { Role } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const roles: { role: Role; icon: React.ElementType; label: string; href: string }[] = [
  { role: 'super_admin', icon: ShieldCheck, label: 'Super Admin', href: '/super-admin/login' },
  { role: 'admin', icon: UserCog, label: 'Admin', href: '/admin/login' },
  { role: 'teacher', icon: Briefcase, label: 'Teacher', href: '/teacher/login' },
  { role: 'security_staff', icon: User, label: 'Security/Staff', href: '/security/login' },
  { role: 'parent', icon: GraduationCap, label: 'Parent', href: '/parent/login' },
];

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <BookOpenCheck className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter text-primary">
                CampusSync
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mb-8">
              Please select your role to sign in.
            </p>
            <Card className="w-full">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-4">
                        {roles.map(({ label, href, icon: Icon }) => (
                            <Button asChild key={href} size="lg" variant="outline">
                                <Link href={href}>
                                    <Icon className="mr-2 h-5 w-5" />
                                    <span>Login as {label}</span>
                                </Link>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}

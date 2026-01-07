'use client';

import { useState } from 'react';
import { ShieldCheck, UserCog, Briefcase, User, GraduationCap, BookOpenCheck, ArrowLeft } from 'lucide-react';
import type { Role } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/auth/login-form';

const roles: { role: Role; icon: React.ElementType; label: string }[] = [
  { role: 'super_admin', icon: ShieldCheck, label: 'Super Admin' },
  { role: 'admin', icon: UserCog, label: 'Admin' },
  { role: 'teacher', icon: Briefcase, label: 'Teacher' },
  { role: 'security_staff', icon: User, label: 'Security/Staff' },
  { role: 'parent', icon: GraduationCap, label: 'Parent' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  if (selectedRole) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
             <div className="w-full max-w-sm mx-auto relative">
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedRole(null)}
                    className="absolute -top-12 left-0 flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <LoginForm role={selectedRole} />
            </div>
        </main>
    )
  }

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
                        {roles.map(({ role, label, icon: Icon }) => (
                            <Button 
                                key={role} 
                                size="lg" 
                                variant="outline"
                                onClick={() => setSelectedRole(role)}
                            >
                                <Icon className="mr-2 h-5 w-5" />
                                <span>Login as {label}</span>
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

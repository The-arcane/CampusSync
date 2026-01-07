
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import type { Role } from "@/lib/types";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export function LoginForm({ role }: { role: Role }) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Step 1: Authenticate with email and password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (authError || !authData.user) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: authError?.message || "Invalid credentials. Please try again.",
      });
      return;
    }

    // Step 2: Verify the user's role from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Could not retrieve user profile. Please contact support.",
      });
      return;
    }

    // Step 3: Check if the fetched role matches the selected role for portal access
    // For super_admin, allow access to admin portal as well.
    const isSuperAdminAccessingAdmin = role === 'admin' && profile.role === 'super_admin';

    if (profile.role !== role && !isSuperAdminAccessingAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: `You do not have permission to access the ${role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} portal.`,
      });
      return;
    }
    
    // Step 4: Role matches. Redirect to the correct dashboard.
    // Use the role from the profile for the redirect to ensure correctness.
    const targetRole = profile.role as Role;
    switch (targetRole) {
        case 'super_admin':
            router.replace('/super-admin/dashboard');
            break;
        case 'admin':
            router.replace('/admin/dashboard');
            break;
        case 'teacher':
            router.replace('/teacher/dashboard');
            break;
        case 'security_staff':
            router.replace('/security/dashboard');
            break;
        case 'parent':
            router.replace('/parent/dashboard');
            break;
        default:
            router.replace('/login');
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl capitalize">
          Login as <span className="text-primary">{role.replace(/_/g, ' ')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Signing In...' : (
                <>
                  <LogIn />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

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

export function LoginForm() {
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
       await supabase.auth.signOut(); // Log the user out if profile is missing
       return;
    }

    toast({
      title: "Login Successful",
      description: "Redirecting to your dashboard...",
    });

    const role = profile.role as Role;

    // Redirect based on role
    switch (role) {
        case 'Super Admin':
            router.push('/dashboard/super-admin');
            break;
        case 'Admin':
            router.push('/dashboard/admin');
            break;
        case 'Teacher':
            router.push('/dashboard/teacher');
            break;
        case 'Security/Staff':
            router.push('/dashboard/security');
            break;
        case 'Parent':
            router.push('/dashboard/parent');
            break;
        default:
            // Fallback to a generic page or the login page
            router.push('/');
            break;
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Secure Login</CardTitle>
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

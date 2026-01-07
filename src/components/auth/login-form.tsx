
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
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Could not retrieve user profile. Please contact support.",
      });
      // Also sign the user out to be safe
      await supabase.auth.signOut();
      return;
    }

    // Step 3: Check if the fetched role matches the selected role
    if (profile.role !== role) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: `You do not have permission to access the ${role} portal.`,
      });
      await supabase.auth.signOut();
      return;
    }
    
    // After successful login and role verification, redirect to the root page.
    // The root page will then handle redirecting to the correct dashboard.
    router.push('/');
    router.refresh(); // Force a refresh to ensure all states are reset correctly.
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Login as <span className="text-primary">{role}</span>
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
    </>
  );
}

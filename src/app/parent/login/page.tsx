
import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import placeholderImages from '@/lib/placeholder-images.json';
import { BookOpenCheck } from 'lucide-react';

export default function ParentLoginPage() {
  const heroImage = placeholderImages.placeholderImages.find(p => p.id === "login-hero");

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
              Parent Portal
            </p>
            <LoginForm role="parent" />
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

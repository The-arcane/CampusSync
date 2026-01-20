
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const envFileContent = `
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=YOUR_SUPABASE_ANON_KEY
`.trim();

export default function SetupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Welcome to CampusSync Setup</CardTitle>
          <CardDescription>
            Your application needs to be connected to a Supabase project to function.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Action Required</AlertTitle>
            <AlertDescription>
              Your Supabase environment variables are missing.
            </AlertDescription>
          </Alert>

          <div className="space-y-4 text-sm text-muted-foreground">
            <p>To fix this, please follow these steps:</p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>
                Create a new file named <code className="font-code bg-muted p-1 rounded-sm">.env.local</code> in the root directory of your project.
              </li>
              <li>
                Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary underline">Supabase project dashboard</a>.
              </li>
              <li>
                Navigate to <span className="font-semibold">Project Settings</span> {'>'} <span className="font-semibold">API</span>.
              </li>
              <li>
                Copy the <span className="font-semibold">Project URL</span> and the <span className="font-semibold">anon</span> <span className="font-semibold">public</span> key.
              </li>
              <li>
                Paste the following content into your <code className="font-code bg-muted p-1 rounded-sm">.env.local</code> file, replacing the placeholder values with your actual credentials:
              </li>
            </ol>
          </div>

          <pre className="bg-muted p-4 rounded-md text-sm text-foreground overflow-x-auto">
            <code className="font-code">{envFileContent}</code>
          </pre>

          <p className="text-sm text-muted-foreground pt-4">
            Once you have saved the <code className="font-code bg-muted p-1 rounded-sm">.env.local</code> file, your application should automatically reload. If it doesn't, please restart the development server.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

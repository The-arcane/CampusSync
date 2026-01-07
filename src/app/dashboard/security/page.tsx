import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SecurityDashboardPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Security & Staff Dashboard</h1>
            <p className="text-muted-foreground">Manage campus access and attendance.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Log attendance and view recent activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Security-specific dashboard widgets will be displayed here (e.g., Scan QR button, live entry feed).</p>
        </CardContent>
      </Card>
    </div>
  );
}

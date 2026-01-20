
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

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
        <CardContent className="grid md:grid-cols-2 gap-4">
            <Button asChild size="lg" className='h-20'>
                <Link href="/security/scan-qr">
                    <QrCode className="mr-4 h-8 w-8" />
                    <div className='text-left'>
                        <p className='font-semibold text-lg'>Scan QR Code</p>
                        <p className='font-normal text-sm'>Log student & staff attendance</p>
                    </div>
                </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className='h-20'>
                <Link href="/security/my-attendance">
                     <FileSpreadsheet className="mr-4 h-8 w-8" />
                     <div className='text-left'>
                        <p className='font-semibold text-lg'>View Attendance Log</p>
                        <p className='font-normal text-sm'>See all entry and exit records</p>
                    </div>
                </Link>
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Entry Feed</CardTitle>
          <CardDescription>Real-time log of campus entries and exits.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A live feed of attendance logs will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

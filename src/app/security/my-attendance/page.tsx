
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyAttendancePage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">My Attendance</h1>
            <p className="text-muted-foreground">View your daily and monthly attendance records.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Log</CardTitle>
          <CardDescription>A summary of your check-in/check-out times.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your attendance records will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

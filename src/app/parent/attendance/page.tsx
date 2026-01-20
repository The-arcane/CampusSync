
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ParentAttendancePage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Attendance Record</h1>
            <p className="text-muted-foreground">Review your child's daily and monthly attendance.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Calendar</CardTitle>
          <CardDescription>Days marked in red indicate absence.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A calendar view of your child's attendance will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

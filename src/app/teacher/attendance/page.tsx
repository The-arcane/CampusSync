
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeacherAttendancePage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Mark Attendance</h1>
            <p className="text-muted-foreground">Mark daily attendance for your classes.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Class</CardTitle>
          <CardDescription>Choose a class to mark attendance for today.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A list of your classes will be displayed here to take attendance.</p>
        </CardContent>
      </Card>
    </div>
  );
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { School, Users, CalendarCheck, BookCopy } from 'lucide-react';

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Your central hub for classes and students.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Assigned Classes"
          value="4"
          description="2 sections of Grade 10, 2 of Grade 9"
          icon={School}
        />
        <StatCard
          title="Total Students"
          value="112"
          description="Across all your classes"
          icon={Users}
        />
        <StatCard
          title="Today's Attendance"
          value="95.5%"
          description="Class 10-A is at 100%"
          icon={CalendarCheck}
        />
        <StatCard
          title="Upcoming Exams"
          value="Mid-Term"
          description="Starts next Monday"
          icon={BookCopy}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Your daily summary and upcoming tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Teacher-specific dashboard widgets will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { CalendarCheck, FileText, BadgeCheck, BookCopy } from 'lucide-react';

export default function ParentDashboardPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Parent Dashboard</h1>
            <p className="text-muted-foreground">Stay updated on your child's progress.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Child Attendance"
          value="98.2%"
          description="This month"
          icon={CalendarCheck}
        />
        <StatCard
          title="Latest Exam Score"
          value="88%"
          description="Mathematics"
          icon={FileText}
        />
        <StatCard
          title="Fee Status"
          value="Paid"
          description="Next due: 10 Aug 2024"
          icon={BadgeCheck}
        />
        <StatCard
          title="Upcoming Exams"
          value="Science"
          description="Starts in 5 days"
          icon={BookCopy}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Child's Overview</CardTitle>
          <CardDescription>A summary of attendance, grades, and recent activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Parent-specific dashboard widgets will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

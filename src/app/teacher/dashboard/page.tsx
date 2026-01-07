import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Your central hub for classes and students.</p>
        </div>
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ParentDashboardPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Parent Dashboard</h1>
            <p className="text-muted-foreground">Stay updated on your child's progress.</p>
        </div>
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

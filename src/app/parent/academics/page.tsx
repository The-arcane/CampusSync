
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ParentAcademicsPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Exams & Results</h1>
            <p className="text-muted-foreground">View your child's academic performance.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Card</CardTitle>
          <CardDescription>Subject-wise marks and teacher remarks.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your child's exam results will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

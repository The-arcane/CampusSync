
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeacherStudentsPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Students</h1>
            <p className="text-muted-foreground">View student profiles, attendance, and performance.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>A list of all students in your classes.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A searchable and filterable list of your students will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function TeacherAcademicsPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Exams & Results</h1>
            <p className="text-muted-foreground">Create exams and upload student marks.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Exam
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Exam Results</CardTitle>
          <CardDescription>Upload and edit marks for your classes.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A list of exams and options to upload marks will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

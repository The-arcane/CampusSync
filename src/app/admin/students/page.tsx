import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { StudentTable } from './_components/student-table';
import { students } from '@/lib/mock-data';

export default function ManageStudentsPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Manage Students</h1>
            <p className="text-muted-foreground">View, add, and manage student records.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Student
        </Button>
      </div>

      <Card>
        <CardContent className='pt-6'>
          <StudentTable data={students} />
        </CardContent>
      </Card>
    </div>
  );
}

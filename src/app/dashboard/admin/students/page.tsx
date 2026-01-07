import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

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
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>A list of all students currently enrolled.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Student data table will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

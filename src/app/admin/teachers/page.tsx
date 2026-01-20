
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { TeachersTable } from './_components/teachers-table';
import { users } from '@/lib/mock-data';
import type { Profile } from '@/lib/types';

export default function ManageTeachersPage() {
  // Filter for teachers
  const teachers = users.filter(u => u.role === 'teacher');

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Manage Teachers</h1>
            <p className="text-muted-foreground">View, add, and manage all teachers.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Teacher
        </Button>
      </div>

      <Card>
        <CardContent className='pt-6'>
          <TeachersTable data={teachers as (Profile & {email: string})[]} />
        </CardContent>
      </Card>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { StudentTable } from './_components/student-table';
import { supabase } from '@/lib/supabase';
import { unstable_noStore as noStore } from 'next/cache';

export default async function ManageStudentsPage() {
  noStore();
  const { data: students } = await supabase.from('students').select('*');
  
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
          <StudentTable data={students || []} />
        </CardContent>
      </Card>
    </div>
  );
}

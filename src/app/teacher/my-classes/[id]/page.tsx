
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { unstable_noStore as noStore } from 'next/cache';
import { StudentListTable } from '../../_components/student-list-table';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarCheck } from 'lucide-react';

export default async function TeacherClassDetailsPage({ params }: { params: { id: string } }) {
  noStore();
  const { id: classId } = params;

  const { data: classDetails } = await supabase
    .from('classes')
    .select('class_name, section')
    .eq('id', classId)
    .single();

  if (!classDetails) {
    notFound();
  }

  const { data: students, error } = await supabase
    .from('students')
    .select('*')
    .eq('class_id', classId)
    .order('full_name', { ascending: true });

  if (error) {
    console.error("Failed to fetch students for class:", error);
    // Render an error state maybe? For now, we'll just show an empty list.
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className='space-y-2'>
            <Button variant="ghost" asChild className='-ml-4'>
                <Link href="/teacher/my-classes" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to My Classes
                </Link>
            </Button>
            <h1 className="text-3xl font-bold font-headline">
                Manage Class: {classDetails.class_name} - {classDetails.section}
            </h1>
            <p className="text-muted-foreground">View students and manage class activities.</p>
        </div>
         <Button>
          <CalendarCheck className="mr-2 h-4 w-4" /> Mark Attendance
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            A list of all students enrolled in this class. Click 'Show QR' to view a student's attendance code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StudentListTable data={students || []} />
        </CardContent>
      </Card>
    </div>
  );
}

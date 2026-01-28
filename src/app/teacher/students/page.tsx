
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRole } from '@/hooks/use-role';
import { supabase } from '@/lib/supabase';
import { useEffect, useState, useMemo } from 'react';
import type { Student } from '@/lib/types';
import { StudentListTable } from '../_components/student-list-table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeacherStudentsPage() {
    const { user, loading: userLoading } = useRole();
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchTeacherStudents() {
          if (user) {
            setIsLoading(true);
            const { data: subjects, error: subjectsError } = await supabase
              .from('subjects')
              .select('class_id')
              .eq('teacher_id', user.id);
    
            if (subjectsError) {
              console.error("Error fetching teacher's subjects:", subjectsError);
              setIsLoading(false);
              return;
            }
    
            if (subjects && subjects.length > 0) {
              const classIds = [...new Set(subjects.map(s => s.class_id).filter(id => id))];
              
              if(classIds.length > 0) {
                const { data: studentData, error: studentsError } = await supabase
                    .from('students')
                    .select('*')
                    .in('class_id', classIds)
                    .order('full_name');
        
                if (studentsError) {
                    console.error("Error fetching students:", studentsError);
                } else {
                    setStudents(studentData || []);
                }
              }
            }
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        }
    
        if (!userLoading) {
            fetchTeacherStudents();
        }
      }, [user, userLoading]);

    const filteredStudents = useMemo(() => {
        if (!searchTerm) return students;
        return students.filter(s => 
            s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.admission_no.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">My Students</h1>
            <p className="text-muted-foreground">View profiles and QR codes for all your students.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>A searchable list of all students in your classes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <Input 
                placeholder="Search by name or admission no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
           />
           {isLoading || userLoading ? (
                <div className='space-y-2'>
                    <Skeleton className='h-10 w-full'/>
                    <Skeleton className='h-10 w-full'/>
                    <Skeleton className='h-10 w-full'/>
                </div>
           ) : <StudentListTable data={filteredStudents} />}
        </CardContent>
      </Card>
    </div>
  );
}

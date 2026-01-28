
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRole } from '@/hooks/use-role';
import { supabase } from '@/lib/supabase';
import { useEffect, useState, useMemo } from 'react';
import type { Student, Class } from '@/lib/types';
import { AttendanceTable, type AttendanceRecord } from './_components/attendance-table';
import { DatePicker } from './_components/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeacherAttendancePage() {
  const { user, loading: userLoading } = useRole();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    async function fetchTeacherData() {
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
          
          if (classIds.length > 0) {
            // Fetch classes
            const { data: classData, error: classesError } = await supabase
              .from('classes')
              .select('*')
              .in('id', classIds);
            if (classesError) console.error("Error fetching classes:", classesError);
            else setClasses(classData || []);

            // Fetch attendance records
            let query = supabase
                .from('student_attendance')
                .select(`
                    *,
                    students ( full_name, admission_no, classes ( class_name, section ) )
                `)
                .in('student_id', (await supabase.from('students').select('id').in('class_id', classIds)).data?.map(s => s.id) || []);

            if (selectedDate) {
                const date = selectedDate.toISOString().split('T')[0];
                query = query.eq('date', date);
            }

            const { data: attendanceData, error: attendanceError } = await query;
            
            if (attendanceError) {
                console.error("Error fetching attendance:", attendanceError);
            } else {
                 const formattedRecords = attendanceData?.map((r: any) => ({
                    student_name: r.students.full_name,
                    admission_no: r.students.admission_no,
                    class_name: `${r.students.classes.class_name} - ${r.students.classes.section}`,
                    date: r.date,
                    status: r.status,
                    class_id: r.students.classes.id,
                }));
                setRecords(formattedRecords || []);
            }
          }
        }
        setIsLoading(false);
      } else if (!userLoading) {
        setIsLoading(false);
      }
    }

    fetchTeacherData();
  }, [user, userLoading, selectedDate]);

  const filteredRecords = useMemo(() => {
    if (selectedClass === 'all') return records;
    return records.filter(r => r.class_id === selectedClass);
  }, [records, selectedClass]);

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Attendance Records</h1>
            <p className="text-muted-foreground">View and filter attendance for your classes.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter & View</CardTitle>
          <CardDescription>Select a class and date to view attendance records.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
             <DatePicker date={selectedDate} setDate={setSelectedDate} />
             <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.class_name} - {c.section}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          {isLoading || userLoading ? (
            <div className='space-y-2 pt-4'>
              <Skeleton className='h-12 w-full'/>
              <Skeleton className='h-12 w-full'/>
              <Skeleton className='h-12 w-full'/>
            </div>
          ) : (
            <AttendanceTable data={filteredRecords} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}


'use client';

import { useRole } from '@/hooks/use-role';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import type { Class } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, School } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyClassesPage() {
  const { user, loading: userLoading } = useRole();
  const [classes, setClasses] = useState<(Class & { subject_name: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTeacherClasses() {
      if (user) {
        setIsLoading(true);
        // A teacher is assigned subjects, and subjects belong to classes.
        // We can find the teacher's classes by finding the classes of the subjects they teach.
        const { data: subjects, error: subjectsError } = await supabase
          .from('subjects')
          .select('class_id, name')
          .eq('teacher_id', user.id);

        if (subjectsError) {
          console.error("Error fetching teacher's subjects:", subjectsError);
          setIsLoading(false);
          return;
        }

        if (subjects && subjects.length > 0) {
          const classIds = [...new Set(subjects.map(s => s.class_id).filter(id => id))];
          
          if (classIds.length > 0) {
            const { data: classData, error: classesError } = await supabase
              .from('classes')
              .select('*, students(count)')
              .in('id', classIds);

            if (classesError) {
              console.error("Error fetching classes:", classesError);
            } else {
              // Map subjects to classes
              const enrichedClasses = classData?.map(c => {
                const relevantSubject = subjects.find(s => s.class_id === c.id);
                return {
                  ...c,
                  student_count: c.students[0]?.count || 0,
                  subject_name: relevantSubject?.name || 'N/A'
                };
              }) || [];
              setClasses(enrichedClasses);
            }
          }
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }

    if (!userLoading) {
        fetchTeacherClasses();
    }
  }, [user, userLoading]);

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">My Classes</h1>
            <p className="text-muted-foreground">An overview of all classes assigned to you.</p>
        </div>
      </div>

      {isLoading || userLoading ? (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            ))}
         </div>
      ) : classes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Card key={cls.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5 text-primary" />
                    {cls.class_name} - {cls.section}
                </CardTitle>
                <CardDescription>Subject: {cls.subject_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-end">
                <p className="text-sm text-muted-foreground">{cls.student_count} students in this class.</p>
                <Button asChild className="w-full mt-auto">
                  <Link href={`/teacher/my-classes/${cls.id}`}>
                    Manage Class <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className='pt-6'>
                <p className="text-center text-muted-foreground">You are not assigned to any classes yet. Please contact an administrator.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

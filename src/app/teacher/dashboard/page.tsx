
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { School, Users, CalendarCheck, BookCopy } from 'lucide-react';
import { useRole } from '@/hooks/use-role';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeacherDashboardPage() {
  const { user, loading: userLoading } = useRole();
  const [stats, setStats] = useState({
    classCount: 0,
    studentCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTeacherStats() {
      if (user) {
        setIsLoading(true);
        
        // Fetch subjects to determine classes and student count
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
          setStats(prev => ({ ...prev, classCount: classIds.length }));

          if(classIds.length > 0) {
            const { count, error: studentsError } = await supabase
              .from('students')
              .select('*', { count: 'exact', head: true })
              .in('class_id', classIds);

            if (studentsError) {
              console.error('Error fetching student count:', studentsError);
            } else {
              setStats(prev => ({ ...prev, studentCount: count || 0 }));
            }
          }
        }
        setIsLoading(false);
      } else if (!userLoading) {
        setIsLoading(false);
      }
    }

    fetchTeacherStats();
  }, [user, userLoading]);

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Your central hub for classes and students.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : (
          <>
            <StatCard
              title="Assigned Classes"
              value={stats.classCount.toString()}
              description="Total classes you teach"
              icon={School}
            />
            <StatCard
              title="Total Students"
              value={stats.studentCount.toString()}
              description="Across all your classes"
              icon={Users}
            />
            <StatCard
              title="Today's Attendance"
              value="95.5%"
              description="Class 10-A is at 100%"
              icon={CalendarCheck}
            />
            <StatCard
              title="Upcoming Exams"
              value="Mid-Term"
              description="Starts next Monday"
              icon={BookCopy}
            />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Your daily summary and upcoming tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Teacher-specific dashboard widgets will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

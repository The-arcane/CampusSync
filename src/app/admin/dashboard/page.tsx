import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { Users, UserCheck, Wallet, CalendarCheck } from 'lucide-react';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { RecentSignups } from '@/components/dashboard/recent-signups';
import { supabase } from '@/lib/supabase';
import { unstable_noStore as noStore } from 'next/cache';

export default async function AdminDashboardPage() {
  noStore();

  const { count: studentCount } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true });

  const { count: staffCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .in('role', ['teacher', 'security_staff']);

  const { data: recentSignups } = await supabase
    .from('profiles')
    .select('full_name, email, avatarUrl')
    .order('created_at', { ascending: false })
    .limit(5);

  // TODO: Implement real attendance and fees data fetching
  const attendanceToday = "92.5%";
  const feesCollected = "$52,312";

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={studentCount?.toLocaleString() || '0'}
          description="All students in the system"
          icon={Users}
        />
        <StatCard
          title="Active Staff"
          value={staffCount?.toLocaleString() || '0'}
          description="Teachers and non-teaching staff"
          icon={UserCheck}
        />
        <StatCard
          title="Attendance Today"
          value={attendanceToday}
          description="-1.4% from yesterday"
          icon={CalendarCheck}
        />
        <StatCard
          title="Fees Collected"
          value={feesCollected}
          description="+19% from last month"
          icon={Wallet}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className='font-headline'>Attendance Overview</CardTitle>
            <CardDescription>Monthly attendance trends for students and staff.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={[]}/>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className='font-headline'>Recent Signups</CardTitle>
            <CardDescription>
              The latest 5 users to join the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSignups signups={recentSignups || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

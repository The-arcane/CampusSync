
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/dashboard/stat-card';
import { Users, UserCheck, Wallet, CalendarCheck } from 'lucide-react';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { RecentSignups } from '@/components/dashboard/recent-signups';
import { attendanceData } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">
                Oversee and manage the entire campus ecosystem.
            </p>
        </div>
        <div className="flex items-center space-x-2">
            <Button>Download Report</Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                title="Total Students"
                value="1,204"
                description="+20.1% from last month"
                icon={Users}
                />
                <StatCard
                title="Active Staff"
                value="82"
                description="+18.1% from last month"
                icon={UserCheck}
                />
                <StatCard
                title="Attendance Today"
                value="92.5%"
                description="-1.4% from yesterday"
                icon={CalendarCheck}
                />
                <StatCard
                title="Fees Collected"
                value="$52,312"
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
                    <OverviewChart data={attendanceData}/>
                </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle className='font-headline'>Recent Signups</CardTitle>
                    <CardDescription>
                    You have 5 new student/staff signups this month.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RecentSignups />
                </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>Detailed Analytics</CardTitle>
                  <CardDescription>
                    In-depth analytics of student performance, financial trends, and more.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>More complex charts and data visualizations will be displayed here.</p>
                </CardContent>
              </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

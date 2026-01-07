import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { StaffTable } from './_components/staff-table';
import { users } from '@/lib/mock-data';
import type { Profile } from '@/lib/types';

export default function ManageStaffPage() {
  // Filter for teachers and non-teaching staff
  const staff = users.filter(u => u.role === 'Teacher' || u.role === 'Security/Staff');

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Manage Staff</h1>
            <p className="text-muted-foreground">View, add, and manage all staff members.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Staff
        </Button>
      </div>

      <Card>
        <CardContent className='pt-6'>
          <StaffTable data={staff as (Profile & {email: string})[]} />
        </CardContent>
      </Card>
    </div>
  );
}


import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { StaffTable } from './_components/staff-table';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';
import { unstable_noStore as noStore } from 'next/cache';

export default async function ManageStaffPage() {
  noStore();
  const { data: staff } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'security_staff');

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Manage Non-Teaching Staff</h1>
            <p className="text-muted-foreground">View, add, and manage all non-teaching staff members.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Staff
        </Button>
      </div>

      <Card>
        <CardContent className='pt-6'>
          <StaffTable data={staff as (Profile & {email: string})[] || []} />
        </CardContent>
      </Card>
    </div>
  );
}

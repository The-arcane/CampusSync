
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { FeesTable } from './_components/fees-table';
import { supabase } from '@/lib/supabase';
import { unstable_noStore as noStore } from 'next/cache';

export default async function ManageFeesPage() {
  noStore();
  const { data: fees } = await supabase.from('fees').select('*');

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Fees Management</h1>
            <p className="text-muted-foreground">Track and manage student fee payments.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Fee Record
        </Button>
      </div>

      <Card>
        <CardContent className='pt-6'>
          <FeesTable data={fees || []} />
        </CardContent>
      </Card>
    </div>
  );
}

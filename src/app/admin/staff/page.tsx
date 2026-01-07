import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

export default function ManageStaffPage() {
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
        <CardHeader>
          <CardTitle>Staff List</CardTitle>
          <CardDescription>A list of all teaching and non-teaching staff.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Staff data table will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

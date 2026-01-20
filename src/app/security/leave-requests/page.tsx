
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function LeaveRequestsPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Leave Requests</h1>
            <p className="text-muted-foreground">Apply for leave and view your request history.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Apply for Leave
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
          <CardDescription>Your past leave requests and their approval status.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>A table of your leave requests will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

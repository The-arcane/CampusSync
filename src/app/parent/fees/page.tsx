
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ParentFeesPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Fee Status</h1>
            <p className="text-muted-foreground">View payment history and download receipts.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee Records</CardTitle>
          <CardDescription>A list of all fee payments and pending dues.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your child's fee records will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

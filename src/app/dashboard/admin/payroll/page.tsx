import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PayrollPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Payroll Management</h1>
            <p className="text-muted-foreground">Automated payroll calculation and reporting.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Payroll</CardTitle>
          <CardDescription>Payroll details for all staff members.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Payroll data table will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

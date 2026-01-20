
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

const reportTypes = [
    { title: 'Student Attendance Report', description: 'Detailed attendance records for all students.'},
    { title: 'Staff Attendance Report', description: 'Attendance and punctuality report for all staff.'},
    { title: 'Exam Performance Report', description: 'Class and subject-wise student performance.'},
    { title: 'Fee Collection Report', description: 'Summary of paid and pending fees.'},
]

export default function ReportsPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Generate Reports</h1>
            <p className="text-muted-foreground">Export detailed reports in PDF or CSV format.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => (
            <Card key={report.title}>
                <CardHeader>
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                </Button>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

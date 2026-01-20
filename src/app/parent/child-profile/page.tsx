
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChildProfilePage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">My Child's Profile</h1>
            <p className="text-muted-foreground">Basic information and academic details.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
          <CardDescription>Class, section, and teacher information.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your child's profile information will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

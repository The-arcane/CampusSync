import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SuperAdminSettingsPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">System Settings</h1>
            <p className="text-muted-foreground">Manage global settings for CampusSync.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Rules</CardTitle>
          <CardDescription>Define deduction policies for late arrivals and leaves.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Settings form for payroll rules will be displayed here. (Editable only by Super Admin)</p>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>Manage permissions for different user roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Role and permission management interface will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

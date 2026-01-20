
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { ClassTable } from './_components/class-table';
import { classes } from '@/lib/mock-data';

export default function ManageClassesPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Manage Classes & Subjects</h1>
            <p className="text-muted-foreground">Create, edit, and assign classes and subjects.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Class
        </Button>
      </div>

      <Card>
        <CardContent className='pt-6'>
          <ClassTable data={classes} />
        </CardContent>
      </Card>
    </div>
  );
}


'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { QrCode, Video, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/hooks/use-role';
import { supabase } from '@/lib/supabase';
import type { Student } from '@/lib/types';

export default function ScanAttendancePage() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { user, loading: userLoading } = useRole();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof window !== 'undefined' && navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
        }
      }
    };

    getCameraPermission();
  }, [toast]);

  useEffect(() => {
    async function fetchTeacherStudents() {
        if (user) {
        const { data: subjects, error: subjectsError } = await supabase
            .from('subjects')
            .select('class_id')
            .eq('teacher_id', user.id);

        if (subjectsError || !subjects) return;

        const classIds = [...new Set(subjects.map(s => s.class_id).filter(id => id))];
        
        if(classIds.length > 0) {
            const { data: studentData, error: studentsError } = await supabase
                .from('students')
                .select('*')
                .in('class_id', classIds);
            if (studentData) setStudents(studentData);
        }
        }
    }

    if (!userLoading) fetchTeacherStudents();
  }, [user, userLoading]);

  const handleScan = async () => {
    setIsScanning(true);
    toast({ title: 'Simulating Scan...', description: "Decoding QR from video feed." });

    // In a real app, you would use a library like jsQR to decode the video stream.
    // Since we can't add new libraries, we'll simulate the process.
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (students.length === 0) {
      toast({ variant: 'destructive', title: 'No Students Found', description: 'Cannot simulate scan as no students are assigned to you.' });
      setIsScanning(false);
      return;
    }
    
    // 1. Simulate decoding a QR code to get a student ID
    const randomStudent = students[Math.floor(Math.random() * students.length)];
    const studentId = randomStudent.id; 
    const today = new Date().toISOString().split('T')[0];
    
    try {
        // 2. Check if attendance for this student on this day already exists
        const { data: existingRecord, error: checkError } = await supabase
            .from('student_attendance')
            .select('id')
            .eq('student_id', studentId)
            .eq('date', today)
            .maybeSingle();

        if (checkError) throw checkError;

        if (existingRecord) {
            toast({
                title: 'Already Marked Present',
                description: `${randomStudent.full_name} has already been marked as present today.`,
            });
        } else {
            // 3. Insert a new attendance record
            const { error: insertError } = await supabase
                .from('student_attendance')
                .insert({
                    student_id: studentId,
                    date: today,
                    status: 'Present'
                });
            
            if (insertError) throw insertError;
            
            toast({
                variant: 'default',
                title: 'Attendance Marked!',
                description: `${randomStudent.full_name} has been successfully marked as present.`,
            });
        }
    } catch (error: any) {
        console.error('Attendance marking error:', error);
        toast({
            variant: 'destructive',
            title: 'Database Error',
            description: error.message || 'Could not mark attendance.',
        });
    } finally {
        setIsScanning(false);
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Scan Student Attendance</h1>
            <p className="text-muted-foreground">Point the camera at a student's QR code to mark them present.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Camera Feed</CardTitle>
          <CardDescription>The actual QR code decoding is simulated. Clicking scan will mark a random student as present.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-muted aspect-video w-full max-w-2xl mx-auto flex items-center justify-center overflow-hidden">
            {hasCameraPermission ? (
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            ) : (
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <Video className="h-10 w-10" />
                    <p>Camera is not available or permission denied.</p>
                </div>
            )}
          </div>
          
          {!hasCameraPermission && (
            <Alert variant="destructive">
              <Video className="h-4 w-4" />
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser to use the QR scanner.
              </AlertDescription>
            </Alert>
          )}

           <div className="text-center">
                <Button size="lg" onClick={handleScan} disabled={isScanning || !hasCameraPermission || userLoading || students.length === 0}>
                    {isScanning ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <QrCode className="mr-2 h-5 w-5" />}
                    {isScanning ? 'Scanning...' : 'Scan Code & Mark Present'}
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

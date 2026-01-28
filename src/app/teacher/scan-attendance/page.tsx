
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { QrCode, Video, Loader2, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/hooks/use-role';
import { supabase } from '@/lib/supabase';
import type { Student } from '@/lib/types';

export default function ScanAttendancePage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { user, loading: userLoading } = useRole();

  const requestCameraPermission = async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: 'Camera access is not supported by your browser.',
      });
      return;
    }
    
    setIsStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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
    } finally {
      setIsStarting(false);
    }
  };

  useEffect(() => {
    // Cleanup function to stop camera stream when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (students.length === 0) {
      toast({ variant: 'destructive', title: 'No Students Found', description: 'Cannot simulate scan as no students are assigned to you.' });
      setIsScanning(false);
      return;
    }
    
    const randomStudent = students[Math.floor(Math.random() * students.length)];
    const studentId = randomStudent.id; 
    const today = new Date().toISOString().split('T')[0];
    
    try {
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
          <CardDescription>
            {hasCameraPermission ? "The actual QR code decoding is simulated. Clicking scan will mark a random student as present." : "Activate your camera to start."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-muted aspect-video w-full max-w-2xl mx-auto flex items-center justify-center overflow-hidden">
            {hasCameraPermission ? (
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            ) : (
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <Video className="h-10 w-10" />
                    <p>Camera is not active.</p>
                </div>
            )}
          </div>
          
          {hasCameraPermission === false && (
            <Alert variant="destructive">
              <Video className="h-4 w-4" />
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser to use the QR scanner.
              </AlertDescription>
            </Alert>
          )}

           <div className="text-center">
                {hasCameraPermission ? (
                    <Button size="lg" onClick={handleScan} disabled={isScanning || userLoading || students.length === 0}>
                        {isScanning ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <QrCode className="mr-2 h-5 w-5" />}
                        {isScanning ? 'Scanning...' : 'Scan Code & Mark Present'}
                    </Button>
                ) : (
                    <Button size="lg" onClick={requestCameraPermission} disabled={isStarting}>
                        {isStarting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Camera className="mr-2 h-5 w-5" />}
                        {isStarting ? 'Starting Camera...' : 'Activate Camera'}
                    </Button>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

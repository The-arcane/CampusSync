'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { QrCode, Video, Loader2, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/hooks/use-role';
import { supabase } from '@/lib/supabase';
import type { Student } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ScanAttendancePage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const { user, loading: userLoading } = useRole();
  
  useEffect(() => {
    // Cleanup function to stop the camera stream when the component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getCameraPermission = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: 'Camera access is not supported by your browser.',
      });
      return;
    }

    setIsActivating(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
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
      setIsActivating(false);
    }
  };


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
            .select('id, check_in, check_out')
            .eq('student_id', studentId)
            .eq('date', today)
            .maybeSingle();

        if (checkError) throw checkError;

        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

        if (existingRecord) {
            if (existingRecord.check_out) {
                 toast({
                    title: 'Already Checked Out',
                    description: `${randomStudent.full_name} has already been marked and checked out for today.`,
                });
            } else {
                 const { error: updateError } = await supabase
                    .from('student_attendance')
                    .update({ check_out: currentTime })
                    .eq('id', existingRecord.id);

                if (updateError) throw updateError;
                 toast({
                    variant: 'default',
                    title: 'Checked Out!',
                    description: `${randomStudent.full_name} has been successfully checked out.`,
                });
            }
        } else {
            const { error: insertError } = await supabase
                .from('student_attendance')
                .insert({
                    student_id: studentId,
                    date: today,
                    status: 'present',
                    check_in: currentTime,
                });
            
            if (insertError) throw insertError;
            
            toast({
                variant: 'default',
                title: 'Checked In!',
                description: `${randomStudent.full_name} has been successfully checked in as present.`,
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
            {hasCameraPermission ? "The actual QR code decoding is simulated. Clicking scan will check-in/out a random student." : "Activate your camera to start."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={cn("relative rounded-md border bg-muted aspect-video w-full max-w-2xl mx-auto flex items-center justify-center overflow-hidden", !hasCameraPermission && "hidden")}>
             <video 
                ref={videoRef} 
                className="w-full h-full object-cover" 
                playsInline
                muted 
            />
          </div>
            
          {hasCameraPermission === null && !isActivating && (
            <div className="rounded-md border bg-muted aspect-video w-full max-w-2xl mx-auto flex items-center justify-center overflow-hidden relative">
                <div className="absolute text-muted-foreground flex flex-col items-center gap-2">
                    <Video className="h-10 w-10" />
                    <p>Camera is not active.</p>
                </div>
            </div>
          )}

          {isActivating && (
            <div className="rounded-md border bg-muted aspect-video w-full max-w-2xl mx-auto flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                </div>
            </div>
          )}
          
          {hasCameraPermission === false && (
            <Alert variant="destructive">
              <Camera className="h-4 w-4" />
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                You have denied camera access. Please allow camera access in your browser to use the QR scanner.
              </AlertDescription>
            </Alert>
          )}

           <div className="text-center">
                {hasCameraPermission ? (
                    <Button size="lg" onClick={handleScan} disabled={isScanning || userLoading || students.length === 0}>
                        {isScanning ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <QrCode className="mr-2 h-5 w-5" />}
                        {isScanning ? 'Scanning...' : 'Scan & Mark Attendance'}
                    </Button>
                ) : (
                    <Button size="lg" onClick={getCameraPermission} disabled={isActivating}>
                        {isActivating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Camera className="mr-2 h-5 w-5" />}
                        {isActivating ? 'Starting Camera...' : 'Activate Camera'}
                    </Button>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

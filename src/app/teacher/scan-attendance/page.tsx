'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  
  const getCameraPermission = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: 'Camera access is not supported by your browser.',
      });
      setHasCameraPermission(false);
      return;
    }

    setIsActivating(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setHasCameraPermission(true);
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
  }, [toast]);

  useEffect(() => {
    // Cleanup function to stop the camera stream when the component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
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

  const handleScan = useCallback(async () => {
    if (isScanning) return;

    setIsScanning(true);
    
    // Simulate a scan attempt.
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (userLoading || students.length === 0) {
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
                    title: 'Already Scanned',
                    description: `${randomStudent.full_name} has already checked in and out for today.`,
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
        setTimeout(() => setIsScanning(false), 2000); // Wait 2 seconds before allowing another scan
    }
  }, [isScanning, students, toast, userLoading]);

  useEffect(() => {
    if (hasCameraPermission) {
      const interval = setInterval(() => {
        handleScan();
      }, 3000); // Attempt a scan every 3 seconds

      return () => clearInterval(interval);
    }
  }, [hasCameraPermission, handleScan]);


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Scan Student Attendance</h1>
            <p className="text-muted-foreground">Automatic scanning will begin once the camera is active.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Camera Feed</CardTitle>
          <CardDescription>
            {hasCameraPermission ? "Scanning for QR codes automatically. The scan itself is simulated." : "Activate your camera to start scanning."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="relative rounded-md border bg-muted aspect-video w-full max-w-2xl mx-auto flex items-center justify-center overflow-hidden">
             <video 
                ref={videoRef} 
                className="w-full h-full object-cover" 
                playsInline
                muted 
            />

            {!hasCameraPermission && !isActivating && (
                <div className="absolute text-muted-foreground flex flex-col items-center gap-2">
                    <Video className="h-10 w-10" />
                    <p>Camera is not active.</p>
                </div>
            )}
            
            {hasCameraPermission && (
                <div className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none">
                    <div className="flex flex-col items-center gap-2 text-white bg-black/50 p-4 rounded-lg">
                        {isScanning ? <Loader2 className="h-8 w-8 animate-spin" /> : <QrCode className="h-8 w-8" />}
                        <p className="font-semibold text-sm">{isScanning ? 'Processing...' : 'Scanning for QR Code'}</p>
                    </div>
                </div>
            )}

            {isActivating && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                    <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                </div>
            )}
          </div>
          
          {hasCameraPermission === false && (
            <Alert variant="destructive">
              <Camera className="h-4 w-4" />
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                You have denied camera access. Please allow camera access in your browser settings to use the QR scanner.
              </AlertDescription>
            </Alert>
          )}

           <div className="text-center">
                {!hasCameraPermission && (
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

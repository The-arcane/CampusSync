'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, Loader2, QrCode, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/hooks/use-role';
import { supabase } from '@/lib/supabase';
import type { Student } from '@/lib/types';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { cn } from '@/lib/utils';

const QR_REGION_ID = "qr-reader-region";

export default function ScanAttendancePage() {
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [lastScan, setLastScan] = useState<{ studentName: string; status: string; success: boolean } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const html5QrCodeScannerRef = useRef<Html5Qrcode | null>(null);

  const { toast } = useToast();
  const { user, loading: userLoading } = useRole();

  // Fetch students for the current teacher
  useEffect(() => {
    async function fetchTeacherStudents() {
      if (user) {
        const { data: subjects, error: subjectsError } = await supabase
          .from('subjects')
          .select('class_id')
          .eq('teacher_id', user.id);

        if (subjectsError || !subjects) return;

        const classIds = [...new Set(subjects.map(s => s.class_id).filter(id => id))];

        if (classIds.length > 0) {
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

  const onScanSuccess = useCallback(async (decodedText: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setLastScan(null);

    const student = students.find(s => s.qr_code === decodedText);

    if (!student) {
      const status = "Student not in your classes or invalid QR.";
      setLastScan({ studentName: 'Unknown', status, success: false });
      toast({ variant: 'destructive', title: 'Invalid Scan', description: status });
      setIsProcessing(false);
      return;
    }
    
    const studentId = student.id;
    const today = new Date().toISOString().split('T')[0];

    try {
      const { data: existingRecord, error: checkError } = await supabase
        .from('student_attendance')
        .select('id, check_in, check_out')
        .eq('student_id', studentId)
        .eq('date', today)
        .maybeSingle();

      if (checkError) throw checkError;

      const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      if (existingRecord) {
        if (existingRecord.check_out) {
          const statusText = `Already Checked In & Out`;
          toast({ title: 'Attendance Marked', description: `${student.full_name} is already marked for today.` });
          setLastScan({ studentName: student.full_name, status: statusText, success: true });
        } else {
          const { error: updateError } = await supabase.from('student_attendance').update({ check_out: currentTime }).eq('id', existingRecord.id);
          if (updateError) throw updateError;
          const statusText = `Checked Out at ${currentTime}`;
          toast({ title: 'Checked Out!', description: `${student.full_name} has been successfully checked out.` });
          setLastScan({ studentName: student.full_name, status: statusText, success: true });
        }
      } else {
        const { error: insertError } = await supabase.from('student_attendance').insert({ student_id: studentId, date: today, status: 'present', check_in: currentTime });
        if (insertError) throw insertError;
        const statusText = `Checked In at ${currentTime}`;
        toast({ title: 'Checked In!', description: `${student.full_name} has been successfully checked in as present.` });
        setLastScan({ studentName: student.full_name, status: statusText, success: true });
      }
    } catch (error: any) {
      console.error('Attendance marking error:', error);
      const statusText = 'Database Error';
      setLastScan({ studentName: student.full_name, status: statusText, success: false });
      toast({ variant: 'destructive', title: statusText, description: error.message });
    } finally {
        if (html5QrCodeScannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
            html5QrCodeScannerRef.current.pause(true);
            setTimeout(() => {
                if (html5QrCodeScannerRef.current?.getState() === Html5QrcodeScannerState.PAUSED) {
                    html5QrCodeScannerRef.current.resume();
                }
                setIsProcessing(false);
            }, 2000);
        } else {
            setIsProcessing(false);
        }
    }
  }, [isProcessing, students, toast]);

  const startScanner = useCallback(() => {
    if (!html5QrCodeScannerRef.current) {
      html5QrCodeScannerRef.current = new Html5Qrcode(QR_REGION_ID, { experimentalFeatures: { useBarCodeDetectorIfSupported: true } });
    }
    const scanner = html5QrCodeScannerRef.current;
    if (scanner && scanner.getState() !== Html5QrcodeScannerState.SCANNING) {
      setLastScan(null);
      scanner.start(
        { facingMode: 'environment' },
        { fps: 5, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        (errorMessage) => { /* Ignore errors */ }
      ).then(() => {
        setIsScannerActive(true);
      }).catch(err => {
        toast({ variant: 'destructive', title: 'Camera Error', description: err.message || 'Failed to start camera.' });
      });
    }
  }, [onScanSuccess, toast]);

  const stopScanner = useCallback(() => {
    const scanner = html5QrCodeScannerRef.current;
    if (scanner && scanner.getState() === Html5QrcodeScannerState.SCANNING) {
      scanner.stop().then(() => setIsScannerActive(false)).catch(err => console.error("Failed to stop scanner", err));
    }
  }, []);

  useEffect(() => {
    return () => {
      const scanner = html5QrCodeScannerRef.current;
      if (scanner && scanner.isScanning) {
        scanner.clear().catch(err => console.error("Cleanup failed", err));
      }
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className='space-y-2'>
          <h1 className="text-3xl font-bold font-headline">Scan Student Attendance</h1>
          <p className="text-muted-foreground">Point the camera at a student's QR code.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Camera Scanner</CardTitle>
          <CardDescription>{isScannerActive ? "Scanning is active." : "Activate camera to begin."}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-muted aspect-video w-full max-w-2xl mx-auto flex items-center justify-center overflow-hidden relative">
            <div id={QR_REGION_ID} className="w-full h-full" />
            {!isScannerActive && (
              <div className="absolute text-muted-foreground flex flex-col items-center gap-2 pointer-events-none">
                <Camera className="h-10 w-10" />
                <p>Camera is inactive.</p>
              </div>
            )}
            {isScannerActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none">
                <div className={cn("flex flex-col items-center gap-2 text-white bg-black/50 p-4 rounded-lg", isProcessing && 'animate-pulse')}>
                  {isProcessing ? <Loader2 className="h-8 w-8 animate-spin" /> : <QrCode className="h-8 w-8" />}
                  <p className="font-semibold text-sm">{isProcessing ? 'Processing...' : 'Scanning...'}</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button size="lg" onClick={isScannerActive ? stopScanner : startScanner} disabled={userLoading}>
              <Camera className="mr-2 h-5 w-5" />
              {isScannerActive ? 'Deactivate Camera' : 'Activate Camera'}
            </Button>
          </div>

          {lastScan && (
            <Card className={cn("mt-4", lastScan.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {lastScan.success ? <CheckCircle className="text-green-600" /> : <XCircle className="text-red-600" />}
                  Last Scan Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Name:</strong> {lastScan.studentName}</p>
                <p><strong>Status:</strong> {lastScan.status}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

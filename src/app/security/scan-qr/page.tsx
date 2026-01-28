'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, Loader2, QrCode, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { cn } from '@/lib/utils';

const QR_REGION_ID = "qr-reader-region";

export default function ScanQrPage() {
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [lastScan, setLastScan] = useState<{ name: string; status: string; success: boolean } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const html5QrCodeScannerRef = useRef<Html5Qrcode | null>(null);

  const { toast } = useToast();

  const handleAttendance = useCallback(async (decodedText: string) => {
    // This function can be expanded to check both students and staff
    // For now, it only checks students as per the current schema
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('qr_code', decodedText)
      .single();

    if (student) {
      const { data: existingRecord, error: checkError } = await supabase
        .from('student_attendance')
        .select('id, check_in, check_out')
        .eq('student_id', student.id)
        .eq('date', new Date().toISOString().split('T')[0])
        .maybeSingle();

      if (checkError) throw checkError;

      const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      if (existingRecord) {
        if (existingRecord.check_out) {
          return { name: student.full_name, status: `Already Checked In & Out`, success: true };
        } else {
          await supabase.from('student_attendance').update({ check_out: currentTime }).eq('id', existingRecord.id);
          return { name: student.full_name, status: `Checked Out at ${currentTime}`, success: true };
        }
      } else {
        await supabase.from('student_attendance').insert({ student_id: student.id, date: new Date().toISOString().split('T')[0], status: 'present', check_in: currentTime });
        return { name: student.full_name, status: `Checked In at ${currentTime}`, success: true };
      }
    }

    // TODO: Implement staff scanning logic here if profiles table gets a qr_code column

    return { name: 'Unknown', status: 'User not found', success: false };

  }, []);

  const onScanSuccess = useCallback(async (decodedText: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setLastScan(null);

    try {
      const result = await handleAttendance(decodedText);
      setLastScan(result);
      if (result.success) {
        toast({ title: 'Scan Successful', description: `${result.name} - ${result.status}` });
      } else {
        toast({ variant: 'destructive', title: 'Scan Failed', description: result.status });
      }
    } catch (error: any) {
      setLastScan({ name: 'Error', status: 'Database operation failed', success: false });
      toast({ variant: 'destructive', title: 'Database Error', description: error.message });
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
  }, [isProcessing, toast, handleAttendance]);
  
  const startScanner = useCallback(() => {
    if (!html5QrCodeScannerRef.current) {
        html5QrCodeScannerRef.current = new Html5Qrcode(QR_REGION_ID, { experimentalFeatures: { useBarCodeDetectorIfSupported: true }});
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
        toast({
          variant: 'destructive',
          title: 'Camera Error',
          description: err.message || 'Failed to start camera. Please check permissions.',
        });
      });
    }
  }, [onScanSuccess, toast]);

  const stopScanner = useCallback(() => {
    const scanner = html5QrCodeScannerRef.current;
    if (scanner && scanner.getState() === Html5QrcodeScannerState.SCANNING) {
      scanner.stop().then(() => {
        setIsScannerActive(false);
      }).catch(err => {
        console.error("Failed to stop scanner", err);
      });
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
            <h1 className="text-3xl font-bold font-headline">Scan QR for Attendance</h1>
            <p className="text-muted-foreground">Point the camera at a student or staff QR code.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>QR Code Scanner</CardTitle>
          <CardDescription>
            {isScannerActive ? "Live scanning is active." : "Activate the camera to begin scanning."}
          </CardDescription>
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
            <Button size="lg" onClick={isScannerActive ? stopScanner : startScanner}>
                <Camera className="mr-2 h-5 w-5" />
                {isScannerActive ? 'Deactivate Camera' : 'Activate Camera'}
            </Button>
            </div>
            
            {lastScan && (
                 <Card className={cn("mt-4", lastScan.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            {lastScan.success ? <CheckCircle className="text-green-600" /> : <XCircle className="text-red-600" />}
                            Scan Result
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>Name:</strong> {lastScan.name}</p>
                        <p><strong>Status:</strong> {lastScan.status}</p>
                    </CardContent>
                 </Card>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { QrCode, Video, Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ScanQrPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

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
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = useCallback(() => {
    if (isScanning) return;
    setIsScanning(true);
    toast({
      title: 'Scan Successful (Simulated)',
      description: 'A student/staff QR code has been processed.',
    });
    setTimeout(() => setIsScanning(false), 2000);
  }, [isScanning, toast]);

  useEffect(() => {
    if (hasCameraPermission) {
      const interval = setInterval(() => {
        handleScan();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [hasCameraPermission, handleScan]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Scan QR for Attendance</h1>
            <p className="text-muted-foreground">Automatic scanning will start once the camera is active.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>QR Code Scanner</CardTitle>
          <CardDescription>
            {hasCameraPermission ? "Scanning automatically. The scan itself is simulated." : "Activate your camera to start scanning."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-muted aspect-video w-full max-w-2xl mx-auto flex items-center justify-center overflow-hidden relative">
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover" 
              autoPlay 
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

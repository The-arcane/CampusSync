'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { QrCode, Video, Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ScanQrPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

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
      // Prefer environment-facing camera for QR scanning
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      setHasCameraPermission(true);
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
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      // The `play()` method returns a Promise. It's good practice to handle potential exceptions.
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
        toast({
            variant: 'destructive',
            title: 'Playback Error',
            description: 'Could not start the camera feed.',
        });
      });
    }
    
    // IMPORTANT: Cleanup function to stop the camera stream
    // when the component unmounts or the stream object changes.
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream, toast]);

  // Note: A real scan would involve a QR library. This is a placeholder action.
  const handleScan = () => {
    toast({
      title: 'Simulating Scan',
      description: 'A real implementation would use a QR library to decode the stream.',
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold font-headline">Scan QR for Attendance</h1>
            <p className="text-muted-foreground">Point the camera at a student or staff QR code to log their attendance.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>QR Code Scanner</CardTitle>
          <CardDescription>
            {hasCameraPermission && stream ? "The video feed from your camera will appear below." : "Activate your camera to start scanning."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-muted aspect-video w-full max-w-2xl mx-auto flex items-center justify-center overflow-hidden">
            {/* The video element is always in the DOM, but hidden if no stream. 
                playsInline is crucial for iOS Safari. */}
            <video ref={videoRef} className={cn("w-full h-full object-cover", !stream && "hidden")} muted playsInline />
            {!stream && (
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <Video className="h-10 w-10" />
                    <p>Camera is not active.</p>
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
            {stream ? (
                 <Button size="lg" onClick={handleScan}>
                    <QrCode className="mr-2 h-5 w-5" />
                    Scan Code
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

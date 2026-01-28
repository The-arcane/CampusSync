
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Image from 'next/image';
import type { Student } from '@/lib/types';
import { Button } from '../ui/button';
import { Printer } from 'lucide-react';

interface StudentQrModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StudentQrModal({ student, isOpen, onClose }: StudentQrModalProps) {
  if (!student) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${student.qr_code}&size=256x256&format=png&qzone=1`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code - ${student.full_name}</title>
            <style>
              @media print {
                body {
                  padding: 20px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                  font-family: sans-serif;
                }
                @page {
                  size: 100mm 100mm;
                  margin: 10mm;
                }
                img {
                    width: 80mm;
                    height: 80mm;
                }
              }
            </style>
          </head>
          <body>
            <h2>${student.full_name}</h2>
            <p>Admission No: ${student.admission_no}</p>
            <img src="${qrCodeUrl}" alt="QR Code" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Student QR Code</DialogTitle>
          <DialogDescription>
            This QR code can be used for attendance marking by security staff.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {student.qr_code ? (
            <Image
              src={qrCodeUrl}
              alt={`QR Code for ${student.full_name}`}
              width={256}
              height={256}
            />
          ) : (
             <p className="text-muted-foreground">No QR code has been generated for this student.</p>
          )}
          <div className="text-center">
            <p className="font-bold text-lg">{student.full_name}</p>
            <p className="text-sm text-muted-foreground">Admission No: {student.admission_no}</p>
          </div>
          <Button onClick={handlePrint} className="w-full mt-2">
            <Printer className="mr-2 h-4 w-4" />
            Print QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

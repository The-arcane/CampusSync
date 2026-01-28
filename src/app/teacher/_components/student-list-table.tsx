
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Student } from "@/lib/types";
import { QrCode } from "lucide-react";
import { StudentQrModal } from "@/components/teacher/student-qr-modal";

export function StudentListTable({ data }: { data: Student[] }) {
    const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
    const [isQrModalOpen, setIsQrModalOpen] = React.useState(false);
    
    const handleShowQr = (student: Student) => {
        setSelectedStudent(student);
        setIsQrModalOpen(true);
    };

    const columns: ColumnDef<Student>[] = [
      {
        accessorKey: "admission_no",
        header: "Admission No.",
        cell: ({ row }) => <div>{row.getValue("admission_no")}</div>,
      },
      {
        accessorKey: "full_name",
        header: "Name",
        cell: ({ row }) => <div className="font-medium">{row.getValue("full_name")}</div>,
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const student = row.original;
    
          return (
            <div className="text-right">
              <Button variant="outline" size="sm" onClick={() => handleShowQr(student)}>
                <QrCode className="mr-2 h-4 w-4" />
                Show QR
              </Button>
            </div>
          );
        },
      },
    ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
    <StudentQrModal 
        student={selectedStudent} 
        isOpen={isQrModalOpen} 
        onClose={() => setIsQrModalOpen(false)} 
    />
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
    </>
  );
}

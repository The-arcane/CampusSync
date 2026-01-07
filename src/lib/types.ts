export type Role = "Super Admin" | "Admin" | "Teacher" | "Security/Staff" | "Parent";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string;
};

export type Student = {
  id: string;
  name: string;
  class: string;
  admissionDate: string;
  parentId: string;
};

export type Staff = {
  id: string;
  name: string;
  role: "Teacher" | "Non-Teaching";
  joiningDate: string;
};

export type AttendanceRecord = {
  id: string;
  userId: string; // Can be student or staff ID
  date: string;
  entryTime: string;
  exitTime: string | null;
  status: "Present" | "Late" | "Absent";
};

export type Payroll = {
  id: string;
  staffId: string;
  month: string;
  baseSalary: number;
  deductions: number;
  netSalary: number;
  status: "Paid" | "Pending";
};

export type AcademicRecord = {
  id: string;
  studentId: string;
  subject: string;
  marks: number;
  examType: "Mid-term" | "Final";
  remarks: string;
};

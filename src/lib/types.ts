
export type Role = "Super Admin" | "Admin" | "Teacher" | "Security/Staff" | "Parent";

export type Profile = {
  id: string; // Corresponds to auth.users(id)
  fullName: string;
  role: Role;
  phone?: string;
  avatarUrl: string;
  email: string;
};

export type Student = {
  id: string; // UUID
  admissionNo: string;
  fullName: string;
  classId?: string; // UUID
  parentId?: string; // UUID, references a profile
  qrCode?: string;
};

export type Parent = {
  id: string; // UUID, references a profile
  address?: string;
};

export type Teacher = {
  id: string; // UUID, references a profile
  salaryPerDay: number;
  joiningDate: string; // Date
};

export type Staff = {
  id: string; // UUID, references a profile
  designation?: string;
  salaryPerDay: number;
  joiningDate: string; // Date
};

export type Class = {
  id: string; // UUID
  className: string;
  section?: string;
};

export type Subject = {
  id: string; // UUID
  name: string;
  classId?: string; // UUID
  teacherId?: string; // UUID, references a profile
};

export type AttendanceLog = {
  id: string; // UUID
  userId?: string; // UUID
  studentId?: string; // UUID
  role?: Role;
  date: string; // Date
  checkIn?: string; // Time
  checkOut?: string; // Time
  isLate: boolean;
};

export type LeaveRequest = {
  id: string; // UUID
  userId?: string; // UUID
  leaveDate: string; // Date
  leaveType: 'emergency' | 'sunday' | 'monday';
  approved: boolean;
};

export type PayrollRule = {
  id: string; // UUID
  late4DaysHalfDay: boolean;
  late8DaysFullDay: boolean;
  mondayLeaveDoubleDeduction: boolean;
  allowedEmergencyLeaves: number;
};

export type SalaryRecord = {
  id: string; // UUID
  userId?: string; // UUID
  month: number;
  year: number;
  totalWorkingDays: number;
  payableDays: number;
  totalSalary: number;
  deductions: number;
  finalSalary: number;
};

export type ExamResult = {
  id: string; // UUID
  studentId?: string; // UUID
  subjectId?: string; // UUID
  marks: number;
  examName?: string;
};

export type Fee = {
  id: string; // UUID
  studentId?: string; // UUID
  amount: number;
  status: 'paid' | 'pending';
  dueDate?: string; // Date
};

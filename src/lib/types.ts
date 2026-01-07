
export type Role = "Super Admin" | "Admin" | "Teacher" | "Security/Staff" | "Parent";

export type Profile = {
  id: string; // Corresponds to auth.users(id)
  full_name: string;
  role: Role;
  phone?: string;
  avatarUrl?: string; 
  email?: string; 
};

export type Student = {
  id: string; // UUID
  admission_no: string;
  full_name: string;
  class_id?: string; // UUID
  parent_id?: string; // UUID, references a profile
  qr_code?: string;
};

export type Parent = {
  id: string; // UUID, references a profile
  address?: string;
};

export type Teacher = {
  id: string; // UUID, references a profile
  salary_per_day: number;
  joining_date: string; // Date
};

export type Staff = {
  id: string; // UUID, references a profile
  designation?: string;
  salary_per_day: number;
  joining_date: string; // Date
};

export type Class = {
  id: string; // UUID
  class_name: string;
  section?: string;
};

export type Subject = {
  id: string; // UUID
  name: string;
  class_id?: string; // UUID
  teacher_id?: string; // UUID, references a profile
};

export type AttendanceLog = {
  id: string; // UUID
  user_id?: string; // UUID
  student_id?: string; // UUID
  role?: Role;
  date: string; // Date
  check_in?: string; // Time
  check_out?: string; // Time
  is_late: boolean;
};

export type LeaveRequest = {
  id: string; // UUID
  user_id?: string; // UUID
  leave_date: string; // Date
  leave_type: 'emergency' | 'sunday' | 'monday';
  approved: boolean;
};

export type PayrollRule = {
  id: string; // UUID
  late_4_days_half_day: boolean;
  late_8_days_full_day: boolean;
  monday_leave_double_deduction: boolean;
  allowed_emergency_leaves: number;
};

export type SalaryRecord = {
  id: string; // UUID
  user_id?: string; // UUID
  month: number;
  year: number;
  total_working_days: number;
  payable_days: number;
  total_salary: number;
  deductions: number;
  final_salary: number;
};

export type ExamResult = {
  id: string; // UUID
  student_id?: string; // UUID
  subject_id?: string; // UUID
  marks: number;
  exam_name?: string;
};

export type Fee = {
  id: string; // UUID
  student_id?: string; // UUID
  amount: number;
  status: 'paid' | 'pending';
  due_date?: string; // Date
};

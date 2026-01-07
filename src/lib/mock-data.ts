
import type { Profile, Role, Student, Staff, Teacher } from './types';
import placeholderImages from './placeholder-images.json';

const avatarUrls = [
  placeholderImages.placeholderImages.find(p => p.id === "avatar-1")?.imageUrl,
  placeholderImages.placeholderImages.find(p => p.id === "avatar-2")?.imageUrl,
  placeholderImages.placeholderImages.find(p => p.id === "avatar-3")?.imageUrl,
  placeholderImages.placeholderImages.find(p => p.id === "avatar-4")?.imageUrl,
  placeholderImages.placeholderImages.find(p => p.id === "avatar-5")?.imageUrl,
].filter(Boolean) as string[];

export const users: (Profile & {email: string})[] = [
  { id: '1', full_name: 'Dr. Evelyn Reed', email: 'evelyn.reed@example.com', role: 'super_admin', avatarUrl: avatarUrls[0] },
  { id: '2', full_name: 'Marcus Kane', email: 'marcus.kane@example.com', role: 'admin', avatarUrl: avatarUrls[1] },
  { id: '3', full_name: 'Lena Petrova', email: 'lena.petrova@example.com', role: 'teacher', avatarUrl: avatarUrls[2] },
  { id: '4', full_name: 'John Smith', email: 'john.smith@example.com', role: 'security_staff', avatarUrl: avatarUrls[3] },
  { id: '5', full_name: 'Sarah Connor', email: 'sarah.connor@example.com', role: 'parent', avatarUrl: avatarUrls[4] },
];

export const students: Student[] = [
  { id: 'S001', full_name: 'Alice Johnson', class_id: '10A', admission_no: 'A001', parent_id: '5' },
  { id: 'S002', full_name: 'Bob Williams', class_id: '10A', admission_no: 'A002', parent_id: 'P002' },
  { id: 'S003', full_name: 'Charlie Brown', class_id: '11B', admission_no: 'A003', parent_id: 'P003' },
  { id: 'S004', full_name: 'Diana Miller', class_id: '9C', admission_no: 'A004', parent_id: 'P004' },
  { id: 'S005', full_name: 'Ethan Davis', class_id: '12A', admission_no: 'A005', parent_id: 'P005' },
];

export const teachers: Teacher[] = [
  { id: '3', salary_per_day: 500, joining_date: '2020-08-20' },
];

export const staff: Staff[] = [
    { id: '4', designation: 'Security Head', salary_per_day: 300, joining_date: '2019-02-11' },
];

export const recentSignups = [
    { name: 'Olivia Martin', email: 'olivia.martin@email.com', avatarUrl: avatarUrls[0] },
    { name: 'Jackson Lee', email: 'jackson.lee@email.com', avatarUrl: avatarUrls[1] },
    { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', avatarUrl: avatarUrls[2] },
    { name: 'William Kim', email: 'will@email.com', avatarUrl: avatarUrls[3] },
    { name: 'Sofia Davis', email: 'sofia.davis@email.com', avatarUrl: avatarUrls[4] },
];

export const attendanceData = [
    { name: "Jan", students: 400, staff: 240 },
    { name: "Feb", students: 300, staff: 139 },
    { name: "Mar", students: 200, staff: 980 },
    { name: "Apr", students: 278, staff: 390 },
    { name: "May", students: 189, staff: 480 },
    { name: "Jun", students: 239, staff: 380 },
    { name: "Jul", students: 349, staff: 430 },
];

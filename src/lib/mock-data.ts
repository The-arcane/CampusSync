
import type { Profile, Role, Student, Staff, Teacher } from './types';
import placeholderImages from './placeholder-images.json';

const avatarUrls = [
  placeholderImages.placeholderImages.find(p => p.id === "avatar-1")?.imageUrl,
  placeholderImages.placeholderImages.find(p => p.id === "avatar-2")?.imageUrl,
  placeholderImages.placeholderImages.find(p => p.id === "avatar-3")?.imageUrl,
  placeholderImages.placeholderImages.find(p => p.id === "avatar-4")?.imageUrl,
  placeholderImages.placeholderImages.find(p => p.id === "avatar-5")?.imageUrl,
].filter(Boolean) as string[];

export const users: Profile[] = [
  { id: '1', fullName: 'Dr. Evelyn Reed', email: 'evelyn.reed@example.com', role: 'Super Admin', avatarUrl: avatarUrls[0] },
  { id: '2', fullName: 'Marcus Kane', email: 'marcus.kane@example.com', role: 'Admin', avatarUrl: avatarUrls[1] },
  { id: '3', fullName: 'Lena Petrova', email: 'lena.petrova@example.com', role: 'Teacher', avatarUrl: avatarUrls[2] },
  { id: '4', fullName: 'John Smith', email: 'john.smith@example.com', role: 'Security/Staff', avatarUrl: avatarUrls[3] },
  { id: '5', fullName: 'Sarah Connor', email: 'sarah.connor@example.com', role: 'Parent', avatarUrl: avatarUrls[4] },
];

export const students: Student[] = [
  { id: 'S001', fullName: 'Alice Johnson', classId: '10A', admissionNo: 'A001', parentId: '5' },
  { id: 'S002', fullName: 'Bob Williams', classId: '10A', admissionNo: 'A002', parentId: 'P002' },
  { id: 'S003', fullName: 'Charlie Brown', classId: '11B', admissionNo: 'A003', parentId: 'P003' },
  { id: 'S004', fullName: 'Diana Miller', classId: '9C', admissionNo: 'A004', parentId: 'P004' },
  { id: 'S005', fullName: 'Ethan Davis', classId: '12A', admissionNo: 'A005', parentId: 'P005' },
];

export const teachers: Teacher[] = [
  { id: '3', salaryPerDay: 500, joiningDate: '2020-08-20' },
];

export const staff: Staff[] = [
    { id: '4', designation: 'Security Head', salaryPerDay: 300, joiningDate: '2019-02-11' },
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

import type { User, Role, Student, Staff } from './types';
import placeholderImages from './placeholder-images.json';

const roles: Role[] = ["Super Admin", "Admin", "Teacher", "Security/Staff", "Parent"];

const avatarUrls = [
  placeholderImages.placeholderImages.find(p => p.id === "avatar-1")?.imageUrl,
  placeholderImages.placeholderImages.find(p => p.id === "avatar-2")?.imageUrl,
  placeholderImages.placeholderImages.find(p => p.id === "avatar-3")?.imageUrl,
  placeholderImages.placeholderImages.find(p => p.id === "avatar-4")?.imageUrl,
  placeholderImages.placeholderImages.find(p => p.id === "avatar-5")?.imageUrl,
].filter(Boolean) as string[];


export const users: User[] = [
  { id: '1', name: 'Dr. Evelyn Reed', email: 'evelyn.reed@example.com', role: 'Super Admin', avatarUrl: avatarUrls[0] },
  { id: '2', name: 'Marcus Kane', email: 'marcus.kane@example.com', role: 'Admin', avatarUrl: avatarUrls[1] },
  { id: '3', name: 'Lena Petrova', email: 'lena.petrova@example.com', role: 'Teacher', avatarUrl: avatarUrls[2] },
  { id: '4', name: 'John Smith', email: 'john.smith@example.com', role: 'Security/Staff', avatarUrl: avatarUrls[3] },
  { id: '5', name: 'Sarah Connor', email: 'sarah.connor@example.com', role: 'Parent', avatarUrl: avatarUrls[4] },
];

export const students: Student[] = [
  { id: 'S001', name: 'Alice Johnson', class: '10A', admissionDate: '2023-01-15', parentId: '5' },
  { id: 'S002', name: 'Bob Williams', class: '10A', admissionDate: '2023-01-20', parentId: 'P002' },
  { id: 'S003', name: 'Charlie Brown', class: '11B', admissionDate: '2022-08-10', parentId: 'P003' },
  { id: 'S004', name: 'Diana Miller', class: '9C', admissionDate: '2023-04-05', parentId: 'P004' },
  { id: 'S005', name: 'Ethan Davis', class: '12A', admissionDate: '2021-09-01', parentId: 'P005' },
];

export const staff: Staff[] = [
  { id: 'T01', name: 'Lena Petrova', role: 'Teacher', joiningDate: '2020-08-20' },
  { id: 'T02', name: 'David Chen', role: 'Teacher', joiningDate: '2021-07-15' },
  { id: 'NT01', name: 'Frank White', role: 'Non-Teaching', joiningDate: '2019-02-11' },
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

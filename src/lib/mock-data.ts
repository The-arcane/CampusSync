
import type { Profile, Role, Student, Staff, Teacher, Class, Fee } from './types';
import placeholderImages from './placeholder-images.json';

const avatarUrls = [
  placeholderImages.placeholderImages.find(p => p.id === "avatar-1")?.imageUrl,
  placeholderImages.placeholderImages.find(p => p.id === "avatar-2")?.imageUrl,
  placeholderImages.placeholderImages.find(p => p.id === "avatar-3")?.imageUrl,
  placeholderImages.placeholderImages.find(p => p.id === "avatar-4")?.imageUrl,
  placeholderImages.placeholderImages.find(p => p.id === "avatar-5")?.imageUrl,
].filter(Boolean) as string[];

const firstNames = ["Aisha", "Bao", "Carlos", "Diana", "Ethan", "Fatima", "Gabriel", "Hana", "Ivan", "Jia", "Kenji", "Lila", "Mateo", "Nia", "Omar", "Priya", "Quinn", "Rosa", "Sanjay", "Talia", "Umar", "Valeria", "Wei", "Ximena", "Yara", "Zane", "Ananya", "Ben", "Chloe", "David", "Elara", "Finn", "Grace", "Henry", "Isla", "Jack", "Kai", "Leo", "Mia", "Noah", "Olivia", "Penelope", "Ryan", "Sofia", "Thomas", "Victoria", "William"];
const lastNames = ["Khan", "Phan", "Rodriguez", "Prince", "Chen", "Al-Fassi", "Silva", "Kim", "Petrov", "Li", "Nakamura", "Patel", "Garcia", "Jones", "Abbas", "Sharma", "Quintero", "Martinez", "Kumar", "Goldberg", "Farooq", "Russo", "Feng", "Vargas", "Zahra", "Miller", "Roy", "Scott", "Lee", "Wang", "Hayes", "King", "Wright", "Davis", "Lopez", "Hill", "Clark", "Lewis", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell"];

const generateUsers = (count: number, role: Role, startingIndex: number) => {
    const usersArr: (Profile & { email: string })[] = [];
    for (let i = 0; i < count; i++) {
        const index = startingIndex + i;
        const firstName = firstNames[index % firstNames.length];
        const lastName = lastNames[index % lastNames.length];
        const fullName = `${firstName} ${lastName}`;
        usersArr.push({
            id: `user-${role}-${i + 1}`,
            full_name: fullName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
            role,
            avatarUrl: avatarUrls[index % avatarUrls.length]
        });
    }
    return usersArr;
};

// --- CORE USER & PROFILE DATA ---
const superAdminUsers = generateUsers(1, 'super_admin', 0);
const adminUsers = generateUsers(1, 'admin', 1);
const teacherUsers = generateUsers(5, 'teacher', 2);
const securityStaffUsers = generateUsers(5, 'security_staff', 7);
const parentUsers = generateUsers(50, 'parent', 12);

export const users: (Profile & { email: string })[] = [
    ...superAdminUsers,
    ...adminUsers,
    ...teacherUsers,
    ...securityStaffUsers,
    ...parentUsers,
];

// --- SUBJECTS ---
export const subjects: { id: string; name: string }[] = [
    { id: 'subj-01', name: 'Mathematics' },
    { id: 'subj-02', name: 'English Language' },
    { id: 'subj-03', name: 'Science' },
    { id: 'subj-04', name: 'History' },
    { id: 'subj-05', name: 'Geography' },
    { id: 'subj-06', name: 'Art & Design' },
    { id: 'subj-07', name: 'Physical Education' },
    { id: 'subj-08', name: 'Music' },
    { id: 'subj-09', name: 'Computer Science' },
    { id: 'subj-10', name: 'Biology' },
];

// --- CLASSES ---
export const classes: Class[] = Array.from({ length: 10 }, (_, i) => {
    const grade = Math.floor(i / 2) + 1;
    const section = i % 2 === 0 ? 'A' : 'B';
    const classSubjects = [
        subjects[0], subjects[1], subjects[2], subjects[3], subjects[4], subjects[6]
    ];
    if (grade > 3) classSubjects.push(subjects[8]);

    return {
        id: `class-${grade}${section}`,
        class_name: `${grade}`,
        section: section,
        student_count: 5,
        subjects: classSubjects
    };
});

// --- STUDENTS ---
export const students: Student[] = Array.from({ length: 50 }, (_, i) => {
    const studentUser = firstNames[(i + 10) % firstNames.length] + ' ' + lastNames[(i + 10) % lastNames.length];
    const classIndex = Math.floor(i / 5);
    return {
        id: `student-${i + 1}`,
        admission_no: `A${2024000 + i + 1}`,
        full_name: studentUser,
        class_id: classes[classIndex].id,
        parent_id: parentUsers[i].id,
    };
});

// --- TEACHERS (Role-specific data) ---
export const teachers: Teacher[] = teacherUsers.map((user, i) => ({
    id: user.id,
    salary_per_day: 500 + i * 20,
    joining_date: `20${18 + i}-08-15`,
}));

// --- STAFF (Role-specific data) ---
export const staff: Staff[] = securityStaffUsers.map((user, i) => ({
    id: user.id,
    designation: i === 0 ? 'Security Head' : 'Security Officer',
    salary_per_day: 300 + i * 10,
    joining_date: `20${17 + i}-03-20`,
}));

// --- FEES ---
export const fees: Fee[] = students.map((student, i) => ({
    id: `fee-${i + 1}`,
    student_id: student.id,
    amount: 4500 + (parseInt(student.class_id.charAt(6)) * 100),
    status: i % 4 === 0 ? 'pending' : 'paid',
    due_date: '2024-08-10',
}));


// --- DASHBOARD-SPECIFIC MOCK DATA (can remain as is or be expanded) ---

export const recentSignups = users.slice(2, 7).map(u => ({
    name: u.full_name,
    email: u.email,
    avatarUrl: u.avatarUrl || avatarUrls[0]
}));

export const attendanceData = [
    { name: "Jan", students: 4000, staff: 2400 },
    { name: "Feb", students: 3000, staff: 1398 },
    { name: "Mar", students: 2000, staff: 9800 },
    { name: "Apr", students: 2780, staff: 3908 },
    { name: "May", students: 1890, staff: 4800 },
    { name: "Jun", students: 2390, staff: 3800 },
    { name: "Jul", students: 3490, staff: 4300 },
];

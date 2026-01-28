-- This script seeds the database for the CampusSync application.
-- To use: Navigate to the SQL Editor in your Supabase dashboard, paste the
-- entire content of this file, and click "Run".

-- NOTE ON USERS: This script does NOT create users in `auth.users` because
-- passwords must be hashed. You must create users manually through the
-- Supabase Dashboard UI (Authentication -> Users -> Add User) or through
-- your application's sign-up form.

-- The `id` values for the profiles below are pre-generated UUIDs. You MUST
-- ensure that the user you create in `auth.users` has the EXACT same UUID.
-- When creating a user in the Supabase UI, you CANNOT specify a UUID.
-- A workaround is to sign up a new user through your app's login page,
-- then check the `auth.users` table for their generated UUID, and UPDATE
-- the corresponding profile row in this script with that UUID before running it.

-- Default password for all users if you sign them up is: password123

-- Clean up existing data in public tables to prevent conflicts.
-- The order is important due to foreign key constraints.
DELETE FROM public.fees;
DELETE FROM public.exam_results;
DELETE FROM public.student_attendance;
DELETE FROM public.staff_attendance;
DELETE FROM public.leave_requests;
DELETE FROM public.salary_records;
DELETE FROM public.subjects;
DELETE FROM public.students;
DELETE FROM public.teachers;
DELETE FROM public.staff;
DELETE FROM public.parents;
DELETE FROM public.classes;
DELETE FROM public.profiles;

-- =============================================================================
-- 1. PROFILES (Users)
-- =============================================================================
-- Replace the `id` values with the UUIDs from your `auth.users` table.
INSERT INTO public.profiles (id, full_name, role, email, avatarUrl) VALUES
('a0a0a0a0-0000-0000-0000-000000000001', 'Super Admin', 'super_admin', 'superadmin@example.com', 'https://images.unsplash.com/photo-1521119989659-a83eee488004'),
('a0a0a0a0-0000-0000-0000-000000000002', 'Admin User', 'admin', 'admin@example.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'),
('a0a0a0a0-0000-0000-0000-000000000003', 'Maria Garcia (Teacher)', 'teacher', 'teacher.maria@example.com', 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a'),
('a0a0a0a0-0000-0000-0000-000000000004', 'Chen Wei (Teacher)', 'teacher', 'teacher.chen@example.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'),
('a0a0a0a0-0000-0000-0000-000000000005', 'Sanjay Patel (Teacher)', 'teacher', 'teacher.sanjay@example.com', 'https://images.unsplash.com/photo-1521119989659-a83eee488004'),
('a0a0a0a0-0000-0000-0000-000000000006', 'David Miller (Security)', 'security_staff', 'staff.david@example.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'),
('a0a0a0a0-0000-0000-0000-000000000007', 'Fatima Khan (Security)', 'security_staff', 'staff.fatima@example.com', 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a');

-- Parent Profiles (Generate 50)
INSERT INTO public.profiles (id, full_name, role, email, avatarUrl)
SELECT
    gen_random_uuid(),
    'Parent ' || (ROW_NUMBER() OVER ()) AS full_name,
    'parent' AS role,
    'parent' || (ROW_NUMBER() OVER ()) || '@example.com' AS email,
    'https://images.unsplash.com/photo-1521119989659-a83eee488004'
FROM generate_series(1, 50);

-- =============================================================================
-- 2. CLASSES
-- =============================================================================
INSERT INTO public.classes (id, class_name, section) VALUES
('c1a55001-0000-0000-0000-000000000001', '1', 'A'),
('c1a55001-0000-0000-0000-000000000002', '1', 'B'),
('c1a55001-0000-0000-0000-000000000003', '2', 'A'),
('c1a55001-0000-0000-0000-000000000004', '2', 'B'),
('c1a55001-0000-0000-0000-000000000005', '3', 'A'),
('c1a55001-0000-0000-0000-000000000006', '3', 'B'),
('c1a55001-0000-0000-0000-000000000007', '4', 'A'),
('c1a55001-0000-0000-0000-000000000008', '4', 'B'),
('c1a55001-0000-0000-0000-000000000009', '5', 'A'),
('c1a55001-0000-0000-0000-000000000010', '5', 'B');

-- =============================================================================
-- 3. SUBJECTS
-- =============================================================================
INSERT INTO public.subjects (id, name) VALUES
('5b1e0001-0000-0000-0000-000000000001', 'Mathematics'),
('5b1e0001-0000-0000-0000-000000000002', 'English Language'),
('5b1e0001-0000-0000-0000-000000000003', 'Science'),
('5b1e0001-0000-0000-0000-000000000004', 'History'),
('5b1e0001-0000-0000-0000-000000000005', 'Geography'),
('5b1e0001-0000-0000-0000-000000000006', 'Art & Design'),
('5b1e0001-0000-0000-0000-000000000007', 'Physical Education'),
('5b1e0001-0000-0000-0000-000000000008', 'Music'),
('5b1e0001-0000-0000-0000-000000000009', 'Computer Science'),
('5b1e0001-0000-0000-0000-000000000010', 'Biology');

-- =============================================================================
-- 4. STUDENTS
-- =============================================================================
-- This part is more complex as it links students to parents and classes.
-- We'll create 50 students and assign them to the 10 classes (5 students per class).
DO $$
DECLARE
    parent_ids uuid[];
    class_ids uuid[];
    student_name text;
    admission_counter int := 1;
BEGIN
    -- Get all parent and class UUIDs into arrays
    SELECT array_agg(id) INTO parent_ids FROM public.profiles WHERE role = 'parent';
    SELECT array_agg(id) INTO class_ids FROM public.classes;

    -- Loop to insert 50 students
    FOR i IN 1..50 LOOP
        student_name := 'Student ' || i;
        INSERT INTO public.students (id, admission_no, full_name, class_id, parent_id)
        VALUES (
            gen_random_uuid(),
            'A' || (2024000 + admission_counter),
            student_name,
            class_ids[( (i-1) / 5) + 1], -- Assigns 5 students to each class
            parent_ids[i] -- Assigns a unique parent to each student
        );
        admission_counter := admission_counter + 1;
    END LOOP;
END $$;


-- =============================================================================
-- 5. FEES
-- =============================================================================
INSERT INTO public.fees (student_id, amount, status, due_date)
SELECT
    s.id,
    4500 + (CAST(c.class_name AS integer) * 100),
    CASE WHEN (ROW_NUMBER() OVER (ORDER BY s.id)) % 4 = 0 THEN 'pending' ELSE 'paid' END,
    '2024-08-10'::date
FROM
    public.students s
JOIN
    public.classes c ON s.class_id = c.id;

-- =============================================================================
-- 6. TEACHERS and STAFF specific data
-- =============================================================================
INSERT INTO public.teachers (id, salary_per_day, joining_date) VALUES
('a0a0a0a0-0000-0000-0000-000000000003', 500, '2018-08-15'),
('a0a0a0a0-0000-0000-0000-000000000004', 520, '2019-08-15'),
('a0a0a0a0-0000-0000-0000-000000000005', 540, '2020-08-15');

INSERT INTO public.staff (id, designation, salary_per_day, joining_date) VALUES
('a0a0a0a0-0000-0000-0000-000000000006', 'Security Head', 300, '2017-03-20'),
('a0a0a0a0-0000-0000-0000-000000000007', 'Security Officer', 310, '2018-03-20');

-- You can add more data for exam_results, attendance etc. as needed.
-- Example for an exam result:
-- INSERT INTO public.exam_results (student_id, subject_id, exam_name, marks)
-- VALUES ('<student_uuid>', '<subject_uuid>', 'Mid-Term Exam', 85);

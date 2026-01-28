-- This script is for seeding your Supabase database with sample data.
-- 1. Go to your Supabase project's SQL Editor.
-- 2. Paste the entire content of this file.
-- 3. Run the query.

-- Note: This script uses the user profile IDs you provided.
-- Teacher ID: 64707f94-58a9-4843-a23a-035ce9f9d674 (teacher@prestige.com)
-- Staff ID: 0770c322-4b80-445c-8ec4-7a923369ae91 (staff@prestige.com)
-- Parent ID: 63cfca0d-de64-4593-91d4-4c5d02f7e618 (parent@prestige.com)

BEGIN;

-- Temporarily disable RLS on all public tables to allow seeding
ALTER TABLE public.classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_records DISABLE ROW LEVEL SECURITY;

-- Clear existing data to prevent conflicts if re-running the seed
TRUNCATE TABLE public.classes, public.subjects, public.students, public.teachers, public.staff, public.parents, public.fees, public.exam_results, public.student_attendance, public.staff_attendance, public.leave_requests, public.salary_records RESTART IDENTITY CASCADE;

-- Insert records for the provided user roles into their respective specific tables.
-- The profiles table itself is NOT modified.
INSERT INTO public.teachers (id, salary_per_day, joining_date) VALUES ('64707f94-58a9-4843-a23a-035ce9f9d674', 2000, '2022-04-01');
INSERT INTO public.staff (id, designation, salary_per_day, joining_date) VALUES ('0770c322-4b80-445c-8ec4-7a923369ae91', 'Security Guard', 1500, '2021-08-15');
INSERT INTO public.parents (id, address) VALUES ('63cfca0d-de64-4593-91d4-4c5d02f7e618', '123 Maple Street, Anytown, USA');

-- Create Classes
-- Using hardcoded UUIDs for deterministic linking
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DO $$
DECLARE
    class_10a_id UUID := 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d01';
    class_10b_id UUID := 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d02';
    class_9a_id UUID := 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d03';
    class_8a_id UUID := 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d04';
BEGIN
    INSERT INTO public.classes (id, class_name, section) VALUES
    (class_10a_id, 'Grade 10', 'A'),
    (class_10b_id, 'Grade 10', 'B'),
    (class_9a_id, 'Grade 9', 'A'),
    (class_8a_id, 'Grade 8', 'A');
END $$;


-- Create Subjects and assign them to classes and the teacher
-- The teacher ID is '64707f94-58a9-4843-a23a-035ce9f9d674'
INSERT INTO public.subjects (id, name, class_id, teacher_id) VALUES
(uuid_generate_v4(), 'Mathematics', 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d01', '64707f94-58a9-4843-a23a-035ce9f9d674'),
(uuid_generate_v4(), 'Physics', 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d01', '64707f94-58a9-4843-a23a-035ce9f9d674'),
(uuid_generate_v4(), 'Chemistry', 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d01', '64707f94-58a9-4843-a23a-035ce9f9d674'),
(uuid_generate_v4(), 'English', 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d01', '64707f94-58a9-4843-a23a-035ce9f9d674'),
(uuid_generate_v4(), 'Mathematics', 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d02', '64707f94-58a9-4843-a23a-035ce9f9d674'),
(uuid_generate_v4(), 'Biology', 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d02', '64707f94-58a9-4843-a23a-035ce9f9d674'),
(uuid_generate_v4(), 'History', 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d03', '64707f94-58a9-4843-a23a-035ce9f9d674'),
(uuid_generate_v4(), 'Geography', 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d03', '64707f94-58a9-4843-a23a-035ce9f9d674'),
(uuid_generate_v4(), 'Computer Science', 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d04', '64707f94-58a9-4843-a23a-035ce9f9d674'),
(uuid_generate_v4(), 'Physical Education', 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d04', '64707f94-58a9-4843-a23a-035ce9f9d674');

-- Create Students
-- All students are linked to the single parent ID '63cfca0d-de64-4593-91d4-4c5d02f7e618'
DO $$
DECLARE
    class_10a_id UUID := 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d01';
    class_10b_id UUID := 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d02';
    class_9a_id UUID := 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d03';
    class_8a_id UUID := 'd9f7b1e4-3a2b-4b1d-8c6c-8a1a9e7d0d04';
    parent_id UUID := '63cfca0d-de64-4593-91d4-4c5d02f7e618';
    first_names TEXT[] := ARRAY['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Saanvi', 'Aanya', 'Aadhya', 'Ananya', 'Pari', 'Diya', 'Myra', 'Anika', 'Aarohi', 'Siya'];
    last_names TEXT[] := ARRAY['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Khan', 'Jain', 'Shah'];
    i INT;
    f_name TEXT;
    l_name TEXT;
    adm_no INT;
    class_id_to_use UUID;
BEGIN
    FOR i IN 1..50 LOOP
        f_name := first_names[1 + floor(random() * array_length(first_names, 1))];
        l_name := last_names[1 + floor(random() * array_length(last_names, 1))];
        adm_no := 2024000 + i;

        -- Distribute students into classes
        IF i <= 15 THEN
            class_id_to_use := class_10a_id;
        ELSIF i <= 30 THEN
            class_id_to_use := class_10b_id;
        ELSIF i <= 40 THEN
            class_id_to_use := class_9a_id;
        ELSE
            class_id_to_use := class_8a_id;
        END IF;

        INSERT INTO public.students (id, admission_no, full_name, class_id, parent_id, qr_code)
        VALUES (uuid_generate_v4(), adm_no::TEXT, f_name || ' ' || l_name, class_id_to_use, parent_id, 'QR-CODE-' || adm_no::TEXT);
    END LOOP;
END $$;

-- Create Fee Records for a subset of students
DO $$
DECLARE
    student_ids UUID[];
    student_id_val UUID;
BEGIN
    -- Get IDs of 20 random students
    SELECT ARRAY(SELECT id FROM public.students ORDER BY random() LIMIT 20) INTO student_ids;

    FOREACH student_id_val IN ARRAY student_ids
    LOOP
        INSERT INTO public.fees (student_id, amount, status, due_date)
        VALUES (
            student_id_val,
            5000 + floor(random() * 2000), -- Random fee amount
            CASE WHEN random() > 0.3 THEN 'paid' ELSE 'pending' END, -- 70% paid, 30% pending
            (CURRENT_DATE + (floor(random() * 60) - 30) * '1 day'::interval) -- Random due date within +/- 30 days
        );
    END LOOP;
END $$;

-- Create Exam Results for a subset of students
DO $$
DECLARE
    student_rec RECORD;
    subject_rec RECORD;
BEGIN
    FOR student_rec IN SELECT id, class_id FROM public.students ORDER BY random() LIMIT 10 LOOP
        FOR subject_rec IN SELECT id FROM public.subjects WHERE subjects.class_id = student_rec.class_id LOOP
             INSERT INTO public.exam_results (student_id, subject_id, exam_name, marks)
             VALUES (
                 student_rec.id,
                 subject_rec.id,
                 'Mid-Term Exam',
                 floor(random() * 60) + 40 -- Marks between 40 and 100
             );
        END LOOP;
    END LOOP;
END $$;


-- Re-enable RLS on all tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_records ENABLE ROW LEVEL SECURITY;

COMMIT;

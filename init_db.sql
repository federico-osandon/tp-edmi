-- 1. Tabla de Perfiles (Profiles)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  role text check (role in ('student', 'instructor')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- 2. Tabla de Cursos (Courses)
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  code text not null,
  description text,
  instructor_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.courses enable row level security;

create policy "Courses are viewable by everyone." on public.courses
  for select using (true);

create policy "Instructors can create courses." on public.courses
  for insert with check (auth.uid() = instructor_id);

create policy "Instructors can update their own courses." on public.courses
  for update using (auth.uid() = instructor_id);

-- 3. Tabla de Tareas (Assignments)
create table public.assignments (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  due_date timestamp with time zone,
  points integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.assignments enable row level security;

create policy "Assignments are viewable by everyone." on public.assignments
  for select using (true);

create policy "Instructors can manage assignments." on public.assignments
  for all using (
    exists (
      select 1 from public.courses
      where id = assignments.course_id
      and instructor_id = auth.uid()
    )
  );

-- 4. Tabla de Entregas (Submissions)
create table public.submissions (
  id uuid default gen_random_uuid() primary key,
  assignment_id uuid references public.assignments(id) on delete cascade not null,
  student_id uuid references public.profiles(id) not null,
  file_url text,
  file_name text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.submissions enable row level security;

create policy "Students can view their own submissions." on public.submissions
  for select using (auth.uid() = student_id);

create policy "Instructors can view submissions for their courses." on public.submissions
  for select using (
    exists (
      select 1 from public.assignments a
      join public.courses c on a.course_id = c.id
      where a.id = submissions.assignment_id
      and c.instructor_id = auth.uid()
    )
  );

create policy "Students can create submissions." on public.submissions
  for insert with check (auth.uid() = student_id);

-- Storage Bucket para entregas (opcional, pero recomendado)
insert into storage.buckets (id, name, public) 
values ('submissions', 'submissions', false)
on conflict (id) do nothing;

create policy "Students can upload submissions." on storage.objects
  for insert with check (
    bucket_id = 'submissions' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Student,
  User,
  Course,
  ScheduleBlock,
  Grade,
  Task,
  Submission,
  Announcement,
  Contact,
  Audit,
} from '../types';
import {
  initialStudents,
  initialUsers,
  initialCourses,
  initialSchedule,
  initialGrades,
  initialTasks,
  initialSubmissions,
  initialAnnouncements,
  initialContacts,
  initialAudit,
} from './mockData';

const STORAGE_KEYS = {
  USER: 'sm_current_user',
  STUDENTS: 'sm_students',
  USERS: 'sm_users',
  COURSES: 'sm_courses',
  SCHEDULE: 'sm_schedule',
  GRADES: 'sm_grades',
  TASKS: 'sm_tasks',
  SUBMISSIONS: 'sm_submissions',
  ANNOUNCEMENTS: 'sm_announcements',
  CONTACTS: 'sm_contacts',
  AUDIT: 'sm_audit',
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

export function initLocalStore() {
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    setLocal(STORAGE_KEYS.STUDENTS, initialStudents);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setLocal(STORAGE_KEYS.USERS, initialUsers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    setLocal(STORAGE_KEYS.COURSES, initialCourses);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SCHEDULE)) {
    setLocal(STORAGE_KEYS.SCHEDULE, initialSchedule);
  }
  if (!localStorage.getItem(STORAGE_KEYS.GRADES)) {
    setLocal(STORAGE_KEYS.GRADES, initialGrades);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    setLocal(STORAGE_KEYS.TASKS, initialTasks);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
    setLocal(STORAGE_KEYS.SUBMISSIONS, initialSubmissions);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    setLocal(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
    setLocal(STORAGE_KEYS.CONTACTS, initialContacts);
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
    setLocal(STORAGE_KEYS.AUDIT, initialAudit);
  }
}

initLocalStore();

function genId(prefix: string): string {
  return prefix + Math.random().toString(36).substring(2, 6).toUpperCase();
}

function stamp(): string {
  return new Date().toISOString();
}

// ----------------------------------------------------
// AUTHENTICATION
// ----------------------------------------------------

export async function login(username: string, password: string): Promise<User> {
  const cleanUsername = username.trim().toLowerCase();

  if (isSupabaseConfigured && supabase) {
    const { data: user, error } = await supabase
      .from('users')
      .select('username, name, role, student, password')
      .eq('username', cleanUsername)
      .single();

    if (error || !user) {
      throw new Error('Usuario o contraseña incorrectos.');
    }

    if (user.password !== password) {
      throw new Error('Usuario o contraseña incorrectos.');
    }

    if (user.role === 'student' && user.student) {
      const { data: student } = await supabase
        .from('students')
        .select('active')
        .eq('id', user.student)
        .single();

      if (student && !student.active) {
        throw new Error('Esta cuenta está inactiva.');
      }
    }

    const authUser: User = {
      username: user.username,
      name: user.name,
      role: user.role,
      student: user.student,
    };
    setCurrentUser(authUser);
    return authUser;
  }

  // Fallback to local storage
  const users = getLocal<User[]>(STORAGE_KEYS.USERS, initialUsers);
  const user = users.find((u) => u.username.toLowerCase() === cleanUsername);

  if (!user || user.password !== password) {
    throw new Error('Usuario o contraseña incorrectos.');
  }

  if (user.role === 'student' && user.student) {
    const students = getLocal<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents);
    const student = students.find((s) => s.id === user.student);
    if (student && !student.active) {
      throw new Error('Esta cuenta está inactiva.');
    }
  }

  const authUser: User = {
    username: user.username,
    name: user.name,
    role: user.role,
    student: user.student,
  };
  setCurrentUser(authUser);
  return authUser;
}

export function getCurrentUser(): User | null {
  return getLocal<User | null>(STORAGE_KEYS.USER, null);
}

export function setCurrentUser(user: User | null): void {
  setLocal(STORAGE_KEYS.USER, user);
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// ----------------------------------------------------
// APP STATE (DATA FETCHING)
// ----------------------------------------------------

export interface AppState {
  user: User;
  classroom?: string | null;
  students: Student[];
  courses: Course[];
  grades: Grade[];
  tasks: Task[];
  schedule: ScheduleBlock[];
  announcements: Announcement[];
  submissions: Submission[];
  contacts: Contact[];
  audit: Audit[];
}

export async function fetchState(): Promise<AppState> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('No hay sesión activa.');
  }

  const isAdmin = user.role === 'admin';

  if (isSupabaseConfigured && supabase) {
    try {
      let classroom: string | null = null;
      if (!isAdmin && user.student) {
        const { data: st } = await supabase
          .from('students')
          .select('classroom')
          .eq('id', user.student)
          .single();
        classroom = st?.classroom || null;
      }

      // Fetch students
      let studentsQuery = supabase.from('students').select('*').order('name');
      if (!isAdmin && user.student) {
        studentsQuery = studentsQuery.eq('id', user.student);
      }
      const { data: students = [] } = await studentsQuery;

      // Fetch courses
      let coursesQuery = supabase.from('courses').select('*');
      if (!isAdmin && classroom) {
        coursesQuery = coursesQuery.eq('classroom', classroom);
      }
      const { data: courses = [] } = await coursesQuery;
      const courseIds = (courses || []).map((c: Course) => c.id);

      // Fetch schedule
      let scheduleQuery = supabase.from('schedule').select('*').order('day').order('start');
      if (!isAdmin) {
        scheduleQuery = scheduleQuery.in('course', courseIds);
      }
      const { data: schedule = [] } = await scheduleQuery;

      // Fetch grades
      let gradesQuery = supabase.from('grades').select('*');
      if (!isAdmin && user.student) {
        gradesQuery = gradesQuery.eq('student', user.student);
      }
      const { data: grades = [] } = await gradesQuery;

      // Fetch tasks
      let tasksQuery = supabase.from('tasks').select('*').order('due');
      if (!isAdmin) {
        tasksQuery = tasksQuery.in('course', courseIds);
      }
      const { data: tasks = [] } = await tasksQuery;

      // Fetch submissions
      let submissionsQuery = supabase.from('submissions').select('*');
      if (!isAdmin && user.student) {
        submissionsQuery = submissionsQuery.eq('student', user.student);
      }
      const { data: submissions = [] } = await submissionsQuery;

      // Fetch announcements
      let announcementsQuery = supabase.from('announcements').select('*').order('created', { ascending: false });
      if (!isAdmin && classroom) {
        const isPrimaria = classroom.includes('Primaria');
        announcementsQuery = announcementsQuery.in('audience', ['Todos', isPrimaria ? 'Primaria' : 'Secundaria']);
      }
      const { data: announcements = [] } = await announcementsQuery;

      // Admin only: contacts & audit
      let contacts: Contact[] = [];
      let audit: Audit[] = [];
      if (isAdmin) {
        const { data: cont = [] } = await supabase.from('contacts').select('*').order('created', { ascending: false });
        contacts = cont || [];
        const { data: aud = [] } = await supabase.from('audit').select('*').order('id', { ascending: false }).limit(15);
        audit = aud || [];
      }

      return {
        user,
        classroom,
        students: students || [],
        courses: courses || [],
        grades: grades || [],
        tasks: tasks || [],
        schedule: schedule || [],
        announcements: announcements || [],
        submissions: submissions || [],
        contacts,
        audit,
      };
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local storage:', err);
    }
  }

  // Local Storage Fallback
  const allStudents = getLocal<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents);
  const allCourses = getLocal<Course[]>(STORAGE_KEYS.COURSES, initialCourses);
  const allSchedule = getLocal<ScheduleBlock[]>(STORAGE_KEYS.SCHEDULE, initialSchedule);
  const allGrades = getLocal<Grade[]>(STORAGE_KEYS.GRADES, initialGrades);
  const allTasks = getLocal<Task[]>(STORAGE_KEYS.TASKS, initialTasks);
  const allSubmissions = getLocal<Submission[]>(STORAGE_KEYS.SUBMISSIONS, initialSubmissions);
  const allAnnouncements = getLocal<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
  const allContacts = getLocal<Contact[]>(STORAGE_KEYS.CONTACTS, initialContacts);
  const allAudit = getLocal<Audit[]>(STORAGE_KEYS.AUDIT, initialAudit);

  let classroom: string | null = null;
  if (!isAdmin && user.student) {
    const student = allStudents.find((s) => s.id === user.student);
    classroom = student?.classroom || null;
  }

  const students = isAdmin
    ? allStudents
    : allStudents.filter((s) => s.id === user.student);

  const courses = isAdmin
    ? allCourses
    : allCourses.filter((c) => c.classroom === classroom);

  const courseIds = courses.map((c) => c.id);

  const schedule = isAdmin
    ? allSchedule
    : allSchedule.filter((s) => courseIds.includes(s.course));

  const grades = isAdmin
    ? allGrades
    : allGrades.filter((g) => g.student === user.student && courseIds.includes(g.course));

  const tasks = isAdmin
    ? allTasks
    : allTasks.filter((t) => courseIds.includes(t.course));

  const submissions = isAdmin
    ? allSubmissions
    : allSubmissions.filter((s) => s.student === user.student);

  const announcements = isAdmin
    ? allAnnouncements
    : allAnnouncements.filter((a) => {
        if (a.audience === 'Todos') return true;
        if (classroom?.includes('Primaria') && a.audience === 'Primaria') return true;
        if (classroom?.includes('Secundaria') && a.audience === 'Secundaria') return true;
        return false;
      });

  return {
    user,
    classroom,
    students,
    courses,
    grades,
    tasks,
    schedule,
    announcements,
    submissions,
    contacts: isAdmin ? allContacts : [],
    audit: isAdmin ? allAudit.slice(0, 15) : [],
  };
}

// ----------------------------------------------------
// AUDIT LOG HELPER
// ----------------------------------------------------

async function addAudit(actor: string, action: string, detail: string) {
  const auditItem: Audit = {
    id: Date.now(),
    actor,
    action,
    detail,
    created: stamp(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('audit').insert(auditItem);
      return;
    } catch (err) {
      console.warn('Error inserting audit in supabase:', err);
    }
  }

  const list = getLocal<Audit[]>(STORAGE_KEYS.AUDIT, initialAudit);
  setLocal(STORAGE_KEYS.AUDIT, [auditItem, ...list]);
}

// ----------------------------------------------------
// MUTATIONS
// ----------------------------------------------------

export async function submitTask(taskId: string, answer: string): Promise<void> {
  const user = getCurrentUser();
  if (!user || user.role !== 'student' || !user.student) {
    throw new Error('Operación no permitida.');
  }

  if (answer.trim().length < 10 || answer.length > 4000) {
    throw new Error('La respuesta debe tener entre 10 y 4000 caracteres.');
  }

  const submission: Submission = {
    task: taskId,
    student: user.student,
    answer: answer.trim(),
    updated: stamp(),
  };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('submissions')
      .upsert(submission, { onConflict: 'task,student' });
    if (error) throw new Error(error.message);
  } else {
    const list = getLocal<Submission[]>(STORAGE_KEYS.SUBMISSIONS, initialSubmissions);
    const filtered = list.filter((s) => !(s.task === taskId && s.student === user.student));
    setLocal(STORAGE_KEYS.SUBMISSIONS, [...filtered, submission]);
  }

  await addAudit(user.username, 'Entrega de tarea', taskId);
}

export async function saveGrade(
  student: string,
  course: string,
  period: number,
  assessment: string,
  grade: number
): Promise<void> {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Solo el administrador puede registrar calificaciones.');
  }

  if (isNaN(grade) || grade < 0 || grade > 20) {
    throw new Error('La nota debe ser un número entre 0 y 20.');
  }

  const gradeItem: Grade = {
    student,
    course,
    period,
    assessment,
    grade: Math.round(grade * 10) / 10,
    updated: stamp(),
  };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('grades')
      .upsert(gradeItem, { onConflict: 'student,course,period,assessment' });
    if (error) throw new Error(error.message);
  } else {
    const list = getLocal<Grade[]>(STORAGE_KEYS.GRADES, initialGrades);
    const filtered = list.filter(
      (g) =>
        !(
          g.student === student &&
          g.course === course &&
          g.period === period &&
          g.assessment === assessment
        )
    );
    setLocal(STORAGE_KEYS.GRADES, [...filtered, gradeItem]);
  }

  await addAudit(
    user.username,
    'Calificación guardada',
    `${student} · ${course} · B${period} · ${assessment}: ${grade}`
  );
}

export async function saveStudent(data: {
  id?: string;
  name: string;
  classroom: string;
  active: number;
  username?: string;
  password?: string;
}): Promise<void> {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Operación no autorizada.');
  }

  const id = data.id || genId('E');
  const name = data.name.trim();
  const classroom = data.classroom;
  const active = Number(data.active);

  if (name.length < 3 || name.length > 80) {
    throw new Error('El nombre debe tener entre 3 y 80 caracteres.');
  }

  const studentItem: Student = { id, name, classroom, active };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('students')
      .upsert(studentItem, { onConflict: 'id' });
    if (error) throw new Error(error.message);

    if (!data.id && data.username && data.password) {
      const newUser: User = {
        username: data.username.trim().toLowerCase(),
        name,
        role: 'student',
        student: id,
        password: data.password,
      };
      await supabase.from('users').insert(newUser);
    } else if (data.id) {
      await supabase.from('users').update({ name }).eq('student', id);
    }
  } else {
    const students = getLocal<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents);
    const filtered = students.filter((s) => s.id !== id);
    setLocal(STORAGE_KEYS.STUDENTS, [...filtered, studentItem]);

    const users = getLocal<User[]>(STORAGE_KEYS.USERS, initialUsers);
    if (!data.id && data.username && data.password) {
      users.push({
        username: data.username.trim().toLowerCase(),
        name,
        role: 'student',
        student: id,
        password: data.password,
      });
      setLocal(STORAGE_KEYS.USERS, users);
    } else if (data.id) {
      const userIndex = users.findIndex((u) => u.student === id);
      if (userIndex >= 0) {
        users[userIndex].name = name;
        setLocal(STORAGE_KEYS.USERS, users);
      }
    }
  }

  await addAudit(
    user.username,
    data.id ? 'Estudiante actualizado' : 'Estudiante registrado',
    id
  );
}

export async function saveCourse(data: {
  id?: string;
  name: string;
  teacher: string;
  classroom: string;
}): Promise<void> {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') throw new Error('No autorizado.');

  const id = data.id || genId('C');
  const name = data.name.trim();
  const teacher = data.teacher.trim();
  const classroom = data.classroom;

  if (name.length < 3 || teacher.length < 3) {
    throw new Error('Completa los datos del curso con al menos 3 caracteres.');
  }

  const courseItem: Course = { id, name, teacher, classroom, color: 'blue' };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('courses').upsert(courseItem, { onConflict: 'id' });
    if (error) throw new Error(error.message);
  } else {
    const list = getLocal<Course[]>(STORAGE_KEYS.COURSES, initialCourses);
    const filtered = list.filter((c) => c.id !== id);
    setLocal(STORAGE_KEYS.COURSES, [...filtered, courseItem]);
  }

  await addAudit(user.username, 'Curso guardado', id);
}

export async function saveSchedule(data: {
  course: string;
  day: number;
  start: string;
  end: string;
  room: string;
}): Promise<void> {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') throw new Error('No autorizado.');

  if (data.start >= data.end) {
    throw new Error('La hora final debe ser posterior a la hora inicial.');
  }

  const state = await fetchState();
  const clash = state.schedule.some((s) => {
    return (
      s.day === data.day &&
      s.start < data.end &&
      s.end > data.start &&
      (s.room === data.room || s.course === data.course)
    );
  });

  if (clash) {
    throw new Error('Ese bloque coincide con una clase del aula o salón seleccionado.');
  }

  const blockItem: ScheduleBlock = {
    id: Date.now(),
    course: data.course,
    day: Number(data.day),
    start: data.start,
    end: data.end,
    room: data.room.trim(),
  };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('schedule').insert(blockItem);
    if (error) throw new Error(error.message);
  } else {
    const list = getLocal<ScheduleBlock[]>(STORAGE_KEYS.SCHEDULE, initialSchedule);
    setLocal(STORAGE_KEYS.SCHEDULE, [...list, blockItem]);
  }

  await addAudit(user.username, 'Horario agregado', data.course);
}

export async function removeSchedule(id: number): Promise<void> {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') throw new Error('No autorizado.');

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('schedule').delete().eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const list = getLocal<ScheduleBlock[]>(STORAGE_KEYS.SCHEDULE, initialSchedule);
    setLocal(STORAGE_KEYS.SCHEDULE, list.filter((s) => s.id !== id));
  }

  await addAudit(user.username, 'Bloque de horario eliminado', String(id));
}

export async function saveTask(data: {
  course: string;
  title: string;
  description: string;
  due: string;
}): Promise<void> {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') throw new Error('No autorizado.');

  const id = genId('T');
  const taskItem: Task = {
    id,
    course: data.course,
    title: data.title.trim(),
    description: data.description.trim(),
    due: data.due,
  };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('tasks').insert(taskItem);
    if (error) throw new Error(error.message);
  } else {
    const list = getLocal<Task[]>(STORAGE_KEYS.TASKS, initialTasks);
    setLocal(STORAGE_KEYS.TASKS, [taskItem, ...list]);
  }

  await addAudit(user.username, 'Tarea publicada', id);
}

export async function saveAnnouncement(data: {
  title: string;
  audience: 'Todos' | 'Primaria' | 'Secundaria';
  body: string;
}): Promise<void> {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') throw new Error('No autorizado.');

  const id = genId('A');
  const annItem: Announcement = {
    id,
    title: data.title.trim(),
    audience: data.audience,
    body: data.body.trim(),
    created: stamp(),
  };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('announcements').insert(annItem);
    if (error) throw new Error(error.message);
  } else {
    const list = getLocal<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
    setLocal(STORAGE_KEYS.ANNOUNCEMENTS, [annItem, ...list]);
  }

  await addAudit(user.username, 'Comunicado publicado', id);
}

export async function updateContactStatus(id: string, status: 'Pendiente' | 'Atendida'): Promise<void> {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') throw new Error('No autorizado.');

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('contacts').update({ status }).eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const list = getLocal<Contact[]>(STORAGE_KEYS.CONTACTS, initialContacts);
    const item = list.find((c) => c.id === id);
    if (item) item.status = status;
    setLocal(STORAGE_KEYS.CONTACTS, list);
  }

  await addAudit(user.username, 'Estado de consulta actualizado', id);
}

export async function createContact(data: {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
  consent: boolean;
}): Promise<{ id: string }> {
  if (!data.consent) {
    throw new Error('Confirma el uso de datos de demostración.');
  }
  if (data.name.trim().length < 3) {
    throw new Error('El nombre debe tener al menos 3 caracteres.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('Escribe un correo electrónico válido.');
  }
  if (data.message.trim().length < 12 || data.message.length > 1000) {
    throw new Error('La consulta debe tener entre 12 y 1000 caracteres.');
  }

  const id = 'SM-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  const contactItem: Contact = {
    id,
    name: data.name.trim(),
    email: data.email.trim(),
    phone: (data.phone || '').trim(),
    topic: data.topic,
    message: data.message.trim(),
    status: 'Pendiente',
    created: stamp(),
  };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('contacts').insert(contactItem);
    if (error) throw new Error(error.message);
  } else {
    const list = getLocal<Contact[]>(STORAGE_KEYS.CONTACTS, initialContacts);
    setLocal(STORAGE_KEYS.CONTACTS, [contactItem, ...list]);
  }

  return { id };
}

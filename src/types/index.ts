export interface Student {
  id: string;
  name: string;
  classroom: string;
  active: number;
}

export interface User {
  username: string;
  name: string;
  role: 'admin' | 'student';
  student?: string | null;
  password?: string;
  salt?: string;
}

export interface Course {
  id: string;
  name: string;
  teacher: string;
  classroom: string;
  color: string;
}

export interface ScheduleBlock {
  id: number;
  course: string;
  day: number;
  start: string;
  end: string;
  room: string;
}

export interface Grade {
  student: string;
  course: string;
  period: number;
  assessment: string;
  grade: number;
  updated: string;
}

export interface Task {
  id: string;
  course: string;
  title: string;
  description: string;
  due: string;
}

export interface Submission {
  task: string;
  student: string;
  answer: string;
  updated: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: 'Todos' | 'Primaria' | 'Secundaria';
  created: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  status: 'Pendiente' | 'Atendida';
  created: string;
}

export interface Audit {
  id: number;
  actor: string;
  action: string;
  detail: string;
  created: string;
}

export interface LevelInfo {
  name: string;
  image: string;
  age: string;
  title: string;
  intro: string;
  features: [string, string][];
  summary: string;
}

export interface GalleryItem {
  category: 'inicial' | 'primaria' | 'secundaria';
  image: string;
  title: string;
  desc: string;
}

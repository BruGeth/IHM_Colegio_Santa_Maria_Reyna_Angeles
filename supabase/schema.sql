-- ============================================================
-- COLEGIO SANTA MARÍA REYNA DE LOS ÁNGELES
-- Script de Creación y Población de Base de Datos para Supabase
-- ============================================================

-- 1. CREACIÓN DE TABLAS

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  classroom TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS users (
  username TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'student')),
  student TEXT REFERENCES students(id) ON DELETE SET NULL,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  teacher TEXT NOT NULL,
  classroom TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'blue'
);

CREATE TABLE IF NOT EXISTS schedule (
  id BIGINT PRIMARY KEY,
  course TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  day INTEGER NOT NULL CHECK (day BETWEEN 0 AND 4),
  start TEXT NOT NULL,
  "end" TEXT NOT NULL,
  room TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS grades (
  student TEXT REFERENCES students(id) ON DELETE CASCADE,
  course TEXT REFERENCES courses(id) ON DELETE CASCADE,
  period INTEGER NOT NULL CHECK (period BETWEEN 1 AND 4),
  assessment TEXT NOT NULL,
  grade NUMERIC(4, 1) NOT NULL CHECK (grade BETWEEN 0 AND 20),
  updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (student, course, period, assessment)
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  course TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  due DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS submissions (
  task TEXT REFERENCES tasks(id) ON DELETE CASCADE,
  student TEXT REFERENCES students(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (task, student)
);

CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  audience TEXT NOT NULL CHECK (audience IN ('Todos', 'Primaria', 'Secundaria')),
  created TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  topic TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Atendida')),
  created TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit (
  id BIGINT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  detail TEXT NOT NULL,
  created TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PERMISOS Y PRIVILEGIOS PARA CLIENTE WEB (ANON Y AUTHENTICATED)

-- Otorgar acceso al esquema public
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Otorgar permisos sobre todas las tablas actuales
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Otorgar permisos sobre secuencias (para generación de IDs)
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Otorgar permisos sobre rutinas y funciones
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

-- Asegurar que tablas y secuencias futuras también tengan estos permisos
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated;

-- Desactivar RLS para evitar errores 42501 (permission denied) en cliente directo
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE schedule DISABLE ROW LEVEL SECURITY;
ALTER TABLE grades DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit DISABLE ROW LEVEL SECURITY;

-- 3. DATOS DE DEMOSTRACIÓN (SEEDS)

INSERT INTO students (id, name, classroom, active) VALUES
  ('E001', 'Ana Torres Mendoza', '5.º A · Primaria', 1),
  ('E002', 'Luis Rojas Vega', '5.º A · Primaria', 1),
  ('E003', 'Camila Díaz Flores', '1.º A · Secundaria', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (username, name, role, student, password) VALUES
  ('admin', 'Coordinación académica', 'admin', NULL, 'Admin2026!'),
  ('ana', 'Ana Torres Mendoza', 'student', 'E001', 'Alumno2026!'),
  ('luis', 'Luis Rojas Vega', 'student', 'E002', 'Alumno2026!'),
  ('camila', 'Camila Díaz Flores', 'student', 'E003', 'Alumno2026!')
ON CONFLICT (username) DO NOTHING;

INSERT INTO courses (id, name, teacher, classroom, color) VALUES
  ('C01', 'Matemática', 'Patricia García', '5.º A · Primaria', 'red'),
  ('C02', 'Comunicación', 'Rosa Medina', '5.º A · Primaria', 'blue'),
  ('C03', 'Ciencia y Tecnología', 'Jorge Flores', '5.º A · Primaria', 'green'),
  ('C04', 'Personal Social', 'Lucía Salazar', '5.º A · Primaria', 'gold'),
  ('C05', 'Inglés', 'Andrea Romero', '5.º A · Primaria', 'purple'),
  ('C06', 'Arte y Cultura', 'Elena Ruiz', '5.º A · Primaria', 'orange'),
  ('C07', 'Matemática', 'Carlos Soto', '1.º A · Secundaria', 'red'),
  ('C08', 'Comunicación', 'Mónica Paredes', '1.º A · Secundaria', 'blue')
ON CONFLICT (id) DO NOTHING;

INSERT INTO schedule (id, course, day, start, "end", room) VALUES
  (1, 'C01', 0, '08:00', '09:00', 'Aula 5A'),
  (2, 'C02', 0, '09:00', '10:00', 'Aula 5A'),
  (3, 'C03', 0, '10:00', '11:00', 'Aula 5A'),
  (4, 'C04', 1, '08:00', '09:00', 'Aula 5A'),
  (5, 'C05', 1, '09:00', '10:00', 'Aula 5A'),
  (6, 'C01', 1, '10:00', '11:00', 'Aula 5A'),
  (7, 'C02', 2, '08:00', '09:00', 'Aula 5A'),
  (8, 'C03', 2, '09:00', '10:00', 'Aula 5A'),
  (9, 'C06', 2, '10:00', '11:00', 'Aula 5A'),
  (10, 'C01', 3, '08:00', '09:00', 'Aula 5A'),
  (11, 'C04', 3, '09:00', '10:00', 'Aula 5A'),
  (12, 'C05', 3, '10:00', '11:00', 'Aula 5A'),
  (13, 'C03', 4, '08:00', '09:00', 'Aula 5A'),
  (14, 'C02', 4, '09:00', '10:00', 'Aula 5A'),
  (15, 'C06', 4, '10:00', '11:00', 'Aula 5A'),
  (16, 'C07', 0, '08:00', '09:00', 'Aula 1A'),
  (17, 'C08', 2, '08:00', '09:00', 'Aula 1A'),
  (18, 'C07', 4, '08:00', '09:00', 'Aula 1A')
ON CONFLICT (id) DO NOTHING;

INSERT INTO grades (student, course, period, assessment, grade, updated) VALUES
  ('E001', 'C01', 3, 'Práctica 1', 15, now()),
  ('E001', 'C01', 3, 'Proyecto', 16, now()),
  ('E001', 'C02', 3, 'Práctica 1', 16, now()),
  ('E001', 'C02', 3, 'Proyecto', 17, now()),
  ('E001', 'C03', 3, 'Práctica 1', 17, now()),
  ('E001', 'C03', 3, 'Proyecto', 18, now()),
  ('E001', 'C04', 3, 'Práctica 1', 18, now()),
  ('E001', 'C04', 3, 'Proyecto', 19, now()),
  ('E001', 'C05', 3, 'Práctica 1', 15, now()),
  ('E001', 'C05', 3, 'Proyecto', 16, now()),
  ('E001', 'C06', 3, 'Práctica 1', 16, now()),
  ('E001', 'C06', 3, 'Proyecto', 17, now()),
  ('E002', 'C01', 3, 'Práctica 1', 16, now()),
  ('E002', 'C01', 3, 'Proyecto', 17, now()),
  ('E003', 'C07', 3, 'Práctica 1', 15, now()),
  ('E003', 'C07', 3, 'Proyecto', 16, now()),
  ('E003', 'C08', 3, 'Práctica 1', 16, now()),
  ('E003', 'C08', 3, 'Proyecto', 17, now())
ON CONFLICT (student, course, period, assessment) DO NOTHING;

INSERT INTO tasks (id, course, title, description, due) VALUES
  ('T01', 'C01', 'Fracciones en la vida cotidiana', 'Resuelve tres situaciones con fracciones y explica el procedimiento que utilizaste.', CURRENT_DATE + INTERVAL '3 days'),
  ('T02', 'C02', 'Leemos y compartimos', 'Lee un cuento de tu elección. Escribe un resumen y explica qué aprendiste del personaje principal.', CURRENT_DATE + INTERVAL '5 days'),
  ('T03', 'C03', 'Nuestro pequeño ecosistema', 'Describe las condiciones que necesita una planta para crecer y propone un experimento sencillo.', CURRENT_DATE + INTERVAL '7 days'),
  ('T04', 'C07', 'Números enteros', 'Plantea y resuelve cinco situaciones con números enteros.', CURRENT_DATE + INTERVAL '4 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO announcements (id, title, body, audience, created) VALUES
  ('A01', 'Bienvenidos al aula virtual', 'Consulta tus cursos, organiza tus actividades y revisa tus calificaciones. Toda la información académica de este entorno es ficticia.', 'Todos', now()),
  ('A02', 'Lectura en familia', 'Esta semana te invitamos a compartir una lectura en casa y conversar sobre lo aprendido. Actividad de demostración.', 'Primaria', now()),
  ('A03', 'Organiza tu semana', 'Revisa tus actividades pendientes antes de comenzar la semana y prepara tus materiales de estudio.', 'Todos', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO contacts (id, name, email, phone, topic, message, status, created) VALUES
  ('SM-DEMO01', 'Carlos Mendoza', 'carlos.mendoza@ejemplo.com', '987654321', 'Primaria', 'Deseo solicitar información sobre el proceso de admisión para 5.º de primaria.', 'Pendiente', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO audit (id, actor, action, detail, created) VALUES
  (1, 'admin', 'Inicio del sistema', 'Configuración inicial del año académico 2026', now())
ON CONFLICT (id) DO NOTHING;


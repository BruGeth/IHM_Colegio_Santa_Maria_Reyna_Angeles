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
  LevelInfo,
  GalleryItem,
} from '../types';

export const levels: Record<string, LevelInfo> = {
  inicial: {
    name: 'Inicial',
    image: 'foto1.jpg',
    age: '3, 4 y 5 años',
    title: 'Sus primeros pasos, grandes descubrimientos.',
    intro:
      'El juego, la exploración y el acompañamiento respetuoso son el punto de partida para desarrollar autonomía y aprender a convivir.',
    features: [
      [
        'Desarrollo integral',
        'Experiencias que consideran el desarrollo intelectual, corporal y afectivo de cada niño.',
      ],
      [
        'Aprender a su ritmo',
        'Una metodología activa que reconoce diferencias en intereses, necesidades y formas de aprender.',
      ],
      [
        'Una transición acompañada',
        'Aprendizajes significativos que facilitan el paso de Inicial a Primaria.',
      ],
    ],
    summary:
      'Juego, autonomía y descubrimiento en un entorno de acompañamiento.',
  },
  primaria: {
    name: 'Primaria',
    image: 'foto12.jpg',
    age: 'Formación primaria',
    title: 'Aprender a pensar. Descubrir lo que podemos hacer.',
    intro:
      'Una propuesta constructivista que permite observar, preguntar, resolver problemas y poner en práctica lo aprendido, con la participación de las familias.',
    features: [
      [
        'Aprendizaje significativo',
        'Los estudiantes conectan los conocimientos con experiencias y situaciones de su entorno.',
      ],
      [
        'Creatividad e interacción',
        'El trabajo con otros y el uso de distintos materiales fortalecen la expresión y la creatividad.',
      ],
      [
        'Familias presentes',
        'La comunicación entre docentes y familias acompaña los avances y las dificultades del aprendizaje.',
      ],
    ],
    summary:
      'Pensamiento, creatividad y valores que se construyen cada día.',
  },
  secundaria: {
    name: 'Secundaria',
    image: 'foto33.jpg',
    age: 'Formación secundaria',
    title: 'Preparados para construir su propio camino.',
    intro:
      'La formación académica se integra con valores y desarrollo personal. El colegio presenta una propuesta orientada al pensamiento crítico y a la participación responsable.',
    features: [
      [
        'Formación en valores',
        'Desarrollo personal y convivencia con una orientación humana y cristiana.',
      ],
      [
        'Ciencia y tecnología',
        'La propuesta publicada contempla recursos para idiomas, ciencias e informática. Consulta su disponibilidad actual con el colegio.',
      ],
      [
        'Pensamiento crítico',
        'Herramientas para analizar, tomar decisiones y afrontar nuevas experiencias de aprendizaje.',
      ],
    ],
    summary:
      'Formación integral, pensamiento crítico y nuevos desafíos.',
  },
};

export const galleryData: GalleryItem[] = [
  {
    category: 'inicial',
    image: 'foto1.jpg',
    title: 'Presentación cultural',
    desc: 'Participación de niños en una presentación escolar.',
  },
  {
    category: 'primaria',
    image: 'foto12.jpg',
    title: 'Compartimos en comunidad',
    desc: 'Un encuentro de estudiantes en un espacio al aire libre.',
  },
  {
    category: 'secundaria',
    image: 'foto13.jpg',
    title: 'Expresiones de nuestra cultura',
    desc: 'Vestimenta y expresión artística en una actividad escolar.',
  },
  {
    category: 'inicial',
    image: 'foto2.jpg',
    title: 'Tradiciones que nos unen',
    desc: 'Una actividad cultural del archivo fotográfico de Inicial.',
  },
  {
    category: 'primaria',
    image: 'foto32.jpg',
    title: 'Arte y movimiento',
    desc: 'Presentación de danza en el patio del colegio.',
  },
  {
    category: 'secundaria',
    image: 'foto33.jpg',
    title: 'Vida escolar',
    desc: 'Estudiantes participando en una actividad colectiva.',
  },
  {
    category: 'inicial',
    image: 'foto3.jpg',
    title: 'Momentos para compartir',
    desc: 'Un encuentro de la comunidad del nivel Inicial.',
  },
  {
    category: 'primaria',
    image: 'foto22.jpg',
    title: 'Participación cívica',
    desc: 'Participación escolar en un desfile.',
  },
  {
    category: 'secundaria',
    image: 'foto42.jpg',
    title: 'Encuentros y celebraciones',
    desc: 'Un momento de convivencia del archivo de Secundaria.',
  },
];

const now = new Date();
const formatDate = (daysAhead: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
};

export const initialStudents: Student[] = [
  { id: 'E001', name: 'Ana Torres Mendoza', classroom: '5.º A · Primaria', active: 1 },
  { id: 'E002', name: 'Luis Rojas Vega', classroom: '5.º A · Primaria', active: 1 },
  { id: 'E003', name: 'Camila Díaz Flores', classroom: '1.º A · Secundaria', active: 1 },
];

export const initialUsers: User[] = [
  {
    username: 'admin',
    name: 'Coordinación académica',
    role: 'admin',
    student: null,
    password: 'Admin2026!',
  },
  {
    username: 'ana',
    name: 'Ana Torres Mendoza',
    role: 'student',
    student: 'E001',
    password: 'Alumno2026!',
  },
  {
    username: 'luis',
    name: 'Luis Rojas Vega',
    role: 'student',
    student: 'E002',
    password: 'Alumno2026!',
  },
  {
    username: 'camila',
    name: 'Camila Díaz Flores',
    role: 'student',
    student: 'E003',
    password: 'Alumno2026!',
  },
];

export const initialCourses: Course[] = [
  { id: 'C01', name: 'Matemática', teacher: 'Patricia García', classroom: '5.º A · Primaria', color: 'red' },
  { id: 'C02', name: 'Comunicación', teacher: 'Rosa Medina', classroom: '5.º A · Primaria', color: 'blue' },
  { id: 'C03', name: 'Ciencia y Tecnología', teacher: 'Jorge Flores', classroom: '5.º A · Primaria', color: 'green' },
  { id: 'C04', name: 'Personal Social', teacher: 'Lucía Salazar', classroom: '5.º A · Primaria', color: 'gold' },
  { id: 'C05', name: 'Inglés', teacher: 'Andrea Romero', classroom: '5.º A · Primaria', color: 'purple' },
  { id: 'C06', name: 'Arte y Cultura', teacher: 'Elena Ruiz', classroom: '5.º A · Primaria', color: 'orange' },
  { id: 'C07', name: 'Matemática', teacher: 'Carlos Soto', classroom: '1.º A · Secundaria', color: 'red' },
  { id: 'C08', name: 'Comunicación', teacher: 'Mónica Paredes', classroom: '1.º A · Secundaria', color: 'blue' },
];

export const initialSchedule: ScheduleBlock[] = [
  { id: 1, course: 'C01', day: 0, start: '08:00', end: '09:00', room: 'Aula 5A' },
  { id: 2, course: 'C02', day: 0, start: '09:00', end: '10:00', room: 'Aula 5A' },
  { id: 3, course: 'C03', day: 0, start: '10:00', end: '11:00', room: 'Aula 5A' },
  { id: 4, course: 'C04', day: 1, start: '08:00', end: '09:00', room: 'Aula 5A' },
  { id: 5, course: 'C05', day: 1, start: '09:00', end: '10:00', room: 'Aula 5A' },
  { id: 6, course: 'C01', day: 1, start: '10:00', end: '11:00', room: 'Aula 5A' },
  { id: 7, course: 'C02', day: 2, start: '08:00', end: '09:00', room: 'Aula 5A' },
  { id: 8, course: 'C03', day: 2, start: '09:00', end: '10:00', room: 'Aula 5A' },
  { id: 9, course: 'C06', day: 2, start: '10:00', end: '11:00', room: 'Aula 5A' },
  { id: 10, course: 'C01', day: 3, start: '08:00', end: '09:00', room: 'Aula 5A' },
  { id: 11, course: 'C04', day: 3, start: '09:00', end: '10:00', room: 'Aula 5A' },
  { id: 12, course: 'C05', day: 3, start: '10:00', end: '11:00', room: 'Aula 5A' },
  { id: 13, course: 'C03', day: 4, start: '08:00', end: '09:00', room: 'Aula 5A' },
  { id: 14, course: 'C02', day: 4, start: '09:00', end: '10:00', room: 'Aula 5A' },
  { id: 15, course: 'C06', day: 4, start: '10:00', end: '11:00', room: 'Aula 5A' },
  { id: 16, course: 'C07', day: 0, start: '08:00', end: '09:00', room: 'Aula 1A' },
  { id: 17, course: 'C08', day: 2, start: '08:00', end: '09:00', room: 'Aula 1A' },
  { id: 18, course: 'C07', day: 4, start: '08:00', end: '09:00', room: 'Aula 1A' },
];

export const initialGrades: Grade[] = [
  // E001 (Ana) Primaria
  { student: 'E001', course: 'C01', period: 3, assessment: 'Práctica 1', grade: 15, updated: '2026-10-11T10:00:00-05:00' },
  { student: 'E001', course: 'C01', period: 3, assessment: 'Proyecto', grade: 16, updated: '2026-10-11T10:00:00-05:00' },
  { student: 'E001', course: 'C02', period: 3, assessment: 'Práctica 1', grade: 16, updated: '2026-10-11T10:00:00-05:00' },
  { student: 'E001', course: 'C02', period: 3, assessment: 'Proyecto', grade: 17, updated: '2026-10-11T10:00:00-05:00' },
  { student: 'E001', course: 'C03', period: 3, assessment: 'Práctica 1', grade: 17, updated: '2026-10-11T10:00:00-05:00' },
  { student: 'E001', course: 'C03', period: 3, assessment: 'Proyecto', grade: 18, updated: '2026-10-11T10:00:00-05:00' },
  { student: 'E001', course: 'C04', period: 3, assessment: 'Práctica 1', grade: 18, updated: '2026-10-11T10:00:00-05:00' },
  { student: 'E001', course: 'C04', period: 3, assessment: 'Proyecto', grade: 19, updated: '2026-10-11T10:00:00-05:00' },
  { student: 'E001', course: 'C05', period: 3, assessment: 'Práctica 1', grade: 15, updated: '2026-10-11T10:00:00-05:00' },
  { student: 'E001', course: 'C05', period: 3, assessment: 'Proyecto', grade: 16, updated: '2026-10-11T10:00:00-05:00' },
  { student: 'E001', course: 'C06', period: 3, assessment: 'Práctica 1', grade: 16, updated: '2026-10-11T10:00:00-05:00' },
  { student: 'E001', course: 'C06', period: 3, assessment: 'Proyecto', grade: 17, updated: '2026-10-11T10:00:00-05:00' },
  // E002 (Luis) Primaria
  { student: 'E002', course: 'C01', period: 3, assessment: 'Práctica 1', grade: 16, updated: '2026-10-11T10:00:00-05:00' },
  { student: 'E002', course: 'C01', period: 3, assessment: 'Proyecto', grade: 17, updated: '2026-10-11T10:00:00-05:00' },
  // E003 (Camila) Secundaria
  { student: 'E003', course: 'C07', period: 3, assessment: 'Práctica 1', grade: 15, updated: '2026-10-11T10:00:00-05:00' },
  { student: 'E003', course: 'C07', period: 3, assessment: 'Proyecto', grade: 16, updated: '2026-10-11T10:00:00-05:00' },
  { student: 'E003', course: 'C08', period: 3, assessment: 'Práctica 1', grade: 16, updated: '2026-10-11T10:00:00-05:00' },
  { student: 'E003', course: 'C08', period: 3, assessment: 'Proyecto', grade: 17, updated: '2026-10-11T10:00:00-05:00' },
];

export const initialTasks: Task[] = [
  {
    id: 'T01',
    course: 'C01',
    title: 'Fracciones en la vida cotidiana',
    description: 'Resuelve tres situaciones con fracciones y explica el procedimiento que utilizaste.',
    due: formatDate(3),
  },
  {
    id: 'T02',
    course: 'C02',
    title: 'Leemos y compartimos',
    description: 'Lee un cuento de tu elección. Escribe un resumen y explica qué aprendiste del personaje principal.',
    due: formatDate(5),
  },
  {
    id: 'T03',
    course: 'C03',
    title: 'Nuestro pequeño ecosistema',
    description: 'Describe las condiciones que necesita una planta para crecer y propone un experimento sencillo.',
    due: formatDate(7),
  },
  {
    id: 'T04',
    course: 'C07',
    title: 'Números enteros',
    description: 'Plantea y resuelve cinco situaciones con números enteros.',
    due: formatDate(4),
  },
];

export const initialSubmissions: Submission[] = [];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'A01',
    title: 'Bienvenidos al aula virtual',
    body: 'Consulta tus cursos, organiza tus actividades y revisa tus calificaciones. Toda la información académica de este entorno es ficticia.',
    audience: 'Todos',
    created: '2026-10-11T09:00:00-05:00',
  },
  {
    id: 'A02',
    title: 'Lectura en familia',
    body: 'Esta semana te invitamos a compartir una lectura en casa y conversar sobre lo aprendido. Actividad de demostración.',
    audience: 'Primaria',
    created: '2026-10-11T09:00:00-05:00',
  },
  {
    id: 'A03',
    title: 'Organiza tu semana',
    body: 'Revisa tus actividades pendientes antes de comenzar la semana y prepara tus materiales de estudio.',
    audience: 'Todos',
    created: '2026-10-11T09:00:00-05:00',
  },
];

export const initialContacts: Contact[] = [
  {
    id: 'SM-DEMO01',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@ejemplo.com',
    phone: '987654321',
    topic: 'Primaria',
    message: 'Deseo solicitar información sobre el proceso de admisión para 5.º de primaria.',
    status: 'Pendiente',
    created: '2026-10-11T11:30:00-05:00',
  },
];

export const initialAudit: Audit[] = [
  {
    id: 1,
    actor: 'admin',
    action: 'Inicio del sistema',
    detail: 'Configuración inicial del año académico 2026',
    created: '2026-10-11T08:00:00-05:00',
  },
];

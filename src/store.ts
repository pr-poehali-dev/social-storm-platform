export interface VideoItem {
  id: number;
  title: string;
  subject: string;
  author: string;
  url: string;
  views: number;
  date: string;
  thumb: string;
}

export interface SubjectItem {
  id: number;
  name: string;
  icon: string;
}

export interface TaskItem {
  id: number;
  subject: string;
  task: string;
  due: string;
  priority: "high" | "medium" | "low";
}

export interface ChatMessage {
  id: number;
  author: string;
  role: string;
  email: string;
  text: string;
  time: string;
  isDonor: boolean;
}

export interface AppUser {
  name: string;
  role: string;
  email: string;
  isDonor: boolean;
}

export const DEFAULT_SUBJECTS: SubjectItem[] = [
  { id: 1, name: "Математика", icon: "📐" },
  { id: 2, name: "Русский язык", icon: "✏️" },
  { id: 3, name: "Физика", icon: "⚗️" },
  { id: 4, name: "История", icon: "📚" },
  { id: 5, name: "Химия", icon: "🧪" },
  { id: 6, name: "Биология", icon: "🌿" },
  { id: 7, name: "Английский", icon: "🌍" },
];

export const DEFAULT_VIDEOS: VideoItem[] = [];

export const DEFAULT_TASKS: TaskItem[] = [];

export const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    author: "Главный Администратор",
    role: "superadmin",
    email: "admin@groza.ru",
    text: "Добро пожаловать в «Социальную Грозу»! ⚡ Здесь вы можете общаться, учиться и развиваться.",
    time: "09:00",
    isDonor: false,
  },
  {
    id: 2,
    author: "Учитель Иванов",
    role: "admin",
    email: "teacher@groza.ru",
    text: "Привет всем! Сегодня загружаю новые видеоуроки по математике. Проверяйте раздел «Видео»!",
    time: "09:30",
    isDonor: false,
  },
];

export const ROLE_COLORS: Record<string, string> = {
  superadmin: "#ff6b1a",
  admin: "#3b82f6",
  student: "#22c55e",
  moderator: "#a855f7",
  donor: "#f59e0b",
  vip: "#06b6d4",
};

export const ROLE_LABELS: Record<string, string> = {
  superadmin: "Суперадмин",
  admin: "Администратор",
  student: "Ученик",
  moderator: "Модератор",
  donor: "Донатер",
  vip: "VIP",
};

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?#]+)/);
  return match ? match[1] : null;
}

export function getEmbedUrl(url: string): string | null {
  const ytId = getYouTubeId(url);
  if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`;
  if (url.includes("rutube.ru/video/")) {
    const match = url.match(/rutube\.ru\/video\/([a-zA-Z0-9]+)/);
    if (match) return `https://rutube.ru/play/embed/${match[1]}`;
  }
  if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) return url;
  return null;
}

export function getThumb(url: string): string | null {
  const ytId = getYouTubeId(url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
  return null;
}

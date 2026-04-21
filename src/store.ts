import { useState, useCallback } from "react";

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

export const DEFAULT_SUBJECTS: SubjectItem[] = [
  { id: 1, name: "Математика", icon: "📐" },
  { id: 2, name: "Русский язык", icon: "✏️" },
  { id: 3, name: "Физика", icon: "⚗️" },
  { id: 4, name: "История", icon: "📚" },
  { id: 5, name: "Химия", icon: "🧪" },
  { id: 6, name: "Биология", icon: "🌿" },
  { id: 7, name: "Английский", icon: "🌍" },
];

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 1,
    title: "Квадратные уравнения — полный разбор",
    subject: "Математика",
    author: "Учитель Иванов",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    views: 1247,
    date: "20 апр",
    thumb: "📐",
  },
  {
    id: 2,
    title: "Законы Ньютона в задачах",
    subject: "Физика",
    author: "Проф. Смирнов",
    url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    views: 893,
    date: "19 апр",
    thumb: "⚗️",
  },
  {
    id: 3,
    title: "Великая Отечественная война",
    subject: "История",
    author: "Учитель Козлов",
    url: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
    views: 2341,
    date: "18 апр",
    thumb: "📚",
  },
];

export const DEFAULT_TASKS: TaskItem[] = [
  { id: 1, subject: "Математика", task: "Параграф 15, задачи 1-10", due: "23 апр", priority: "high" },
  { id: 2, subject: "Русский язык", task: "Сочинение на тему «Весна»", due: "24 апр", priority: "medium" },
  { id: 3, subject: "Физика", task: "Лабораторная работа №3", due: "25 апр", priority: "high" },
  { id: 4, subject: "История", task: "Конспект главы 8", due: "26 апр", priority: "low" },
];

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?#]+)/);
  return match ? match[1] : null;
}

export function getEmbedUrl(url: string): string | null {
  const ytId = getYouTubeId(url);
  if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1`;
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

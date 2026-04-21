import { useState } from "react";
import Icon from "@/components/ui/icon";

const VIDEOS = [
  { id: 1, title: "Квадратные уравнения — полный разбор", subject: "Математика", author: "Учитель Иванов", duration: "24:15", views: 1247, thumb: "📐", date: "20 апр" },
  { id: 2, title: "Законы Ньютона в задачах", subject: "Физика", author: "Проф. Смирнов", duration: "31:08", views: 893, thumb: "⚗️", date: "19 апр" },
  { id: 3, title: "Великая Отечественная война", subject: "История", author: "Учитель Козлов", duration: "18:42", views: 2341, thumb: "📚", date: "18 апр" },
  { id: 4, title: "Синтаксис русского языка", subject: "Русский язык", author: "Учитель Петрова", duration: "22:55", views: 567, thumb: "✏️", date: "17 апр" },
  { id: 5, title: "Органическая химия: основы", subject: "Химия", author: "Проф. Быков", duration: "27:33", views: 445, thumb: "🧪", date: "16 апр" },
  { id: 6, title: "English Grammar: Tenses", subject: "Английский", author: "Ms. Williams", duration: "19:10", views: 1089, thumb: "🌍", date: "15 апр" },
];

const SUBJECTS = ["Все", "Математика", "Физика", "История", "Русский язык", "Химия", "Английский"];

interface VideosPageProps {
  user: { name: string; role: string };
}

export default function VideosPage({ user }: VideosPageProps) {
  const [filter, setFilter] = useState("Все");
  const [playing, setPlaying] = useState<number | null>(null);

  const isAdmin = user.role === "admin" || user.role === "superadmin";
  const filtered = filter === "Все" ? VIDEOS : VIDEOS.filter(v => v.subject === filter);

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in" style={{ background: '#0d0b09' }}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Видеоуроки</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">{VIDEOS.length} роликов доступно</p>
          </div>
          {isAdmin && (
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold font-body text-white transition-all hover:scale-105 active:scale-95 orange-glow" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)' }}>
              <Icon name="Upload" size={16} />
              Загрузить видео
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hidden">
          {SUBJECTS.map(subj => (
            <button
              key={subj}
              onClick={() => setFilter(subj)}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold font-body transition-all"
              style={filter === subj
                ? { background: 'linear-gradient(135deg, #ff6b1a, #cc4400)', color: '#fff' }
                : { background: 'rgba(255,107,26,0.08)', color: '#888', border: '1px solid rgba(255,107,26,0.12)' }
              }
            >
              {subj}
            </button>
          ))}
        </div>

        {playing !== null && (
          <div className="glass-card rounded-2xl overflow-hidden animate-scale-in">
            <div className="relative" style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #1a0d05, #2d1508)' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="text-6xl animate-float">{VIDEOS.find(v => v.id === playing)?.thumb}</div>
                <p className="font-display text-xl font-bold text-white text-center px-8">{VIDEOS.find(v => v.id === playing)?.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)' }}>
                    <Icon name="Pause" size={24} className="text-white" />
                  </button>
                </div>
              </div>
              <button onClick={() => setPlaying(null)} className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <Icon name="X" size={16} className="text-white" />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="h-2 rounded-full mb-2" style={{ background: 'rgba(255,107,26,0.1)' }}>
                <div className="h-full w-[35%] rounded-full" style={{ background: 'linear-gradient(90deg, #ff6b1a, #ff9545)' }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground font-body">
                <span>8:27</span>
                <span>{VIDEOS.find(v => v.id === playing)?.duration}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((video, i) => (
            <div key={video.id} className="glass-card glass-card-hover rounded-2xl overflow-hidden group cursor-pointer animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }} onClick={() => setPlaying(video.id)}>
              <div className="relative flex items-center justify-center" style={{ height: '160px', background: 'linear-gradient(135deg, #1a0d05, #2d1508)' }}>
                <div className="text-5xl group-hover:scale-110 transition-transform">{video.thumb}</div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.4)' }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center orange-glow" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)' }}>
                    <Icon name="Play" size={22} className="text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg text-xs font-body font-semibold" style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
                  {video.duration}
                </div>
                <div className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-body font-semibold" style={{ background: 'rgba(255,107,26,0.25)', color: '#ff9545', backdropFilter: 'blur(4px)' }}>
                  {video.subject}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display text-base font-semibold text-white mb-1 leading-tight">{video.title}</h3>
                <p className="text-xs text-muted-foreground font-body mb-3">{video.author}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground font-body">
                  <div className="flex items-center gap-1">
                    <Icon name="Eye" size={12} />
                    <span>{video.views.toLocaleString()}</span>
                  </div>
                  <span>{video.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

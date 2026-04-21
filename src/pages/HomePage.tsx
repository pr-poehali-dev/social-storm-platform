import Icon from "@/components/ui/icon";
import { type AppUser } from "@/store";

interface HomePageProps {
  user: AppUser;
  onNavigate: (page: string) => void;
}

const STATS = [
  { label: "Учеников", value: "1,247", icon: "Users" },
  { label: "Уроков", value: "3,890", icon: "BookOpen" },
  { label: "Видеоуроков", value: "842", icon: "Play" },
  { label: "Рейтинг", value: "TOP 1", icon: "Trophy" },
];

const FEATURES = [
  {
    icon: "BookOpen",
    title: "Электронный дневник",
    desc: "Оценки, задания и расписание в одном месте",
    page: "diary",
    badge: "Новые оценки",
  },
  {
    icon: "MessageSquare",
    title: "Чат платформы",
    desc: "Общайтесь с администраторами и учителями",
    page: "chat",
    badge: null,
  },
  {
    icon: "Play",
    title: "Видеоуроки",
    desc: "Обучающие ролики от лучших преподавателей",
    page: "videos",
    badge: "5 новых",
  },
  {
    icon: "User",
    title: "Мой профиль",
    desc: "Статистика, достижения и настройки",
    page: "profile",
    badge: null,
  },
];

const NEWS = [
  { date: "21 апр", title: "Добавлены новые видеоуроки по математике", type: "video" },
  { date: "20 апр", title: "Расписание на следующую неделю обновлено", type: "schedule" },
  { date: "19 апр", title: "Новые задания по русскому языку", type: "task" },
  { date: "18 апр", title: "Платформа обновлена до версии 2.0", type: "system" },
];

export default function HomePage({ user, onNavigate }: HomePageProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in" style={{ background: '#0d0b09' }}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="relative rounded-3xl overflow-hidden p-8 md:p-12" style={{ background: 'linear-gradient(135deg, #1a0d05 0%, #2d1508 40%, #1a0d05 100%)', border: '1px solid rgba(255,107,26,0.2)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, #ff6b1a, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle at bottom left, #ff9545, transparent 70%)' }} />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-muted-foreground font-body text-sm mb-1">{greeting},</p>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-2" style={{ color: '#fff' }}>
                {user.name.split(" ")[0]}
                <span className="gradient-text"> ⚡</span>
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-xs font-body px-3 py-1 rounded-full font-semibold" style={{ background: 'rgba(255,107,26,0.2)', color: '#ff9545', border: '1px solid rgba(255,107,26,0.3)' }}>
                  {user.role === "superadmin" ? "Суперадмин" : user.role === "admin" ? "Администратор" : "Ученик"}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-6xl font-bold gradient-text text-glow">SG</div>
              <div className="text-xs text-muted-foreground font-body mt-1">Социальная Гроза</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <div key={i} className="glass-card glass-card-hover rounded-2xl p-5 text-center" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3" style={{ background: 'rgba(255,107,26,0.15)' }}>
                <Icon name={s.icon as "Users"} size={18} className="text-orange-400" />
              </div>
              <div className="font-display text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-muted-foreground font-body mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-display text-2xl font-semibold text-white mb-4">Разделы платформы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <button
                key={i}
                onClick={() => onNavigate(f.page)}
                className="glass-card glass-card-hover rounded-2xl p-6 text-left group flex items-center gap-5 animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110" style={{ background: 'linear-gradient(135deg, rgba(255,107,26,0.2), rgba(204,68,0,0.1))', border: '1px solid rgba(255,107,26,0.2)' }}>
                  <Icon name={f.icon as "BookOpen"} size={24} className="text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-lg font-semibold text-white">{f.title}</span>
                    {f.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-body font-semibold" style={{ background: 'rgba(255,107,26,0.2)', color: '#ff9545' }}>{f.badge}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-body">{f.desc}</p>
                </div>
                <Icon name="ChevronRight" size={18} className="text-muted-foreground group-hover:text-orange-400 transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-semibold text-white mb-4">Последние новости</h2>
          <div className="glass-card rounded-2xl overflow-hidden">
            {NEWS.map((n, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-orange-500/5 transition-colors" style={{ borderBottom: i < NEWS.length - 1 ? '1px solid rgba(255,107,26,0.08)' : 'none' }}>
                <span className="text-xs font-body text-muted-foreground w-16 flex-shrink-0">{n.date}</span>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#ff6b1a' }} />
                <span className="text-sm font-body text-foreground/80">{n.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
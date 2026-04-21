import Icon from "@/components/ui/icon";
import { ROLE_COLORS, ROLE_LABELS, type AppUser } from "@/store";

interface ProfilePageProps {
  user: AppUser;
}

const ACHIEVEMENTS = [
  { icon: "⭐", title: "Первый вход", desc: "Добро пожаловать!", unlocked: true },
  { icon: "🔥", title: "Стрик 7 дней", desc: "Заходи 7 дней подряд", unlocked: true },
  { icon: "💬", title: "Общительный", desc: "Напиши 10 сообщений", unlocked: false },
  { icon: "🎯", title: "Первое задание", desc: "Выполни задание", unlocked: false },
  { icon: "🏆", title: "ТОП-3", desc: "Войди в рейтинг", unlocked: false },
  { icon: "💎", title: "Донатер", desc: "Поддержи платформу", unlocked: false },
];

const SETTINGS = [
  { icon: "Bell", label: "Уведомления", desc: "Настройка оповещений" },
  { icon: "Lock", label: "Безопасность", desc: "Смена пароля" },
  { icon: "Palette", label: "Оформление", desc: "Тема и внешний вид" },
  { icon: "HelpCircle", label: "Поддержка", desc: "Связаться с администрацией" },
];

export default function ProfilePage({ user }: ProfilePageProps) {
  const isAdmin = user.role === "admin" || user.role === "superadmin";
  const roleColor = ROLE_COLORS[user.role] ?? "#ff6b1a";

  const achievements = ACHIEVEMENTS.map(a =>
    a.icon === "💎" ? { ...a, unlocked: user.isDonor } : a
  );

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in" style={{ background: '#0a0806' }}>
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Hero card */}
        <div className="relative rounded-3xl overflow-hidden p-7" style={{ background: 'linear-gradient(135deg, #130e06, #1e1408)', border: '1px solid rgba(255,107,26,0.15)' }}>
          {/* BG glow */}
          <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${roleColor}20, transparent 70%)` }} />

          <div className="relative z-10 flex items-start gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display text-4xl font-bold"
                style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`, boxShadow: `0 0 30px ${roleColor}40`, color: '#fff' }}>
                {user.name[0]}
              </div>
              {user.isDonor && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background: 'linear-gradient(135deg, #f59e0b, #b45309)', boxShadow: '0 4px 12px rgba(245,158,11,0.4)' }}>💎</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">{user.name}</h1>
              <p className="font-body text-sm mb-3" style={{ color: '#5a4a3a' }}>{user.email}</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-body font-semibold"
                  style={{ background: `${roleColor}15`, color: roleColor, border: `1px solid ${roleColor}30` }}>
                  {isAdmin ? "⚡" : "👤"} {ROLE_LABELS[user.role] ?? user.role}
                </span>
                {user.isDonor && (
                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-body font-semibold"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                    💎 Донатер
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Дней на платформе", value: "1" },
              { label: "Видео просмотрено", value: "0" },
              { label: "Сообщений в чате", value: "0" },
              { label: "Заданий выполнено", value: "0" },
            ].map((s, i) => (
              <div key={i} className="text-center py-3 px-2 rounded-2xl" style={{ background: 'rgba(255,107,26,0.06)', border: '1px solid rgba(255,107,26,0.08)' }}>
                <div className="font-display text-xl font-bold mb-0.5" style={{ background: 'linear-gradient(135deg, #ff6b1a, #ffaa55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                <div className="text-xs font-body" style={{ color: '#5a4a3a' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="font-display text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Icon name="Award" size={18} style={{ color: '#ff6b1a' }} />
            Достижения
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.map((a, i) => (
              <div key={i} className="rounded-2xl p-4 text-center transition-all"
                style={{
                  background: a.unlocked ? 'rgba(255,107,26,0.07)' : 'rgba(255,107,26,0.02)',
                  border: `1px solid ${a.unlocked ? 'rgba(255,107,26,0.2)' : 'rgba(255,107,26,0.06)'}`,
                  opacity: a.unlocked ? 1 : 0.4,
                }}>
                <div className="text-3xl mb-2">{a.icon}</div>
                <div className="font-display text-sm font-semibold text-white mb-1">{a.title}</div>
                <div className="text-xs font-body" style={{ color: '#5a4a3a' }}>{a.desc}</div>
                {a.unlocked && <div className="mt-2 text-xs font-body" style={{ color: '#22c55e' }}>✓ Получено</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-3xl overflow-hidden" style={{ background: '#0d0b08', border: '1px solid rgba(255,107,26,0.1)' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,107,26,0.08)' }}>
            <h2 className="font-display text-base font-semibold text-white">Настройки</h2>
          </div>
          {SETTINGS.map((item, i) => (
            <button key={i} className="w-full flex items-center gap-4 px-6 py-4 text-left transition-all"
              style={{ borderBottom: i < SETTINGS.length - 1 ? '1px solid rgba(255,107,26,0.06)' : 'none' }}
              onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,107,26,0.04)')}
              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,107,26,0.08)' }}>
                <Icon name={item.icon as "Bell"} size={16} style={{ color: '#ff6b1a' }} />
              </div>
              <div className="flex-1">
                <div className="font-body text-sm font-semibold text-white">{item.label}</div>
                <div className="text-xs font-body" style={{ color: '#5a4a3a' }}>{item.desc}</div>
              </div>
              <Icon name="ChevronRight" size={15} style={{ color: '#3a3028' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

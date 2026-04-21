import Icon from "@/components/ui/icon";

interface ProfilePageProps {
  user: { name: string; role: string; email: string };
}

const ACHIEVEMENTS = [
  { icon: "⭐", title: "Отличник", desc: "Средний балл 5.0", unlocked: true },
  { icon: "🔥", title: "Стрик 7 дней", desc: "Заходил 7 дней подряд", unlocked: true },
  { icon: "💬", title: "Общительный", desc: "100+ сообщений в чате", unlocked: true },
  { icon: "🎯", title: "Первое задание", desc: "Выполнил задание", unlocked: true },
  { icon: "🏆", title: "ТОП-10", desc: "В рейтинге учеников", unlocked: false },
  { icon: "💎", title: "Донатер", desc: "Поддержал платформу", unlocked: false },
];

const STATS = [
  { label: "Дней на платформе", value: "142" },
  { label: "Выполнено заданий", value: "89" },
  { label: "Сообщений", value: "234" },
  { label: "Просмотрено видео", value: "47" },
];

const ROLE_BADGES = [
  { name: "Ученик", color: "#22c55e", active: true },
];

export default function ProfilePage({ user }: ProfilePageProps) {
  const isAdmin = user.role === "admin" || user.role === "superadmin";
  const isDonor = false;

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in" style={{ background: '#0d0b09' }}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="relative rounded-3xl overflow-hidden p-8" style={{ background: 'linear-gradient(135deg, #1a0d05 0%, #2d1508 60%, #1a0d05 100%)', border: '1px solid rgba(255,107,26,0.2)' }}>
          <div className="absolute top-0 right-0 w-56 h-56 opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, #ff6b1a, transparent)' }} />

          <div className="flex items-start gap-6 relative z-10">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display text-3xl font-bold orange-glow" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)', color: '#fff' }}>
                {user.name[0]}
              </div>
              {isDonor && (
                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: '#f59e0b' }}>💎</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-display text-3xl font-bold text-white mb-1">{user.name}</h1>
              <p className="text-muted-foreground font-body text-sm mb-3">{user.email}</p>
              <div className="flex flex-wrap gap-2">
                {isAdmin && (
                  <span className="text-xs px-3 py-1 rounded-full font-body font-semibold" style={{ background: 'rgba(255,107,26,0.2)', color: '#ff9545', border: '1px solid rgba(255,107,26,0.3)' }}>
                    ⚡ {user.role === "superadmin" ? "Суперадмин" : "Администратор"}
                  </span>
                )}
                <span className="text-xs px-3 py-1 rounded-full font-body font-semibold" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
                  Ученик
                </span>
                {isDonor && (
                  <span className="text-xs px-3 py-1 rounded-full font-body font-semibold" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                    💎 Донатер
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {STATS.map((s, i) => (
              <div key={i} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,107,26,0.08)' }}>
                <div className="font-display text-xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-muted-foreground font-body mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Icon name="Award" size={20} className="text-orange-400" />
            Достижения
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 text-center transition-all" style={{ opacity: a.unlocked ? 1 : 0.35 }}>
                <div className="text-3xl mb-2">{a.icon}</div>
                <div className="font-display text-sm font-semibold text-white mb-1">{a.title}</div>
                <div className="text-xs text-muted-foreground font-body">{a.desc}</div>
                {!a.unlocked && (
                  <div className="mt-2 text-xs font-body" style={{ color: 'rgba(255,107,26,0.5)' }}>Не получено</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,107,26,0.1)' }}>
            <h2 className="font-display text-xl font-semibold text-white">Настройки профиля</h2>
          </div>
          {[
            { icon: "Bell", label: "Уведомления", desc: "Настройка оповещений" },
            { icon: "Lock", label: "Безопасность", desc: "Пароль и двухфакторка" },
            { icon: "Palette", label: "Оформление", desc: "Тема и внешний вид" },
            { icon: "HelpCircle", label: "Поддержка", desc: "Связаться с администрацией" },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-orange-500/5 transition-colors text-left" style={{ borderBottom: i < 3 ? '1px solid rgba(255,107,26,0.06)' : 'none' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,107,26,0.1)' }}>
                <Icon name={item.icon as "Bell"} size={16} className="text-orange-400" />
              </div>
              <div className="flex-1">
                <div className="font-body text-sm font-semibold text-white">{item.label}</div>
                <div className="text-xs text-muted-foreground font-body">{item.desc}</div>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

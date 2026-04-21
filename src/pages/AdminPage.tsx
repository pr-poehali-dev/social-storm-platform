import { useState } from "react";
import Icon from "@/components/ui/icon";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  warnings: number;
  blocked: boolean;
  donor: boolean;
  avatar: string;
}

const INITIAL_USERS: User[] = [
  { id: 1, name: "Ученик Петров", email: "student@groza.ru", role: "student", warnings: 0, blocked: false, donor: false, avatar: "П" },
  { id: 2, name: "Ученица Сидорова", email: "sidorova@groza.ru", role: "student", warnings: 1, blocked: false, donor: true, avatar: "С" },
  { id: 3, name: "Ученик Козлов", email: "kozlov@groza.ru", role: "student", warnings: 2, blocked: false, donor: false, avatar: "К" },
  { id: 4, name: "Модератор Тихонов", email: "moderator@groza.ru", role: "moderator", warnings: 0, blocked: false, donor: false, avatar: "Т" },
  { id: 5, name: "Ученик Орлов", email: "orlov@groza.ru", role: "student", warnings: 3, blocked: true, donor: false, avatar: "О" },
];

const ROLES = ["student", "moderator", "admin", "donor", "vip"];
const ROLE_LABELS: Record<string, string> = {
  student: "Ученик", moderator: "Модератор", admin: "Администратор", donor: "Донатер", vip: "VIP",
};
const ROLE_COLORS: Record<string, string> = {
  student: "#22c55e", moderator: "#a855f7", admin: "#ff6b1a", donor: "#f59e0b", vip: "#06b6d4",
};

interface AdminPageProps {
  user: { name: string; role: string };
}

export default function AdminPage({ user }: AdminPageProps) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [activeTab, setActiveTab] = useState<"users" | "grades" | "videos">("users");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [toast, setToast] = useState("");
  const [newGrade, setNewGrade] = useState({ student: "", subject: "", grade: "5" });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const addWarning = (id: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      const warnings = u.warnings + 1;
      const blocked = warnings >= 3;
      showToast(blocked ? `${u.name} заблокирован (3 предупреждения)` : `Предупреждение выдано: ${u.name} (${warnings}/3)`);
      return { ...u, warnings, blocked };
    }));
  };

  const toggleBlock = (id: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      const blocked = !u.blocked;
      showToast(blocked ? `${u.name} заблокирован` : `${u.name} разблокирован`);
      return { ...u, blocked };
    }));
  };

  const toggleDonor = (id: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      const donor = !u.donor;
      showToast(donor ? `💎 Донат выдан: ${u.name}` : `Донат снят: ${u.name}`);
      return { ...u, donor };
    }));
  };

  const changeRole = (id: number, role: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      showToast(`Роль изменена: ${u.name} → ${ROLE_LABELS[role]}`);
      return { ...u, role };
    }));
  };

  const tabs = [
    { id: "users", label: "Пользователи", icon: "Users" },
    { id: "grades", label: "Выставить оценки", icon: "Star" },
    { id: "videos", label: "Управление видео", icon: "Video" },
  ] as const;

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in" style={{ background: '#0d0b09' }}>
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl font-body text-sm text-white animate-slide-in-right" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)', boxShadow: '0 8px 32px rgba(255,107,26,0.4)' }}>
          {toast}
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-2xl">⚡</span> Админ-панель
            </h1>
            <p className="text-muted-foreground font-body text-sm mt-1">Управление платформой «Социальная Гроза»</p>
          </div>
          <div className="glass-card rounded-2xl px-4 py-2 text-center">
            <div className="font-display text-xl font-bold gradient-text">{users.length}</div>
            <div className="text-xs text-muted-foreground font-body">Пользователей</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Активных", value: users.filter(u => !u.blocked).length, color: "#22c55e", icon: "UserCheck" },
            { label: "Заблокированных", value: users.filter(u => u.blocked).length, color: "#ef4444", icon: "UserX" },
            { label: "Донатеров", value: users.filter(u => u.donor).length, color: "#f59e0b", icon: "Heart" },
          ].map((s, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 text-center">
              <Icon name={s.icon as "UserCheck"} size={20} className="mx-auto mb-2" style={{ color: s.color }} />
              <div className="font-display text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-muted-foreground font-body">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 p-1 rounded-2xl" style={{ background: 'rgba(255,107,26,0.06)', border: '1px solid rgba(255,107,26,0.1)' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs md:text-sm font-semibold font-body transition-all"
              style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #ff6b1a, #cc4400)', color: '#fff' } : { color: '#888' }}
            >
              <Icon name={tab.icon as "Users"} size={14} />
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {activeTab === "users" && (
          <div className="space-y-3 animate-fade-in">
            {users.map((u, i) => (
              <div key={u.id} className="glass-card rounded-2xl p-5 animate-fade-in" style={{ animationDelay: `${i * 0.05}s`, opacity: u.blocked ? 0.7 : 1 }}>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center font-display text-lg font-bold" style={{ background: `${ROLE_COLORS[u.role]}22`, color: ROLE_COLORS[u.role], border: `1px solid ${ROLE_COLORS[u.role]}44` }}>
                      {u.avatar}
                    </div>
                    {u.blocked && <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#ef4444' }}><Icon name="Lock" size={8} className="text-white" /></div>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display text-base font-semibold text-white">{u.name}</span>
                      {u.donor && <span className="text-xs">💎</span>}
                      {u.blocked && <span className="text-xs px-2 py-0.5 rounded-full font-body" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>Заблокирован</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground font-body">{u.email}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-body font-semibold" style={{ background: `${ROLE_COLORS[u.role]}15`, color: ROLE_COLORS[u.role] }}>
                        {ROLE_LABELS[u.role]}
                      </span>
                      {u.warnings > 0 && (
                        <span className="text-xs flex items-center gap-1 font-body" style={{ color: u.warnings >= 2 ? '#ef4444' : '#f59e0b' }}>
                          <Icon name="AlertTriangle" size={11} />
                          {u.warnings}/3 предупрежд.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={u.role}
                      onChange={e => changeRole(u.id, e.target.value)}
                      className="text-xs px-2 py-1.5 rounded-lg font-body outline-none cursor-pointer"
                      style={{ background: 'rgba(255,107,26,0.1)', border: '1px solid rgba(255,107,26,0.2)', color: '#ff9545' }}
                    >
                      {ROLES.map(r => <option key={r} value={r} style={{ background: '#1a0d05' }}>{ROLE_LABELS[r]}</option>)}
                    </select>

                    <button onClick={() => toggleDonor(u.id)} title={u.donor ? "Убрать донат" : "Выдать донат"}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all hover:scale-110"
                      style={{ background: u.donor ? 'rgba(245,158,11,0.2)' : 'rgba(255,107,26,0.08)', border: `1px solid ${u.donor ? 'rgba(245,158,11,0.4)' : 'rgba(255,107,26,0.15)'}` }}>
                      💎
                    </button>

                    <button onClick={() => addWarning(u.id)} disabled={u.blocked} title="Выдать предупреждение"
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <Icon name="AlertTriangle" size={14} style={{ color: '#f59e0b' }} />
                    </button>

                    <button onClick={() => toggleBlock(u.id)} title={u.blocked ? "Разблокировать" : "Заблокировать"}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: u.blocked ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${u.blocked ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                      <Icon name={u.blocked ? "Unlock" : "Lock"} size={14} style={{ color: u.blocked ? '#22c55e' : '#ef4444' }} />
                    </button>
                  </div>
                </div>

                {u.warnings > 0 && (
                  <div className="mt-3 flex gap-1.5">
                    {[1, 2, 3].map(n => (
                      <div key={n} className="h-1.5 flex-1 rounded-full" style={{ background: n <= u.warnings ? (n === 3 ? '#ef4444' : '#f59e0b') : 'rgba(255,255,255,0.1)' }} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "grades" && (
          <div className="glass-card rounded-2xl p-6 animate-fade-in space-y-5">
            <h3 className="font-display text-xl font-semibold text-white">Выставить оценку</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block font-body uppercase tracking-wider">Ученик</label>
                <select value={newGrade.student} onChange={e => setNewGrade(p => ({ ...p, student: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none"
                  style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.2)', color: newGrade.student ? '#fff' : '#666' }}>
                  <option value="" style={{ background: '#1a0d05' }}>Выберите ученика</option>
                  {users.filter(u => u.role === "student").map(u => <option key={u.id} value={u.name} style={{ background: '#1a0d05' }}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block font-body uppercase tracking-wider">Предмет</label>
                <select value={newGrade.subject} onChange={e => setNewGrade(p => ({ ...p, subject: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none"
                  style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.2)', color: newGrade.subject ? '#fff' : '#666' }}>
                  <option value="" style={{ background: '#1a0d05' }}>Выберите предмет</option>
                  {["Математика", "Русский язык", "Физика", "История", "Химия", "Биология", "Английский"].map(s => <option key={s} value={s} style={{ background: '#1a0d05' }}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block font-body uppercase tracking-wider">Оценка</label>
                <div className="flex gap-2">
                  {[5, 4, 3, 2, 1].map(g => (
                    <button key={g} onClick={() => setNewGrade(p => ({ ...p, grade: String(g) }))}
                      className="flex-1 py-3 rounded-xl font-display text-lg font-bold transition-all hover:scale-105"
                      style={{
                        background: newGrade.grade === String(g) ? (g >= 4 ? '#22c55e' : g === 3 ? '#f59e0b' : '#ef4444') : 'rgba(255,107,26,0.08)',
                        color: newGrade.grade === String(g) ? '#fff' : '#888',
                        border: '1px solid rgba(255,107,26,0.15)'
                      }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                if (newGrade.student && newGrade.subject) {
                  showToast(`✅ Оценка ${newGrade.grade} выставлена: ${newGrade.student} — ${newGrade.subject}`);
                  setNewGrade({ student: "", subject: "", grade: "5" });
                } else {
                  showToast("Выберите ученика и предмет");
                }
              }}
              className="w-full py-3 rounded-xl font-display font-semibold text-white tracking-wide transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)' }}
            >
              ВЫСТАВИТЬ ОЦЕНКУ
            </button>
          </div>
        )}

        {activeTab === "videos" && (
          <div className="glass-card rounded-2xl p-6 animate-fade-in space-y-5">
            <h3 className="font-display text-xl font-semibold text-white">Загрузка видеоролика</h3>
            <div className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer hover:border-orange-500 transition-colors" style={{ borderColor: 'rgba(255,107,26,0.25)' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,107,26,0.1)' }}>
                <Icon name="Upload" size={28} className="text-orange-400" />
              </div>
              <p className="font-display text-base font-semibold text-white mb-1">Перетащите видео или нажмите</p>
              <p className="text-sm text-muted-foreground font-body">MP4, AVI, MOV до 500 МБ</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Название ролика" className="px-4 py-3 rounded-xl text-sm font-body outline-none" style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.2)', color: '#fff' }} />
              <select className="px-4 py-3 rounded-xl text-sm font-body outline-none" style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.2)', color: '#888' }}>
                <option value="" style={{ background: '#1a0d05' }}>Выберите предмет</option>
                {["Математика", "Физика", "История", "Химия"].map(s => <option key={s} value={s} style={{ background: '#1a0d05' }}>{s}</option>)}
              </select>
            </div>
            <button className="w-full py-3 rounded-xl font-display font-semibold text-white tracking-wide" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)' }}>
              ОПУБЛИКОВАТЬ ВИДЕО
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

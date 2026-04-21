import { useState } from "react";
import Icon from "@/components/ui/icon";
import { DEFAULT_SUBJECTS, DEFAULT_VIDEOS, DEFAULT_TASKS, getEmbedUrl, type VideoItem, type SubjectItem, type TaskItem } from "@/store";

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
const PRIORITY_LABELS: Record<string, string> = { high: "Срочно", medium: "Средний", low: "Обычный" };
const PRIORITY_COLORS: Record<string, string> = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };

interface AdminPageProps {
  user: { name: string; role: string };
  videos: VideoItem[];
  setVideos: React.Dispatch<React.SetStateAction<VideoItem[]>>;
  subjects: SubjectItem[];
  setSubjects: React.Dispatch<React.SetStateAction<SubjectItem[]>>;
  tasks: TaskItem[];
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
}

export default function AdminPage({ user, videos, setVideos, subjects, setSubjects, tasks, setTasks }: AdminPageProps) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [activeTab, setActiveTab] = useState<"users" | "grades" | "subjects" | "videos">("users");
  const [toast, setToast] = useState("");
  const [newGrade, setNewGrade] = useState({ student: "", subject: "", grade: "5" });

  const [newVideo, setNewVideo] = useState({ title: "", subject: "", author: "", url: "" });
  const [videoError, setVideoError] = useState("");
  const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null);

  const [newSubject, setNewSubject] = useState({ name: "", icon: "📖" });
  const [newTask, setNewTask] = useState({ subject: "", task: "", due: "", priority: "medium" as "high" | "medium" | "low" });

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

  const handleAddVideo = () => {
    setVideoError("");
    if (!newVideo.title.trim()) { setVideoError("Введите название ролика"); return; }
    if (!newVideo.subject) { setVideoError("Выберите предмет"); return; }
    if (!newVideo.url.trim()) { setVideoError("Вставьте ссылку на видео"); return; }
    const embed = getEmbedUrl(newVideo.url);
    if (!embed) { setVideoError("Неверная ссылка. Поддерживаются YouTube, RuTube, mp4"); return; }
    const now = new Date();
    const date = `${now.getDate()} ${["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"][now.getMonth()]}`;
    const subj = subjects.find(s => s.name === newVideo.subject);
    setVideos(prev => [...prev, {
      id: Date.now(),
      title: newVideo.title.trim(),
      subject: newVideo.subject,
      author: newVideo.author.trim() || user.name,
      url: newVideo.url.trim(),
      views: 0,
      date,
      thumb: subj?.icon || "🎬",
    }]);
    setNewVideo({ title: "", subject: "", author: "", url: "" });
    showToast("✅ Видео опубликовано!");
  };

  const handleDeleteVideo = (id: number) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    showToast("Видео удалено");
  };

  const handleAddSubject = () => {
    if (!newSubject.name.trim()) return;
    if (subjects.find(s => s.name.toLowerCase() === newSubject.name.toLowerCase())) {
      showToast("Такой предмет уже есть"); return;
    }
    setSubjects(prev => [...prev, { id: Date.now(), name: newSubject.name.trim(), icon: newSubject.icon }]);
    setNewSubject({ name: "", icon: "📖" });
    showToast(`✅ Предмет «${newSubject.name}» добавлен`);
  };

  const handleDeleteSubject = (id: number) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    showToast("Предмет удалён");
  };

  const handleAddTask = () => {
    if (!newTask.subject || !newTask.task.trim() || !newTask.due.trim()) {
      showToast("Заполните все поля задания"); return;
    }
    setTasks(prev => [...prev, { id: Date.now(), ...newTask }]);
    setNewTask({ subject: "", task: "", due: "", priority: "medium" });
    showToast("✅ Задание добавлено");
  };

  const handleDeleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast("Задание удалено");
  };

  const tabs = [
    { id: "users", label: "Пользователи", icon: "Users" },
    { id: "grades", label: "Оценки", icon: "Star" },
    { id: "subjects", label: "Предметы и задания", icon: "BookOpen" },
    { id: "videos", label: "Видео", icon: "Video" },
  ] as const;

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in" style={{ background: '#0d0b09' }}>
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl font-body text-sm text-white animate-slide-in-right" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)', boxShadow: '0 8px 32px rgba(255,107,26,0.4)' }}>
          {toast}
        </div>
      )}

      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-3xl animate-scale-in rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,107,26,0.2)' }}>
            <div className="flex items-center justify-between px-5 py-3" style={{ background: '#131110' }}>
              <span className="font-display text-base font-semibold text-white truncate">{previewVideo.title}</span>
              <button onClick={() => setPreviewVideo(null)} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ml-3 text-muted-foreground hover:text-white transition-colors" style={{ background: 'rgba(255,107,26,0.1)' }}>
                <Icon name="X" size={16} />
              </button>
            </div>
            {(() => {
              const embed = getEmbedUrl(previewVideo.url);
              if (embed && (embed.includes("youtube.com/embed") || embed.includes("rutube.ru/play/embed"))) {
                return (
                  <iframe
                    src={embed}
                    className="w-full"
                    style={{ aspectRatio: '16/9', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                );
              }
              if (embed) {
                return <video src={embed} controls autoPlay className="w-full" style={{ aspectRatio: '16/9', background: '#000' }} />;
              }
              return <div className="flex items-center justify-center text-muted-foreground font-body" style={{ aspectRatio: '16/9' }}>Не удалось загрузить видео</div>;
            })()}
          </div>
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

        <div className="flex gap-1.5 p-1 rounded-2xl overflow-x-auto scrollbar-hidden" style={{ background: 'rgba(255,107,26,0.06)', border: '1px solid rgba(255,107,26,0.1)' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-shrink-0 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs md:text-sm font-semibold font-body transition-all"
              style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #ff6b1a, #cc4400)', color: '#fff' } : { color: '#888' }}
            >
              <Icon name={tab.icon as "Users"} size={14} />
              {tab.label}
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
                    <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                      className="text-xs px-2 py-1.5 rounded-lg font-body outline-none cursor-pointer"
                      style={{ background: 'rgba(255,107,26,0.1)', border: '1px solid rgba(255,107,26,0.2)', color: '#ff9545' }}>
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
                  {subjects.map(s => <option key={s.id} value={s.name} style={{ background: '#1a0d05' }}>{s.icon} {s.name}</option>)}
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
            <button onClick={() => {
              if (newGrade.student && newGrade.subject) {
                showToast(`✅ Оценка ${newGrade.grade} → ${newGrade.student} — ${newGrade.subject}`);
                setNewGrade({ student: "", subject: "", grade: "5" });
              } else { showToast("Выберите ученика и предмет"); }
            }} className="w-full py-3 rounded-xl font-display font-semibold text-white tracking-wide transition-all hover:scale-[1.01]" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)' }}>
              ВЫСТАВИТЬ ОЦЕНКУ
            </button>
          </div>
        )}

        {activeTab === "subjects" && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="font-display text-xl font-semibold text-white flex items-center gap-2">
                <Icon name="BookOpen" size={18} className="text-orange-400" /> Добавить предмет
              </h3>
              <div className="flex gap-3">
                <input
                  value={newSubject.icon}
                  onChange={e => setNewSubject(p => ({ ...p, icon: e.target.value }))}
                  placeholder="📖"
                  className="w-16 px-3 py-3 rounded-xl text-center text-xl font-body outline-none"
                  style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.2)', color: '#fff' }}
                  maxLength={2}
                />
                <input
                  value={newSubject.name}
                  onChange={e => setNewSubject(p => ({ ...p, name: e.target.value }))}
                  placeholder="Название предмета"
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-body outline-none"
                  style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.2)', color: '#fff' }}
                  onKeyDown={e => e.key === "Enter" && handleAddSubject()}
                  onFocus={e => e.target.style.borderColor = '#ff6b1a'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,107,26,0.2)'}
                />
                <button onClick={handleAddSubject} className="px-5 py-3 rounded-xl font-display font-semibold text-white text-sm transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)' }}>
                  <Icon name="Plus" size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {subjects.map(s => (
                  <div key={s.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-body" style={{ background: 'rgba(255,107,26,0.1)', border: '1px solid rgba(255,107,26,0.2)', color: '#ff9545' }}>
                    <span>{s.icon}</span>
                    <span>{s.name}</span>
                    <button onClick={() => handleDeleteSubject(s.id)} className="ml-1 text-muted-foreground hover:text-red-400 transition-colors">
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="font-display text-xl font-semibold text-white flex items-center gap-2">
                <Icon name="CheckSquare" size={18} className="text-orange-400" /> Добавить задание
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select value={newTask.subject} onChange={e => setNewTask(p => ({ ...p, subject: e.target.value }))}
                  className="px-4 py-3 rounded-xl text-sm font-body outline-none"
                  style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.2)', color: newTask.subject ? '#fff' : '#666' }}>
                  <option value="" style={{ background: '#1a0d05' }}>Выберите предмет</option>
                  {subjects.map(s => <option key={s.id} value={s.name} style={{ background: '#1a0d05' }}>{s.icon} {s.name}</option>)}
                </select>
                <input
                  value={newTask.due}
                  onChange={e => setNewTask(p => ({ ...p, due: e.target.value }))}
                  placeholder="Срок (напр. 25 апр)"
                  className="px-4 py-3 rounded-xl text-sm font-body outline-none"
                  style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.2)', color: '#fff' }}
                  onFocus={e => e.target.style.borderColor = '#ff6b1a'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,107,26,0.2)'}
                />
                <input
                  value={newTask.task}
                  onChange={e => setNewTask(p => ({ ...p, task: e.target.value }))}
                  placeholder="Описание задания"
                  className="md:col-span-2 px-4 py-3 rounded-xl text-sm font-body outline-none"
                  style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.2)', color: '#fff' }}
                  onFocus={e => e.target.style.borderColor = '#ff6b1a'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,107,26,0.2)'}
                />
                <div className="flex gap-2">
                  {(["high","medium","low"] as const).map(p => (
                    <button key={p} onClick={() => setNewTask(prev => ({ ...prev, priority: p }))}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold font-body transition-all"
                      style={{ background: newTask.priority === p ? `${PRIORITY_COLORS[p]}22` : 'rgba(255,107,26,0.06)', color: newTask.priority === p ? PRIORITY_COLORS[p] : '#555', border: `1px solid ${newTask.priority === p ? PRIORITY_COLORS[p] + '44' : 'rgba(255,107,26,0.1)'}` }}>
                      {PRIORITY_LABELS[p]}
                    </button>
                  ))}
                </div>
                <button onClick={handleAddTask} className="py-3 rounded-xl font-display font-semibold text-white text-sm tracking-wide" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)' }}>
                  ДОБАВИТЬ ЗАДАНИЕ
                </button>
              </div>

              <div className="space-y-2 mt-2">
                {tasks.map(t => (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,107,26,0.05)', border: '1px solid rgba(255,107,26,0.1)' }}>
                    <span className="text-xs px-2 py-0.5 rounded-full font-body font-semibold flex-shrink-0" style={{ background: `${PRIORITY_COLORS[t.priority]}15`, color: PRIORITY_COLORS[t.priority] }}>
                      {t.subject}
                    </span>
                    <span className="text-sm text-white font-body flex-1 truncate">{t.task}</span>
                    <span className="text-xs text-muted-foreground font-body flex-shrink-0">до {t.due}</span>
                    <button onClick={() => handleDeleteTask(t.id)} className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0">
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "videos" && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="font-display text-xl font-semibold text-white flex items-center gap-2">
                <Icon name="Link" size={18} className="text-orange-400" /> Добавить видеоролик
              </h3>
              <p className="text-xs text-muted-foreground font-body">Поддерживаются ссылки: YouTube, RuTube, прямые .mp4 ссылки</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={newVideo.title} onChange={e => setNewVideo(p => ({ ...p, title: e.target.value }))}
                  placeholder="Название ролика"
                  className="md:col-span-2 px-4 py-3 rounded-xl text-sm font-body outline-none"
                  style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.2)', color: '#fff' }}
                  onFocus={e => e.target.style.borderColor = '#ff6b1a'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,107,26,0.2)'}
                />
                <select value={newVideo.subject} onChange={e => setNewVideo(p => ({ ...p, subject: e.target.value }))}
                  className="px-4 py-3 rounded-xl text-sm font-body outline-none"
                  style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.2)', color: newVideo.subject ? '#fff' : '#666' }}>
                  <option value="" style={{ background: '#1a0d05' }}>Предмет</option>
                  {subjects.map(s => <option key={s.id} value={s.name} style={{ background: '#1a0d05' }}>{s.icon} {s.name}</option>)}
                </select>
                <input value={newVideo.author} onChange={e => setNewVideo(p => ({ ...p, author: e.target.value }))}
                  placeholder="Автор (необязательно)"
                  className="px-4 py-3 rounded-xl text-sm font-body outline-none"
                  style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.2)', color: '#fff' }}
                  onFocus={e => e.target.style.borderColor = '#ff6b1a'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,107,26,0.2)'}
                />
                <input value={newVideo.url} onChange={e => setNewVideo(p => ({ ...p, url: e.target.value }))}
                  placeholder="Ссылка на YouTube / RuTube / .mp4"
                  className="md:col-span-2 px-4 py-3 rounded-xl text-sm font-body outline-none"
                  style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.2)', color: '#fff' }}
                  onFocus={e => e.target.style.borderColor = '#ff6b1a'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,107,26,0.2)'}
                />
              </div>
              {videoError && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,50,50,0.3)', color: '#ff6b6b' }}>
                  <Icon name="AlertCircle" size={14} />
                  {videoError}
                </div>
              )}
              <button onClick={handleAddVideo} className="w-full py-3 rounded-xl font-display font-semibold text-white tracking-wide transition-all hover:scale-[1.01]" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)' }}>
                ОПУБЛИКОВАТЬ ВИДЕО
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-lg font-semibold text-white">Опубликованные ролики ({videos.length})</h3>
              {videos.map((v, i) => (
                <div key={v.id} className="glass-card rounded-2xl p-4 flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className="text-3xl flex-shrink-0">{v.thumb}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm font-semibold text-white truncate">{v.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-body px-2 py-0.5 rounded" style={{ background: 'rgba(255,107,26,0.15)', color: '#ff9545' }}>{v.subject}</span>
                      <span className="text-xs text-muted-foreground font-body">{v.author}</span>
                      <span className="text-xs text-muted-foreground font-body flex items-center gap-1"><Icon name="Eye" size={10} />{v.views}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setPreviewVideo(v)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all hover:scale-105" style={{ background: 'rgba(255,107,26,0.15)', color: '#ff9545' }}>
                      <Icon name="Play" size={12} />
                      Просмотр
                    </button>
                    <button onClick={() => handleDeleteVideo(v.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors" style={{ background: 'rgba(239,68,68,0.08)' }}>
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

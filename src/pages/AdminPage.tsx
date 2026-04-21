import { useState } from "react";
import Icon from "@/components/ui/icon";
import { getEmbedUrl, ROLE_COLORS, ROLE_LABELS, type VideoItem, type SubjectItem, type TaskItem, type AppUser } from "@/store";

interface ManagedUser {
  id: number;
  name: string;
  email: string;
  role: string;
  warnings: number;
  blocked: boolean;
  avatar: string;
}

const INITIAL_USERS: ManagedUser[] = [
  { id: 1, name: "Ученик Петров", email: "student@groza.ru", role: "student", warnings: 0, blocked: false, avatar: "П" },
  { id: 2, name: "Сидорова Анна", email: "sidorova@groza.ru", role: "student", warnings: 1, blocked: false, avatar: "С" },
  { id: 3, name: "Козлов Игорь", email: "kozlov@groza.ru", role: "student", warnings: 2, blocked: false, avatar: "К" },
  { id: 4, name: "Тихонов Вова", email: "moderator@groza.ru", role: "moderator", warnings: 0, blocked: false, avatar: "Т" },
  { id: 5, name: "Орлов Денис", email: "orlov@groza.ru", role: "student", warnings: 3, blocked: true, avatar: "О" },
];

const ROLES = ["student", "moderator", "admin", "vip"];
const PRIORITY_LABELS: Record<string, string> = { high: "Срочно", medium: "Средний", low: "Обычный" };
const PRIORITY_COLORS: Record<string, string> = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };

interface AdminPageProps {
  user: AppUser;
  videos: VideoItem[];
  setVideos: React.Dispatch<React.SetStateAction<VideoItem[]>>;
  subjects: SubjectItem[];
  setSubjects: React.Dispatch<React.SetStateAction<SubjectItem[]>>;
  tasks: TaskItem[];
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  donors: Record<string, boolean>;
  toggleDonor: (email: string) => void;
}

export default function AdminPage({ user, videos, setVideos, subjects, setSubjects, tasks, setTasks, donors, toggleDonor }: AdminPageProps) {
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
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
    setTimeout(() => setToast(""), 3500);
  };

  const addWarning = (id: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      const warnings = u.warnings + 1;
      const blocked = warnings >= 3;
      showToast(blocked ? `🔴 ${u.name} заблокирован — 3 предупреждения` : `⚠️ Предупреждение ${warnings}/3: ${u.name}`);
      return { ...u, warnings, blocked };
    }));
  };

  const toggleBlock = (id: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      const blocked = !u.blocked;
      showToast(blocked ? `🔒 ${u.name} заблокирован` : `✅ ${u.name} разблокирован`);
      return { ...u, blocked };
    }));
  };

  const changeRole = (id: number, role: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      showToast(`✅ Роль изменена: ${u.name} → ${ROLE_LABELS[role] ?? role}`);
      return { ...u, role };
    }));
  };

  const handleToggleDonor = (u: ManagedUser) => {
    toggleDonor(u.email);
    showToast(donors[u.email] ? `Донат снят: ${u.name}` : `💎 Донат выдан: ${u.name}`);
  };

  const handleAddVideo = () => {
    setVideoError("");
    if (!newVideo.title.trim()) { setVideoError("Введите название"); return; }
    if (!newVideo.subject) { setVideoError("Выберите предмет"); return; }
    if (!newVideo.url.trim()) { setVideoError("Вставьте ссылку"); return; }
    const embed = getEmbedUrl(newVideo.url);
    if (!embed) { setVideoError("Неверная ссылка. Поддерживаются YouTube, RuTube, .mp4"); return; }
    const now = new Date();
    const months = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];
    const date = `${now.getDate()} ${months[now.getMonth()]}`;
    const subj = subjects.find(s => s.name === newVideo.subject);
    setVideos(prev => [...prev, {
      id: Date.now(),
      title: newVideo.title.trim(),
      subject: newVideo.subject,
      author: newVideo.author.trim() || user.name,
      url: newVideo.url.trim(),
      views: 0, date,
      thumb: subj?.icon ?? "🎬",
    }]);
    setNewVideo({ title: "", subject: "", author: "", url: "" });
    showToast("✅ Видео опубликовано!");
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

  const handleAddTask = () => {
    if (!newTask.subject || !newTask.task.trim() || !newTask.due.trim()) {
      showToast("Заполните все поля задания"); return;
    }
    setTasks(prev => [...prev, { id: Date.now(), ...newTask }]);
    setNewTask({ subject: "", task: "", due: "", priority: "medium" });
    showToast("✅ Задание добавлено для учеников");
  };

  const tabs = [
    { id: "users", label: "Пользователи", icon: "Users" },
    { id: "grades", label: "Оценки", icon: "Star" },
    { id: "subjects", label: "Предметы", icon: "BookOpen" },
    { id: "videos", label: "Видео", icon: "Video" },
  ] as const;

  const inputCls = "w-full px-4 py-3 rounded-2xl text-sm font-body outline-none transition-all";
  const inputStyle = { background: 'rgba(255,107,26,0.05)', border: '1px solid rgba(255,107,26,0.12)', color: '#d4c4b0' };
  const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => (e.target.style.borderColor = '#ff6b1a');
  const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => (e.target.style.borderColor = 'rgba(255,107,26,0.12)');

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in" style={{ background: '#0a0806' }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl font-body text-sm text-white animate-slide-in-right max-w-xs"
          style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)', boxShadow: '0 12px 32px rgba(255,107,26,0.4)' }}>
          {toast}
        </div>
      )}

      {/* Video preview modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)' }}>
          <div className="w-full max-w-3xl animate-scale-in rounded-3xl overflow-hidden" style={{ background: '#0d0b08', border: '1px solid rgba(255,107,26,0.15)' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,107,26,0.08)' }}>
              <span className="font-display text-sm font-bold text-white truncate">{previewVideo.title}</span>
              <button onClick={() => setPreviewVideo(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center ml-3 transition-all"
                style={{ background: 'rgba(255,107,26,0.1)', color: '#9b7a5a' }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,107,26,0.1)'; e.currentTarget.style.color = '#9b7a5a'; }}
              >
                <Icon name="X" size={15} />
              </button>
            </div>
            {(() => {
              const embed = getEmbedUrl(previewVideo.url);
              if (embed && (embed.includes("youtube.com/embed") || embed.includes("rutube.ru/play/embed"))) {
                return <iframe src={embed} className="w-full" style={{ aspectRatio: '16/9', border: 'none' }} allowFullScreen title={previewVideo.title} allow="autoplay" />;
              }
              if (embed) return <video src={embed} controls autoPlay className="w-full" style={{ aspectRatio: '16/9', background: '#000' }} />;
              return (
                <div className="flex flex-col items-center justify-center gap-4" style={{ aspectRatio: '16/9', background: '#130e06' }}>
                  <p className="font-body text-sm" style={{ color: '#5a4a3a' }}>Видео недоступно</p>
                  <a href={previewVideo.url} target="_blank" rel="noopener noreferrer" className="text-sm font-body" style={{ color: '#ff9545' }}>Открыть оригинал</a>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl flex items-center justify-center text-base" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)', boxShadow: '0 0 20px rgba(255,107,26,0.4)' }}>⚡</span>
              Админ-панель
            </h1>
            <p className="font-body text-sm mt-1" style={{ color: '#5a4a3a' }}>Полный контроль платформы «Социальная Гроза»</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Пользователей", value: users.length, color: "#ff6b1a", icon: "Users" },
            { label: "Активных", value: users.filter(u => !u.blocked).length, color: "#22c55e", icon: "UserCheck" },
            { label: "Заблокированных", value: users.filter(u => u.blocked).length, color: "#ef4444", icon: "UserX" },
            { label: "Донатеров", value: Object.values(donors).filter(Boolean).length, color: "#f59e0b", icon: "Heart" },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-4 text-center" style={{ background: '#0d0b08', border: '1px solid rgba(255,107,26,0.08)' }}>
              <Icon name={s.icon as "Users"} size={18} className="mx-auto mb-1.5" style={{ color: s.color }} />
              <div className="font-display text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs font-body" style={{ color: '#4a3a2a' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl overflow-x-auto scrollbar-hidden" style={{ background: 'rgba(255,107,26,0.04)', border: '1px solid rgba(255,107,26,0.08)' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-shrink-0 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs md:text-sm font-semibold font-body transition-all"
              style={activeTab === tab.id
                ? { background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)', color: '#fff', boxShadow: '0 4px 12px rgba(255,107,26,0.25)' }
                : { color: '#5a4a3a' }
              }>
              <Icon name={tab.icon as "Users"} size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="space-y-2.5 animate-fade-in">
            {users.map((u, i) => {
              const color = ROLE_COLORS[u.role] ?? "#ff6b1a";
              const isDonor = donors[u.email] ?? false;
              return (
                <div key={u.id} className="rounded-2xl p-5 animate-fade-in" style={{ background: '#0d0b08', border: '1px solid rgba(255,107,26,0.08)', animationDelay: `${i * 0.04}s`, opacity: u.blocked ? 0.65 : 1 }}>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative flex-shrink-0">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-display text-lg font-bold"
                        style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                        {u.avatar}
                      </div>
                      {isDonor && <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-lg flex items-center justify-center text-xs" style={{ background: '#f59e0b', fontSize: '9px' }}>💎</div>}
                      {u.blocked && <div className="absolute -top-1 -right-1 w-4 h-4 rounded-lg flex items-center justify-center" style={{ background: '#ef4444' }}><Icon name="Lock" size={8} className="text-white" /></div>}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-display text-sm font-bold text-white">{u.name}</span>
                        {isDonor && <span className="text-xs">💎</span>}
                        {u.blocked && <span className="text-xs px-2 py-0.5 rounded-lg font-body" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Заблокирован</span>}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-body" style={{ color: '#4a3a2a' }}>{u.email}</span>
                        <span className="text-xs px-2 py-0.5 rounded-lg font-body font-semibold" style={{ background: `${color}12`, color }}>
                          {ROLE_LABELS[u.role] ?? u.role}
                        </span>
                        {u.warnings > 0 && (
                          <span className="text-xs flex items-center gap-1 font-body" style={{ color: u.warnings >= 2 ? '#ef4444' : '#f59e0b' }}>
                            <Icon name="AlertTriangle" size={11} />{u.warnings}/3
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                        className="text-xs px-2.5 py-1.5 rounded-xl font-body outline-none cursor-pointer"
                        style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.15)', color: '#ff9545' }}>
                        {ROLES.map(r => <option key={r} value={r} style={{ background: '#1a0d05' }}>{ROLE_LABELS[r] ?? r}</option>)}
                      </select>

                      <button onClick={() => handleToggleDonor(u)} title={isDonor ? "Снять донат" : "Выдать донат"}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all hover:scale-110"
                        style={{ background: isDonor ? 'rgba(245,158,11,0.2)' : 'rgba(255,107,26,0.06)', border: `1px solid ${isDonor ? 'rgba(245,158,11,0.4)' : 'rgba(255,107,26,0.12)'}` }}>
                        💎
                      </button>

                      <button onClick={() => addWarning(u.id)} disabled={u.blocked} title="Выдать предупреждение"
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
                        <Icon name="AlertTriangle" size={14} style={{ color: '#f59e0b' }} />
                      </button>

                      <button onClick={() => toggleBlock(u.id)} title={u.blocked ? "Разблокировать" : "Заблокировать"}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: u.blocked ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${u.blocked ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                        <Icon name={u.blocked ? "Unlock" : "Lock"} size={14} style={{ color: u.blocked ? '#22c55e' : '#ef4444' }} />
                      </button>
                    </div>
                  </div>

                  {u.warnings > 0 && (
                    <div className="mt-3 flex gap-1.5">
                      {[1, 2, 3].map(n => (
                        <div key={n} className="h-1 flex-1 rounded-full transition-all" style={{ background: n <= u.warnings ? (n === 3 ? '#ef4444' : '#f59e0b') : 'rgba(255,255,255,0.06)' }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* GRADES TAB */}
        {activeTab === "grades" && (
          <div className="rounded-3xl p-7 animate-fade-in space-y-5" style={{ background: '#0d0b08', border: '1px solid rgba(255,107,26,0.1)' }}>
            <h3 className="font-display text-xl font-semibold text-white">Выставить оценку</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold mb-2 block font-body uppercase tracking-widest" style={{ color: '#5a4a3a' }}>Ученик</label>
                <select value={newGrade.student} onChange={e => setNewGrade(p => ({ ...p, student: e.target.value }))}
                  className={inputCls} style={{ ...inputStyle, color: newGrade.student ? '#d4c4b0' : '#4a3a2a' }}
                  onFocus={inputFocus} onBlur={inputBlur}>
                  <option value="" style={{ background: '#1a0d05' }}>Выберите ученика</option>
                  {users.filter(u => !u.blocked).map(u => <option key={u.id} value={u.name} style={{ background: '#1a0d05' }}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-2 block font-body uppercase tracking-widest" style={{ color: '#5a4a3a' }}>Предмет</label>
                <select value={newGrade.subject} onChange={e => setNewGrade(p => ({ ...p, subject: e.target.value }))}
                  className={inputCls} style={{ ...inputStyle, color: newGrade.subject ? '#d4c4b0' : '#4a3a2a' }}
                  onFocus={inputFocus} onBlur={inputBlur}>
                  <option value="" style={{ background: '#1a0d05' }}>Выберите предмет</option>
                  {subjects.map(s => <option key={s.id} value={s.name} style={{ background: '#1a0d05' }}>{s.icon} {s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-2 block font-body uppercase tracking-widest" style={{ color: '#5a4a3a' }}>Оценка</label>
                <div className="flex gap-2">
                  {[5,4,3,2,1].map(g => (
                    <button key={g} onClick={() => setNewGrade(p => ({ ...p, grade: String(g) }))}
                      className="flex-1 py-3 rounded-2xl font-display text-lg font-bold transition-all hover:scale-105"
                      style={{
                        background: newGrade.grade === String(g) ? (g >= 4 ? '#22c55e' : g === 3 ? '#f59e0b' : '#ef4444') : 'rgba(255,107,26,0.06)',
                        color: newGrade.grade === String(g) ? '#fff' : '#5a4a3a',
                        border: '1px solid rgba(255,107,26,0.1)',
                      }}>{g}</button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => {
              if (newGrade.student && newGrade.subject) {
                showToast(`✅ Оценка ${newGrade.grade} → ${newGrade.student} — ${newGrade.subject}`);
                setNewGrade({ student: "", subject: "", grade: "5" });
              } else showToast("Выберите ученика и предмет");
            }} className="w-full py-3.5 rounded-2xl font-display font-semibold text-white tracking-wide transition-all hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)', boxShadow: '0 8px 24px rgba(255,107,26,0.25)' }}>
              ВЫСТАВИТЬ ОЦЕНКУ
            </button>
          </div>
        )}

        {/* SUBJECTS TAB */}
        {activeTab === "subjects" && (
          <div className="space-y-5 animate-fade-in">
            <div className="rounded-3xl p-6 space-y-4" style={{ background: '#0d0b08', border: '1px solid rgba(255,107,26,0.1)' }}>
              <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
                <Icon name="BookOpen" size={17} style={{ color: '#ff6b1a' }} /> Добавить предмет
              </h3>
              <div className="flex gap-3">
                <input value={newSubject.icon} onChange={e => setNewSubject(p => ({ ...p, icon: e.target.value }))}
                  className="w-14 text-center text-xl font-body outline-none rounded-2xl"
                  style={inputStyle} maxLength={2}
                  onFocus={inputFocus} onBlur={inputBlur}
                />
                <input value={newSubject.name} onChange={e => setNewSubject(p => ({ ...p, name: e.target.value }))}
                  placeholder="Название предмета" className="flex-1 px-4 py-3 rounded-2xl text-sm font-body outline-none"
                  style={inputStyle}
                  onFocus={inputFocus} onBlur={inputBlur}
                  onKeyDown={e => e.key === "Enter" && handleAddSubject()}
                />
                <button onClick={handleAddSubject} className="px-5 py-3 rounded-2xl font-display font-semibold text-white text-sm transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)' }}>
                  <Icon name="Plus" size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {subjects.map(s => (
                  <div key={s.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-body"
                    style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.15)', color: '#ff9545' }}>
                    <span>{s.icon}</span><span>{s.name}</span>
                    <button onClick={() => setSubjects(prev => prev.filter(x => x.id !== s.id))} className="ml-1 transition-colors" style={{ color: '#5a4a3a' }}
                      onMouseOver={e => (e.currentTarget.style.color = '#ef4444')}
                      onMouseOut={e => (e.currentTarget.style.color = '#5a4a3a')}
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl p-6 space-y-4" style={{ background: '#0d0b08', border: '1px solid rgba(255,107,26,0.1)' }}>
              <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
                <Icon name="CheckSquare" size={17} style={{ color: '#ff6b1a' }} /> Добавить задание для учеников
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select value={newTask.subject} onChange={e => setNewTask(p => ({ ...p, subject: e.target.value }))}
                  className={inputCls} style={{ ...inputStyle, color: newTask.subject ? '#d4c4b0' : '#4a3a2a' }}
                  onFocus={inputFocus} onBlur={inputBlur}>
                  <option value="" style={{ background: '#1a0d05' }}>Выберите предмет</option>
                  {subjects.map(s => <option key={s.id} value={s.name} style={{ background: '#1a0d05' }}>{s.icon} {s.name}</option>)}
                </select>
                <input value={newTask.due} onChange={e => setNewTask(p => ({ ...p, due: e.target.value }))}
                  placeholder="Срок (напр. 25 апр)" className={inputCls} style={inputStyle}
                  onFocus={inputFocus} onBlur={inputBlur}
                />
                <input value={newTask.task} onChange={e => setNewTask(p => ({ ...p, task: e.target.value }))}
                  placeholder="Описание задания" className={`${inputCls} md:col-span-2`} style={inputStyle}
                  onFocus={inputFocus} onBlur={inputBlur}
                />
                <div className="flex gap-2">
                  {(["high","medium","low"] as const).map(p => (
                    <button key={p} onClick={() => setNewTask(prev => ({ ...prev, priority: p }))}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold font-body transition-all"
                      style={{
                        background: newTask.priority === p ? `${PRIORITY_COLORS[p]}18` : 'rgba(255,107,26,0.04)',
                        color: newTask.priority === p ? PRIORITY_COLORS[p] : '#4a3a2a',
                        border: `1px solid ${newTask.priority === p ? PRIORITY_COLORS[p] + '44' : 'rgba(255,107,26,0.08)'}`,
                      }}>
                      {PRIORITY_LABELS[p]}
                    </button>
                  ))}
                </div>
                <button onClick={handleAddTask} className="py-3 rounded-2xl font-display font-semibold text-white text-sm tracking-wide"
                  style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)' }}>
                  ДОБАВИТЬ ЗАДАНИЕ
                </button>
              </div>

              {tasks.length > 0 && (
                <div className="space-y-2 mt-2">
                  {tasks.map(t => (
                    <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,107,26,0.04)', border: '1px solid rgba(255,107,26,0.08)' }}>
                      <span className="text-xs px-2 py-0.5 rounded-lg font-body font-semibold flex-shrink-0" style={{ background: `${PRIORITY_COLORS[t.priority]}12`, color: PRIORITY_COLORS[t.priority] }}>{t.subject}</span>
                      <span className="text-sm font-body flex-1 truncate" style={{ color: '#9b7a5a' }}>{t.task}</span>
                      <span className="text-xs font-body flex-shrink-0" style={{ color: '#4a3a2a' }}>до {t.due}</span>
                      <button onClick={() => setTasks(prev => prev.filter(x => x.id !== t.id))} className="transition-colors flex-shrink-0" style={{ color: '#4a3a2a' }}
                        onMouseOver={e => (e.currentTarget.style.color = '#ef4444')}
                        onMouseOut={e => (e.currentTarget.style.color = '#4a3a2a')}
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIDEOS TAB */}
        {activeTab === "videos" && (
          <div className="space-y-5 animate-fade-in">
            <div className="rounded-3xl p-6 space-y-4" style={{ background: '#0d0b08', border: '1px solid rgba(255,107,26,0.1)' }}>
              <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
                <Icon name="Link" size={17} style={{ color: '#ff6b1a' }} /> Добавить видеоролик
              </h3>
              <p className="text-xs font-body" style={{ color: '#4a3a2a' }}>Поддерживаются: YouTube, RuTube, прямые ссылки .mp4</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={newVideo.title} onChange={e => setNewVideo(p => ({ ...p, title: e.target.value }))}
                  placeholder="Название ролика" className={`${inputCls} md:col-span-2`} style={inputStyle}
                  onFocus={inputFocus} onBlur={inputBlur}
                />
                <select value={newVideo.subject} onChange={e => setNewVideo(p => ({ ...p, subject: e.target.value }))}
                  className={inputCls} style={{ ...inputStyle, color: newVideo.subject ? '#d4c4b0' : '#4a3a2a' }}
                  onFocus={inputFocus} onBlur={inputBlur}>
                  <option value="" style={{ background: '#1a0d05' }}>Предмет</option>
                  {subjects.map(s => <option key={s.id} value={s.name} style={{ background: '#1a0d05' }}>{s.icon} {s.name}</option>)}
                </select>
                <input value={newVideo.author} onChange={e => setNewVideo(p => ({ ...p, author: e.target.value }))}
                  placeholder="Автор (необязательно)" className={inputCls} style={inputStyle}
                  onFocus={inputFocus} onBlur={inputBlur}
                />
                <input value={newVideo.url} onChange={e => setNewVideo(p => ({ ...p, url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=... или https://rutube.ru/video/..." className={`${inputCls} md:col-span-2`} style={inputStyle}
                  onFocus={inputFocus} onBlur={inputBlur}
                />
              </div>
              {videoError && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-body" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171' }}>
                  <Icon name="AlertCircle" size={13} />{videoError}
                </div>
              )}
              <button onClick={handleAddVideo} className="w-full py-3.5 rounded-2xl font-display font-semibold text-white tracking-wide transition-all hover:scale-[1.01]"
                style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)', boxShadow: '0 8px 24px rgba(255,107,26,0.25)' }}>
                ОПУБЛИКОВАТЬ ВИДЕО
              </button>
            </div>

            {videos.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-display text-base font-semibold text-white">Опубликованные ролики ({videos.length})</h3>
                {videos.map((v, i) => (
                  <div key={v.id} className="flex items-center gap-4 p-4 rounded-2xl animate-fade-in" style={{ background: '#0d0b08', border: '1px solid rgba(255,107,26,0.08)', animationDelay: `${i * 0.04}s` }}>
                    <div className="text-2xl flex-shrink-0">{v.thumb}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-sm font-semibold text-white truncate">{v.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-body px-2 py-0.5 rounded-lg" style={{ background: 'rgba(255,107,26,0.1)', color: '#ff9545' }}>{v.subject}</span>
                        <span className="text-xs font-body" style={{ color: '#4a3a2a' }}>{v.author}</span>
                        <span className="text-xs font-body flex items-center gap-1" style={{ color: '#4a3a2a' }}><Icon name="Eye" size={10} />{v.views}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => setPreviewVideo(v)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-body transition-all hover:scale-105"
                        style={{ background: 'rgba(255,107,26,0.1)', color: '#ff9545' }}>
                        <Icon name="Play" size={12} />Просмотр
                      </button>
                      <button onClick={() => { setVideos(prev => prev.filter(x => x.id !== v.id)); showToast("Видео удалено"); }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                        style={{ background: 'rgba(239,68,68,0.06)', color: '#4a3a2a' }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#4a3a2a'; }}
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

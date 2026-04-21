import { useState } from "react";
import Icon from "@/components/ui/icon";
import AuthPage from "@/pages/AuthPage";
import HomePage from "@/pages/HomePage";
import DiaryPage from "@/pages/DiaryPage";
import ChatPage from "@/pages/ChatPage";
import ProfilePage from "@/pages/ProfilePage";
import VideosPage from "@/pages/VideosPage";
import AdminPage from "@/pages/AdminPage";
import {
  DEFAULT_VIDEOS, DEFAULT_SUBJECTS, DEFAULT_TASKS, DEFAULT_MESSAGES,
  ROLE_COLORS,
  type VideoItem, type SubjectItem, type TaskItem, type ChatMessage, type AppUser
} from "@/store";

type Page = "home" | "diary" | "chat" | "profile" | "videos" | "admin";

const NAV_ITEMS = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "diary", label: "Дневник", icon: "BookOpen" },
  { id: "chat", label: "Чат", icon: "MessageSquare" },
  { id: "videos", label: "Видео", icon: "Play" },
  { id: "profile", label: "Профиль", icon: "User" },
];

export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [page, setPage] = useState<Page>("home");

  const [videos, setVideos] = useState<VideoItem[]>(DEFAULT_VIDEOS);
  const [subjects, setSubjects] = useState<SubjectItem[]>(DEFAULT_SUBJECTS);
  const [tasks, setTasks] = useState<TaskItem[]>(DEFAULT_TASKS);
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);
  // donors: email -> isDonor
  const [donors, setDonors] = useState<Record<string, boolean>>({});

  const handleLogin = (u: Omit<AppUser, "isDonor">) => {
    setUser({ ...u, isDonor: donors[u.email] ?? false });
  };

  const handleLogout = () => { setUser(null); setPage("home"); };
  const navigate = (p: string) => setPage(p as Page);

  const toggleDonor = (email: string) => {
    setDonors(prev => {
      const next = { ...prev, [email]: !prev[email] };
      if (user && user.email === email) {
        setUser(u => u ? { ...u, isDonor: next[email] } : u);
      }
      return next;
    });
  };

  if (!user) return <AuthPage onLogin={handleLogin} />;

  const isAdmin = user.role === "admin" || user.role === "superadmin";
  const allNavItems = isAdmin ? [...NAV_ITEMS, { id: "admin", label: "Админ", icon: "Shield" }] : NAV_ITEMS;
  const roleColor = ROLE_COLORS[user.role] ?? "#ff6b1a";

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ background: '#0a0806' }}>
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen flex-shrink-0" style={{ background: '#0d0b08', borderRight: '1px solid rgba(255,107,26,0.1)' }}>
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,107,26,0.08)' }}>
          <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)' }}>
            <span className="text-lg">⚡</span>
            <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: '0 0 20px rgba(255,107,26,0.5)' }} />
          </div>
          <div>
            <div className="font-display text-sm font-bold leading-tight" style={{ background: 'linear-gradient(90deg, #ff6b1a, #ffaa55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>СОЦИАЛЬНАЯ</div>
            <div className="font-display text-sm font-bold text-white leading-tight">ГРОЗА</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {allNavItems.map(item => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold font-body transition-all relative overflow-hidden group"
                style={active
                  ? { background: 'rgba(255,107,26,0.12)', color: '#ff9545' }
                  : { color: '#5a5550' }
                }
              >
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #ff6b1a, #cc3d00)' }} />}
                <Icon name={item.icon as "Home"} size={17} style={{ color: active ? '#ff6b1a' : '#4a4540' }} />
                <span>{item.label}</span>
                {item.id === "admin" && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 rounded-md font-body font-bold" style={{ background: 'rgba(255,107,26,0.15)', color: '#ff9545' }}>ADM</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User card */}
        <div className="px-2 pb-4 pt-2" style={{ borderTop: '1px solid rgba(255,107,26,0.08)' }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-1" style={{ background: 'rgba(255,107,26,0.05)', border: '1px solid rgba(255,107,26,0.08)' }}>
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-sm" style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`, color: '#fff' }}>
                {user.name[0]}
              </div>
              {user.isDonor && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-md flex items-center justify-center text-xs" style={{ background: '#f59e0b' }}>💎</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-body text-xs font-semibold text-white truncate">{user.name.split(" ")[0]}</div>
              <div className="text-xs font-body truncate" style={{ color: roleColor + 'bb' }}>{user.role === "superadmin" ? "Суперадмин" : user.role === "admin" ? "Администратор" : "Ученик"}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-body transition-all" style={{ color: '#44403c' }}
            onMouseOver={e => (e.currentTarget.style.color = '#ef4444')}
            onMouseOut={e => (e.currentTarget.style.color = '#44403c')}
          >
            <Icon name="LogOut" size={14} />
            Выйти из аккаунта
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ background: '#0d0b08', borderBottom: '1px solid rgba(255,107,26,0.1)' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)' }}>
              <span className="text-xs">⚡</span>
            </div>
            <span className="font-display text-base font-bold" style={{ background: 'linear-gradient(90deg, #ff6b1a, #ffaa55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ГРОЗА</span>
          </div>
          <div className="relative">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-bold text-sm" style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`, color: '#fff' }}>
              {user.name[0]}
            </div>
            {user.isDonor && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-md flex items-center justify-center text-xs" style={{ background: '#f59e0b' }}>💎</div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-hidden">
          {page === "home" && <HomePage user={user} onNavigate={navigate} />}
          {page === "diary" && <DiaryPage tasks={tasks} subjects={subjects} />}
          {page === "chat" && <ChatPage user={user} messages={messages} setMessages={setMessages} />}
          {page === "profile" && <ProfilePage user={user} />}
          {page === "videos" && <VideosPage user={user} videos={videos} setVideos={setVideos} subjects={subjects} />}
          {page === "admin" && isAdmin && (
            <AdminPage
              user={user}
              videos={videos} setVideos={setVideos}
              subjects={subjects} setSubjects={setSubjects}
              tasks={tasks} setTasks={setTasks}
              donors={donors} toggleDonor={toggleDonor}
            />
          )}
          {page === "admin" && !isAdmin && (
            <div className="flex items-center justify-center min-h-[70vh]">
              <div className="text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="font-display text-2xl font-bold text-white mb-2">Нет доступа</h2>
                <p className="font-body text-sm" style={{ color: '#5a5550' }}>Только для администраторов платформы</p>
              </div>
            </div>
          )}
        </main>

        {/* Mobile nav */}
        <nav className="md:hidden flex items-center justify-around py-2 px-2 flex-shrink-0" style={{ background: '#0d0b08', borderTop: '1px solid rgba(255,107,26,0.1)' }}>
          {allNavItems.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => navigate(item.id)}
                className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all"
                style={{ color: active ? '#ff6b1a' : '#44403c' }}
              >
                <Icon name={item.icon as "Home"} size={19} />
                <span className="text-xs font-body font-medium" style={{ fontSize: '10px' }}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

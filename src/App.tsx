import { useState } from "react";
import Icon from "@/components/ui/icon";
import AuthPage from "@/pages/AuthPage";
import HomePage from "@/pages/HomePage";
import DiaryPage from "@/pages/DiaryPage";
import ChatPage from "@/pages/ChatPage";
import ProfilePage from "@/pages/ProfilePage";
import VideosPage from "@/pages/VideosPage";
import AdminPage from "@/pages/AdminPage";
import { DEFAULT_VIDEOS, DEFAULT_SUBJECTS, DEFAULT_TASKS, type VideoItem, type SubjectItem, type TaskItem } from "@/store";

type Page = "home" | "diary" | "chat" | "profile" | "videos" | "admin";

interface User {
  name: string;
  role: string;
  email: string;
}

const NAV_ITEMS = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "diary", label: "Дневник", icon: "BookOpen" },
  { id: "chat", label: "Чат", icon: "MessageSquare" },
  { id: "videos", label: "Видео", icon: "Play" },
  { id: "profile", label: "Профиль", icon: "User" },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>("home");

  const [videos, setVideos] = useState<VideoItem[]>(DEFAULT_VIDEOS);
  const [subjects, setSubjects] = useState<SubjectItem[]>(DEFAULT_SUBJECTS);
  const [tasks, setTasks] = useState<TaskItem[]>(DEFAULT_TASKS);

  const handleLogin = (u: User) => setUser(u);
  const handleLogout = () => { setUser(null); setPage("home"); };
  const navigate = (p: string) => setPage(p as Page);

  if (!user) return <AuthPage onLogin={handleLogin} />;

  const isAdmin = user.role === "admin" || user.role === "superadmin";
  const allNavItems = isAdmin ? [...NAV_ITEMS, { id: "admin", label: "Админ", icon: "Shield" }] : NAV_ITEMS;

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ background: '#0d0b09' }}>
      <aside className="hidden md:flex flex-col w-64 min-h-screen flex-shrink-0 nav-glow" style={{ background: '#0f0d0a', borderRight: '1px solid rgba(255,107,26,0.12)' }}>
        <div className="px-6 py-6 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,107,26,0.1)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 orange-glow" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)' }}>
            <span className="text-base">⚡</span>
          </div>
          <div>
            <div className="font-display text-base font-bold gradient-text leading-tight">СОЦИАЛЬНАЯ</div>
            <div className="font-display text-base font-bold text-white leading-tight">ГРОЗА</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {allNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold font-body transition-all"
              style={page === item.id
                ? { background: 'linear-gradient(135deg, rgba(255,107,26,0.2), rgba(204,68,0,0.1))', color: '#ff9545', borderLeft: '3px solid #ff6b1a' }
                : { color: '#666', borderLeft: '3px solid transparent' }
              }
            >
              <Icon
                name={item.icon as "Home"}
                size={18}
                className="flex-shrink-0"
                style={{ color: page === item.id ? '#ff6b1a' : '#555' }}
              />
              {item.label}
              {item.id === "admin" && (
                <span className="ml-auto text-xs px-1.5 py-0.5 rounded font-body" style={{ background: 'rgba(255,107,26,0.2)', color: '#ff9545' }}>ADM</span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(255,107,26,0.1)', paddingTop: '1rem' }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2" style={{ background: 'rgba(255,107,26,0.06)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)', color: '#fff' }}>
              {user.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-body text-sm font-semibold text-white truncate">{user.name.split(" ")[0]}</div>
              <div className="text-xs text-muted-foreground font-body truncate">{user.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body transition-all hover:bg-red-500/10" style={{ color: '#666' }}>
            <Icon name="LogOut" size={16} />
            Выйти
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3 nav-glow flex-shrink-0" style={{ background: '#0f0d0a', borderBottom: '1px solid rgba(255,107,26,0.12)' }}>
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span className="font-display text-lg font-bold gradient-text">ГРОЗА</span>
          </div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)', color: '#fff' }}>
            {user.name[0]}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {page === "home" && <HomePage user={user} onNavigate={navigate} />}
          {page === "diary" && <DiaryPage tasks={tasks} subjects={subjects} />}
          {page === "chat" && <ChatPage user={user} />}
          {page === "profile" && <ProfilePage user={user} />}
          {page === "videos" && <VideosPage user={user} videos={videos} setVideos={setVideos} subjects={subjects} />}
          {page === "admin" && isAdmin && (
            <AdminPage
              user={user}
              videos={videos}
              setVideos={setVideos}
              subjects={subjects}
              setSubjects={setSubjects}
              tasks={tasks}
              setTasks={setTasks}
            />
          )}
          {page === "admin" && !isAdmin && (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
              <div className="text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h2 className="font-display text-2xl font-bold text-white mb-2">Нет доступа</h2>
                <p className="text-muted-foreground font-body">Только для администраторов</p>
              </div>
            </div>
          )}
        </main>

        <nav className="md:hidden flex items-center justify-around py-2 px-2 flex-shrink-0" style={{ background: '#0f0d0a', borderTop: '1px solid rgba(255,107,26,0.12)' }}>
          {allNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all"
              style={page === item.id ? { color: '#ff6b1a' } : { color: '#555' }}
            >
              <Icon name={item.icon as "Home"} size={20} />
              <span className="text-xs font-body font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
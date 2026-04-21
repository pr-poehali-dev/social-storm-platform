import { useState } from "react";
import Icon from "@/components/ui/icon";

interface AuthPageProps {
  onLogin: (user: { name: string; role: string; email: string }) => void;
}

const DEMO_USERS = [
  { email: "admin@groza.ru", password: "admin123", name: "Главный Администратор", role: "superadmin" },
  { email: "teacher@groza.ru", password: "teacher123", name: "Учитель Иванов", role: "admin" },
  { email: "student@groza.ru", password: "student123", name: "Ученик Петров", role: "student" },
];

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const user = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (user) {
        onLogin({ name: user.name, role: user.role, email: user.email });
      } else {
        setError("Неверный email или пароль");
      }
    } else {
      if (!name.trim()) { setError("Введите имя"); return; }
      if (!email.includes("@")) { setError("Введите корректный email"); return; }
      if (password.length < 6) { setError("Пароль минимум 6 символов"); return; }
      onLogin({ name, role: "student", email });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#0d0b09' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #ff6b1a 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #cc4400 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #ff9545 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-md px-4 animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 orange-glow animate-float" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)' }}>
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="font-display text-4xl font-bold gradient-text mb-1">СОЦИАЛЬНАЯ ГРОЗА</h1>
          <p className="text-muted-foreground text-sm font-body">Образовательная платформа нового поколения</p>
        </div>

        <div className="glass-card rounded-2xl p-8" style={{ background: 'rgba(255,107,26,0.04)', border: '1px solid rgba(255,107,26,0.15)' }}>
          <div className="flex rounded-xl overflow-hidden mb-6" style={{ background: 'rgba(255,107,26,0.08)' }}>
            <button
              onClick={() => { setIsLogin(true); setError(""); }}
              className="flex-1 py-2.5 text-sm font-semibold font-body transition-all"
              style={isLogin ? { background: 'linear-gradient(135deg, #ff6b1a, #cc4400)', color: '#fff' } : { color: '#999' }}
            >
              Войти
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(""); }}
              className="flex-1 py-2.5 text-sm font-semibold font-body transition-all"
              style={!isLogin ? { background: 'linear-gradient(135deg, #ff6b1a, #cc4400)', color: '#fff' } : { color: '#999' }}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block font-body uppercase tracking-wider">Имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ваше имя"
                  className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none transition-all"
                  style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.2)', color: '#fff' }}
                  onFocus={e => e.target.style.borderColor = '#ff6b1a'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,107,26,0.2)'}
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block font-body uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none transition-all"
                style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.2)', color: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#ff6b1a'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,107,26,0.2)'}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block font-body uppercase tracking-wider">Пароль</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl text-sm font-body outline-none transition-all pr-11"
                  style={{ background: 'rgba(255,107,26,0.08)', border: '1px solid rgba(255,107,26,0.2)', color: '#fff' }}
                  onFocus={e => e.target.style.borderColor = '#ff6b1a'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,107,26,0.2)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-orange-400 transition-colors">
                  <Icon name={showPass ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,50,50,0.3)', color: '#ff6b6b' }}>
                <Icon name="AlertCircle" size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-display font-semibold text-white text-base tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] orange-glow"
              style={{ background: 'linear-gradient(135deg, #ff6b1a 0%, #ff9545 50%, #cc4400 100%)' }}
            >
              {isLogin ? "ВОЙТИ В СИСТЕМУ" : "СОЗДАТЬ АККАУНТ"}
            </button>
          </form>

          {isLogin && (
            <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(255,107,26,0.06)', border: '1px solid rgba(255,107,26,0.1)' }}>
              <p className="text-xs text-muted-foreground font-body mb-1">Демо-доступ:</p>
              <p className="text-xs font-body" style={{ color: '#ff9545' }}>admin@groza.ru / admin123</p>
              <p className="text-xs font-body" style={{ color: '#ff9545' }}>student@groza.ru / student123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

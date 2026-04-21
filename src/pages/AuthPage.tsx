import { useState } from "react";
import Icon from "@/components/ui/icon";

interface AuthPageProps {
  onLogin: (user: { name: string; role: string; email: string }) => void;
}

const DEMO_USERS = [
  { email: "admin@groza.ru", password: "admin123", name: "Главный Администратор", role: "superadmin" },
  { email: "teacher@groza.ru", password: "teacher123", name: "Учитель Иванов", role: "admin" },
];

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [adminModal, setAdminModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminShowPass, setAdminShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isLogin) {
      const found = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (found) {
        onLogin({ name: found.name, role: found.role, email: found.email });
      } else {
        setError("Неверный email или пароль");
      }
    } else {
      if (!name.trim()) { setError("Введите имя"); return; }
      if (!email.includes("@")) { setError("Введите корректный email"); return; }
      if (password.length < 6) { setError("Пароль минимум 6 символов"); return; }
      onLogin({ name: name.trim(), role: "admin", email });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    const found = DEMO_USERS.find(u =>
      u.email === adminEmail && u.password === adminPassword
    );
    if (found) {
      onLogin({ name: found.name, role: found.role, email: found.email });
    } else {
      setAdminError("Неверные данные администратора");
    }
  };

  const inputStyle = {
    background: 'rgba(255,107,26,0.06)',
    border: '1px solid rgba(255,107,26,0.15)',
    color: '#fff',
    borderRadius: '14px',
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#0a0806' }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(255,107,26,0.18) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(204,61,0,0.15) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(255,150,50,0.04) 0%, transparent 70%)' }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,107,26,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,26,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Admin modal */}
      {adminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
          <div className="w-full max-w-sm animate-scale-in rounded-3xl p-8" style={{ background: 'linear-gradient(135deg, #131008, #1a1208)', border: '1px solid rgba(255,107,26,0.2)', boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,107,26,0.05)' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)', boxShadow: '0 0 20px rgba(255,107,26,0.4)' }}>
                  <Icon name="Shield" size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-display text-base font-bold text-white">Вход для администраторов</div>
                  <div className="text-xs font-body" style={{ color: '#6b5a4a' }}>Только для персонала</div>
                </div>
              </div>
              <button onClick={() => { setAdminModal(false); setAdminError(""); }}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,107,26,0.08)', color: '#6b5a4a' }}
                onMouseOver={e => (e.currentTarget.style.color = '#fff')}
                onMouseOut={e => (e.currentTarget.style.color = '#6b5a4a')}
              >
                <Icon name="X" size={15} />
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold mb-2 block font-body uppercase tracking-widest" style={{ color: '#6b5a4a' }}>Email</label>
                <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
                  placeholder="admin@groza.ru"
                  className="w-full px-4 py-3 text-sm font-body outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#ff6b1a')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,107,26,0.15)')}
                />
              </div>
              <div>
                <label className="text-xs font-semibold mb-2 block font-body uppercase tracking-widest" style={{ color: '#6b5a4a' }}>Пароль</label>
                <div className="relative">
                  <input type={adminShowPass ? "text" : "password"} value={adminPassword} onChange={e => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 text-sm font-body outline-none transition-all pr-11"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#ff6b1a')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,107,26,0.15)')}
                  />
                  <button type="button" onClick={() => setAdminShowPass(!adminShowPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#6b5a4a' }}
                    onMouseOver={e => (e.currentTarget.style.color = '#ff9545')}
                    onMouseOut={e => (e.currentTarget.style.color = '#6b5a4a')}
                  >
                    <Icon name={adminShowPass ? "EyeOff" : "Eye"} size={15} />
                  </button>
                </div>
              </div>
              {adminError && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-body" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                  <Icon name="AlertCircle" size={13} />
                  {adminError}
                </div>
              )}
              <button type="submit" className="w-full py-3 rounded-2xl font-display font-semibold text-white text-sm tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #ff6b1a 0%, #cc3d00 100%)', boxShadow: '0 8px 24px rgba(255,107,26,0.35)' }}>
                ВОЙТИ В ПАНЕЛЬ
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="w-full max-w-[420px] px-4 animate-fade-in relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)', boxShadow: '0 0 40px rgba(255,107,26,0.5), 0 0 80px rgba(255,107,26,0.15)' }}>
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-2" style={{ background: 'linear-gradient(135deg, #ff6b1a 0%, #ffaa55 50%, #ff4500 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            СОЦИАЛЬНАЯ ГРОЗА
          </h1>
          <p className="font-body text-sm" style={{ color: '#6b5a4a' }}>Образовательная платформа нового поколения</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8" style={{ background: 'linear-gradient(135deg, #110e08, #1a1308)', border: '1px solid rgba(255,107,26,0.12)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
          {/* Tabs */}
          <div className="flex rounded-2xl p-1 mb-7" style={{ background: 'rgba(255,107,26,0.06)' }}>
            {[{ id: true, label: "Войти" }, { id: false, label: "Регистрация" }].map(tab => (
              <button key={String(tab.id)} onClick={() => { setIsLogin(tab.id); setError(""); }}
                className="flex-1 py-2.5 text-sm font-semibold font-body rounded-xl transition-all"
                style={isLogin === tab.id
                  ? { background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)', color: '#fff', boxShadow: '0 4px 16px rgba(255,107,26,0.3)' }
                  : { color: '#5a4a3a' }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs font-semibold mb-2 block font-body uppercase tracking-widest" style={{ color: '#6b5a4a' }}>Имя</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Ваше имя"
                  className="w-full px-4 py-3 text-sm font-body outline-none transition-all"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#ff6b1a')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,107,26,0.15)')}
                />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold mb-2 block font-body uppercase tracking-widest" style={{ color: '#6b5a4a' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 text-sm font-body outline-none transition-all"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#ff6b1a')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,107,26,0.15)')}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 block font-body uppercase tracking-widest" style={{ color: '#6b5a4a' }}>Пароль</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 text-sm font-body outline-none transition-all pr-11"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#ff6b1a')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,107,26,0.15)')}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#6b5a4a' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#ff9545')}
                  onMouseOut={e => (e.currentTarget.style.color = '#6b5a4a')}
                >
                  <Icon name={showPass ? "EyeOff" : "Eye"} size={15} />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-body" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                <Icon name="AlertCircle" size={13} />
                {error}
              </div>
            )}

            <button type="submit" className="w-full py-3.5 rounded-2xl font-display font-semibold text-white tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
              style={{ background: 'linear-gradient(135deg, #ff6b1a 0%, #cc3d00 100%)', boxShadow: '0 8px 24px rgba(255,107,26,0.35)' }}>
              {isLogin ? "ВОЙТИ В СИСТЕМУ" : "СОЗДАТЬ АККАУНТ"}
            </button>
          </form>

          <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,107,26,0.08)' }}>
            <button onClick={() => { setAdminModal(true); setAdminError(""); setAdminEmail(""); setAdminPassword(""); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-semibold font-body transition-all"
              style={{ background: 'rgba(255,107,26,0.06)', border: '1px solid rgba(255,107,26,0.12)', color: '#9b7a5a' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,107,26,0.3)'; e.currentTarget.style.color = '#ff9545'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,107,26,0.12)'; e.currentTarget.style.color = '#9b7a5a'; }}
            >
              <Icon name="Shield" size={15} />
              Войти как администратор
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

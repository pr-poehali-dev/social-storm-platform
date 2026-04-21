import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface ChatPageProps {
  user: { name: string; role: string; email: string };
}

interface Message {
  id: number;
  author: string;
  role: string;
  text: string;
  time: string;
  mine: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, author: "Главный Администратор", role: "superadmin", text: "Добро пожаловать в общий чат платформы «Социальная Гроза»! 🌩️", time: "09:00", mine: false },
  { id: 2, author: "Учитель Иванов", role: "admin", text: "Всем привет! Напоминаю, что завтра контрольная по математике.", time: "09:15", mine: false },
  { id: 3, author: "Ученик Петров", role: "student", text: "Понял, спасибо за напоминание!", time: "09:18", mine: false },
  { id: 4, author: "Главный Администратор", role: "superadmin", text: "Сегодня будет добавлено 5 новых видеоуроков по физике.", time: "10:00", mine: false },
];

const ROLE_COLORS: Record<string, string> = {
  superadmin: "#ff6b1a",
  admin: "#3b82f6",
  student: "#22c55e",
  moderator: "#a855f7",
  donor: "#f59e0b",
};

const ROLE_LABELS: Record<string, string> = {
  superadmin: "Суперадмин",
  admin: "Администратор",
  student: "Ученик",
  moderator: "Модератор",
  donor: "Донатер",
};

export default function ChatPage({ user }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setMessages(prev => [...prev, {
      id: Date.now(),
      author: user.name,
      role: user.role,
      text: input.trim(),
      time,
      mine: true,
    }]);
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen animate-fade-in" style={{ background: '#0d0b09' }}>
      <div className="flex-shrink-0 px-6 py-4 flex items-center gap-4 nav-glow" style={{ background: '#111009', borderBottom: '1px solid rgba(255,107,26,0.15)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,107,26,0.15)' }}>
          <Icon name="MessageSquare" size={20} className="text-orange-400" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-white">Общий чат</h1>
          <p className="text-xs text-muted-foreground font-body">Онлайн: {messages.length > 0 ? 4 : 0} участников</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
          <span className="text-xs text-muted-foreground font-body">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hidden">
        {messages.map((msg, i) => (
          <div key={msg.id} className={`flex gap-3 animate-fade-in ${msg.mine ? "flex-row-reverse" : ""}`} style={{ animationDelay: `${i * 0.03}s` }}>
            <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-display font-bold" style={{ background: `${ROLE_COLORS[msg.role]}22`, border: `1px solid ${ROLE_COLORS[msg.role]}44`, color: ROLE_COLORS[msg.role] }}>
              {msg.author[0]}
            </div>
            <div className={`max-w-[70%] ${msg.mine ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div className={`flex items-center gap-2 ${msg.mine ? "flex-row-reverse" : ""}`}>
                <span className="text-xs font-semibold font-body" style={{ color: ROLE_COLORS[msg.role] }}>{msg.author}</span>
                <span className="text-xs px-1.5 py-0.5 rounded font-body" style={{ background: `${ROLE_COLORS[msg.role]}15`, color: ROLE_COLORS[msg.role], fontSize: '10px' }}>
                  {ROLE_LABELS[msg.role] || msg.role}
                </span>
                <span className="text-xs text-muted-foreground font-body">{msg.time}</span>
              </div>
              <div className="px-4 py-2.5 rounded-2xl text-sm font-body" style={msg.mine
                ? { background: 'linear-gradient(135deg, #ff6b1a, #cc4400)', color: '#fff', borderBottomRightRadius: '4px' }
                : { background: 'rgba(255,107,26,0.07)', border: '1px solid rgba(255,107,26,0.12)', color: '#e5d5c5', borderBottomLeftRadius: '4px' }
              }>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex-shrink-0 p-4" style={{ borderTop: '1px solid rgba(255,107,26,0.1)', background: '#0f0d0b' }}>
        <div className="flex gap-3 max-w-4xl mx-auto">
          <div className="flex-1 flex items-center gap-3 rounded-2xl px-4" style={{ background: 'rgba(255,107,26,0.07)', border: '1px solid rgba(255,107,26,0.15)' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Написать сообщение..."
              rows={1}
              className="flex-1 bg-transparent py-3 text-sm font-body text-white outline-none resize-none scrollbar-hidden placeholder:text-muted-foreground"
              style={{ maxHeight: '120px' }}
            />
            <Icon name="Smile" size={18} className="text-muted-foreground flex-shrink-0 cursor-pointer hover:text-orange-400 transition-colors" />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95"
            style={{ background: input.trim() ? 'linear-gradient(135deg, #ff6b1a, #cc4400)' : 'rgba(255,107,26,0.1)', cursor: input.trim() ? 'pointer' : 'default' }}
          >
            <Icon name="Send" size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

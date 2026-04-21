import { useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useState } from "react";
import { ROLE_COLORS, ROLE_LABELS, type ChatMessage, type AppUser } from "@/store";

interface ChatPageProps {
  user: AppUser;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function ChatPage({ user, messages, setMessages }: ChatPageProps) {
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
      email: user.email,
      text: input.trim(),
      time,
      isDonor: user.isDonor,
    }]);
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isMe = (msg: ChatMessage) => msg.email === user.email;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 57px)', background: '#0a0806' }}>
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-3.5 flex items-center gap-3" style={{ background: '#0d0b08', borderBottom: '1px solid rgba(255,107,26,0.08)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,107,26,0.1)' }}>
          <Icon name="MessageSquare" size={17} style={{ color: '#ff6b1a' }} />
        </div>
        <div className="flex-1">
          <h1 className="font-display text-base font-bold text-white">Общий чат</h1>
          <p className="text-xs font-body" style={{ color: '#5a4a3a' }}>{messages.length} сообщений · все участники видят переписку</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
          <span className="text-xs font-body" style={{ color: '#5a4a3a' }}>Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hidden">
        {messages.map((msg, i) => {
          const mine = isMe(msg);
          const color = ROLE_COLORS[msg.role] ?? "#ff6b1a";
          return (
            <div key={msg.id} className={`flex gap-3 animate-fade-in ${mine ? "flex-row-reverse" : ""}`} style={{ animationDelay: `${Math.min(i, 10) * 0.02}s` }}>
              {/* Avatar */}
              <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-display text-sm font-bold relative"
                style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
                {msg.author[0]}
                {msg.isDonor && (
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded flex items-center justify-center text-xs leading-none" style={{ background: '#f59e0b', fontSize: '8px' }}>💎</div>
                )}
              </div>

              <div className={`flex flex-col gap-1 max-w-[72%] ${mine ? "items-end" : "items-start"}`}>
                {/* Meta */}
                <div className={`flex items-center gap-1.5 ${mine ? "flex-row-reverse" : ""}`}>
                  <span className="text-xs font-semibold font-body" style={{ color }}>{mine ? "Вы" : msg.author.split(" ")[0]}</span>
                  <span className="text-xs font-body px-1.5 py-0.5 rounded-md" style={{ background: `${color}12`, color: `${color}cc`, fontSize: '10px' }}>
                    {ROLE_LABELS[msg.role] ?? msg.role}
                  </span>
                  {msg.isDonor && <span className="text-xs">💎</span>}
                  <span className="text-xs font-body" style={{ color: '#3a3028', fontSize: '10px' }}>{msg.time}</span>
                </div>

                {/* Bubble */}
                <div className="px-4 py-2.5 text-sm font-body leading-relaxed"
                  style={mine
                    ? { background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)', color: '#fff', borderRadius: '18px 18px 4px 18px', boxShadow: '0 4px 16px rgba(255,107,26,0.25)' }
                    : { background: 'rgba(255,107,26,0.06)', border: '1px solid rgba(255,107,26,0.1)', color: '#d4c4b0', borderRadius: '18px 18px 18px 4px' }
                  }>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 pb-4 pt-3" style={{ borderTop: '1px solid rgba(255,107,26,0.08)', background: '#0d0b08' }}>
        <div className="flex gap-3 max-w-4xl mx-auto">
          <div className="flex-1 flex items-center gap-3 rounded-2xl px-4" style={{ background: 'rgba(255,107,26,0.06)', border: '1px solid rgba(255,107,26,0.12)' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Написать сообщение... (Enter — отправить)"
              rows={1}
              className="flex-1 bg-transparent py-3.5 text-sm font-body text-white outline-none resize-none scrollbar-hidden"
              style={{ maxHeight: '100px', color: '#d4c4b0' }}
            />
          </div>
          <button onClick={sendMessage} disabled={!input.trim()}
            className="w-11 h-11 self-end rounded-2xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: input.trim() ? 'linear-gradient(135deg, #ff6b1a, #cc3d00)' : 'rgba(255,107,26,0.08)',
              boxShadow: input.trim() ? '0 4px 16px rgba(255,107,26,0.3)' : 'none',
              transform: input.trim() ? 'scale(1)' : 'scale(0.95)',
            }}
          >
            <Icon name="Send" size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

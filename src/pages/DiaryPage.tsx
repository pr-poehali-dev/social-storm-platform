import { useState } from "react";
import Icon from "@/components/ui/icon";
import { type TaskItem, type SubjectItem } from "@/store";

const GRADE_COLORS: Record<number, string> = {
  5: "#22c55e", 4: "#3b82f6", 3: "#f59e0b", 2: "#ef4444", 1: "#dc2626",
};
const PRIORITY_COLORS: Record<string, string> = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };
const PRIORITY_LABELS: Record<string, string> = { high: "Срочно", medium: "Средний", low: "Обычный" };

const SCHEDULE = [
  { time: "08:00", subject: "Математика", room: "Каб. 201", color: "#ff6b1a" },
  { time: "09:00", subject: "Русский язык", room: "Каб. 105", color: "#3b82f6" },
  { time: "10:00", subject: "Физика", room: "Каб. 308", color: "#a855f7" },
  { time: "11:30", subject: "История", room: "Каб. 214", color: "#f59e0b" },
  { time: "12:30", subject: "Английский", room: "Каб. 112", color: "#22c55e" },
];

interface DiaryPageProps {
  tasks: TaskItem[];
  subjects: SubjectItem[];
}

export default function DiaryPage({ tasks, subjects }: DiaryPageProps) {
  const [activeTab, setActiveTab] = useState<"grades" | "tasks" | "schedule">("grades");
  const [doneTasks, setDoneTasks] = useState<Set<number>>(new Set());

  const toggleTask = (id: number) => {
    setDoneTasks(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const tabs = [
    { id: "grades", label: "Оценки", icon: "Star" },
    { id: "tasks", label: "Задания", icon: "CheckSquare" },
    { id: "schedule", label: "Расписание", icon: "Clock" },
  ] as const;

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in" style={{ background: '#0a0806' }}>
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Электронный дневник</h1>
            <p className="font-body text-sm mt-1" style={{ color: '#5a4a3a' }}>2024–2025 учебный год</p>
          </div>
          <div className="text-center px-5 py-3 rounded-2xl" style={{ background: 'rgba(255,107,26,0.07)', border: '1px solid rgba(255,107,26,0.12)' }}>
            <div className="font-display text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #ff6b1a, #ffaa55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>—</div>
            <div className="text-xs font-body" style={{ color: '#5a4a3a' }}>Средний балл</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 p-1 rounded-2xl" style={{ background: 'rgba(255,107,26,0.04)', border: '1px solid rgba(255,107,26,0.08)' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold font-body transition-all"
              style={activeTab === tab.id
                ? { background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)', color: '#fff', boxShadow: '0 4px 12px rgba(255,107,26,0.25)' }
                : { color: '#5a4a3a' }
              }>
              <Icon name={tab.icon as "Star"} size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grades tab */}
        {activeTab === "grades" && (
          <div className="animate-fade-in">
            <div className="rounded-3xl overflow-hidden" style={{ background: '#0d0b08', border: '1px solid rgba(255,107,26,0.1)' }}>
              <div className="px-6 py-5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,107,26,0.08)' }}>
                <Icon name="Star" size={16} style={{ color: '#ff6b1a' }} />
                <span className="font-display text-base font-semibold text-white">Оценки пусты</span>
                <span className="text-xs font-body px-2 py-0.5 rounded-lg ml-auto" style={{ background: 'rgba(255,107,26,0.1)', color: '#ff9545' }}>Нет данных</span>
              </div>
              <div className="px-6 py-16 text-center">
                <div className="text-5xl mb-4">📋</div>
                <p className="font-display text-lg font-semibold text-white mb-2">Оценок пока нет</p>
                <p className="font-body text-sm" style={{ color: '#5a4a3a' }}>Администратор выставит оценки в журнале</p>
              </div>
            </div>

            {subjects.length > 0 && (
              <div className="mt-4">
                <p className="font-body text-xs mb-3 uppercase tracking-widest" style={{ color: '#4a3a2a' }}>Предметы</p>
                <div className="flex flex-wrap gap-2">
                  {subjects.map(s => (
                    <span key={s.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-body"
                      style={{ background: 'rgba(255,107,26,0.06)', border: '1px solid rgba(255,107,26,0.1)', color: '#9b7a5a' }}>
                      {s.icon} {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tasks tab */}
        {activeTab === "tasks" && (
          <div className="space-y-2.5 animate-fade-in">
            {tasks.length === 0 ? (
              <div className="rounded-3xl py-16 text-center" style={{ background: '#0d0b08', border: '1px solid rgba(255,107,26,0.08)' }}>
                <div className="text-5xl mb-4">✅</div>
                <p className="font-display text-lg font-semibold text-white mb-2">Заданий нет</p>
                <p className="font-body text-sm" style={{ color: '#5a4a3a' }}>Администратор добавит задания из панели управления</p>
              </div>
            ) : tasks.map(task => {
              const done = doneTasks.has(task.id);
              return (
                <div key={task.id} className="flex items-start gap-4 p-5 rounded-2xl transition-all"
                  style={{ background: 'rgba(255,107,26,0.04)', border: '1px solid rgba(255,107,26,0.08)', opacity: done ? 0.55 : 1 }}>
                  <button onClick={() => toggleTask(task.id)}
                    className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all"
                    style={{ borderColor: done ? '#ff6b1a' : 'rgba(255,107,26,0.25)', background: done ? '#ff6b1a' : 'transparent' }}>
                    {done && <Icon name="Check" size={12} className="text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-display text-sm font-semibold" style={{ color: '#ff9545' }}>{task.subject}</span>
                      <span className="text-xs px-2 py-0.5 rounded-lg font-body"
                        style={{ background: `${PRIORITY_COLORS[task.priority]}12`, color: PRIORITY_COLORS[task.priority], border: `1px solid ${PRIORITY_COLORS[task.priority]}22` }}>
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                    </div>
                    <p className="text-sm font-body" style={{ color: done ? '#4a3a2a' : '#c4b0a0', textDecoration: done ? 'line-through' : 'none' }}>{task.task}</p>
                    <p className="text-xs font-body mt-1.5 flex items-center gap-1" style={{ color: '#4a3a2a' }}>
                      <Icon name="Calendar" size={11} />
                      Срок: {task.due}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Schedule tab */}
        {activeTab === "schedule" && (
          <div className="rounded-3xl overflow-hidden animate-fade-in" style={{ background: '#0d0b08', border: '1px solid rgba(255,107,26,0.1)' }}>
            <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,107,26,0.08)' }}>
              <Icon name="Calendar" size={15} style={{ color: '#ff6b1a' }} />
              <span className="font-display text-base font-semibold text-white">Понедельник, 21 апреля</span>
            </div>
            {SCHEDULE.map((s, i) => (
              <div key={i} className="flex items-center gap-5 px-6 py-4 transition-all"
                style={{ borderBottom: i < SCHEDULE.length - 1 ? '1px solid rgba(255,107,26,0.05)' : 'none' }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,107,26,0.03)')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span className="font-display text-sm font-bold w-14 flex-shrink-0" style={{ color: s.color }}>{s.time}</span>
                <div className="w-0.5 h-9 rounded-full flex-shrink-0" style={{ background: `linear-gradient(180deg, ${s.color}, ${s.color}44)` }} />
                <div>
                  <div className="font-body text-sm font-semibold text-white">{s.subject}</div>
                  <div className="text-xs font-body" style={{ color: '#4a3a2a' }}>{s.room}</div>
                </div>
                <div className="ml-auto text-xs font-body px-2.5 py-1 rounded-lg" style={{ background: `${s.color}12`, color: s.color }}>45 мин</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

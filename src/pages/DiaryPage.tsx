import { useState } from "react";
import Icon from "@/components/ui/icon";

const SUBJECTS = ["Математика", "Русский язык", "Физика", "История", "Химия", "Биология", "Английский"];

const GRADES_DATA = [
  { subject: "Математика", grades: [5, 4, 5, 3, 5], avg: 4.4 },
  { subject: "Русский язык", grades: [4, 4, 3, 5, 4], avg: 4.0 },
  { subject: "Физика", grades: [5, 5, 4, 5], avg: 4.8 },
  { subject: "История", grades: [3, 4, 4, 3], avg: 3.5 },
  { subject: "Химия", grades: [4, 3, 5], avg: 4.0 },
  { subject: "Биология", grades: [5, 5, 5], avg: 5.0 },
  { subject: "Английский", grades: [4, 4, 5, 4], avg: 4.25 },
];

const TASKS = [
  { subject: "Математика", task: "Параграф 15, задачи 1-10", due: "23 апр", done: false, priority: "high" },
  { subject: "Русский язык", task: "Сочинение на тему «Весна»", due: "24 апр", done: false, priority: "medium" },
  { subject: "Физика", task: "Лабораторная работа №3", due: "25 апр", done: true, priority: "high" },
  { subject: "История", task: "Конспект главы 8", due: "26 апр", done: false, priority: "low" },
  { subject: "Английский", task: "Unit 5 exercises", due: "22 апр", done: true, priority: "medium" },
];

const GRADE_COLORS: Record<number, string> = {
  5: "#22c55e",
  4: "#3b82f6",
  3: "#f59e0b",
  2: "#ef4444",
  1: "#dc2626",
};

const SCHEDULE = [
  { time: "08:00", subject: "Математика", room: "Каб. 201" },
  { time: "09:00", subject: "Русский язык", room: "Каб. 105" },
  { time: "10:00", subject: "Физика", room: "Каб. 308" },
  { time: "11:30", subject: "История", room: "Каб. 214" },
  { time: "12:30", subject: "Английский", room: "Каб. 112" },
];

export default function DiaryPage() {
  const [activeTab, setActiveTab] = useState<"grades" | "tasks" | "schedule">("grades");
  const [tasks, setTasks] = useState(TASKS);

  const toggleTask = (i: number) => {
    setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));
  };

  const tabs = [
    { id: "grades", label: "Оценки", icon: "Star" },
    { id: "tasks", label: "Задания", icon: "CheckSquare" },
    { id: "schedule", label: "Расписание", icon: "Clock" },
  ] as const;

  const overallAvg = (GRADES_DATA.reduce((s, g) => s + g.avg, 0) / GRADES_DATA.length).toFixed(1);

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in" style={{ background: '#0d0b09' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Электронный дневник</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">2024–2025 учебный год</p>
          </div>
          <div className="text-center glass-card rounded-2xl px-6 py-3">
            <div className="font-display text-3xl font-bold gradient-text">{overallAvg}</div>
            <div className="text-xs text-muted-foreground font-body">Средний балл</div>
          </div>
        </div>

        <div className="flex gap-2 p-1 rounded-2xl" style={{ background: 'rgba(255,107,26,0.06)', border: '1px solid rgba(255,107,26,0.1)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold font-body transition-all"
              style={activeTab === tab.id
                ? { background: 'linear-gradient(135deg, #ff6b1a, #cc4400)', color: '#fff' }
                : { color: '#888' }
              }
            >
              <Icon name={tab.icon as "Star"} size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "grades" && (
          <div className="space-y-3 animate-fade-in">
            {GRADES_DATA.map((row, i) => (
              <div key={i} className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-base font-semibold text-white">{row.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-body">Ср. балл:</span>
                    <span className="font-display text-lg font-bold" style={{ color: row.avg >= 4.5 ? "#22c55e" : row.avg >= 3.5 ? "#3b82f6" : "#f59e0b" }}>
                      {row.avg.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {row.grades.map((g, j) => (
                    <div key={j} className="w-9 h-9 rounded-xl flex items-center justify-center font-display text-base font-bold text-white"
                      style={{ background: `${GRADE_COLORS[g]}22`, border: `1px solid ${GRADE_COLORS[g]}55`, color: GRADE_COLORS[g] }}>
                      {g}
                    </div>
                  ))}
                  <div className="flex-1 h-2 rounded-full ml-2" style={{ background: 'rgba(255,107,26,0.1)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${(row.avg / 5) * 100}%`, background: `linear-gradient(90deg, #ff6b1a, #ff9545)` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-3 animate-fade-in">
            {tasks.map((task, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 flex items-start gap-4" style={{ opacity: task.done ? 0.6 : 1 }}>
                <button onClick={() => toggleTask(i)} className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all"
                  style={{ borderColor: task.done ? '#ff6b1a' : 'rgba(255,107,26,0.3)', background: task.done ? '#ff6b1a' : 'transparent' }}>
                  {task.done && <Icon name="Check" size={12} className="text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-sm font-semibold text-orange-400">{task.subject}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-body" style={{
                      background: task.priority === "high" ? "rgba(239,68,68,0.15)" : task.priority === "medium" ? "rgba(245,158,11,0.15)" : "rgba(34,197,94,0.15)",
                      color: task.priority === "high" ? "#ef4444" : task.priority === "medium" ? "#f59e0b" : "#22c55e",
                    }}>
                      {task.priority === "high" ? "Срочно" : task.priority === "medium" ? "Средний" : "Обычный"}
                    </span>
                  </div>
                  <p className="text-sm font-body text-white" style={{ textDecoration: task.done ? "line-through" : "none" }}>{task.task}</p>
                  <p className="text-xs text-muted-foreground font-body mt-1">До {task.due}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
            <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,107,26,0.1)', background: 'rgba(255,107,26,0.05)' }}>
              <h3 className="font-display text-base font-semibold text-white">Понедельник, 21 апреля</h3>
            </div>
            {SCHEDULE.map((s, i) => (
              <div key={i} className="flex items-center gap-5 px-6 py-4 hover:bg-orange-500/5 transition-colors" style={{ borderBottom: i < SCHEDULE.length - 1 ? '1px solid rgba(255,107,26,0.06)' : 'none' }}>
                <span className="font-display text-sm font-semibold text-orange-400 w-14 flex-shrink-0">{s.time}</span>
                <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(180deg, #ff6b1a, #cc4400)' }} />
                <div>
                  <div className="font-body text-sm font-semibold text-white">{s.subject}</div>
                  <div className="text-xs text-muted-foreground font-body">{s.room}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

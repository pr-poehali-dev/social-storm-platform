import { useState } from "react";
import Icon from "@/components/ui/icon";
import { getEmbedUrl, getThumb, type VideoItem, type SubjectItem, type AppUser } from "@/store";

interface VideosPageProps {
  user: AppUser;
  videos: VideoItem[];
  setVideos: React.Dispatch<React.SetStateAction<VideoItem[]>>;
  subjects: SubjectItem[];
}

export default function VideosPage({ user, videos, setVideos, subjects }: VideosPageProps) {
  const [filter, setFilter] = useState("Все");
  const [playing, setPlaying] = useState<VideoItem | null>(null);

  const subjectNames = ["Все", ...subjects.map(s => s.name)];
  const filtered = filter === "Все" ? videos : videos.filter(v => v.subject === filter);

  const openVideo = (video: VideoItem) => {
    setPlaying(video);
    setVideos(prev => prev.map(v => v.id === video.id ? { ...v, views: v.views + 1 } : v));
  };

  const embedUrl = playing ? getEmbedUrl(playing.url) : null;

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in" style={{ background: '#0a0806' }}>

      {/* Video modal */}
      {playing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setPlaying(null); }}
        >
          <div className="w-full max-w-4xl animate-scale-in rounded-3xl overflow-hidden"
            style={{ background: '#0d0b08', border: '1px solid rgba(255,107,26,0.15)', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}>
            <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,107,26,0.08)' }}>
              <span className="text-xl flex-shrink-0">{playing.thumb}</span>
              <div className="flex-1 min-w-0">
                <div className="font-display text-sm font-bold text-white truncate">{playing.title}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-body" style={{ color: '#5a4a3a' }}>{playing.author}</span>
                  <span className="text-xs font-body px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(255,107,26,0.1)', color: '#ff9545' }}>{playing.subject}</span>
                </div>
              </div>
              <button onClick={() => setPlaying(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: 'rgba(255,107,26,0.1)', color: '#9b7a5a' }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,107,26,0.1)'; e.currentTarget.style.color = '#9b7a5a'; }}
              >
                <Icon name="X" size={15} />
              </button>
            </div>

            <div style={{ aspectRatio: '16/9', background: '#000', position: 'relative' }}>
              {embedUrl && (embedUrl.includes("youtube.com/embed") || embedUrl.includes("rutube.ru/play/embed")) ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  style={{ border: 'none', display: 'block' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={playing.title}
                />
              ) : embedUrl && embedUrl.match(/\.(mp4|webm|ogg)/i) ? (
                <video src={embedUrl} controls autoPlay className="w-full h-full" style={{ background: '#000' }} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-5" style={{ background: 'linear-gradient(135deg, #130e06, #1e1408)' }}>
                  <div className="text-6xl animate-float">{playing.thumb}</div>
                  <p className="font-body text-sm text-center px-8" style={{ color: '#5a4a3a' }}>Видео недоступно для встроенного воспроизведения</p>
                  <a href={playing.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold font-body text-white transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)', boxShadow: '0 8px 20px rgba(255,107,26,0.3)' }}>
                    <Icon name="ExternalLink" size={14} />
                    Открыть в браузере
                  </a>
                </div>
              )}
            </div>

            <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,107,26,0.08)' }}>
              <div className="flex items-center gap-4 text-xs font-body" style={{ color: '#4a3a2a' }}>
                <span className="flex items-center gap-1.5"><Icon name="Eye" size={12} />{playing.views.toLocaleString()} просмотров</span>
                <span className="flex items-center gap-1.5"><Icon name="Calendar" size={12} />{playing.date}</span>
              </div>
              <a href={playing.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-body transition-colors"
                style={{ color: '#4a3a2a' }}
                onMouseOver={e => (e.currentTarget.style.color = '#ff9545')}
                onMouseOut={e => (e.currentTarget.style.color = '#4a3a2a')}
              >
                <Icon name="ExternalLink" size={12} />
                Оригинал
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-5">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Видеоуроки</h1>
          <p className="font-body text-sm mt-1" style={{ color: '#5a4a3a' }}>{videos.length} роликов доступно</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hidden">
          {subjectNames.map(subj => {
            const subjectData = subjects.find(s => s.name === subj);
            return (
              <button key={subj} onClick={() => setFilter(subj)}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold font-body transition-all"
                style={filter === subj
                  ? { background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)', color: '#fff', boxShadow: '0 4px 12px rgba(255,107,26,0.25)' }
                  : { background: 'rgba(255,107,26,0.05)', color: '#5a4a3a', border: '1px solid rgba(255,107,26,0.08)' }
                }>
                {subjectData && <span>{subjectData.icon}</span>}
                {subj}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 rounded-3xl" style={{ background: '#0d0b08', border: '1px solid rgba(255,107,26,0.08)' }}>
            <div className="text-5xl mb-4">🎬</div>
            <p className="font-display text-lg font-semibold text-white mb-2">Видео не найдено</p>
            <p className="font-body text-sm" style={{ color: '#5a4a3a' }}>Администратор добавит ролики через панель управления</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((video, i) => {
            const thumb = getThumb(video.url);
            return (
              <div key={video.id} onClick={() => openVideo(video)}
                className="rounded-2xl overflow-hidden cursor-pointer group animate-fade-in"
                style={{ background: '#0d0b08', border: '1px solid rgba(255,107,26,0.08)', animationDelay: `${i * 0.05}s`, transition: 'all 0.25s ease' }}
                onMouseOver={e => { e.currentTarget.style.border = '1px solid rgba(255,107,26,0.25)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)'; }}
                onMouseOut={e => { e.currentTarget.style.border = '1px solid rgba(255,107,26,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div className="relative" style={{ height: '165px', background: 'linear-gradient(135deg, #130e06, #1e1408)', overflow: 'hidden' }}>
                  {thumb ? (
                    <img src={thumb} alt={video.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ opacity: 0.85 }} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl group-hover:scale-110 transition-transform">{video.thumb}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.45)' }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc3d00)', boxShadow: '0 8px 24px rgba(255,107,26,0.5)' }}>
                      <Icon name="Play" size={22} className="text-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl text-xs font-body font-semibold" style={{ background: 'rgba(10,8,6,0.8)', color: '#ff9545', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,107,26,0.2)' }}>
                    {video.subject}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-bold text-white mb-1 leading-snug line-clamp-2">{video.title}</h3>
                  <p className="text-xs font-body mb-3" style={{ color: '#4a3a2a' }}>{video.author}</p>
                  <div className="flex items-center justify-between text-xs font-body" style={{ color: '#4a3a2a' }}>
                    <span className="flex items-center gap-1"><Icon name="Eye" size={11} />{video.views.toLocaleString()}</span>
                    <span>{video.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

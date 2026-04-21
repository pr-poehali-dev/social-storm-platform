import { useState } from "react";
import Icon from "@/components/ui/icon";
import { getEmbedUrl, getThumb, type VideoItem, type SubjectItem } from "@/store";

interface VideosPageProps {
  user: { name: string; role: string };
  videos: VideoItem[];
  setVideos: React.Dispatch<React.SetStateAction<VideoItem[]>>;
  subjects: SubjectItem[];
}

export default function VideosPage({ user, videos, setVideos, subjects }: VideosPageProps) {
  const [filter, setFilter] = useState("Все");
  const [playing, setPlaying] = useState<VideoItem | null>(null);

  const allSubjects = ["Все", ...subjects.map(s => s.name)];
  const filtered = filter === "Все" ? videos : videos.filter(v => v.subject === filter);

  const openVideo = (video: VideoItem) => {
    setPlaying(video);
    setVideos(prev => prev.map(v => v.id === video.id ? { ...v, views: v.views + 1 } : v));
  };

  const embedUrl = playing ? getEmbedUrl(playing.url) : null;

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in" style={{ background: '#0d0b09' }}>
      {playing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-4xl animate-scale-in rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,107,26,0.2)' }}>
            <div className="flex items-center gap-3 px-5 py-3" style={{ background: '#131110', borderBottom: '1px solid rgba(255,107,26,0.15)' }}>
              <span className="text-xl">{playing.thumb}</span>
              <div className="flex-1 min-w-0">
                <div className="font-display text-sm font-semibold text-white truncate">{playing.title}</div>
                <div className="text-xs text-muted-foreground font-body">{playing.author} · {playing.subject}</div>
              </div>
              <button
                onClick={() => setPlaying(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-muted-foreground hover:text-white transition-colors"
                style={{ background: 'rgba(255,107,26,0.1)' }}
              >
                <Icon name="X" size={16} />
              </button>
            </div>

            <div style={{ aspectRatio: '16/9', background: '#000' }}>
              {embedUrl && (embedUrl.includes("youtube.com/embed") || embedUrl.includes("rutube.ru/play/embed")) ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  style={{ border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : embedUrl ? (
                <video
                  src={embedUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                  style={{ background: '#000' }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4" style={{ background: 'linear-gradient(135deg, #1a0d05, #2d1508)' }}>
                  <div className="text-5xl">{playing.thumb}</div>
                  <p className="text-muted-foreground font-body text-sm text-center px-8">
                    Не удалось открыть видео. Проверьте ссылку.
                  </p>
                  <a href={playing.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-body transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)', color: '#fff' }}>
                    <Icon name="ExternalLink" size={14} />
                    Открыть в браузере
                  </a>
                </div>
              )}
            </div>

            <div className="px-5 py-3 flex items-center justify-between" style={{ background: '#131110' }}>
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
                <span className="flex items-center gap-1"><Icon name="Eye" size={12} />{playing.views.toLocaleString()} просмотров</span>
                <span>{playing.date}</span>
              </div>
              <a href={playing.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-body transition-colors hover:text-orange-400"
                style={{ color: '#666' }}>
                <Icon name="ExternalLink" size={12} />
                Открыть оригинал
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Видеоуроки</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">{videos.length} роликов доступно</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hidden">
          {allSubjects.map(subj => (
            <button
              key={subj}
              onClick={() => setFilter(subj)}
              className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold font-body transition-all"
              style={filter === subj
                ? { background: 'linear-gradient(135deg, #ff6b1a, #cc4400)', color: '#fff' }
                : { background: 'rgba(255,107,26,0.08)', color: '#888', border: '1px solid rgba(255,107,26,0.12)' }
              }
            >
              {subjects.find(s => s.name === subj)?.icon} {subj}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground font-body">
            <div className="text-4xl mb-3">🎬</div>
            <p>Видео не найдено</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((video, i) => {
            const thumb = getThumb(video.url);
            return (
              <div
                key={video.id}
                className="glass-card glass-card-hover rounded-2xl overflow-hidden group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => openVideo(video)}
              >
                <div className="relative flex items-center justify-center" style={{ height: '160px', background: 'linear-gradient(135deg, #1a0d05, #2d1508)' }}>
                  {thumb ? (
                    <img src={thumb} alt={video.title} className="absolute inset-0 w-full h-full object-cover opacity-70" />
                  ) : (
                    <div className="text-5xl group-hover:scale-110 transition-transform relative z-10">{video.thumb}</div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center orange-glow" style={{ background: 'linear-gradient(135deg, #ff6b1a, #cc4400)' }}>
                      <Icon name="Play" size={22} className="text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 z-10 px-2 py-1 rounded-lg text-xs font-body font-semibold" style={{ background: 'rgba(0,0,0,0.65)', color: '#ff9545', backdropFilter: 'blur(4px)' }}>
                    {video.subject}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-semibold text-white mb-1 leading-tight line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-muted-foreground font-body mb-3">{video.author}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-body">
                    <div className="flex items-center gap-1">
                      <Icon name="Eye" size={12} />
                      <span>{video.views.toLocaleString()}</span>
                    </div>
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

import React, { useState, useEffect } from 'react';
import { fetchNews, fetchRewrittenNews } from './api';

// Настройки настроений с динамической цветовой палитрой
const MOODS = [
  { 
    id: 'neutral', 
    label: 'Нейтрально', 
    icon: '😐', 
    accentColor: 'border-slate-500 text-slate-300', 
    activeBtn: 'bg-slate-700 text-white border-slate-500 shadow-slate-500/20',
    glow: 'rgba(148, 163, 184, 0.08)' 
  },
  { 
    id: 'joyful', 
    label: 'Радостно', 
    icon: '🎉', 
    accentColor: 'border-amber-500 text-amber-400', 
    activeBtn: 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20 font-bold',
    glow: 'rgba(245, 158, 11, 0.12)' 
  },
  { 
    id: 'sad', 
    label: 'Грустно', 
    icon: '😢', 
    accentColor: 'border-indigo-500 text-indigo-400', 
    activeBtn: 'bg-indigo-600 text-white border-indigo-400 shadow-indigo-500/20',
    glow: 'rgba(99, 102, 241, 0.12)' 
  },
  { 
    id: 'ironic', 
    label: 'Иронично', 
    icon: '😏', 
    accentColor: 'border-emerald-500 text-emerald-400', 
    activeBtn: 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/20',
    glow: 'rgba(16, 185, 129, 0.12)' 
  },
  { 
    id: 'dramatic', 
    label: 'Драматично', 
    icon: '🎭', 
    accentColor: 'border-rose-500 text-rose-400', 
    activeBtn: 'bg-rose-600 text-white border-rose-400 shadow-rose-500/20',
    glow: 'rgba(244, 63, 94, 0.12)' 
  },
];

export default function App() {
  const [news, setNews] = useState([]);
  const [selectedMood, setSelectedMood] = useState('joyful');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [rewrittenText, setRewrittenText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const currentMood = MOODS.find((m) => m.id === selectedMood) || MOODS[0];

  // Загрузка списка новостей
  useEffect(() => {
    fetchNews()
      .then((data) => {
        setNews(data);
        if (data && data.length > 0) {
          setSelectedArticle(data[0]);
        }
      })
      .catch(console.error);
  }, []);

  // Генерация текста при смене новости или настроения
  useEffect(() => {
    if (!selectedArticle) return;

    if (selectedMood === 'neutral') {
      setRewrittenText(selectedArticle.original_text);
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetchRewrittenNews(selectedArticle.id, selectedMood)
      .then((res) => {
        if (isMounted) setRewrittenText(res.text);
      })
      .catch(() => {
        if (isMounted) setRewrittenText('Не удалось переписать текст новости.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedArticle, selectedMood]);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-amber-500 selection:text-slate-950 relative">
      
      {/* Динамический фоновый фокус (свечение зависит от режима) */}
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-700 ease-out blur-[140px] z-0"
        style={{ background: `radial-gradient(circle at 60% 30%, ${currentMood.glow}, transparent 70%)` }}
      />

      {/* 1. ВЕРХНЯЯ ПАНЕЛЬ (HEADER) */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          {/* Кнопка скрыть/показать боковое меню */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-95"
            title={isSidebarOpen ? "Свернуть панель" : "Развернуть панель"}
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl">📰</span>
            <h1 className="font-bold text-sm md:text-base lg:text-lg text-white tracking-tight hidden sm:block">
              Mood News
            </h1>
          </div>
        </div>

        {/* Переключатель настроения */}
        <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
          {MOODS.map((m) => {
            const isActive = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 border whitespace-nowrap active:scale-95 ${
                  isActive
                    ? `${m.activeBtn} shadow-lg scale-105`
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ОСНОВНАЯ ОБЛАСТЬ */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        
        {/* 2. БОКОВАЯ ПАНЕЛЬ (SIDEBAR) */}
        <aside
          className={`
            fixed md:relative inset-y-0 left-0 z-30 md:z-0
            h-[calc(100vh-4rem)] md:h-auto
            bg-slate-950/90 md:bg-slate-950/40 backdrop-blur-xl md:backdrop-blur-none
            border-r border-slate-800/80 flex flex-col shrink-0
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'w-80 md:w-96 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-0 overflow-hidden border-none'}
          `}
        >
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Лента ({news.length})
            </span>
          </div>

          {/* Скрываем скроллбар, сохраняя функционал прокрутки мышью */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {news.map((item) => {
              const isSelected = selectedArticle?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedArticle(item);
                    // На мобильных закрываем панель после выбора новости
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-slate-900 border-l-4 border-amber-500 shadow-inner'
                      : 'hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      {item.source_name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(item.published_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <h3 className={`text-xs md:text-sm font-semibold line-clamp-2 leading-snug ${
                    isSelected ? 'text-white' : 'text-slate-300'
                  }`}>
                    {item.title}
                  </h3>
                  <p className="text-[11px] md:text-xs text-slate-500 line-clamp-2 mt-1 font-light">
                    {item.original_text}
                  </p>
                </div>
              );
            })}
          </div>
        </aside>

        {/* 3. ЦЕНТРАЛЬНАЯ ОБЛАСТЬ (READER) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-transparent [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {selectedArticle ? (
            <div className="max-w-4xl mx-auto animate-fade-in">
              
              {/* Заголовок */}
              <div className="mb-6 md:mb-8 border-b border-slate-800/80 pb-6">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                    {selectedArticle.source_name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(selectedArticle.published_at).toLocaleString('ru-RU')}
                  </span>
                </div>

                {/* Адаптивный размер заголовка */}
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                  {selectedArticle.title}
                </h2>

                <a
                  href={selectedArticle.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>🔗 Перейти к первоисточнику</span>
                </a>
              </div>

              {/* Две колонки адаптивного текста */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Колонka: Оригинал */}
                <div className="bg-slate-900/40 border border-slate-800/80 p-5 md:p-6 rounded-2xl backdrop-blur-sm">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-800/60">
                    📄 Исходный факт
                  </div>
                  {/* Адаптивный шрифт статьи */}
                  <p className="text-slate-300 text-sm md:text-base lg:text-lg leading-relaxed whitespace-pre-line font-light">
                    {selectedArticle.original_text}
                  </p>
                </div>

                {/* Колонка: Адаптация под настроение */}
                <div className={`bg-slate-900/80 border p-5 md:p-6 rounded-2xl backdrop-blur-md relative transition-all duration-500 ${currentMood.accentColor}`}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b border-slate-800/60 flex items-center justify-between">
                    <span>{currentMood.icon} Адаптация: {currentMood.label}</span>
                  </div>

                  {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs md:text-sm font-medium animate-pulse text-slate-400">
                        Нейросеть адаптирует новость...
                      </span>
                    </div>
                  ) : (
                    /* Адаптивный шрифт адаптированного текста */
                    <p className="text-slate-100 text-sm md:text-base lg:text-lg leading-relaxed whitespace-pre-line font-normal">
                      {rewrittenText}
                    </p>
                  )}
                </div>

              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Выберите новость из меню слева
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
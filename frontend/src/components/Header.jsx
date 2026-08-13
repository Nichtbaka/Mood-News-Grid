import React from 'react';

export const MOODS = [
  { id: 'neutral', label: '😐 Нейтрально' },
  { id: 'joyful', label: '🎉 Радостно' },
  { id: 'sad', label: '😢 Грустно' },
  { id: 'ironic', label: '😏 Иронично' },
  { id: 'dramatic', label: '🎭 Драматично' },
];

export function Header({ currentMood, onMoodChange }) {
  return (
    <header className="max-w-6xl mx-auto mb-8 text-center sm:text-left">
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
        📰 Mood News
      </h1>
      <p className="text-slate-600 mb-6">
        Читайте реальные мировые новости в любом настроении с сохранением фактов.
      </p>

      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {MOODS.map((m) => (
          <button
            key={m.id}
            onClick={() => onMoodChange(m.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
              currentMood === m.id
                ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-105'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </header>
  );
}
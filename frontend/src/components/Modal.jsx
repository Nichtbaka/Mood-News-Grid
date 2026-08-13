import React from 'react';
import { MOODS } from './Header';

export function Modal({ article, mood, rewrittenText, loading, onClose }) {
  if (!article) return null;

  const currentMoodObj = MOODS.find((m) => m.id === mood);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Шапка модалки */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {article.title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 font-bold text-2xl p-1 leading-none"
          >
            ✕
          </button>
        </div>

        {/* Ссылка на источник */}
        <div className="mb-6">
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-4"
          >
            🔗 Оригинальный источник ({article.source_name})
          </a>
        </div>

        {/* Две колонки: Исходник vs Переписанный */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          {/* Оригинал */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Оригинальный текст
            </h4>
            <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
              {article.original_text}
            </p>
          </div>

          {/* Переписанный вариант */}
          <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-100 flex flex-col">
            <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">
              Переписано ({currentMoodObj?.label})
            </h4>
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center py-10">
                <div className="text-blue-600 font-medium text-sm animate-pulse flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                  Нейросеть адаптирует новость...
                </div>
              </div>
            ) : (
              <p className="text-slate-900 text-sm leading-relaxed whitespace-pre-line">
                {rewrittenText}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
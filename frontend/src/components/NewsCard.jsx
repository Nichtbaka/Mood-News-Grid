import React from 'react';

export function NewsCard({ article, onClick }) {
  const formattedDate = new Date(article.published_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
            {article.source_name || 'Источник'}
          </span>
          <span className="text-xs text-slate-400">{formattedDate}</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 leading-snug">
          {article.title}
        </h3>
        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
          {article.original_text}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 text-xs font-semibold text-blue-600 flex items-center justify-between">
        <span>Читать в нужном тоне →</span>
      </div>
    </div>
  );
}
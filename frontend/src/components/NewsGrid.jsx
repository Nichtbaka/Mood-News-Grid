import React from 'react';
import { NewsCard } from './NewsCard';

export function NewsGrid({ news, onArticleClick }) {
  if (!news || news.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        Новостей пока нет или они загружаются...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
        <NewsCard
          key={item.id}
          article={item}
          onClick={() => onArticleClick(item)}
        />
      ))}
    </div>
  );
}
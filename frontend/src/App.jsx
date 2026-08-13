import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NewsGrid } from './components/NewsGrid';
import { Modal } from './components/Modal';
import { fetchNews, fetchRewrittenNews } from './api';

export default function App() {
  const [news, setNews] = useState([]);
  const [selectedMood, setSelectedMood] = useState('neutral');
  const [activeArticle, setActiveArticle] = useState(null);
  const [rewrittenText, setRewrittenText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNews()
      .then((data) => setNews(data))
      .catch((err) => console.error(err));
  }, []);

  const handleArticleClick = async (article) => {
    setActiveArticle(article);

    if (selectedMood === 'neutral') {
      setRewrittenText(article.original_text);
      return;
    }

    setLoading(true);
    try {
      const res = await fetchRewrittenNews(article.id, selectedMood);
      setRewrittenText(res.text);
    } catch (e) {
      setRewrittenText('Не удалось переписать текст новости.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 p-4 sm:p-8 font-sans">
      <Header
        currentMood={selectedMood}
        onMoodChange={(mood) => setSelectedMood(mood)}
      />
      
      <main>
        <NewsGrid
          news={news}
          onArticleClick={handleArticleClick}
        />
      </main>

      {activeArticle && (
        <Modal
          article={activeArticle}
          mood={selectedMood}
          rewrittenText={rewrittenText}
          loading={loading}
          onClose={() => setActiveArticle(null)}
        />
      )}
    </div>
  );
}
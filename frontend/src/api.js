const API_BASE_URL = 'http://localhost:8080/api';

export async function fetchNews() {
  const response = await fetch(`${API_BASE_URL}/news`);
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  return response.json();
}

export async function fetchRewrittenNews(id, mood) {
  const response = await fetch(`${API_BASE_URL}/news/rewrite?id=${id}&mood=${mood}`);
  if (!response.ok) {
    throw new Error('Failed to rewrite news');
  }
  return response.json();
}
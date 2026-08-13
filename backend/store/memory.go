package store

import (
	"sync"

	"mood-news-app/backend/models"
)

type MemoryStore struct {
	sync.RWMutex
	articles map[string]models.NewsArticle
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		articles: make(map[string]models.NewsArticle),
	}
}

func (s *MemoryStore) SaveAll(articles []models.NewsArticle) {
	s.Lock()
	defer s.Unlock()
	for _, a := range articles {
		s.articles[a.ID] = a
	}
}

func (s *MemoryStore) GetAll() []models.NewsArticle {
	s.RLock()
	defer s.RUnlock()
	var list []models.NewsArticle
	for _, a := range s.articles {
		list = append(list, a)
	}
	return list
}

func (s *MemoryStore) GetByID(id string) (models.NewsArticle, bool) {
	s.RLock()
	defer s.RUnlock()
	a, exists := s.articles[id]
	return a, exists
}

func (s *MemoryStore) SaveRewritten(id string, mood models.Mood, text string) {
	s.Lock()
	defer s.Unlock()
	if a, exists := s.articles[id]; exists {
		a.Rewritten[mood] = text
		s.articles[id] = a
	}
}

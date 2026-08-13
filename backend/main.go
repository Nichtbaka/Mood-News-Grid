package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"mood-news-app/backend/ai"
	"mood-news-app/backend/models"
	"mood-news-app/backend/rss"
	"mood-news-app/backend/store"
)

var (
	newsStore *store.MemoryStore
	llmClient *ai.LLMService
)

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func main() {
	apiKey := os.Getenv("LLM_API_KEY")
	llmClient = ai.NewLLMService(apiKey)
	newsStore = store.NewMemoryStore()

	// Загружаем минимум 10 реальных новостей при старте
	feedURL := "https://habr.com/ru/rss/news/all/all/"
	log.Printf("Fetching RSS news from %s...", feedURL)

	articles, err := rss.FetchLatestNews(context.Background(), feedURL, 12)
	if err != nil {
		log.Fatalf("Error fetching RSS: %v", err)
	}
	newsStore.SaveAll(articles)
	log.Printf("Loaded %d articles successfully", len(articles))

	http.HandleFunc("/api/news", handleGetNews)
	http.HandleFunc("/api/news/rewrite", handleRewrite)

	log.Println("Go Backend listening on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

func handleGetNews(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}

	w.Header().Set("Content-Type", "application/json")
	articles := newsStore.GetAll()
	json.NewEncoder(w).Encode(articles)
}

func handleRewrite(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}

	w.Header().Set("Content-Type", "application/json")

	id := r.URL.Query().Get("id")
	mood := models.Mood(r.URL.Query().Get("mood"))

	if id == "" || mood == "" {
		http.Error(w, "Missing 'id' or 'mood' parameter", http.StatusBadRequest)
		return
	}

	article, exists := newsStore.GetByID(id)
	if !exists {
		http.Error(w, "Article not found", http.StatusNotFound)
		return
	}

	// Ленивое кеширование: если уже переписывали в этом настроении, отдаём из памяти
	if text, cached := article.Rewritten[mood]; cached {
		json.NewEncoder(w).Encode(map[string]string{"text": text})
		return
	}

	// Если не нейтральный режим — вызываем AI
	var rewrittenText string
	var err error
	if mood == models.MoodNeutral {
		rewrittenText = article.OriginalText
	} else {
		rewrittenText, err = llmClient.RewriteNews(r.Context(), article.OriginalText, mood)
		if err != nil {
			http.Error(w, "AI generation error: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	newsStore.SaveRewritten(id, mood, rewrittenText)
	json.NewEncoder(w).Encode(map[string]string{"text": rewrittenText})
}

package rss

import (
	"context"
	"regexp"
	"strings"
	"time"

	"mood-news-app/backend/models"

	"github.com/google/uuid"
	"github.com/mmcdole/gofeed"
)

func FetchLatestNews(ctx context.Context, feedURL string, limit int) ([]models.NewsArticle, error) {
	fp := gofeed.NewParser()
	feed, err := fp.ParseURLWithContext(feedURL, ctx)
	if err != nil {
		return nil, err
	}

	var articles []models.NewsArticle
	for i, item := range feed.Items {
		if i >= limit {
			break
		}

		rawContent := item.Content
		if rawContent == "" {
			rawContent = item.Description
		}

		cleanContent := stripHTML(rawContent)
		if len(cleanContent) == 0 {
			cleanContent = item.Title
		}

		pubDate := time.Now()
		if item.PublishedParsed != nil {
			pubDate = *item.PublishedParsed
		}

		article := models.NewsArticle{
			ID:           uuid.New().String(),
			Title:        item.Title,
			OriginalText: cleanContent,
			SourceURL:    item.Link,
			SourceName:   feed.Title,
			PublishedAt:  pubDate,
			Rewritten:    make(map[models.Mood]string),
		}
		articles = append(articles, article)
	}

	return articles, nil
}

func stripHTML(input string) string {
	re := regexp.MustCompile("<[^>]*>")
	cleaned := re.ReplaceAllString(input, "")
	return strings.TrimSpace(cleaned)
}

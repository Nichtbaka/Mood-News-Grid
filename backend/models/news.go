package models

import "time"

type Mood string

const (
	MoodNeutral  Mood = "neutral"
	MoodJoyful   Mood = "joyful"
	MoodSad      Mood = "sad"
	MoodIronic   Mood = "ironic"
	MoodDramatic Mood = "dramatic"
)

type NewsArticle struct {
	ID           string          `json:"id"`
	Title        string          `json:"title"`
	OriginalText string          `json:"original_text"`
	SourceURL    string          `json:"source_url"`
	SourceName   string          `json:"source_name"`
	PublishedAt  time.Time       `json:"published_at"`
	Rewritten    map[Mood]string `json:"rewritten_texts"`
}

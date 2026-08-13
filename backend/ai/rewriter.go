package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"mood-news-app/backend/models"
)

type LLMService struct {
	APIKey  string
	BaseURL string
}

func NewLLMService(apiKey string) *LLMService {
	if apiKey == "" {
		apiKey = "mock-key"
	}
	return &LLMService{
		APIKey:  apiKey,
		BaseURL: "https://openrouter.ai/api/v1/chat/completions", // Замените на endpoint вашего провайдера (например, Z.ai GLM-5.2)
	}
}

func (s *LLMService) RewriteNews(ctx context.Context, originalText string, mood models.Mood) (string, error) {
	// Режим заглушки (если API ключ не задан)
	if s.APIKey == "mock-key" {
		time.Sleep(500 * time.Millisecond)
		return fmt.Sprintf("[%s стиль]: %s", mood, originalText), nil
	}

	systemPrompt := `Ты — профессиональный редактор новостей.
Твоя задача — переписать новость в заданном эмоциональном стиле, КАТЕГОРИЧЕСКИ сохраняя все фактические данные.

ПРАВИЛА СОХРАНЕНИЯ ФАКТОВ:
1. Запрещено изменять, выдумывать или убирать: имена людей, названия компаний/организаций, даты, числа, геолокации, прямые цитаты.
2. Запрещено добавлять новые факты, которых нет в оригинале.
3. Изменяй только эмоциональную окраску, синонимы, метафоры и тон повествования.

Заданный эмоциональный стиль: ` + string(mood)

	userPrompt := fmt.Sprintf("Оригинальная новость:\n%s", originalText)

	reqBody, _ := json.Marshal(map[string]interface{}{
		"model": "google/gemini-2.5-flash",
		"messages": []map[string]string{
			{"role": "system", "content": systemPrompt},
			{"role": "user", "content": userPrompt},
		},
		"temperature": 0.2, // Низкая температура снижает риск галлюцинаций
	})

	req, err := http.NewRequestWithContext(ctx, "POST", s.BaseURL, bytes.NewBuffer(reqBody))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.APIKey)

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var result struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	if len(result.Choices) == 0 {
		return "", fmt.Errorf("empty response from AI")
	}

	return result.Choices[0].Message.Content, nil
}

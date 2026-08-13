@echo off
echo ==========================================
echo    Запуск Mood News Application...
echo ==========================================

:: 1. Проверяем node_modules у фронтенда
if not exist "frontend\node_modules" (
    echo [1/3] Установка npm зависимостей...
    cd frontend && call npm install && cd ..
) else (
    echo [1/3] Зависимости фронтенда уже установлены.
)

:: 2. Запускаем Go backend в отдельном фоновом окне
echo [2/3] Запуск Go Backend (http://localhost:8080)...
start "Mood News Backend" cmd /k "cd backend && go run main.go"

:: 3. Запускаем React frontend в текущем окне
echo [3/3] Запуск React Frontend (http://localhost:5173)...
cd frontend
npm run dev
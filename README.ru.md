# 🤖 headless-llm

[![npm version](https://img.shields.io/npm/v/headless-llm.svg)](https://www.npmjs.com/package/headless-llm)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[🇺🇸 English](#english) | [🇷🇺 Русский](#russian)

<a name="russian"></a>

## 🇷🇺 Русский

Headless-библиотека без привязки к UI для создания интерфейсов ИИ-чатов (в стиле ChatGPT). Предоставляет утилиты для умного автоскролла и парсинга `ReadableStream`.

На данный момент поддерживает React, но построена на независимом ядре (поддержка Vue, Svelte и Angular появится в будущих релизах).

### Особенности

- 🚀 **Умный автоскролл**: Автоматически прокручивает контейнер вниз при поступлении новых кусков текста (чанков).
- 🧠 **Чувствительность к пользователю**: Останавливает автоскролл, если пользователь прокручивает вверх, чтобы прочитать прошлые сообщения, и возобновляет, когда он возвращается в самый низ.
- 💧 **Плавность**: Встроенная поддержка плавного нативного скроллинга (`smooth`).
- 🌊 **Парсинг стримов**: Избавляет от головной боли при парсинге `ReadableStream` от бэкендов LLM.
- 📦 **Headless-архитектура**: Библиотека предоставляет только логику, свой UI вы делаете сами.

### Установка

```bash
npm install headless-llm
```

```bash
import { useAutoScroll, useLLMStream } from 'headless-llm';

export default function ChatApp() {
  // 1. Инициализируем умный автоскролл
  const { containerRef, isSticky } = useAutoScroll<HTMLDivElement>({
    behavior: 'smooth',
    threshold: 20
  });

  // 2. Инициализируем парсер LLM-стрима
  const { text, isGenerating, startStream, error } = useLLMStream();

  const handleGenerate = () => {
    // Передайте сюда URL вашего ИИ-бэкенда
    startStream('[https://my-ai-backend.com/api/chat](https://my-ai-backend.com/api/chat)', {
      method: 'POST',
      body: JSON.stringify({ prompt: "Расскажи сказку про React" })
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? "Нейросеть печатает..." : "Сгенерировать"}
      </button>

      {/* Привязываем ref к нашему скроллируемому контейнеру */}
      <div
        ref={containerRef}
        style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', marginTop: '10px' }}
      >
        <p>{text}</p>
      </div>

      {!isSticky && <p style={{ color: 'gray' }}>Вы читаете историю. Прокрутите вниз, чтобы возобновить автоскролл.</p>}
      {error && <p style={{ color: 'red' }}>Ошибка: {error.message}</p>}
    </div>
  );
}
```

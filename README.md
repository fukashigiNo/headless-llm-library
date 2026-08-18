# 🤖 headless-llm

[![npm version](https://img.shields.io/npm/v/headless-llm.svg)](https://www.npmjs.com/package/headless-llm)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[🇺🇸 English](#english) | [🇷🇺 Русский](#russian)

<a name="english"></a>

## 🇺🇸 English

A headless, UI-agnostic library for building AI chat interfaces (like ChatGPT). Provides smart auto-scrolling and `ReadableStream` parsing utilities.

Currently supports React, but it's built on a framework-agnostic Core (Vue/Svelte/Angular support coming in future releases).

### Features

- 🚀 **Smart Auto-scroll**: Automatically scrolls to the bottom as new text chunks arrive.
- 🧠 **User-aware**: Stops scrolling if the user scrolls up to read past messages, and resumes when they scroll back down.
- 💧 **Smooth Behavior**: Built-in support for smooth native scrolling.
- 🌊 **Stream Parsing**: Takes the pain out of parsing `ReadableStream` from LLM backends.
- 📦 **Headless Architecture**: Brings its own logic, you bring your own UI.

### Installation

```bash
npm install headless-llm
```

import { useAutoScroll, useLLMStream } from 'headless-llm';

export default function ChatApp() {
// 1. Initialize smart auto-scroll
const { containerRef, isSticky } = useAutoScroll<HTMLDivElement>({
behavior: 'smooth',
threshold: 20
});

// 2. Initialize LLM stream parser

```bash
const { text, isGenerating, startStream, error } = useLLMStream();

const handleGenerate = () => {
  // Pass your AI backend URL here
  startStream('[https://my-ai-backend.com/api/chat](https://my-ai-backend.com/api/chat)', {
    method: 'POST',
    body: JSON.stringify({ prompt: "Tell me a story about React" })
  });
};

return (
  <div style={{ maxWidth: '600px', margin: '0 auto' }}>
    <button onClick={handleGenerate} disabled={isGenerating}>
      {isGenerating ? "AI is typing..." : "Generate"}
    </button>

    {/* Attach the ref to your scrollable container */}
    <div
      ref={containerRef}
      style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', marginTop: '10px' }}
    >
      <p>{text}</p>
    </div>

    {!isSticky && <p style={{ color: 'gray' }}>You are reading history. Scroll down to resume auto-scroll.</p>}
    {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
  </div>
);
}
```

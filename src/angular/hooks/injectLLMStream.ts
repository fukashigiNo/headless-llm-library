import { signal, inject, DestroyRef } from '@angular/core';

export function injectLLMStream(apiEndpoint = '/api/chat') {
  const messages = signal<{ role: string; content: string }[]>([]);
  const isStreaming = signal(false);
  const error = signal<string | null>(null);
  let abortController: AbortController | null = null;

  inject(DestroyRef).onDestroy(() => {
    if (abortController) abortController.abort();
  });

  const send = async (prompt: string) => {
    if (!prompt.trim() || isStreaming()) return;

    isStreaming.set(true);
    error.set(null);
    abortController = new AbortController();

    messages.update(prev => [
      ...prev,
      { role: 'user', content: prompt },
      { role: 'assistant', content: '' }
    ]);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages().slice(0, -1) }),
        signal: abortController.signal,
      });

      if (!response.ok) throw new Error('Network error');
      if (!response.body) throw new Error('No readable stream');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        messages.update(prev => {
          const newMessages = [...prev];
          const lastIdx = newMessages.length - 1;
          newMessages[lastIdx] = {
            ...newMessages[lastIdx],
            content: newMessages[lastIdx].content + chunk
          };
          return newMessages;
        });
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        error.set(err.message || 'Unknown error');
        messages.update(prev => prev.slice(0, -1)); 
      }
    } finally {
      isStreaming.set(false);
      abortController = null;
    }
  };

  const stop = () => {
    if (abortController) abortController.abort();
  };

  return {
    messages: messages.asReadonly(),
    isStreaming: isStreaming.asReadonly(),
    error: error.asReadonly(),
    send,
    stop
  };
}
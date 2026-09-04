import { ref, readonly } from 'vue';

export const  useLLMStream = (apiEndpoint = '/api/chat') => {
  const messages = ref<{ role: string; content: string }[]>([]);
  const isStreaming = ref(false);
  const error = ref<string | null>(null);
  const abortController = ref<AbortController | null>(null);

  const send = async (prompt: string) => {
    if (!prompt.trim() || isStreaming.value) return;

    isStreaming.value = true;
    error.value = null;
    abortController.value = new AbortController();

    messages.value.push({ role: 'user', content: prompt });
    messages.value.push({ role: 'assistant', content: '' });

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages.value.slice(0, -1) }),
        signal: abortController.value.signal,
      });

      if (!response.ok) throw new Error('Network error');
      if (!response.body) throw new Error('No readable stream');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lastIdx = messages.value.length - 1;
        messages.value[lastIdx].content += chunk; 
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Stream aborted by user');
      } else {
        error.value = err.message || 'Unknown error';
        messages.value.pop(); 
      }
    } finally {
      isStreaming.value = false;
      abortController.value = null;
    }
  };

  const stop = () => {
    if (abortController.value) {
      abortController.value.abort();
    }
  };

  return {
    messages: readonly(messages),
    isStreaming: readonly(isStreaming),
    error: readonly(error),
    send,
    stop
  };
}
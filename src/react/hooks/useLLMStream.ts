import { useState, useCallback } from 'react';

export const useLLMStream = () => {
  const [text, setText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const startStream = useCallback(async (url: string, options?: RequestInit) => {
    setIsGenerating(true);
    setText(""); 
    setError(null);

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (!response.body) {
        throw new Error("Бэкенд не вернул ReadableStream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { value, done } = await reader.read();
        
        if (done) break; 
        
        const chunk = decoder.decode(value, { stream: true });
        
        setText(prev => prev + chunk);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    text,
    isGenerating,
    error,
    startStream,
  };
};
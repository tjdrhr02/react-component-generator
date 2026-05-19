import { useState, useCallback, useEffect } from 'react';
import type { GeneratedComponent, Provider } from '../types';

interface UseComponentGeneratorReturn {
  components: GeneratedComponent[];
  isLoading: boolean;
  error: string | null;
  generate: (prompt: string, apiKey: string | undefined, provider: Provider) => Promise<void>;
  removeComponent: (id: string) => void;
  clearAll: () => void;
}

const STORAGE_KEY = 'react-component-generator:components';

function loadComponentsFromStorage(): GeneratedComponent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.map((c) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        }))
      : [];
  } catch {
    return [];
  }
}

function saveComponentsToStorage(components: GeneratedComponent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(components));
  } catch {
    // 저장 실패 시 조용히 넘어가기
  }
}

export function useComponentGenerator(): UseComponentGeneratorReturn {
  const [components, setComponents] = useState<GeneratedComponent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const stored = loadComponentsFromStorage();
    setComponents(stored);
    setIsInitialized(true);
  }, []);

  const generate = useCallback(async (prompt: string, apiKey: string | undefined, provider: Provider) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ...(apiKey && { apiKey }), provider }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate component');
      }

      const newComponent: GeneratedComponent = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        prompt,
        code: data.code,
        createdAt: new Date(),
        provider,
      };

      setComponents((prev) => {
        const updated = [newComponent, ...prev];
        saveComponentsToStorage(updated);
        return updated;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeComponent = useCallback((id: string) => {
    setComponents((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveComponentsToStorage(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setComponents([]);
    saveComponentsToStorage([]);
  }, []);

  return { components, isLoading, error, generate, removeComponent, clearAll };
}

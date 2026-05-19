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
      ? parsed.map((c) => {
          const createdAt = c.createdAt ? new Date(c.createdAt) : new Date();
          return {
            ...c,
            createdAt: isValidDate(createdAt) ? createdAt : new Date(),
          };
        })
      : [];
  } catch {
    return [];
  }
}

function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

function saveComponentsToStorage(components: GeneratedComponent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(components));
  } catch (err) {
    // localStorage 할당량 초과 또는 접근 불가 상황에 대해 로깅할 수 있음
    // 현재는 silently fail - UI에 영향을 주지 않음
  }
}

export function useComponentGenerator(): UseComponentGeneratorReturn {
  const [components, setComponents] = useState<GeneratedComponent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadComponentsFromStorage();
    setComponents(stored);
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

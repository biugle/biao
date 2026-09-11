export interface BiuEventEnvelope<T = unknown> {
  name: string;
  payload: T;
  source?: string;
  timestamp: number;
}

export interface BiuEventBus {
  publish<T>(name: string, payload: T, source?: string): void;
  subscribe<T>(name: string, listener: (event: BiuEventEnvelope<T>) => void): () => void;
  clear(name?: string): void;
}

/** Framework-neutral, scoped event bus for same-document consumers. */
export function createBiuEventBus(): BiuEventBus {
  const listeners = new Map<string, Set<(event: BiuEventEnvelope<unknown>) => void>>();

  return {
    publish<T>(name: string, payload: T, source?: string) {
      const event: BiuEventEnvelope<T> = {
        name,
        payload,
        source,
        timestamp: Date.now(),
      };
      listeners.get(name)?.forEach((listener) => listener(event as BiuEventEnvelope<unknown>));
    },
    subscribe<T>(name: string, listener: (event: BiuEventEnvelope<T>) => void) {
      const bucket = listeners.get(name) ?? new Set();
      const wrapped = listener as (event: BiuEventEnvelope<unknown>) => void;
      bucket.add(wrapped);
      listeners.set(name, bucket);
      return () => {
        bucket.delete(wrapped);
        if (!bucket.size) listeners.delete(name);
      };
    },
    clear(name?: string) {
      if (name) listeners.delete(name);
      else listeners.clear();
    },
  };
}

export const biuEventBus = createBiuEventBus();

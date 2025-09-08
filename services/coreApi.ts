import type { AppData } from '../types';

export const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function apiFetch<T = any>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function getHealth() {
  return apiFetch('/health');
}

export async function getAppData() {
  return apiFetch<AppData>('/app-data');
}

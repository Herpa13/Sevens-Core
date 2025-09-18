"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_BASE = void 0;
exports.apiFetch = apiFetch;
exports.getHealth = getHealth;
exports.getAppData = getAppData;
exports.API_BASE = import.meta.env.VITE_API_BASE || '';
async function apiFetch(path, init) {
    const url = `${exports.API_BASE}${path}`;
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
    return res.json();
}
async function getHealth() {
    return apiFetch('/health');
}
async function getAppData() {
    return apiFetch('/app-data');
}

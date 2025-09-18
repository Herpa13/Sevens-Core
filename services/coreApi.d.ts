import type { AppData } from '../types';
export declare const API_BASE: any;
export declare function apiFetch<T = any>(path: string, init?: RequestInit): Promise<T>;
export declare function getHealth(): Promise<any>;
export declare function getAppData(): Promise<AppData>;

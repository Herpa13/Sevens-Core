import type { User } from '../types';
/**
 * Checks if a user has permission to access a specific view or entity.
 * @param user The user object, or null if not logged in.
 * @param viewKey The key representing the view or entity (e.g., 'products', 'pvprMatrix').
 * @returns True if the user has permission, false otherwise.
 */
export declare const hasPermission: (user: User | null, viewKey: string) => boolean;

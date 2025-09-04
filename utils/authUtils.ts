import type { User } from '../types';

/**
 * Checks if a user has permission to access a specific view or entity.
 * @param user The user object, or null if not logged in.
 * @param viewKey The key representing the view or entity (e.g., 'products', 'pvprMatrix').
 * @returns True if the user has permission, false otherwise.
 */
export const hasPermission = (user: User | null, viewKey: string): boolean => {
    if (!user) {
        return false;
    }

    if (user.role === 'Administrador') {
        return true;
    }

    if (user.role === 'Nivel 2') {
        // Nivel 2 can see everything except user management
        return viewKey !== 'users';
    }

    if (user.role === 'Nivel 3') {
        // Nivel 3 can only see what's explicitly allowed in their allowedViews
        return user.allowedViews?.includes(viewKey) || false;
    }

    // Default to deny access if role is unrecognized
    return false;
};

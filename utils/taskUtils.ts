import type { TaskRecurrence } from '../types';

export const calculateNextDueDate = (currentDueDate: string, recurrence: TaskRecurrence): string => {
    const date = new Date(currentDueDate + 'T00:00:00'); // Ensure it's treated as local date

    switch (recurrence.frequency) {
        case 'daily':
            date.setDate(date.getDate() + recurrence.interval);
            break;
        case 'weekly':
            date.setDate(date.getDate() + 7 * recurrence.interval);
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + recurrence.interval);
            break;
        case 'yearly':
            date.setFullYear(date.getFullYear() + recurrence.interval);
            break;
    }
    
    return date.toISOString().split('T')[0];
};

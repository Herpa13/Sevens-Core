"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateNextDueDate = void 0;
const calculateNextDueDate = (currentDueDate, recurrence) => {
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
exports.calculateNextDueDate = calculateNextDueDate;

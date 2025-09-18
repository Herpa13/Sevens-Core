import React from 'react';
import type { User } from '../types';
interface LoginViewProps {
    onLogin: (user: User) => void;
    users: User[];
}
export declare const LoginView: React.FC<LoginViewProps>;
export {};

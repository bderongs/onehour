"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Notification } from '../components/Notification';

type NotificationType = 'success' | 'error';

interface NotificationContextType {
    showNotification: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notification, setNotification] = useState<{
        show: boolean;
        type: NotificationType;
        message: string;
    } | null>(null);

    const showNotification = useCallback((type: NotificationType, message: string) => {
        setNotification({ show: true, type, message });
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification?.show && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
} 
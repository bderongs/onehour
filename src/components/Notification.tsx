import { useEffect } from 'react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface NotificationProps {
    type: 'success' | 'error';
    message: string;
    onClose: () => void;
}

export function Notification({ type, message, onClose }: NotificationProps) {
    // Auto-dismiss after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`fixed top-4 right-4 left-4 sm:left-auto sm:w-96 rounded-lg shadow-lg ${
                    type === 'success' 
                        ? 'bg-white border-l-4 border-green-500' 
                        : 'bg-white border-l-4 border-red-500'
                } z-50`}
            >
                <div className="p-4">
                    <div className="flex items-start gap-3">
                        {type === 'success' ? (
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 text-gray-700">{message}</div>
                        <button 
                            onClick={onClose}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Fermer la notification"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <motion.div 
                    className={`h-1 rounded-b-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                />
            </motion.div>
        </AnimatePresence>
    );
} 
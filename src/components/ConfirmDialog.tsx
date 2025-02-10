import { motion, AnimatePresence } from 'framer-motion';

export interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel,
    onConfirm,
    onCancel,
    variant = 'danger'
}: ConfirmDialogProps) {
    const variantStyles = {
        danger: {
            button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
            icon: 'text-red-600'
        },
        warning: {
            button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
            icon: 'text-yellow-600'
        },
        info: {
            button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
            icon: 'text-blue-600'
        }
    }[variant];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.25 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-40"
                        onClick={onCancel}
                    />
                    
                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {message}
                                </p>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
                                {cancelLabel && (
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        onClick={onCancel}
                                    >
                                        {cancelLabel}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantStyles.button}`}
                                    onClick={onConfirm}
                                >
                                    {confirmLabel}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
} 
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    CheckCircle2, 
    AlertCircle, 
    Info, 
    AlertTriangle,
    Music,
    Bell
} from 'lucide-react';

const FeedbackContext = createContext();

export const useFeedback = () => {
    const context = useContext(FeedbackContext);
    if (!context) {
        throw new Error('useFeedback must be used within a FeedbackProvider');
    }
    return context;
};

export const FeedbackProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'info', // 'danger', 'info', 'success'
        onConfirm: () => {},
        onCancel: () => {}
    });

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const showConfirm = useCallback(({ 
        title, 
        message, 
        confirmText = 'Confirm', 
        cancelText = 'Cancel', 
        type = 'info',
        onConfirm,
        onCancel
    }) => {
        setConfirmModal({
            isOpen: true,
            title,
            message,
            confirmText,
            cancelText,
            type,
            onConfirm: () => {
                onConfirm?.();
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            },
            onCancel: () => {
                onCancel?.();
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            }
        });
    }, []);

    return (
        <FeedbackContext.Provider value={{ showToast, showConfirm }}>
            {children}
            
            {/* Global Toasts */}
            <div className="fixed top-6 right-6 z-[200] space-y-3 pointer-events-none flex flex-col items-end">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className={`glass-panel p-3 border-l-[3px] flex flex-col gap-3 shadow-xl backdrop-blur-md min-w-[240px] max-w-[320px] overflow-hidden relative ${
                                toast.type === 'error' ? 'border-rose-500 bg-rose-500/5' : 
                                toast.type === 'info' ? 'border-indigo-500 bg-indigo-500/5' : 
                                'border-emerald-500 bg-emerald-500/5'
                            }`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-lg ${
                                        toast.type === 'error' ? 'text-rose-500 bg-rose-500/10' :
                                        toast.type === 'info' ? 'text-indigo-500 bg-indigo-500/10' :
                                        'text-emerald-500 bg-emerald-500/10'
                                    }`}>
                                        {toast.type === 'error' ? <AlertCircle size={14} /> : 
                                         toast.type === 'info' ? <Info size={14} /> : 
                                         <CheckCircle2 size={14} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] font-medium text-white/90 leading-tight">{toast.message}</p>
                                    </div>
                                    <button 
                                        onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                                        className="text-white/20 hover:text-white transition-colors"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                                {/* Progress Bar */}
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
                                    <motion.div 
                                        initial={{ width: "100%" }}
                                        animate={{ width: 0 }}
                                        transition={{ duration: 4, ease: "linear" }}
                                        className={`h-full ${
                                            toast.type === 'error' ? 'bg-rose-500' : 
                                            toast.type === 'info' ? 'bg-indigo-500' : 
                                            'bg-emerald-500'
                                        }`}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Global Confirmation Modal */}
            <AnimatePresence>
                {confirmModal.isOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={confirmModal.onCancel}
                            className="absolute inset-0 bg-brand-bg/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 1.05, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, y: -10 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="glass-panel w-full max-w-[320px] p-6 relative z-10 border-white/5 shadow-2xl text-center"
                        >
                            <div className={`w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                                confirmModal.type === 'danger' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/10' :
                                'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10'
                            }`}>
                                {confirmModal.type === 'danger' ? <AlertTriangle size={24} /> : <Bell size={24} />}
                            </div>
                            
                            <h2 className="text-lg font-bold text-white tracking-tight mb-1">{confirmModal.title}</h2>
                            <p className="text-[13px] text-gray-400 font-medium leading-relaxed mb-6">{confirmModal.message}</p>
                            
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={confirmModal.onConfirm}
                                    className={`w-full py-3 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all haptic-hover ${
                                        confirmModal.type === 'danger' ? 'bg-rose-600 text-white hover:bg-rose-500' : 'bg-brand-teal text-brand-bg hover:bg-brand-teal/90'
                                    }`}
                                >
                                    {confirmModal.confirmText}
                                </button>
                                <button
                                    onClick={confirmModal.onCancel}
                                    className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-gray-400 font-bold text-[11px] uppercase tracking-wider hover:bg-white/10 transition-all haptic-hover"
                                >
                                    {confirmModal.cancelText}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </FeedbackContext.Provider>
    );
};

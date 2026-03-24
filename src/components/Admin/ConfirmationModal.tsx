import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}) => {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: <AlertTriangle className="text-brand-red" size={24} />,
            bg: 'bg-brand-red/10',
            button: 'bg-brand-red hover:bg-red-700 shadow-brand-red/20'
        },
        warning: {
            icon: <AlertTriangle className="text-amber-500" size={24} />,
            bg: 'bg-amber-500/10',
            button: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
        },
        info: {
            icon: <AlertTriangle className="text-brand-green" size={24} />,
            bg: 'bg-brand-green/10',
            button: 'bg-brand-green hover:bg-brand-green-dark shadow-brand-green/20'
        }
    };

    const style = variantStyles[variant];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${style.bg}`}>
                            {style.icon}
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-gray-400">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <h3 className="text-xl font-900 tracking-tight text-brand-text mb-2">{title}</h3>
                    <p className="text-sm font-500 text-gray-500 leading-relaxed mb-8">{message}</p>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl font-700 text-gray-400 hover:text-brand-text hover:bg-brand-bg transition-all"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 px-6 py-3 rounded-xl font-800 text-white transition-all shadow-lg ${style.button}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;

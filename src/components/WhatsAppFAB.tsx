import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const WhatsAppFAB: React.FC = () => {
    const { getSetting } = useSettings();
    
    const enabled = getSetting('whatsapp_enabled') === 'true';
    const number = getSetting('whatsapp_number');
    const message = getSetting('whatsapp_message');

    if (!enabled || !number) return null;

    // Remove any non-numeric characters from the phone number except the leading +
    const cleanNumber = number.replace(/[^\d+]/g, '');
    const encodedMessage = encodeURIComponent(message || '');
    const whatsappUrl = `https://wa.me/${cleanNumber.startsWith('+') ? cleanNumber.substring(1) : cleanNumber}?text=${encodedMessage}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
            aria-label="Chat on WhatsApp"
        >
            <div className="absolute -top-12 right-0 bg-white text-brand-text text-[0.7rem] font-800 px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-black/5 pointer-events-none">
                Chat with us!
                <div className="absolute -bottom-1 right-4 w-2 h-2 bg-white rotate-45 border-r border-b border-black/5"></div>
            </div>
            <MessageCircle size={28} className="fill-current" />
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:hidden"></span>
        </a>
    );
};

export default WhatsAppFAB;

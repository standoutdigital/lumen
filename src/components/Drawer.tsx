import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children, headerActions }) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-4 right-4 h-[calc(100vh-2rem)] w-[600px] bg-gradient-to-l from-zinc-950/95 to-black/95 backdrop-blur-2xl border border-white/10 shadow-2xl z-[60] flex flex-col rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/5">
                <h2 className="text-xl font-bold text-white truncate flex-1 mr-4">{title}</h2>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                    {headerActions}
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors ml-2">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

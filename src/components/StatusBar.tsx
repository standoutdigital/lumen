import React from 'react';
import { Terminal, Bell, Wifi, Server } from 'lucide-react';
import { clsx } from 'clsx';

interface StatusBarProps {
    activeCluster: string | null;
    onTogglePanel: () => void;
    isPanelOpen: boolean;
    notificationCount?: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
    activeCluster, 
    onTogglePanel, 
    isPanelOpen,
    notificationCount = 0
}) => {
    return (
        <div className="h-6 bg-[#0a0a0a] border-t border-white/10 text-gray-400 flex items-center justify-between px-2 text-xs select-none z-50">
            {/* Left Section */}
            <div className="flex items-center h-full">
                <button 
                    onClick={onTogglePanel}
                    className={clsx(
                        "flex items-center gap-1.5 px-2 h-full hover:bg-white/10 transition-colors focus:outline-none",
                        isPanelOpen && "bg-white/20"
                    )}
                    title="Toggle Terminal (Ctrl+`)"
                >
                    <Terminal size={12} />
                    <span>Terminal</span>
                </button>
                
                <button className="flex items-center gap-1.5 px-2 h-full hover:bg-white/10 transition-colors focus:outline-none">
                    <Bell size={12} />
                    {notificationCount > 0 && (
                        <span className="bg-white/20 px-1 rounded-full text-[10px]">{notificationCount}</span>
                    )}
                </button>
            </div>

            {/* Right Section */}
            <div className="flex items-center h-full gap-4">
                {activeCluster ? (
                    <div className="flex items-center gap-1.5 px-2 h-full hover:bg-white/10 hover:text-gray-200 transition-colors cursor-pointer">
                        <Server size={12} />
                        <span>{activeCluster}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 px-2 h-full text-gray-600">
                        <Server size={12} />
                        <span>No Cluster</span>
                    </div>
                )}

                <div className="flex items-center gap-1.5 px-2 h-full hover:bg-white/10 transition-colors cursor-pointer">
                     <Wifi size={12} />
                     <span>Online</span>
                </div>
            </div>
        </div>
    );
};

import React, { useEffect, useState } from 'react';

interface TimeAgoProps {
    timestamp: string | number | Date;
}

export const TimeAgo: React.FC<TimeAgoProps> = ({ timestamp }) => {
    const [label, setLabel] = useState('');

    useEffect(() => {
        const update = () => {
            const date = new Date(timestamp);
            const now = new Date();
            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

            if (diffInSeconds < 0) {
                // Future date? Just show 0s or date
                setLabel('0s');
                return;
            }

            // After 48 hours (48 * 60 * 60 = 172800 seconds), show Date
            if (diffInSeconds > 172800) {
                setLabel(date.toLocaleDateString());
            } else if (diffInSeconds < 60) {
                setLabel(`${diffInSeconds}s`);
            } else if (diffInSeconds < 3600) {
                setLabel(`${Math.floor(diffInSeconds / 60)}m`);
            } else {
                setLabel(`${Math.floor(diffInSeconds / 3600)}h`);
            }
        };

        update();
        // Update every second. 
        // React state updates bail out if value hasn't changed, 
        // so this is relatively efficient even if running often.
        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, [timestamp]);

    return <span>{label}</span>;
};

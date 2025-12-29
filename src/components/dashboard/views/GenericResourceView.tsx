import React from 'react';
import { motion } from 'framer-motion';
import { ResourceTable } from '../../shared/ResourceTable';

interface GenericResourceViewProps {
    title?: string; // Optional override, usually handled by header
    description?: string;
    headers: (string | { label: string; key?: string; sortable?: boolean })[]; // Support simple strings or objects
    data: any[];
    renderRow: (item: any) => React.ReactNode;
    onRowClick?: (item: any) => void;
    sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
    onSort?: (key: string) => void;
    viewKey?: string; // For motion key
}

export const GenericResourceView: React.FC<GenericResourceViewProps> = ({
    description,
    headers,
    data,
    renderRow,
    onRowClick,
    sortConfig,
    onSort,
    viewKey = "resource-view"
}) => {
    const pageVariants = {
        initial: { opacity: 0, y: 10 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -10 }
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.3
    };

    return (
        <motion.div 
            key={viewKey}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition as any}
            className="mb-8"
        >
            {description && (
                <p className="text-sm text-gray-400 mb-4">
                    {description}
                </p>
            )}
            <ResourceTable 
                headers={headers}
                data={data}
                renderRow={renderRow}
                onRowClick={onRowClick}
                sortConfig={sortConfig}
                onSort={onSort}
            />
        </motion.div>
    );
};

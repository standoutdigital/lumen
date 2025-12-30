import React from 'react';
import { motion } from 'framer-motion';
import { VirtualizedTable, IColumn } from '../../shared/VirtualizedTable';

interface GenericResourceViewProps {
    title?: string; // Optional override, usually handled by header
    description?: string;
    columns: IColumn[];
    data: any[];
    onRowClick?: (item: any) => void;
    sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
    onSort?: (key: string) => void;
    viewKey?: string; // For motion key
}

export const GenericResourceView: React.FC<GenericResourceViewProps> = ({
    description,
    columns,
    data,
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
            className="mb-8 flex flex-col h-full"
        >
            {description && (
                <p className="text-sm text-gray-400 mb-4 flex-none">
                    {description}
                </p>
            )}
            <div className="flex-1 min-h-0">
                <VirtualizedTable
                    columns={columns}
                    data={data}
                    onRowClick={onRowClick}
                    sortConfig={sortConfig}
                    onSort={onSort}
                />
            </div>
        </motion.div>
    );
};

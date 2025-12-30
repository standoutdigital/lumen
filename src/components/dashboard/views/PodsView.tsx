import React from 'react';
import { motion } from 'framer-motion';
import { ResourceTable } from '../../shared/ResourceTable';
import { TimeAgo } from '../../shared/TimeAgo';
import { PodVisualizer } from '../../resources/visualizers/PodVisualizer';
import { ErrorBoundary } from '../../shared/ErrorBoundary';

interface PodsViewProps {
    viewMode: 'list' | 'visual';
    pods: any[];
    sortedPods: any[];
    nodes: any[];
    sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
    onSort: (key: string) => void;
    onRowClick: (pod: any) => void;
}

export const PodsView: React.FC<PodsViewProps> = ({
    viewMode,
    pods,
    sortedPods,
    nodes,
    sortConfig,
    onSort,
    onRowClick
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
            key="pods"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition as any}
            className="mb-8"
        >
            {viewMode === 'list' ? (
                <>
                    <p className="text-sm text-gray-400 mb-4">
                        The smallest deployable units of computing that you can create and manage.
                    </p>
                    <ResourceTable
                        headers={[
                            { label: 'Name', key: 'name', sortable: true },
                            { label: 'Namespace', key: 'namespace', sortable: true },
                            { label: 'Restarts', key: 'restarts', sortable: true },
                            { label: 'Status', key: 'status', sortable: true },
                            { label: 'Containers' }, // Not sortable
                            { label: 'Age', key: 'age', sortable: true }
                        ]}
                        data={sortedPods}
                        sortConfig={sortConfig}
                        onSort={onSort}
                        onRowClick={onRowClick}
                        renderRow={(pod: any) => (
                            <>
                                <td className="px-6 py-3 font-medium text-gray-200">{pod.name}</td>
                                <td className="px-6 py-3 text-gray-400">{pod.namespace}</td>
                                <td className="px-6 py-3 text-gray-400">{pod.restarts}</td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-0.5 rounded text-xs border ${pod.status === 'Running' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        pod.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                            pod.status === 'Succeeded' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                pod.status === 'Failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                        }`}>
                                        {pod.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex gap-1 items-center">
                                        {pod.containers?.map((c: any, idx: number) => {
                                            let color = 'bg-gray-500';
                                            if (c.state === 'running' && c.ready) color = 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]';
                                            else if (c.state === 'running' && !c.ready) color = 'bg-yellow-500';
                                            else if (c.state === 'waiting') color = 'bg-yellow-500 animate-pulse';
                                            else if (c.state === 'terminated' && c.restartCount > 0) color = 'bg-red-500';
                                            else if (c.state === 'terminated') color = 'bg-gray-500';

                                            return (
                                                <div
                                                    key={idx}
                                                    className={`w-2 h-2 rounded-full ${color}`}
                                                    title={`${c.name}: ${c.state} (Restarts: ${c.restartCount})`}
                                                />
                                            );
                                        })}
                                    </div>
                                </td>
                                <td className="px-6 py-3 text-gray-400"><TimeAgo timestamp={pod.age} /></td>
                            </>
                        )}
                    />
                </>
            ) : (
                <ErrorBoundary>
                    <PodVisualizer
                        pods={pods}
                        nodes={nodes}
                    />
                </ErrorBoundary>
            )}
        </motion.div>
    );
};

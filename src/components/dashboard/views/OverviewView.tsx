import React from 'react';
import { OverviewCharts } from '../OverviewCharts';
import { EventsTable } from '../EventsTable';

interface OverviewViewProps {
    pods: any[];
    deployments: any[];
    events: any[];
    onNavigate?: (view: string) => void;
    onSwitchToVisualPods: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ pods, deployments, events, onNavigate, onSwitchToVisualPods }) => {
    return (
        <div className="mb-8">
            <p className="text-sm text-gray-400 mb-6">
                Real-time health status and activities of your cluster.
            </p>
            
            <OverviewCharts 
                pods={pods} 
                deployments={deployments} 
                onViewDetails={() => {
                    if (onNavigate) {
                        onNavigate('pods');
                        onSwitchToVisualPods();
                    }
                }}
            />
            
            <EventsTable events={events} />
        </div>
    );
}

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, Tag, List, Server, Network, Copy, Check } from 'lucide-react';
import { ResourceTopology } from '../visualizers/ResourceTopology';

interface PodDetailsProps {
    pod: any;
    explanation?: string | null;
    onOpenLogs: (containerName: string) => void;
    onExplain?: () => void;
    isExplaining?: boolean;
    onNavigate?: (kind: string, name: string) => void;
    onShowTopology?: () => void;
    clusterName?: string;
}

export const PodDetails: React.FC<PodDetailsProps> = ({ pod, explanation, onOpenLogs, onExplain, isExplaining, onNavigate, onShowTopology, clusterName }) => {
    const [copiedImage, setCopiedImage] = useState<string | null>(null);
    const [showTopology, setShowTopology] = useState(false);

    if (!pod) return null;

    const { metadata, spec, status } = pod;

    const handleCopyImage = (image: string) => {
        navigator.clipboard.writeText(image);
        setCopiedImage(image);
        setTimeout(() => setCopiedImage(null), 2000);
    };

    return (
        <div className="space-y-8 text-sm">
            {/* AI Explanation Section (Placeholder for future) */}
            {explanation && (
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-4 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
                    <h3 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
                        <span className="text-lg">✨</span> AI Explanation
                    </h3>
                    <div className="text-gray-200 leading-relaxed font-sans text-sm prose prose-invert max-w-none prose-p:my-1 prose-headings:text-blue-300 prose-headings:mt-3 prose-headings:mb-1 prose-ul:my-1 prose-li:my-0">
                        <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                </div>
            )}

            {/* Metadata Section */}
            <div>
                 <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-500 uppercase font-bold text-xs tracking-wider">Metadata</h3>
                    <div className="flex items-center gap-2">
                        {onShowTopology && (
                            <button
                                onClick={() => setShowTopology(!showTopology)}
                                className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border ${
                                    showTopology 
                                        ? 'bg-pink-600/80 hover:bg-pink-500 text-white border-transparent' 
                                        : 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-500 hover:to-pink-500 text-white border-transparent'
                                } hover:shadow-lg hover:scale-105 active:scale-95`}
                            >
                                <span className="text-xs">{showTopology ? '✖️' : '🔗'}</span> {showTopology ? 'Hide' : 'Display'} Topology
                            </button>
                        )}
                        {onExplain && (
                        <button
                            onClick={onExplain}
                            disabled={isExplaining}
                            className={`
                                flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                transition-all duration-300 border
                                ${isExplaining 
                                    ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 cursor-wait' 
                                    : 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-500 hover:to-purple-500 text-white border-transparent hover:shadow-lg hover:scale-105 active:scale-95'
                                }
                            `}
                        >
                            {isExplaining ? (
                                <>
                                    <div className="w-2 h-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <span className="text-xs">✨</span> Explain
                                </>
                            )}
                        </button>
                        )}
                    </div>
                 </div>
                 <div className="bg-white/5 rounded-md p-4 border border-white/10 space-y-2">
                    <div className="grid grid-cols-3 gap-4">
                        <span className="text-gray-400">Name</span>
                        <span className="col-span-2 text-white font-mono">{metadata.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="text-gray-400">Namespace</span>
                        <span className="col-span-2 text-white font-mono">{metadata.namespace}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="text-gray-400">Created</span>
                        <span className="col-span-2 text-white">{new Date(metadata.creationTimestamp).toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="text-gray-400">UID</span>
                        <span className="col-span-2 text-gray-500 font-mono text-xs">{metadata.uid}</span>
                    </div>
                    
                    {/* Controlled By */}
                    {metadata.ownerReferences && (
                        <div className="grid grid-cols-3 gap-4">
                            <span className="text-gray-400">Controlled By</span>
                            <div className="col-span-2 space-y-1">
                                {metadata.ownerReferences.map((ref: any) => (
                                    <div key={ref.uid} className="flex items-center gap-2 text-xs">
                                        <span className="text-gray-400">{ref.kind}</span>
                                        {onNavigate ? (
                                            <button 
                                                onClick={() => onNavigate(ref.kind, ref.name)}
                                                className="text-blue-400 hover:text-blue-300 underline font-mono cursor-pointer"
                                            >
                                                {ref.name}
                                            </button>
                                        ) : (
                                            <span className="text-blue-400 font-mono">{ref.name}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                 </div>
            </div>

            {/* Inline Topology View */}
            {showTopology && clusterName && (
                <div className="border border-purple-500/30 rounded-lg overflow-hidden bg-black/20">
                    <ResourceTopology clusterName={clusterName} resource={pod} />
                </div>
            )}

            {/* Status & Networking */}
            <div>
                 <h3 className="text-gray-500 uppercase font-bold text-xs tracking-wider mb-3 flex items-center gap-2">
                    <Network size={14}/> Status & Networking
                 </h3>
                 <div className="bg-white/5 rounded-md p-4 border border-white/10 space-y-2">
                    <div className="grid grid-cols-3 gap-4">
                        <span className="text-gray-400">Phase</span>
                        <span className={`col-span-2 font-bold ${status.phase === 'Running' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {status.phase}
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="text-gray-400">Host IP</span>
                        <span className="col-span-2 text-white font-mono">{status.hostIP || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="text-gray-400">Pod IP</span>
                        <span className="col-span-2 text-white font-mono">{status.podIP || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <span className="text-gray-400">Node</span>
                        <span className="col-span-2 text-white font-mono">{spec.nodeName || '-'}</span>
                    </div>
                     <div className="grid grid-cols-3 gap-4">
                        <span className="text-gray-400">QoS Class</span>
                        <span className="col-span-2 text-white">{status.qosClass}</span>
                    </div>
                 </div>
            </div>

            {/* Labels & Annotations */}
            <div>
                 <h3 className="text-gray-500 uppercase font-bold text-xs tracking-wider mb-3 flex items-center gap-2">
                    <Tag size={14}/> Labels
                 </h3>
                 <div className="flex flex-wrap gap-2 mb-6">
                    {metadata.labels ? Object.entries(metadata.labels).map(([k, v]) => (
                        <div key={k} className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs border border-blue-500/20 font-mono">
                            {k}: {String(v)}
                        </div>
                    )) : <span className="text-gray-500 italic">No labels</span>}
                 </div>

                 <h3 className="text-gray-500 uppercase font-bold text-xs tracking-wider mb-3 flex items-center gap-2">
                    <List size={14}/> Annotations
                 </h3>
                 <div className="space-y-1">
                    {metadata.annotations ? Object.entries(metadata.annotations).map(([k, v]) => (
                        <div key={k} className="grid grid-cols-1 gap-1 border-b border-white/10 pb-2 mb-2 last:border-0">
                            <span className="text-gray-400 font-mono text-xs">{k}</span>
                            <span className="text-gray-300 break-all">{String(v)}</span>
                        </div>
                    )) : <span className="text-gray-500 italic">No annotations</span>}
                 </div>
            </div>

            {/* Containers */}
            <div>
                 <h3 className="text-gray-500 uppercase font-bold text-xs tracking-wider mb-3 flex items-center gap-2">
                    <Box size={14}/> Containers
                 </h3>
                 <div className="space-y-4">
                     {spec.containers.map((c: any) => (
                         <div key={c.name} className="bg-white/5 border border-white/10 rounded-md p-4">
                             <div className="flex items-center justify-between mb-4">
                                 <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                     <span className="font-bold text-white text-lg">{c.name}</span>
                                 </div>
                                 <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-2 py-1">
                                     <span className="text-gray-400 text-xs font-mono">{c.image}</span>
                                     <button 
                                        onClick={() => handleCopyImage(c.image)}
                                        className="text-gray-500 hover:text-white transition-colors p-1"
                                        title="Copy Image"
                                     >
                                         {copiedImage === c.image ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                     </button>
                                     <div className="w-px h-3 bg-white/10 mx-1"></div>
                                     <button
                                        onClick={() => onOpenLogs(c.name)}
                                        className="text-gray-500 hover:text-blue-400 transition-colors p-1 flex items-center gap-1 group"
                                        title="View Logs"
                                     >
                                         <Server size={14} className="group-hover:text-blue-400"/>
                                         <span className="text-[10px] hidden group-hover:inline font-mono">LOGS</span>
                                     </button>
                                 </div>
                             </div>

                             {/* Ports */}
                             {c.ports && (
                                <div className="mb-4">
                                    <span className="text-gray-500 text-xs uppercase font-bold block mb-2">Exposed Ports</span>
                                    <div className="flex flex-wrap gap-2">
                                        {c.ports.map((p: any) => (
                                            <div key={p.containerPort} className="bg-white/10 text-gray-300 px-2 py-1 rounded text-xs font-mono flex items-center gap-1">
                                                <Server size={12} className="text-gray-500"/>
                                                {p.containerPort}/{p.protocol}
                                                {p.name && <span className="text-gray-500 ml-1">({p.name})</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             )}
                             
                             {/* Env Vars */}
                             {c.env && (
                                 <div>
                                     <span className="text-gray-500 text-xs uppercase font-bold block mb-2">Environment</span>
                                     <div className="grid grid-cols-1 gap-1 bg-black/40 p-2 rounded border border-white/10">
                                         {c.env.map((e: any) => (
                                             <div key={e.name} className="flex gap-2 text-xs font-mono border-b border-white/10 last:border-0 py-1">
                                                 <span className="text-blue-400 min-w-[120px]">{e.name}</span>
                                                 <span className="text-gray-500">=</span>
                                                 <span className="text-green-400 break-all">{e.value || (e.valueFrom ? "from reference..." : "")}</span>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             )}
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    );
};

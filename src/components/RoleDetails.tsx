import React from 'react';
import { Shield, Calendar, Scale } from 'lucide-react';
import { TimeAgo } from './TimeAgo';

interface RoleDetailsProps {
    resource: any;
}

export const RoleDetails: React.FC<RoleDetailsProps> = ({ resource }) => {
    if (!resource) return null;

    return (
        <div className="space-y-6">
            {/* Header / Meta */}
            <div className="bg-[#252526] rounded-lg p-4 border border-[#333]">
                <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Metadata</h3>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs text-gray-500">Name</label>
                        <div className="font-mono text-white flex items-center gap-2">
                             <Shield size={14} className="text-blue-400" />
                             {resource.metadata?.name}
                        </div>
                     </div>
                      <div>
                        <label className="text-xs text-gray-500">Namespace</label>
                        <div className="text-white">{resource.metadata?.namespace}</div>
                     </div>
                     <div>
                        <label className="text-xs text-gray-500">Created</label>
                        <div className="text-white flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400"/>
                             <TimeAgo timestamp={resource.metadata?.creationTimestamp} />
                        </div>
                     </div>
                </div>
            </div>

            {/* Rules */}
            <div>
                 <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Scale size={16} /> Rules
                 </h3>
                 <div className="space-y-3">
                    {resource.rules?.map((rule: any, idx: number) => (
                        <div key={idx} className="bg-[#252526] rounded-lg p-3 border border-[#333]">
                            
                            {/* Resources */}
                            <div className="mb-2">
                                <span className="text-xs text-gray-500 uppercase">Resources</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {rule.resources?.map((r: string, i: number) => (
                                        <span key={i} className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs border border-blue-500/20 font-mono">
                                            {r}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Verbs */}
                            <div className="mb-2">
                                <span className="text-xs text-gray-500 uppercase">Verbs</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {rule.verbs?.map((v: string, i: number) => (
                                        <span key={i} className="px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded text-xs border border-green-500/20 font-mono">
                                            {v}
                                        </span>
                                    ))}
                                </div>
                            </div>

                             {/* API Groups */}
                             <div>
                                <span className="text-xs text-gray-500 uppercase">API Groups</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {rule.apiGroups?.map((g: string, i: number) => (
                                        <span key={i} className="px-1.5 py-0.5 bg-gray-700 text-gray-300 rounded text-xs font-mono">
                                            {g === "" ? '"" (core)' : g}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!resource.rules || resource.rules.length === 0) && (
                        <div className="text-gray-500 italic text-sm">No rules defined.</div>
                    )}
                 </div>
            </div>
        </div>
    );
};

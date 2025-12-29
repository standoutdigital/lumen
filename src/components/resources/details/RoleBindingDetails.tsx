import React from 'react';
import { Users, User, Calendar, Shield } from 'lucide-react';
import { TimeAgo } from '../../shared/TimeAgo';

interface RoleBindingDetailsProps {
    resource: any;
}

export const RoleBindingDetails: React.FC<RoleBindingDetailsProps> = ({ resource }) => {
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
                             <Shield size={14} className="text-yellow-400" />
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

            {/* Role Ref */}
            <div className="bg-[#252526] rounded-lg p-4 border border-[#333]">
                <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Role Reference</h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-[#1e1e1e] rounded border border-[#333]">
                        <span className="text-gray-400 text-sm">Kind</span>
                        <span className="text-purple-400 font-mono text-sm">{resource.roleRef?.kind}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#1e1e1e] rounded border border-[#333]">
                        <span className="text-gray-400 text-sm">Name</span>
                        <span className="text-white font-mono text-sm">{resource.roleRef?.name}</span>
                    </div>
                     <div className="flex items-center justify-between p-2 bg-[#1e1e1e] rounded border border-[#333]">
                        <span className="text-gray-400 text-sm">API Group</span>
                        <span className="text-gray-500 font-mono text-xs">{resource.roleRef?.apiGroup}</span>
                    </div>
                </div>
            </div>

             {/* Subjects */}
             <div>
                 <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Users size={16} /> Subjects ({resource.subjects?.length || 0})
                 </h3>
                 <div className="space-y-2">
                    {resource.subjects?.map((subj: any, idx: number) => (
                        <div key={idx} className="bg-[#252526] rounded-lg p-3 border border-[#333] flex items-center gap-3">
                             <div className={`p-2 rounded bg-[#333] ${subj.kind === 'ServiceAccount' ? 'text-blue-400' : 'text-green-400'}`}>
                                 <User size={16} />
                             </div>
                             <div>
                                 <div className="text-white font-medium text-sm">{subj.name}</div>
                                 <div className="text-xs text-gray-500 flex gap-2">
                                     <span>{subj.kind}</span>
                                     {subj.namespace && <span className="text-gray-600">• {subj.namespace}</span>}
                                 </div>
                             </div>
                        </div>
                    ))}
                    {(!resource.subjects || resource.subjects.length === 0) && (
                        <div className="text-gray-500 italic text-sm">No subjects bound.</div>
                    )}
                 </div>
            </div>
        </div>
    );
};

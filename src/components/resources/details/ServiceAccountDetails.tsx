import React from 'react';
import { Shield, Key, Image, Calendar } from 'lucide-react';
import { TimeAgo } from '../../shared/TimeAgo';

interface ServiceAccountDetailsProps {
    resource: any;
}

export const ServiceAccountDetails: React.FC<ServiceAccountDetailsProps> = ({ resource }) => {
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

            {/* Secrets */}
            <div>
                 <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Key size={16} /> Secrets ({resource.secrets?.length || 0})
                 </h3>
                 <div className="space-y-2">
                    {resource.secrets?.map((secret: any, idx: number) => (
                        <div key={idx} className="bg-[#252526] rounded-lg p-3 border border-[#333] flex items-center justify-between">
                            <span className="text-white font-mono text-sm">{secret.name}</span>
                        </div>
                    ))}
                    {(!resource.secrets || resource.secrets.length === 0) && (
                        <div className="text-gray-500 italic text-sm">No secrets attached.</div>
                    )}
                 </div>
            </div>

            {/* Image Pull Secrets */}
            <div>
                 <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Image size={16} /> Image Pull Secrets ({resource.imagePullSecrets?.length || 0})
                 </h3>
                 <div className="space-y-2">
                    {resource.imagePullSecrets?.map((secret: any, idx: number) => (
                        <div key={idx} className="bg-[#252526] rounded-lg p-3 border border-[#333] flex items-center justify-between">
                            <span className="text-white font-mono text-sm">{secret.name}</span>
                        </div>
                    ))}
                    {(!resource.imagePullSecrets || resource.imagePullSecrets.length === 0) && (
                        <div className="text-gray-500 italic text-sm">No image pull secrets.</div>
                    )}
                 </div>
            </div>
        </div>
    );
};

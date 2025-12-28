import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Check, Shield, Cpu, AlertCircle } from 'lucide-react';
import { GlassButton } from './GlassButton';
import packageJson from '../../package.json';
import logoUrl from '../assets/logo.png';

export const Settings: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');
  const [inputKey, setInputKey] = useState('');
  const [savedKey, setSavedKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const models = [
    { id: 'gemini-2.5-flash-lite-preview-09-2025', name: 'Gemini 2.5 Flash Lite Preview (09-2025)' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
    { id: 'gemini-3-flash', name: 'Gemini 3 Flash' },
  ];

  useEffect(() => {
    const savedModel = localStorage.getItem('k8ptain_model');
    if (savedModel) {
      setSelectedModel(savedModel);
    }
    
    // Load persisted API Key
    window.k8s.getApiKey().then(key => {
        if (key) {
            setSavedKey(key);
        }
    });
  }, []);

  const handleSaveApiKey = async () => {
    if (!inputKey) return; 
    
    await window.k8s.saveApiKey(inputKey);
    setSavedKey(inputKey);
    setInputKey('');
    setEditMode(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem('k8ptain_model', modelId);
  };

  const getMaskedKey = (key: string) => {
      if (!key) return '';
      if (key.length <= 6) return key; // Or mask all?
      return '•'.repeat(key.length - 6) + key.slice(-6);
  };

  const handleInputFocus = () => {
      setEditMode(true);
  };

  const handleInputBlur = () => {
      if (!inputKey) {
          setEditMode(false);
      }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Top Bar - Matching Dashboard.tsx style */}
      <div className="flex-none p-6 border border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between rounded-2xl mx-6 mt-6 mb-6">
            <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg shadow-black/20">
                    <SettingsIcon className="text-white" size={20} />
                 </div>
                 <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        Configure application preferences and connections
                    </div>
                 </div>
            </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="max-w-4xl mx-auto space-y-8">
            
            {/* API Key Section */}
            <section>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    Gemini API Key
                </h3>
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-4 shadow-xl shadow-black/20">
                    <p className="text-sm text-gray-400">
                        Enter your Gemini API Key here. {savedKey ? "A key is currently saved." : "No key is currently saved."}
                    </p>
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <input 
                                type={editMode ? "text" : "text"} // Always text to show custom mask chars if needed
                                value={editMode ? inputKey : getMaskedKey(savedKey)}
                                onChange={(e) => setInputKey(e.target.value)}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                placeholder={editMode ? "Enter new API Key..." : "Enter your API Key..."}
                                className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all placeholder:text-gray-600 ${!editMode && savedKey ? 'font-mono tracking-widest text-gray-300' : ''}`}
                            />
                        </div>
                        <GlassButton 
                            onClick={handleSaveApiKey}
                            variant={isSaved ? 'secondary' : 'primary'}
                            className={isSaved ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                            icon={isSaved ? <Check size={16} /> : undefined}
                        >
                            {isSaved ? 'Saved' : 'Save Key'}
                        </GlassButton>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Shield size={12} />
                        <span>Stored locally in encrypted configuration</span>
                    </div>
                </div>
            </section>

            {/* AI Model Section */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                 <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                 AI Model Configuration
              </h3>
              <div className="bg-white/5 rounded-2xl border border-white/10 p-2 shadow-xl shadow-black/20">
                 {models.map(model => (
                   <div 
                     key={model.id}
                     onClick={() => handleModelChange(model.id)}
                     className={`
                        flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border border-transparent
                        ${selectedModel === model.id 
                            ? 'bg-white/5 border-white/10 shadow-lg' 
                            : 'hover:bg-white/5 hover:border-white/5'
                        }
                     `}
                   >
                     <div className="flex items-center gap-4">
                        <div className={`
                            w-8 h-8 rounded-lg flex items-center justify-center
                            ${selectedModel === model.id ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-500'}
                        `}>
                            <Cpu size={16} />
                        </div>
                        <div>
                           <p className={`font-medium ${selectedModel === model.id ? 'text-white' : 'text-gray-300'}`}>
                             {model.name}
                           </p>
                           <p className="text-gray-500 text-xs font-mono mt-0.5">{model.id}</p>
                        </div>
                     </div>
                     
                     {selectedModel === model.id && (
                       <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                           <Check size={14} />
                       </div>
                     )}
                   </div>
                 ))}
              </div>
              <p className="text-gray-500 text-sm mt-4 px-2 flex items-center gap-2">
                 <AlertCircle size={14} />
                 The selected model will be used for explaining Kubernetes resources.
              </p>
            </section>

            {/* About Section */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                 <div className="w-1 h-6 bg-gray-500 rounded-full"></div>
                 About
              </h3>
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6 shadow-xl shadow-black/20">
                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <h4 className="text-white font-semibold">Lumen</h4>
                     <p className="text-gray-400 text-sm">Kubernetes Management Tool</p>
                   </div>
                   <div className="w-12 h-12 rounded-lg overflow-hidden">
                     <img 
                       src={logoUrl} 
                       alt="Lumen Logo" 
                       className="w-full h-full object-cover"
                     />
                   </div>
                 </div>
                 <div className="pt-4 border-t border-white/10">
                   <div className="flex items-center justify-between text-sm">
                     <span className="text-gray-400">Version</span>
                     <span className="text-white font-mono">{packageJson.version}</span>
                   </div>
                 </div>
              </div>
            </section>
        </div>
      </div>
    </div>
  );
};

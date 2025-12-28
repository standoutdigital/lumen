import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { SecondarySidebar } from './components/SecondarySidebar'
import { Dashboard } from './components/Dashboard'
import { Settings } from './components/Settings'
import { LogViewer, LogTab } from './components/LogViewer'
import { StatusBar } from './components/StatusBar'
import { BottomPanel } from './components/BottomPanel'

function App() {
  const [activeView, setActiveView] = useState<'clusters' | 'dashboard' | 'settings'>('clusters')
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)
  
  // Dashboard Sub-views
  const [resourceView, setResourceView] = useState<string>('overview')

  // Log Streaming State (Hoisted from Dashboard)
  const [logTabs, setLogTabs] = useState<LogTab[]>([]);
  const [activeLogTabId, setActiveLogTabId] = useState<string | null>(null);
  
  // Bottom Panel State
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);
  // We keep minimized state for the LogViewer inside the panel? 
  // actually BottomPanel IS the container. If it's closed, it's closed.
  // We might want a "maximize" state for full screen logic later.
  // For now let's map "isLogViewerVisible" logic to "isBottomPanelOpen"

  useEffect(() => {
    const cleanup = window.k8s.onPodLogChunk((streamId, chunk) => {
        setLogTabs(prev => prev.map(tab => {
            const currentStreamKey = `${tab.namespace}-${tab.podName}-${tab.containerName}`;
            if (streamId === currentStreamKey) {
                const lines = chunk.split('\n');
                return { ...tab, logs: [...tab.logs, ...lines].slice(-1000) };
            }
            return tab;
        }));
    });
    return cleanup;
  }, []);

  const handleOpenLogs = (pod: any, containerName: string) => {
    const name = pod.metadata?.name || pod.name;
    const namespace = pod.metadata?.namespace || pod.namespace;
    
    if (!name || !namespace || !selectedCluster) return;

    const tabId = `${namespace}-${name}`;
    const containers = pod.spec?.containers?.map((c: any) => c.name) || [containerName];
    const initContainers = pod.spec?.initContainers?.map((c: any) => c.name) || [];
    const allContainers = [...containers, ...initContainers];

    if (!logTabs.find(t => t.id === tabId)) {
        const newTab: LogTab = {
            id: tabId,
            namespace: namespace,
            podName: name,
            containerName,
            allContainers,
            logs: []
        };
        setLogTabs(prev => [...prev, newTab]);
        window.k8s.streamPodLogs(selectedCluster, namespace, name, containerName);
    } else {
        const existing = logTabs.find(t => t.id === tabId);
        if (existing && existing.containerName !== containerName) {
            handleChangeContainer(tabId, containerName);
        }
    }
    
    setActiveLogTabId(tabId);
    setIsBottomPanelOpen(true); // Open the panel
  };

  const handleChangeContainer = (tabId: string, newContainer: string) => {
      const tab = logTabs.find(t => t.id === tabId);
      if (!tab || !selectedCluster) return;

      window.k8s.stopStreamPodLogs(tab.namespace, tab.podName, tab.containerName);

      setLogTabs(prev => prev.map(t => {
          if (t.id === tabId) {
              return { ...t, containerName: newContainer, logs: [] };
          }
          return t;
      }));

      window.k8s.streamPodLogs(selectedCluster, tab.namespace, tab.podName, newContainer);
  };

  const handleCloseLogTab = (id: string) => {
    const tab = logTabs.find(t => t.id === id);
    if (tab) {
        window.k8s.stopStreamPodLogs(tab.namespace, tab.podName, tab.containerName);
    }
    
    setLogTabs(prev => {
        const newTabs = prev.filter(t => t.id !== id);
        if (activeLogTabId === id) {
           setActiveLogTabId(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null);
        }
        return newTabs;
    });
  };

  const handleSwitchTab = (id: string) => {
    setActiveLogTabId(id);
  };

  const handleClearLogs = (id: string) => {
    setLogTabs(prev => prev.map(t => t.id === id ? { ...t, logs: [] } : t));
  }

  const handleClusterSelect = (clusterName: string) => {
    setSelectedCluster(clusterName)
    setActiveView('dashboard')
  }

  const handleMainMenuChange = (view: 'clusters' | 'dashboard' | 'settings') => {
      setActiveView(view);
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-[#0a0a0a] to-black text-white font-sans overflow-hidden">
      {/* Custom Title Bar */}
      <div 
          className="h-10 flex-none bg-transparent flex items-center px-4 select-none z-50"
          style={{ WebkitAppRegion: 'drag' } as any}
      >
          <div className="w-16"></div> 
          <div className="text-xs text-gray-500 font-medium ml-2 flex items-center pt-0.5">Lumen</div>
      </div>

      <div className="flex-1 flex overflow-hidden p-4 gap-4 pb-0"> 
          {/* Main Sidebar & Content Container */}
          <div className="flex flex-1 overflow-hidden gap-4 pb-4">
              {/* Floating Glass Sidebar Container */}
              <div className="flex rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 backdrop-blur-xl h-full flex-shrink-0">
                <Sidebar activeView={activeView} onChangeView={handleMainMenuChange} />
                
                <SecondarySidebar 
                    mode={activeView === 'settings' ? 'settings' : activeView === 'clusters' ? 'clusters' : 'resources'}
                    activeView={resourceView} 
                    onSelectView={setResourceView}
                    selectedCluster={selectedCluster}
                    onSelectCluster={handleClusterSelect}
                />
              </div>

              {/* Main Content Area */}
              <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <div className="flex-1 min-h-0 w-full relative rounded-2xl overflow-hidden border border-white/5">
                {activeView === 'settings' ? (
                    <Settings />
                ) : activeView === 'clusters' && !selectedCluster ? (
                   <div className="flex items-center justify-center h-full text-gray-500">
                     Select a cluster from the sidebar
                   </div>
                ) : (
                     selectedCluster ? (
                        <Dashboard 
                            clusterName={selectedCluster} 
                            activeView={resourceView}
                            onOpenLogs={handleOpenLogs}
                        />
                     ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No cluster selected
                        </div>
                     )
                )}
                </div>
              </main>
          </div>
      </div> 

      {/* Bottom Panel */}
      <BottomPanel 
        isVisible={isBottomPanelOpen} 
        onClose={() => setIsBottomPanelOpen(false)}
      >
         <LogViewer
             tabs={logTabs}
             activeTabId={activeLogTabId}
             onCloseTab={handleCloseLogTab}
             onSwitchTab={handleSwitchTab}
             onClearLogs={handleClearLogs}
             onCloseViewer={() => setIsBottomPanelOpen(false)} // This button inside LogViewer closes the panel
             isMinimized={false} // Panel handles minimization/hiding
             onToggleMinimize={() => setIsBottomPanelOpen(false)} // Mapping minimize to close for now
             onChangeContainer={handleChangeContainer}
          />
      </BottomPanel>

      {/* Status Bar */}
      <StatusBar 
          activeCluster={selectedCluster} 
          onTogglePanel={() => setIsBottomPanelOpen(!isBottomPanelOpen)}
          isPanelOpen={isBottomPanelOpen}
          notificationCount={0}
      />
    </div>
  )
}

export default App

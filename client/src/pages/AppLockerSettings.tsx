import React, { useEffect, useState } from 'react';
import StatusBar from '@/components/layout/StatusBar';
import { useLocation, useParams } from 'wouter';
import { SwitchWithTrack } from '@/components/ui/switch-with-track';
import { useAppContext } from '@/context/app-context';
import { ProtectedApp } from '@shared/schema';

const AppLockerSettings = () => {
  const [_, navigate] = useLocation();
  const params = useParams<{ appName?: string }>();
  const { protectedApps, updateProtectedApp } = useAppContext();
  
  const [selectedApp, setSelectedApp] = useState<ProtectedApp | undefined>(undefined);
  const [disguiseType, setDisguiseType] = useState<string>('hide');
  const [disguiseAs, setDisguiseAs] = useState<string>('Calculator');
  const [disguiseIcon, setDisguiseIcon] = useState<string>('calculate');
  const [clearChats, setClearChats] = useState<boolean>(false);
  const [logOut, setLogOut] = useState<boolean>(false);
  
  // Find the app if an appName is provided
  useEffect(() => {
    if (params.appName) {
      const app = protectedApps.find(a => a.name === params.appName);
      if (app) {
        setSelectedApp(app);
        setDisguiseType(app.disguiseType);
        setDisguiseAs(app.disguiseAs || 'Calculator');
        setDisguiseIcon(app.disguiseIcon || 'calculate');
        setClearChats(app.clearChats);
        setLogOut(app.logOut);
      }
    }
  }, [params.appName, protectedApps]);
  
  const handleSaveChanges = () => {
    if (selectedApp) {
      const updatedApp: ProtectedApp = {
        ...selectedApp,
        disguiseType,
        disguiseAs: disguiseType === 'disguise' ? disguiseAs : null,
        disguiseIcon: disguiseType === 'disguise' ? disguiseIcon : null,
        clearChats,
        logOut,
        description: getDescriptionFromDisguiseType(disguiseType, disguiseAs)
      };
      
      updateProtectedApp(updatedApp);
      navigate('/');
    }
  };
  
  const getDescriptionFromDisguiseType = (type: string, disguiseName?: string | null) => {
    switch (type) {
      case 'hide': return 'Hidden when triggered';
      case 'disguise': return `Disguised as ${disguiseName || 'Calculator'}`;
      case 'crash': return 'Fake crash on open';
      case 'uninstall': return 'Show "Not Installed" prompt';
      default: return 'Protected app';
    }
  };

  if (!selectedApp) {
    return (
      <>
        <StatusBar />
        <div className="content-area h-[685px] overflow-y-auto">
          <div className="px-5 py-4">
            <div className="flex items-center mb-6">
              <button className="mr-3" onClick={() => navigate("/")}>
                <span className="material-icons">arrow_back</span>
              </button>
              <h1 className="text-xl font-semibold">App Protection</h1>
            </div>
            <p className="text-muted-foreground">No app selected. Please go back and select an app to configure.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <StatusBar />
      <div className="content-area h-[685px] overflow-y-auto">
        <div className="px-5 py-4">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button className="mr-3" onClick={() => navigate("/")}>
              <span className="material-icons">arrow_back</span>
            </button>
            <h1 className="text-xl font-semibold">App Protection</h1>
          </div>
          
          {/* App Config */}
          <div className="bg-card rounded-lg p-4 shadow-md mb-5">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mr-3">
                <span className="material-icons">{selectedApp.icon}</span>
              </div>
              <div>
                <h2 className="text-base">{selectedApp.name}</h2>
                <p className="text-muted-foreground text-xs">Messaging app</p>
              </div>
            </div>
            
            <div className="border-t border-muted pt-4">
              <h3 className="text-sm font-medium mb-3">When Panic Triggered:</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="hide-icon" 
                    name="app-action" 
                    className="mr-3 accent-secondary"
                    checked={disguiseType === 'hide'}
                    onChange={() => setDisguiseType('hide')}
                  />
                  <label htmlFor="hide-icon" className="text-sm">Hide app icon</label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="disguise" 
                    name="app-action" 
                    className="mr-3 accent-secondary"
                    checked={disguiseType === 'disguise'}
                    onChange={() => setDisguiseType('disguise')}
                  />
                  <label htmlFor="disguise" className="text-sm">Disguise as another app</label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="fake-crash" 
                    name="app-action" 
                    className="mr-3 accent-secondary"
                    checked={disguiseType === 'crash'}
                    onChange={() => setDisguiseType('crash')}
                  />
                  <label htmlFor="fake-crash" className="text-sm">Show fake crash screen</label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="fake-uninstall" 
                    name="app-action" 
                    className="mr-3 accent-secondary"
                    checked={disguiseType === 'uninstall'}
                    onChange={() => setDisguiseType('uninstall')}
                  />
                  <label htmlFor="fake-uninstall" className="text-sm">Show "Not Installed" prompt</label>
                </div>
              </div>
            </div>
          </div>
          
          {disguiseType === 'disguise' && (
            <div className="bg-card rounded-lg p-4 shadow-md mb-5">
              <h3 className="text-sm font-medium mb-3">Disguise Options</h3>
              
              <div className="mb-4">
                <p className="text-muted-foreground text-xs mb-2">Replace icon with:</p>
                <div className="grid grid-cols-4 gap-3">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-12 h-12 rounded-lg bg-accent flex items-center justify-center ${disguiseIcon === 'calculate' ? 'border-2 border-secondary' : ''}`}
                      onClick={() => setDisguiseIcon('calculate')}
                    >
                      <span className="material-icons">calculate</span>
                    </div>
                    <span className="text-muted-foreground text-xs mt-1">Calculator</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-12 h-12 rounded-lg bg-accent flex items-center justify-center ${disguiseIcon === 'access_time' ? 'border-2 border-secondary' : ''}`}
                      onClick={() => setDisguiseIcon('access_time')}
                    >
                      <span className="material-icons">access_time</span>
                    </div>
                    <span className="text-muted-foreground text-xs mt-1">Clock</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-12 h-12 rounded-lg bg-accent flex items-center justify-center ${disguiseIcon === 'calendar_today' ? 'border-2 border-secondary' : ''}`}
                      onClick={() => setDisguiseIcon('calendar_today')}
                    >
                      <span className="material-icons">calendar_today</span>
                    </div>
                    <span className="text-muted-foreground text-xs mt-1">Calendar</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-12 h-12 rounded-lg bg-accent flex items-center justify-center ${disguiseIcon === 'camera_alt' ? 'border-2 border-secondary' : ''}`}
                      onClick={() => setDisguiseIcon('camera_alt')}
                    >
                      <span className="material-icons">camera_alt</span>
                    </div>
                    <span className="text-muted-foreground text-xs mt-1">Camera</span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-muted-foreground text-xs mb-2">Custom app name:</p>
                <input 
                  type="text" 
                  value={disguiseAs} 
                  onChange={(e) => setDisguiseAs(e.target.value)}
                  className="w-full bg-accent border border-muted rounded px-3 py-2 text-sm focus:border-secondary outline-none"
                />
              </div>
            </div>
          )}
          
          <div className="bg-card rounded-lg p-4 shadow-md mb-5">
            <h3 className="text-sm font-medium mb-3">Additional Actions</h3>
            
            <div className="flex justify-between items-center mb-3">
              <SwitchWithTrack 
                label="Log out of app"
                description="Sign out when panic triggered"
                checked={logOut}
                onChange={() => setLogOut(!logOut)}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <SwitchWithTrack 
                label="Clear recent chats"
                description="Delete recent message history"
                checked={clearChats}
                onChange={() => setClearChats(!clearChats)}
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              className="flex-1 py-3 rounded bg-accent text-foreground text-sm font-medium"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button 
              className="flex-1 py-3 rounded bg-primary text-primary-foreground text-sm font-medium"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppLockerSettings;

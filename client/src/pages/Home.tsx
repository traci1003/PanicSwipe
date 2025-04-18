import React from 'react';
import StatusBar from '@/components/layout/StatusBar';
import BottomNav from '@/components/layout/BottomNav';
import { Link, useLocation } from 'wouter';
import { SwitchWithTrack } from '@/components/ui/switch-with-track';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';

const Home = () => {
  const { 
    protectedApps, 
    panicSettings, 
    updatePanicSettings, 
    triggerPanic,
    lastTriggered,
    delayedPanicRemainingTime,
    cancelDelayedPanic
  } = useAppContext();
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  const getLastTriggeredText = () => {
    if (!lastTriggered) return "Never";
    
    const now = new Date();
    const diff = now.getTime() - lastTriggered.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "1 hour ago";
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  return (
    <>
      <StatusBar />
      <div className="content-area h-[685px] overflow-y-auto">
        <div className="px-5 py-4">
          {/* Header */}
          <div className="flex flex-col mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="material-icons text-primary mr-2">security</span>
                <h1 className="text-2xl font-bold text-primary">Panic Swipe</h1>
              </div>
              <div className="flex space-x-2">
                <Link href="/install">
                  <button 
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-accent hover:bg-accent/80 transition-colors active:scale-95 transform duration-100"
                    aria-label="Install App"
                  >
                    <span className="material-icons">get_app</span>
                  </button>
                </Link>
                <Link href="/help">
                  <button 
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-accent hover:bg-accent/80 transition-colors active:scale-95 transform duration-100"
                    aria-label="Help and Information"
                  >
                    <span className="material-icons">help_outline</span>
                  </button>
                </Link>
                <Link href="/settings">
                  <button 
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-accent hover:bg-accent/80 transition-colors active:scale-95 transform duration-100"
                    aria-label="Settings"
                  >
                    <span className="material-icons">settings</span>
                  </button>
                </Link>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Discreet emergency exit for activists & organizers</p>
          </div>
          
          {/* Status Card */}
          <div className="bg-card rounded-lg p-4 mb-4 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-card-foreground">Protection Status</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-800 text-green-100">Active</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="material-icons text-green-400">shield</span>
              <div>
                <p className="text-card-foreground text-sm">Your device is protected</p>
                <p className="text-muted-foreground text-xs">Last triggered: {getLastTriggeredText()}</p>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <h2 className="text-lg font-medium text-foreground mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div 
              className="bg-card rounded-lg p-4 shadow-md cursor-pointer hover:bg-card/90 transition-colors active:scale-95 transform duration-100"
              onClick={() => navigate('/gesture-training')}
            >
              <span className="material-icons text-secondary mb-2 text-xl">swipe_up</span>
              <h3 className="text-card-foreground text-sm font-medium mb-1">Configure Trigger</h3>
              <p className="text-muted-foreground text-xs">Gesture settings</p>
            </div>
            <div 
              className="bg-card rounded-lg p-4 shadow-md cursor-pointer hover:bg-card/90 transition-colors active:scale-95 transform duration-100"
              onClick={() => {
                if (panicSettings.delayedPanicEnabled && delayedPanicRemainingTime !== null) {
                  cancelDelayedPanic();
                  toast({
                    title: "Timed Panic Cancelled",
                    description: "The countdown has been stopped",
                    variant: "default",
                  });
                } else {
                  updatePanicSettings({ 
                    delayedPanicEnabled: true,
                    delayedPanicMinutes: 5
                  });
                  toast({
                    title: "⏱️ Timed Panic Activated",
                    description: "Will trigger in 5 minutes",
                    variant: "destructive",
                  });
                }
              }}
            >
              <span className="material-icons text-secondary mb-2 text-xl">
                {panicSettings.delayedPanicEnabled && delayedPanicRemainingTime !== null ? 'timer_off' : 'timer'}
              </span>
              <h3 className="text-card-foreground text-sm font-medium mb-1">
                {panicSettings.delayedPanicEnabled && delayedPanicRemainingTime !== null ? 'Cancel Timer' : 'Set Timer'}
              </h3>
              <p className="text-muted-foreground text-xs">
                {panicSettings.delayedPanicEnabled && delayedPanicRemainingTime !== null ? 
                  `${Math.floor(delayedPanicRemainingTime / 60)}:${(delayedPanicRemainingTime % 60).toString().padStart(2, '0')} left` : 
                  'Delayed panic'}
              </p>
            </div>
            <div 
              className="bg-card rounded-lg p-4 shadow-md cursor-pointer hover:bg-card/90 transition-colors active:scale-95 transform duration-100"
              onClick={() => {
                triggerPanic();
                toast({
                  title: "✅ Panic Mode Activated",
                  description: "Apps hidden and decoy mode engaged",
                  variant: "default",
                });
              }}
            >
              <span className="material-icons text-secondary mb-2 text-xl">play_circle</span>
              <h3 className="text-card-foreground text-sm font-medium mb-1">Test Mode</h3>
              <p className="text-muted-foreground text-xs">Verify your setup</p>
            </div>
          </div>
          
          {/* Protected Apps */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium text-foreground">Protected Apps</h2>
            <button className="text-secondary text-sm">Edit</button>
          </div>
          
          <div className="bg-card rounded-lg shadow-md mb-6">
            {protectedApps.map(app => (
              <div 
                key={app.id} 
                className="flex items-center p-4 border-b border-muted" 
                onClick={() => navigate(`/app-locker-settings/${app.name}`)}
              >
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mr-3">
                  <span className="material-icons">{app.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-card-foreground text-sm">{app.name}</h3>
                  <p className="text-muted-foreground text-xs">{app.description}</p>
                </div>
                <SwitchWithTrack 
                  checked={app.isActive} 
                  onChange={() => {
                    /* Implementation would update active status */
                  }}
                />
              </div>
            ))}
            
            <button className="w-full p-4 flex items-center justify-center text-secondary">
              <span className="material-icons mr-1 text-sm">add</span>
              <span className="text-sm">Add More Apps</span>
            </button>
          </div>
          
          {/* Auto-Wipe Options */}
          <h2 className="text-lg font-medium text-foreground mb-3">Auto-Wipe Options</h2>
          <div className="bg-card rounded-lg shadow-md mb-4">
            <div className="p-4 border-b border-muted">
              <SwitchWithTrack 
                label="Browser Tabs" 
                description="Clear all open tabs" 
                checked={panicSettings.clearBrowserTabs} 
                onChange={() => updatePanicSettings({ clearBrowserTabs: !panicSettings.clearBrowserTabs })} 
              />
            </div>
            
            <div className="p-4 border-b border-muted">
              <SwitchWithTrack 
                label="Clipboard" 
                description="Clear copied content" 
                checked={panicSettings.clearClipboard} 
                onChange={() => updatePanicSettings({ clearClipboard: !panicSettings.clearClipboard })} 
              />
            </div>
            
            <div className="p-4">
              <SwitchWithTrack 
                label="Burn Mode" 
                description="Clear recent chats" 
                checked={panicSettings.burnMode} 
                onChange={() => updatePanicSettings({ burnMode: !panicSettings.burnMode })} 
              />
            </div>
          </div>
          
          {/* Timed Panic Feature */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium text-foreground">Timed Panic</h2>
            {panicSettings.delayedPanicEnabled && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-red-800 text-red-100">Active</span>
            )}
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-md mb-6">
            <SwitchWithTrack 
              label="Delayed Panic Mode" 
              description="Automatically trigger panic after a delay" 
              checked={panicSettings.delayedPanicEnabled} 
              onChange={() => {
                updatePanicSettings({ 
                  delayedPanicEnabled: !panicSettings.delayedPanicEnabled 
                });
                
                if (!panicSettings.delayedPanicEnabled) {
                  toast({
                    title: "⏱️ Timed Panic Activated",
                    description: `Will trigger in ${panicSettings.delayedPanicMinutes} minutes`,
                    variant: "destructive",
                  });
                }
              }} 
            />
            
            {panicSettings.delayedPanicEnabled && delayedPanicRemainingTime !== null && (
              <div className="mt-3 p-3 bg-red-900/20 rounded-md border border-red-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-400 text-sm font-medium flex items-center">
                    <span className="material-icons mr-1 text-sm">timer</span>
                    Panic countdown active
                  </span>
                  <span className="text-white font-bold">
                    {Math.floor(delayedPanicRemainingTime / 60)}:{(delayedPanicRemainingTime % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <button 
                  className="w-full py-1.5 mt-1 rounded text-xs bg-red-800 text-white hover:bg-red-700 active:scale-95 transform duration-100"
                  onClick={() => {
                    cancelDelayedPanic();
                    toast({
                      title: "Timed Panic Cancelled",
                      description: "The countdown has been stopped",
                      variant: "default",
                    });
                  }}
                >
                  Cancel Countdown
                </button>
              </div>
            )}
            
            {panicSettings.delayedPanicEnabled && delayedPanicRemainingTime === null && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Delay duration: {panicSettings.delayedPanicMinutes} min</span>
                </div>
                <Slider
                  min={1}
                  max={30}
                  step={1}
                  value={[panicSettings.delayedPanicMinutes]}
                  onValueChange={(value) => {
                    updatePanicSettings({ delayedPanicMinutes: value[0] });
                  }}
                  className="my-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1m</span>
                  <span>15m</span>
                  <span>30m</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Decoy Setup */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium text-foreground">Decoy Mode</h2>
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-800 text-blue-100">Active</span>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-md mb-6">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-12 h-12 rounded bg-accent flex items-center justify-center">
                <span className="material-icons text-secondary">access_time</span>
              </div>
              <div>
                <h3 className="text-card-foreground text-sm">Clock App</h3>
                <p className="text-muted-foreground text-xs">Shows when panic is triggered</p>
              </div>
            </div>
            <button 
              className="w-full py-2 mt-2 rounded text-sm bg-accent text-foreground"
              onClick={() => navigate('/decoy-setup')}
            >
              Change Decoy Screen
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default Home;

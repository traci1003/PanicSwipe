import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePanicGesture } from '@/hooks/use-panic-gesture';
import { ProtectedApp, PanicSettings } from '@shared/schema';

// Define a default protected app structure
const defaultProtectedApps: ProtectedApp[] = [
  {
    id: 1,
    userId: 1,
    name: "Signal",
    icon: "chat",
    description: "Disguised as Calculator",
    isActive: true,
    disguiseType: "disguise",
    disguiseAs: "Calculator",
    disguiseIcon: "calculate",
    clearChats: true,
    logOut: false
  },
  {
    id: 2,
    userId: 1,
    name: "ProtonMail",
    icon: "mail",
    description: "Hidden when triggered",
    isActive: true,
    disguiseType: "hide",
    disguiseAs: null,
    disguiseIcon: null,
    clearChats: false,
    logOut: false
  },
  {
    id: 3,
    userId: 1,
    name: "Telegram",
    icon: "send",
    description: "Fake crash on open",
    isActive: true,
    disguiseType: "crash",
    disguiseAs: null,
    disguiseIcon: null,
    clearChats: true,
    logOut: false
  }
];

// Define default panic settings
const defaultPanicSettings: PanicSettings = {
  id: 1,
  userId: 1,
  gestureType: "triple_swipe_up",
  swipeCount: 3,
  holdDuration: 10,
  workWithScreenLocked: true,
  vibrationFeedback: true,
  clearBrowserTabs: true,
  clearClipboard: true,
  clearBrowserHistory: true,
  burnMode: false,
  decoyType: "clock",
  fakeSystemAlert: true,
  systemAlertType: "low_battery",
  disableNotifications: true,
  randomizeExternalSite: false,
  enableLongPressZone: false,
  longPressZoneLocation: "bottom_right",
  longPressDuration: 15,
  enableFakeLockScreen: false,
  delayedPanicEnabled: false,
  delayedPanicMinutes: 5,
  // Accessibility settings
  accessibilityMode: false,
  showTriggerZones: false,
  highContrastMode: false,
  largerText: false,
  enableKeyboardTriggers: false,
  keyboardTriggerKey: "Escape",
  enableVoiceInstructions: false
};

interface AppContextType {
  protectedApps: ProtectedApp[];
  panicSettings: PanicSettings;
  isPanicTriggered: boolean;
  triggerPanic: () => void;
  resetPanic: () => void;
  updateProtectedApp: (app: ProtectedApp) => void;
  updatePanicSettings: (settings: Partial<PanicSettings>) => void;
  addProtectedApp: (app: Omit<ProtectedApp, 'id' | 'userId'>) => void;
  lastTriggered: Date | null;
  delayedPanicRemainingTime: number | null;
  cancelDelayedPanic: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [protectedApps, setProtectedApps] = useState<ProtectedApp[]>(defaultProtectedApps);
  const [panicSettings, setPanicSettings] = useState<PanicSettings>(defaultPanicSettings);
  const [isPanicTriggered, setIsPanicTriggered] = useState(false);
  const [lastTriggered, setLastTriggered] = useState<Date | null>(null);
  const [delayedPanicTimer, setDelayedPanicTimer] = useState<NodeJS.Timeout | null>(null);
  const [delayedPanicRemainingTime, setDelayedPanicRemainingTime] = useState<number | null>(null);

  // Initialize panic gesture detection
  usePanicGesture({
    onPanicTriggered: () => triggerPanic(),
    swipeCount: panicSettings.swipeCount,
    holdDuration: panicSettings.holdDuration / 10, // Convert from tenths to seconds
  });
  
  // Set up keyboard shortcuts for accessibility
  useEffect(() => {
    if (!panicSettings.enableKeyboardTriggers) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === panicSettings.keyboardTriggerKey) {
        e.preventDefault();
        triggerPanic();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [panicSettings.enableKeyboardTriggers, panicSettings.keyboardTriggerKey]);
  
  // Handle delayed panic timer
  useEffect(() => {
    // Clear existing timer when settings change
    if (delayedPanicTimer) {
      clearTimeout(delayedPanicTimer);
      setDelayedPanicTimer(null);
      setDelayedPanicRemainingTime(null);
    }
    
    // Set up a new delayed panic timer if enabled
    if (panicSettings.delayedPanicEnabled && !isPanicTriggered) {
      const delayMs = panicSettings.delayedPanicMinutes * 60 * 1000;
      const timerEnd = Date.now() + delayMs;
      
      // Update countdown display
      const countdownInterval = setInterval(() => {
        const remaining = Math.max(0, timerEnd - Date.now());
        setDelayedPanicRemainingTime(Math.ceil(remaining / 1000));
        
        if (remaining <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);
      
      // Set the actual timer
      const timer = setTimeout(() => {
        triggerPanic();
        clearInterval(countdownInterval);
        setDelayedPanicTimer(null);
        setDelayedPanicRemainingTime(null);
      }, delayMs);
      
      setDelayedPanicTimer(timer);
      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [panicSettings.delayedPanicEnabled, panicSettings.delayedPanicMinutes]);
  
  // Function to cancel the delayed panic timer
  const cancelDelayedPanic = () => {
    if (delayedPanicTimer) {
      clearTimeout(delayedPanicTimer);
      setDelayedPanicTimer(null);
      setDelayedPanicRemainingTime(null);
      setPanicSettings(current => ({ ...current, delayedPanicEnabled: false }));
    }
  };

  const triggerPanic = () => {
    // Create and show a visual confirmation that disappears quickly
    const flashMessage = document.createElement('div');
    flashMessage.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        font-family: sans-serif;
      ">
        <div style="
          background-color: rgba(40, 40, 40, 0.9);
          border-radius: 8px;
          padding: 20px;
          max-width: 80%;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        ">
          <div style="color: #ff3333; font-size: 24px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center;">
            <span style="margin-right: 10px;">⚠️</span>
            <span>PANIC MODE ACTIVATED</span>
          </div>
          <p style="color: white; margin: 10px 0; font-size: 16px;">
            Securing your device...
          </p>
        </div>
      </div>
    `;
    document.body.appendChild(flashMessage);
    
    // Set app state
    setIsPanicTriggered(true);
    setLastTriggered(new Date());
    
    // Vibration feedback if supported by the browser
    if (panicSettings.vibrationFeedback && navigator.vibrate) {
      navigator.vibrate([100, 50, 200]); // Pattern: vibrate, pause, longer vibrate
    }
    
    // Simulating the clearing of browser tabs and clipboard
    if (panicSettings.clearBrowserTabs) {
      console.log('Clearing browser tabs');
      // This would need to be implemented differently in a real mobile app
    }
    
    if (panicSettings.clearClipboard) {
      console.log('Clearing clipboard');
      if (navigator.clipboard) {
        navigator.clipboard.writeText('');
      }
    }
    
    // Remove the flash message after a short delay
    setTimeout(() => {
      if (document.body.contains(flashMessage)) {
        document.body.removeChild(flashMessage);
      }
    }, 700); // Removing it shortly to transition to the decoy screen
    
    // If we're using the fake lock screen, we won't do external redirects
    if (panicSettings.decoyType === 'fake_lock_screen') {
      console.log('[PANIC MODE] Showing fake lock screen');
      // The rendering of the lock screen is handled in App.tsx
      
      // Still clear history if enabled
      if (panicSettings.clearBrowserHistory) {
        console.log('[PANIC MODE] Would clear browser history');
      }
      return;
    }
    
    // Handle external site redirection if selected
    if (panicSettings.decoyType.startsWith('external_site_')) {
      // For the demo, we'll simulate a redirect after a delay
      // In a real mobile app, this would navigate to an actual external site
      
      // Get the site type from the decoy type (after 'external_site_')
      const siteType = panicSettings.decoyType.split('external_site_')[1];
      
      let targetUrl = "";
      
      // If randomize is enabled, choose from a pool of sites
      if (panicSettings.randomizeExternalSite) {
        const weatherSites = [
          "https://weather.com", 
          "https://accuweather.com", 
          "https://weather.gov"
        ];
        
        const recipeSites = [
          "https://allrecipes.com", 
          "https://foodnetwork.com/recipes", 
          "https://epicurious.com"
        ];
        
        const homeworkSites = [
          "https://canvas.instructure.com", 
          "https://classroom.google.com", 
          "https://studygroups.com"
        ];
        
        const newsSites = [
          "https://news.google.com", 
          "https://reuters.com", 
          "https://apnews.com"
        ];
        
        // Pick a random site from the appropriate category
        if (siteType === 'weather') {
          targetUrl = weatherSites[Math.floor(Math.random() * weatherSites.length)];
        } else if (siteType === 'recipes') {
          targetUrl = recipeSites[Math.floor(Math.random() * recipeSites.length)];
        } else if (siteType === 'homework') {
          targetUrl = homeworkSites[Math.floor(Math.random() * homeworkSites.length)];
        } else if (siteType === 'news') {
          targetUrl = newsSites[Math.floor(Math.random() * newsSites.length)];
        }
      } else {
        // Use default sites
        if (siteType === 'weather') {
          targetUrl = "https://weather.com";
        } else if (siteType === 'recipes') {
          targetUrl = "https://allrecipes.com";
        } else if (siteType === 'homework') {
          targetUrl = "https://classroom.google.com";
        } else if (siteType === 'news') {
          targetUrl = "https://news.google.com";
        }
      }
      
      // For demonstration purposes, we'll log the URL rather than actually redirecting
      console.log(`[PANIC MODE] Would redirect to: ${targetUrl}`);
      
      // In a real app, uncomment this:
      // setTimeout(() => {
      //   window.location.href = targetUrl;
      // }, 800);
      
      // Clear browser history if the option is enabled
      if (panicSettings.clearBrowserHistory) {
        // This would need proper implementation in a real mobile app
        console.log('[PANIC MODE] Would clear browser history');
      }
    }
  };

  const resetPanic = () => {
    setIsPanicTriggered(false);
  };

  const updateProtectedApp = (updatedApp: ProtectedApp) => {
    setProtectedApps(apps => 
      apps.map(app => app.id === updatedApp.id ? updatedApp : app)
    );
  };

  const updatePanicSettings = (settings: Partial<PanicSettings>) => {
    setPanicSettings(current => ({ ...current, ...settings }));
  };

  const addProtectedApp = (newApp: Omit<ProtectedApp, 'id' | 'userId'>) => {
    const newId = Math.max(0, ...protectedApps.map(app => app.id)) + 1;
    setProtectedApps([...protectedApps, { 
      ...newApp, 
      id: newId, 
      userId: 1 // Default user ID
    }]);
  };

  const contextValue: AppContextType = {
    protectedApps,
    panicSettings,
    isPanicTriggered,
    triggerPanic,
    resetPanic,
    updateProtectedApp,
    updatePanicSettings,
    addProtectedApp,
    lastTriggered,
    delayedPanicRemainingTime,
    cancelDelayedPanic
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

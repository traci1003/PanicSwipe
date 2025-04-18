import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import GestureTraining from "@/pages/GestureTraining";
import AppLockerSettings from "@/pages/AppLockerSettings";
import DecoySetup from "@/pages/DecoySetup";
import EmergencyTriggered from "@/pages/EmergencyTriggered";
import Help from "@/pages/Help";
import Settings from "@/pages/Settings";
import Install from "@/pages/Install";
import LongPressZone from "@/components/LongPressZone";
import FakeLockScreen from "@/components/FakeLockScreen";
import { useAppContext, AppProvider } from "./context/app-context";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "wouter";

// Emergency Route wrapper
const EmergencyRoute = (_: RouteComponentProps) => {
  return <EmergencyTriggered />;
};

// The AppRoutes component uses context, so it needs to be inside the AppProvider
function AppRoutes() {
  const { isPanicTriggered, panicSettings } = useAppContext();
  const [showEmergency, setShowEmergency] = useState(false);
  
  // Handle panic mode activation
  useEffect(() => {
    if (isPanicTriggered) {
      setShowEmergency(true);
    }
  }, [isPanicTriggered]);

  // Show fake lock screen instead of emergency screen if enabled
  if (showEmergency && panicSettings.enableFakeLockScreen) {
    return <FakeLockScreen />;
  }
  
  // Regular emergency triggered view
  if (showEmergency) {
    return <EmergencyTriggered onClose={() => setShowEmergency(false)} />;
  }

  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/gesture-training" component={GestureTraining} />
        <Route path="/app-locker-settings/:appName?" component={AppLockerSettings} />
        <Route path="/decoy-setup" component={DecoySetup} />
        <Route path="/emergency" component={EmergencyRoute} />
        <Route path="/help" component={Help} />
        <Route path="/settings" component={Settings} />
        <Route path="/install" component={Install} />
        <Route component={NotFound} />
      </Switch>
      
      {/* Long press zone if enabled */}
      {panicSettings.enableLongPressZone && (
        <LongPressZone 
          location={panicSettings.longPressZoneLocation}
          duration={panicSettings.longPressDuration}
        />
      )}
    </>
  );
}

// The main App component no longer directly uses the context
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <div className="device-frame bg-background text-foreground font-sans">
          <AppRoutes />
          <Toaster />
        </div>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import StatusBar from '@/components/layout/StatusBar';
import { useLocation } from 'wouter';
import { SwitchWithTrack } from '@/components/ui/switch-with-track';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';

const GestureTraining = () => {
  const [_, navigate] = useLocation();
  const { panicSettings, updatePanicSettings, triggerPanic } = useAppContext();
  const { toast } = useToast();
  
  const [isTraining, setIsTraining] = useState(false);
  const [currentSwipe, setCurrentSwipe] = useState(0);
  const [holdTimer, setHoldTimer] = useState<number | null>(null);
  const gestureAreaRef = useRef<HTMLDivElement>(null);
  const [touchPosition, setTouchPosition] = useState<{x: number, y: number} | null>(null);
  const [swipeComplete, setSwipeComplete] = useState(false);
  
  // Function to simulate a swipe from bottom to top
  const simulateSwipe = () => {
    if (gestureAreaRef.current && !isTraining) {
      setIsTraining(true);
      setCurrentSwipe(0);
      setSwipeComplete(false);
      
      const area = gestureAreaRef.current;
      const areaRect = area.getBoundingClientRect();
      
      // Start position at the bottom center of the gesture area
      const startY = areaRect.height - 20;
      const centerX = areaRect.width / 2;
      
      // Animate swipe
      animateSwipe(centerX, startY, centerX, 20, 0);
    }
  };
  
  const animateSwipe = (startX: number, startY: number, endX: number, endY: number, swipeIndex: number) => {
    if (swipeIndex >= panicSettings.swipeCount) {
      // All swipes completed, now simulate hold
      simulateHold();
      return;
    }
    
    setCurrentSwipe(swipeIndex + 1);
    setTouchPosition({x: startX, y: startY});
    
    // Duration of swipe animation in ms
    const duration = 600;
    const startTime = Date.now();
    
    const moveStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * progress;
      
      setTouchPosition({x: currentX, y: currentY});
      
      if (progress < 1) {
        requestAnimationFrame(moveStep);
      } else {
        // After a brief pause, start the next swipe
        setTimeout(() => {
          if (swipeIndex < panicSettings.swipeCount - 1) {
            animateSwipe(startX, startY, endX, endY, swipeIndex + 1);
          } else {
            simulateHold();
          }
        }, 300);
      }
    };
    
    requestAnimationFrame(moveStep);
  };
  
  const simulateHold = () => {
    if (touchPosition) {
      // Show hold message
      toast({
        title: "Hold to complete",
        description: `Hold for ${(panicSettings.holdDuration / 10).toFixed(1)} seconds`,
      });
      
      // Simulate hold for the configured duration
      const holdDuration = panicSettings.holdDuration * 100; // Convert to ms
      
      setSwipeComplete(true);
      
      // After hold duration, complete the gesture
      setTimeout(() => {
        setSwipeComplete(false);
        setIsTraining(false);
        setTouchPosition(null);
        
        toast({
          title: "✅ Gesture completed successfully!",
          description: "Your panic gesture is now configured",
          variant: "default",
        });
      }, holdDuration);
    }
  };

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
            <h1 className="text-xl font-semibold">Gesture Training</h1>
          </div>
          
          {/* Training Area */}
          <div className="bg-card rounded-lg p-5 shadow-md mb-6 flex flex-col items-center">
            <div className="text-center mb-6">
              <h2 className="text-lg mb-2">Practice Your Panic Gesture</h2>
              <p className="text-muted-foreground text-sm">
                {currentSwipe > 0 && !swipeComplete
                  ? `Swipe ${currentSwipe} of ${panicSettings.swipeCount}`
                  : swipeComplete 
                    ? `Hold for ${(panicSettings.holdDuration / 10).toFixed(1)}s`
                    : `${panicSettings.swipeCount} swipes up + hold for ${(panicSettings.holdDuration / 10).toFixed(1)}s`
                }
              </p>
            </div>
            
            {/* Interactive gesture area */}
            <div 
              ref={gestureAreaRef}
              className="gesture-area w-full bg-background/10 rounded-lg border border-accent mb-6"
              onClick={simulateSwipe}
            >
              {touchPosition && (
                <>
                  <div 
                    className={`gesture-dot ${swipeComplete ? 'pulse-animation' : ''}`}
                    style={{ 
                      left: touchPosition.x,
                      top: touchPosition.y
                    }}
                  />
                </>
              )}
              
              {!isTraining && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="material-icons text-muted-foreground text-4xl mb-2">touch_app</span>
                    <p className="text-sm text-muted-foreground">Tap here to simulate gesture</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center mb-5">
              <p className="text-muted-foreground text-sm mb-1">Swipe direction</p>
              <div className="flex justify-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                  <span className="material-icons text-muted-foreground">arrow_upward</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-card border-2 border-secondary flex items-center justify-center">
                  <span className="material-icons text-secondary">swipe_up</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                  <span className="material-icons text-muted-foreground">arrow_downward</span>
                </div>
              </div>
            </div>
            
            <div className="w-full">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground text-sm">Number of swipes:</p>
                <p className="text-sm font-medium">{panicSettings.swipeCount}</p>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={panicSettings.swipeCount} 
                className="slider w-full mb-4"
                onChange={(e) => updatePanicSettings({ swipeCount: parseInt(e.target.value) })}
              />
              
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground text-sm">Hold duration:</p>
                <p className="text-sm font-medium">{(panicSettings.holdDuration / 10).toFixed(1)}s</p>
              </div>
              <input 
                type="range" 
                min="5" 
                max="20" 
                value={panicSettings.holdDuration} 
                className="slider w-full"
                onChange={(e) => updatePanicSettings({ holdDuration: parseInt(e.target.value) })}
              />
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 shadow-md mb-6">
            <h3 className="text-sm font-medium mb-3">Advanced Options</h3>
            
            <div className="flex justify-between items-center mb-3">
              <SwitchWithTrack 
                label="Work with screen locked"
                description="Trigger even when device is locked"
                checked={panicSettings.workWithScreenLocked}
                onChange={() => updatePanicSettings({ 
                  workWithScreenLocked: !panicSettings.workWithScreenLocked 
                })}
              />
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <SwitchWithTrack 
                label="Vibration feedback"
                description="Haptic confirmation when triggered"
                checked={panicSettings.vibrationFeedback}
                onChange={() => updatePanicSettings({ 
                  vibrationFeedback: !panicSettings.vibrationFeedback 
                })}
              />
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <SwitchWithTrack 
                label="Enable long press zone"
                description="Add a hidden trigger area on screen"
                checked={panicSettings.enableLongPressZone}
                onChange={() => updatePanicSettings({ 
                  enableLongPressZone: !panicSettings.enableLongPressZone 
                })}
              />
            </div>
            
            {panicSettings.enableLongPressZone && (
              <>
                <div className="mb-3">
                  <p className="text-muted-foreground text-sm mb-2">Long press location:</p>
                  <select 
                    className="w-full bg-accent border border-muted rounded px-3 py-2 text-sm mb-1"
                    value={panicSettings.longPressZoneLocation}
                    onChange={(e) => updatePanicSettings({ longPressZoneLocation: e.target.value })}
                  >
                    <option value="bottom_right">Bottom Right</option>
                    <option value="bottom_left">Bottom Left</option>
                    <option value="top_right">Top Right</option>
                    <option value="top_left">Top Left</option>
                    <option value="center">Center</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground text-sm">Long press duration:</p>
                    <p className="text-sm font-medium">{(panicSettings.longPressDuration / 10).toFixed(1)}s</p>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="30" 
                    value={panicSettings.longPressDuration} 
                    className="slider w-full"
                    onChange={(e) => updatePanicSettings({ longPressDuration: parseInt(e.target.value) })}
                  />
                </div>
              </>
            )}
            
            <div className="flex justify-between items-center mb-3">
              <SwitchWithTrack 
                label="Fake Lock Screen Mode"
                description="Show a fake lock screen instead of decoy"
                checked={panicSettings.enableFakeLockScreen}
                onChange={() => updatePanicSettings({ 
                  enableFakeLockScreen: !panicSettings.enableFakeLockScreen 
                })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              className="py-3 rounded bg-accent text-foreground text-sm font-medium hover:bg-accent/80 transition-colors"
              onClick={() => simulateSwipe()}
              disabled={isTraining}
            >
              <span className="material-icons text-sm mr-1">school</span>
              Practice Gesture
            </button>
            <button 
              className="py-3 rounded bg-primary text-primary-foreground text-sm font-medium shadow-md hover:bg-primary/90 transition-colors active:scale-95 transform duration-100"
              onClick={() => {
                triggerPanic();
                toast({
                  title: "✅ Panic Mode Activated",
                  description: "Gesture recognized successfully",
                });
              }}
            >
              <span className="material-icons text-sm mr-1">security</span>
              Test Trigger
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GestureTraining;

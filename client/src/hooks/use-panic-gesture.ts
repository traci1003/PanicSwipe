import { useEffect, useRef, useState } from 'react';

interface PanicGestureOptions {
  onPanicTriggered: () => void;
  swipeCount?: number;
  holdDuration?: number; // in seconds
  debug?: boolean; // Enable visual debug indicators
}

export function usePanicGesture(options: PanicGestureOptions) {
  const { 
    onPanicTriggered, 
    swipeCount = 3, 
    holdDuration = 1,
    debug = false
  } = options;
  
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const swipeCounter = useRef<number>(0);
  const holdTimer = useRef<number | null>(null);
  const lastSwipeTime = useRef<number>(0);
  const swipeDetected = useRef<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  // Constants
  const SWIPE_THRESHOLD = 150; // Minimum distance for a swipe (increased for more reliable detection)
  const SWIPE_TIMEOUT = 700; // Maximum time between swipes to count as consecutive (ms)
  
  // Show debug indicator if enabled
  const showDebugIndicator = (message: string) => {
    if (!debug) return;
    
    setDebugInfo(message);
    
    // Clear debug info after 2 seconds
    setTimeout(() => {
      setDebugInfo('');
    }, 2000);
  };
  
  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    swipeDetected.current = false;
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStartY.current || !touchStartX.current) return;
    
    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const diffY = touchStartY.current - currentY;
    const diffX = Math.abs(touchStartX.current - currentX);
    
    // Only count vertical swipes (not horizontal ones)
    if (diffY > SWIPE_THRESHOLD && diffX < diffY / 2 && !swipeDetected.current) {
      swipeDetected.current = true;
      const now = Date.now();
      
      // Reset counter if too much time has passed since the last swipe
      if (now - lastSwipeTime.current > SWIPE_TIMEOUT) {
        swipeCounter.current = 0;
      }
      
      swipeCounter.current += 1;
      lastSwipeTime.current = now;
      
      if (debug) {
        showDebugIndicator(`Swipe ${swipeCounter.current} of ${swipeCount}`);
      }
      
      // If we've reached the required number of swipes
      if (swipeCounter.current >= swipeCount) {
        // Start hold timer 
        if (holdTimer.current === null) {
          if (debug) {
            showDebugIndicator(`Hold for ${holdDuration}s to activate`);
          }
          
          holdTimer.current = window.setTimeout(() => {
            if (debug) {
              showDebugIndicator('Panic activated!');
            }
            onPanicTriggered();
            swipeCounter.current = 0;
            holdTimer.current = null;
          }, holdDuration * 1000);
        }
      }
    }
  };
  
  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartY.current && e.changedTouches.length > 0) {
      touchEndY.current = e.changedTouches[0].clientY;
      
      // Simple swipe detection for devices without proper touch support
      if (touchStartY.current - touchEndY.current > SWIPE_THRESHOLD) {
        // This is a backup detection method that's simpler but less reliable
        const now = Date.now();
        
        if (now - lastSwipeTime.current > SWIPE_TIMEOUT) {
          swipeCounter.current = 0;
        }
        
        swipeCounter.current += 1;
        lastSwipeTime.current = now;
        
        if (debug) {
          showDebugIndicator(`Simple swipe ${swipeCounter.current} of ${swipeCount}`);
        }
      }
    }
    
    touchStartY.current = null;
    touchStartX.current = null;
    touchEndY.current = null;
    
    // Clear hold timer if touch ends before hold duration completes
    if (holdTimer.current !== null) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };
  
  // Handle long-press detection (alternative trigger method)
  const longPressTimer = useRef<number | null>(null);
  const LONG_PRESS_DURATION = 3000; // 3 seconds for a long press
  
  const handleLongPressStart = (e: TouchEvent) => {
    if (longPressTimer.current === null) {
      longPressTimer.current = window.setTimeout(() => {
        if (debug) {
          showDebugIndicator('Long press activated!');
        }
        onPanicTriggered();
        longPressTimer.current = null;
      }, LONG_PRESS_DURATION);
    }
  };
  
  const handleLongPressEnd = () => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  
  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    // Alternative trigger with long press
    document.addEventListener('touchstart', handleLongPressStart);
    document.addEventListener('touchend', handleLongPressEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchstart', handleLongPressStart);
      document.removeEventListener('touchend', handleLongPressEnd);
      
      if (holdTimer.current !== null) {
        clearTimeout(holdTimer.current);
      }
      if (longPressTimer.current !== null) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [swipeCount, holdDuration, debug]);
  
  // For development/testing purposes - allow keyboard trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Pressing 'p' key as a panic trigger for testing
      if (e.key === 'p') {
        if (debug) {
          showDebugIndicator('Keyboard trigger (p key)');
        }
        onPanicTriggered();
      }
      
      // Combination trigger: triple-press Escape key
      if (e.key === 'Escape') {
        const now = Date.now();
        // Reset counter if too much time has passed
        if (now - lastSwipeTime.current > SWIPE_TIMEOUT) {
          swipeCounter.current = 0;
        }
        
        swipeCounter.current += 1;
        lastSwipeTime.current = now;
        
        if (debug) {
          showDebugIndicator(`Escape press ${swipeCounter.current} of 3`);
        }
        
        if (swipeCounter.current >= 3) {
          if (debug) {
            showDebugIndicator('Keyboard trigger (triple escape)');
          }
          onPanicTriggered();
          swipeCounter.current = 0;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPanicTriggered, debug]);
  
  // Create and render debug indicator if in debug mode
  useEffect(() => {
    if (debug && debugInfo) {
      const debugElement = document.createElement('div');
      debugElement.id = 'panic-debug-indicator';
      debugElement.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-family: sans-serif;
        font-size: 14px;
        z-index: 9999;
      `;
      debugElement.textContent = debugInfo;
      document.body.appendChild(debugElement);
      
      return () => {
        if (document.getElementById('panic-debug-indicator')) {
          document.body.removeChild(debugElement);
        }
      };
    }
  }, [debugInfo, debug]);
  
  return { 
    swipeCounter: swipeCounter.current,
    debugInfo
  };
}

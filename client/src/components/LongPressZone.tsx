import React, { useRef, useEffect, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';

interface LongPressZoneProps {
  location: string;
  duration: number; // In tenths of seconds
}

const LongPressZone: React.FC<LongPressZoneProps> = ({ location, duration }) => {
  const { triggerPanic, panicSettings } = useAppContext();
  const { toast } = useToast();
  const timeoutRef = useRef<number | null>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  
  // Get location text for accessibility labels
  const getLocationText = () => {
    switch (location) {
      case 'top_left':
        return 'top left';
      case 'top_right':
        return 'top right';
      case 'bottom_left':
        return 'bottom left';
      case 'bottom_right':
        return 'bottom right';
      case 'center':
        return 'center';
      default:
        return 'bottom right';
    }
  };
  
  // Determine position based on location
  const getPositionStyles = () => {
    switch (location) {
      case 'top_left':
        return { top: 0, left: 0 };
      case 'top_right':
        return { top: 0, right: 0 };
      case 'bottom_left':
        return { bottom: 0, left: 0 };
      case 'bottom_right':
        return { bottom: 0, right: 0 };
      case 'center':
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      default:
        return { bottom: 0, right: 0 };
    }
  };
  
  const positionStyles = getPositionStyles();
  
  // Handle touch start and touch end events
  const handleTouchStart = () => {
    setIsPressed(true);
    timeoutRef.current = window.setTimeout(() => {
      triggerPanic();
      if (panicSettings.vibrationFeedback && navigator.vibrate) {
        navigator.vibrate([100, 50, 200]);
      }
    }, duration * 100); // Convert from tenths to milliseconds
  };
  
  const handleTouchEnd = () => {
    setIsPressed(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  
  // Handle key press for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTouchStart();
    }
  };
  
  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTouchEnd();
    }
  };
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Determine visual appearance based on accessibility settings
  const isVisible = panicSettings.accessibilityMode && panicSettings.showTriggerZones;
  const backgroundColor = isPressed ? 'rgba(255, 50, 50, 0.4)' : 'rgba(255, 50, 50, 0.2)';
  
  return (
    <div 
      ref={zoneRef}
      className="long-press-zone"
      role="button"
      tabIndex={0}
      aria-label={`Long press emergency zone at ${getLocationText()}. Hold for ${(duration / 10).toFixed(1)} seconds to activate panic mode`}
      aria-pressed={isPressed}
      style={{
        position: 'fixed',
        width: '60px',
        height: '60px',
        zIndex: 999,
        opacity: isVisible ? 1 : 0,
        backgroundColor: isVisible ? backgroundColor : 'transparent',
        border: isVisible ? '2px dashed rgba(255, 50, 50, 0.7)' : 'none',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        ...positionStyles
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      {isVisible && (
        <span 
          className="sr-only"
          style={{
            fontSize: panicSettings.largerText ? '14px' : '12px',
            color: 'white',
            textAlign: 'center',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        >
          Press and hold for panic
        </span>
      )}
    </div>
  );
};

export default LongPressZone;
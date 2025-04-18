import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/app-context';

const FakeLockScreen: React.FC = () => {
  const { resetPanic, panicSettings } = useAppContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPinError, setShowPinError] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [securityDelay, setSecurityDelay] = useState(0);
  const [showDecoy, setShowDecoy] = useState(false);
  const [decoyType, setDecoyType] = useState('calculator');
  
  // Update the clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format date and time
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  
  // Handle PIN input
  const handleNumberPress = (num: number) => {
    if (pinInput.length < 4) {
      const newPin = pinInput + num;
      setPinInput(newPin);
      
      // If PIN reaches 4 digits, show error message
      if (newPin.length === 4) {
        setShowPinError(true);
        if (securityDelay < 3) {
          setSecurityDelay(securityDelay + 1);
        }
        
        // Clear PIN after 2 seconds and reset error message
        setTimeout(() => {
          setPinInput('');
          setShowPinError(false);
        }, 2000);
      }
    }
  };
  
  // Handle deleting a digit
  const handleDelete = () => {
    if (pinInput.length > 0) {
      setPinInput(pinInput.slice(0, -1));
    }
  };
  
  // Handle "real" PIN (secret exit)
  const handleSecretExit = () => {
    resetPanic();
  };
  
  // Handle unlock swipe to show decoy screen
  const handleUnlockSwipe = () => {
    // Determine which decoy screen to show based on settings
    if (panicSettings.decoyType === 'fake_lock_screen') {
      setDecoyType('calculator'); // Default to calculator if no preference
    } else if (panicSettings.decoyType.startsWith('external_site_')) {
      setDecoyType('browser');
    } else {
      setDecoyType(panicSettings.decoyType);
    }
    
    setShowDecoy(true);
  };
  
  // Secret triple tap to exit decoy and return to real app
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  const handleSecretTap = () => {
    const now = Date.now();
    
    // Reset counter if too much time has passed since last tap
    if (now - lastTapTime > 1000) {
      setTapCount(1);
    } else {
      setTapCount(prev => prev + 1);
    }
    
    setLastTapTime(now);
    
    // If triple tap detected, exit decoy
    if (tapCount >= 2) {
      setShowDecoy(false);
      setTapCount(0);
    }
  };
  
  // Render decoy screens
  const renderDecoyScreen = () => {
    // Get font size based on accessibility settings
    const getFontSize = (baseSize: string, increment: string = '1') => {
      if (panicSettings.largerText) {
        return `calc(${baseSize} + ${increment}rem)`;
      }
      return baseSize;
    };
    
    switch (decoyType) {
      case 'calculator':
        return (
          <div 
            className="bg-black text-white h-screen p-4" 
            onClick={handleSecretTap}
            role="application"
            aria-label="Calculator application. This is a decoy screen. Triple tap anywhere to exit."
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleSecretExit();
              }
            }}
          >
            {/* Hidden accessibility instruction */}
            <div className="sr-only">This is a fake calculator screen. Triple tap anywhere to exit, or press Escape key.</div>
            
            <div 
              className="text-right text-3xl mb-4 font-light" 
              role="textbox" 
              aria-label="Calculator result: 42.5"
              style={{ fontSize: getFontSize('1.875rem') }}
            >
              42.5
            </div>
            <div className="grid grid-cols-4 gap-2" role="grid" aria-label="Calculator keypad">
              {['AC', '+/-', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '00', '.', '='].map((key, index) => (
                <div 
                  key={key} 
                  role="button"
                  tabIndex={0}
                  aria-label={key}
                  className={`
                    text-center py-3 rounded-lg cursor-pointer
                    ${index < 3 ? 'bg-gray-600' : ''}
                    ${[3, 7, 11, 15, 19].includes(index) ? 'bg-orange-500' : ''}
                    ${![3, 7, 11, 15, 19].includes(index) && index >= 4 ? 'bg-gray-800' : ''}
                  `}
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  {key}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-3">
              <div className="h-1 w-1/3 bg-gray-700 rounded" aria-hidden="true"></div>
            </div>
          </div>
        );
      
      case 'notes':
        return (
          <div 
            className="bg-white text-black h-screen p-4" 
            onClick={handleSecretTap}
            role="application"
            aria-label="Notes application with shopping list. This is a decoy screen. Triple tap anywhere to exit."
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleSecretExit();
              }
            }}
          >
            {/* Hidden accessibility instruction */}
            <div className="sr-only">This is a fake notes screen. Triple tap anywhere to exit, or press Escape key.</div>
            
            <div className="border-b border-gray-200 pb-2 mb-2">
              <div 
                className="font-medium" 
                role="heading" 
                aria-level={1}
                style={{ fontSize: getFontSize('1rem') }}
              >
                Shopping List
              </div>
            </div>
            <div className="space-y-3" role="list" aria-label="Shopping list items">
              <div 
                className="flex items-center" 
                role="listitem"
                style={{ fontSize: getFontSize('1rem') }}
              >
                <span className="material-icons text-xs mr-2" aria-hidden="true">check_circle</span>
                <span>Milk <span className="sr-only">(completed)</span></span>
              </div>
              <div 
                className="flex items-center" 
                role="listitem"
                style={{ fontSize: getFontSize('1rem') }}
              >
                <span className="material-icons text-xs mr-2" aria-hidden="true">check_circle</span>
                <span>Bread <span className="sr-only">(completed)</span></span>
              </div>
              <div 
                className="flex items-center" 
                role="listitem"
                style={{ fontSize: getFontSize('1rem') }}
              >
                <span className="material-icons text-xs mr-2" aria-hidden="true">check_circle_outline</span>
                <span>Eggs <span className="sr-only">(not completed)</span></span>
              </div>
              <div 
                className="flex items-center" 
                role="listitem"
                style={{ fontSize: getFontSize('1rem') }}
              >
                <span className="material-icons text-xs mr-2" aria-hidden="true">check_circle_outline</span>
                <span>Apples <span className="sr-only">(not completed)</span></span>
              </div>
            </div>
          </div>
        );
        
      case 'browser':
        return (
          <div 
            className="bg-white text-black h-screen" 
            onClick={handleSecretTap}
            role="application"
            aria-label="Web browser showing weather information. This is a decoy screen. Triple tap anywhere to exit."
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleSecretExit();
              }
            }}
          >
            {/* Hidden accessibility instruction */}
            <div className="sr-only">This is a fake browser screen. Triple tap anywhere to exit, or press Escape key.</div>
            
            <div className="bg-gray-100 p-3 flex items-center border-b" role="banner">
              <span className="material-icons text-gray-500 mr-2" aria-hidden="true">arrow_back</span>
              <div 
                className="bg-white rounded-full flex-1 py-1 px-3 text-sm text-gray-500 border"
                role="textbox"
                aria-label="Address bar, showing weather.com"
                style={{ fontSize: getFontSize('0.875rem') }}
              >
                weather.com
              </div>
              <span className="material-icons text-gray-500 ml-2" aria-hidden="true">refresh</span>
            </div>
            <div className="p-4" role="main">
              <div 
                className="text-lg font-medium mb-2" 
                role="heading" 
                aria-level={1}
                style={{ fontSize: getFontSize('1.125rem') }}
              >
                New York
              </div>
              <div className="flex items-center" role="region" aria-label="Current weather">
                <span 
                  className="material-icons text-4xl text-blue-500 mr-3" 
                  aria-hidden="true"
                >
                  cloud
                </span>
                <div>
                  <div 
                    className="text-3xl font-light" 
                    aria-label="Current temperature: 72 degrees"
                    style={{ fontSize: getFontSize('1.875rem') }}
                  >
                    72°
                  </div>
                  <div 
                    className="text-sm text-gray-500" 
                    aria-label="Weather condition: Partly Cloudy"
                    style={{ fontSize: getFontSize('0.875rem') }}
                  >
                    Partly Cloudy
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-2" role="list" aria-label="Weather forecast">
                <div 
                  className="flex justify-between p-2 bg-gray-50 rounded"
                  role="listitem"
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  <span>Tomorrow</span>
                  <div className="flex items-center">
                    <span className="material-icons text-sm text-blue-500 mr-1" aria-hidden="true">water_drop</span>
                    <span aria-label="Temperature: 75 degrees, rainy">75°</span>
                  </div>
                </div>
                <div 
                  className="flex justify-between p-2 bg-gray-50 rounded"
                  role="listitem"
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  <span>Tuesday</span>
                  <div className="flex items-center">
                    <span className="material-icons text-sm text-yellow-500 mr-1" aria-hidden="true">wb_sunny</span>
                    <span aria-label="Temperature: 80 degrees, sunny">80°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div 
            className="bg-white text-black h-screen flex items-center justify-center" 
            onClick={handleSecretTap}
            role="application"
            aria-label="Generic application screen. This is a decoy screen. Triple tap anywhere to exit."
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleSecretExit();
              }
            }}
          >
            <div className="text-center">
              <span className="material-icons text-6xl mb-4" aria-hidden="true">apps</span>
              <p style={{ fontSize: getFontSize('1rem') }}>
                Tap three times quickly to return to lock screen
                <span className="sr-only">or press the Escape key</span>
              </p>
            </div>
          </div>
        );
    }
  };
  
  if (showDecoy) {
    return renderDecoyScreen();
  }
  
  // Determine text size based on accessibility settings
  const getFontSize = (baseSize: string, increment: string = '1') => {
    if (panicSettings.largerText) {
      return `calc(${baseSize} + ${increment}rem)`;
    }
    return baseSize;
  };

  return (
    <div 
      className="lock-screen bg-black text-white flex flex-col items-center justify-between min-h-screen p-6"
      role="dialog"
      aria-label="Fake lock screen. This is a decoy screen for privacy protection. Triple tap anywhere to exit, or press Emergency to return to app."
    >
      {/* Skip to content link for keyboard users */}
      <a 
        href="#emergency-exit" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:p-2 focus:bg-blue-500 focus:text-white focus:z-50 focus:rounded"
      >
        Skip to emergency exit
      </a>
      
      {/* Top bar with status icons */}
      <div className="w-full flex justify-between items-center pt-4">
        <div className="text-sm" style={{ fontSize: getFontSize('0.875rem') }}>No Service</div>
        <div className="flex space-x-2">
          <span className="material-icons text-sm" aria-hidden="true">wifi</span>
          <span className="material-icons text-sm" aria-hidden="true">battery_full</span>
        </div>
      </div>
      
      {/* Clock and date */}
      <div className="flex flex-col items-center mt-20" role="presentation" aria-live="polite">
        <div 
          className="text-6xl font-light mb-2" 
          style={{ fontSize: getFontSize('3.75rem') }}
          aria-label={`Current time: ${formattedTime}`}
        >
          {formattedTime}
        </div>
        <div 
          className="text-xl" 
          style={{ fontSize: getFontSize('1.25rem') }}
          aria-label={`Today is ${formattedDate}`}
        >
          {formattedDate}
        </div>
      </div>
      
      {/* PIN dots */}
      <div 
        className="mt-10 flex space-x-4" 
        role="status" 
        aria-live="polite"
        aria-label={`Passcode field, ${pinInput.length} of 4 digits entered`}
      >
        {[...Array(4)].map((_, i) => (
          <div 
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i < pinInput.length ? 'bg-white' : 'bg-gray-600'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      
      {/* Error message */}
      {showPinError && (
        <div 
          className="text-red-500 mt-4" 
          role="alert" 
          aria-live="assertive"
          style={{ fontSize: getFontSize('1rem') }}
        >
          {securityDelay === 3 
            ? 'Try again in 1 minute' 
            : 'Incorrect passcode. Try again.'}
        </div>
      )}
      
      {/* Keypad */}
      <div className="w-full max-w-xs mt-auto mb-8">
        <div className="grid grid-cols-3 gap-4 mb-4" role="group" aria-label="Number pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              className="bg-gray-800/60 backdrop-blur-md text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl"
              onClick={() => handleNumberPress(num)}
              aria-label={`Number ${num}`}
              style={{ fontSize: getFontSize('1.5rem') }}
            >
              {num}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between">
          <div className="w-16 h-16"></div>
          <button
            className="bg-gray-800/60 backdrop-blur-md text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl"
            onClick={() => handleNumberPress(0)}
            aria-label="Number 0"
            style={{ fontSize: getFontSize('1.5rem') }}
          >
            0
          </button>
          <button
            className="bg-transparent text-white w-16 h-16 flex items-center justify-center"
            onClick={handleDelete}
            aria-label="Delete last digit"
          >
            <span className="material-icons" style={{ fontSize: getFontSize('1.5rem') }}>backspace</span>
          </button>
        </div>
        
        {/* Swipe to unlock */}
        <div 
          className="bg-gray-800/30 mt-6 rounded-full py-2 px-4 text-center text-white/80 text-sm cursor-pointer"
          onClick={handleUnlockSwipe}
          role="button"
          tabIndex={0}
          aria-label="Tap to unlock phone and show decoy application"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleUnlockSwipe();
            }
          }}
          style={{ fontSize: getFontSize('0.875rem') }}
        >
          Swipe to unlock
        </div>
        
        {/* Emergency button (actually our secret exit) */}
        <div className="flex justify-between mt-4">
          <button
            id="emergency-exit"
            className="text-white/70 text-sm py-2 px-4"
            onClick={handleSecretExit}
            aria-label="Emergency - Exit fake lock screen and return to application"
            style={{ fontSize: getFontSize('0.875rem') }}
          >
            Emergency
          </button>
          <button
            className="text-white/70 text-sm py-2 px-4"
            onClick={handleSecretExit}
            aria-label="Cancel - Exit fake lock screen and return to application"
            style={{ fontSize: getFontSize('0.875rem') }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FakeLockScreen;
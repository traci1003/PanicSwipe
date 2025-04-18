import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { RouteComponentProps } from 'wouter';

interface EmergencyTriggeredProps extends Partial<RouteComponentProps> {
  onClose?: () => void;
}

const EmergencyTriggered: React.FC<EmergencyTriggeredProps> = ({ onClose }) => {
  const { panicSettings, resetPanic } = useAppContext();
  const [showOverlay, setShowOverlay] = useState(true);
  
  // Get current time in local format
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  // Get current date in local format
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const [time, setTime] = useState(getCurrentTime());
  const [date, setDate] = useState(getCurrentDate());
  
  // For calculator mode
  const [displayValue, setDisplayValue] = useState('0');
  const [calculation, setCalculation] = useState({
    firstOperand: 0 as number | null,
    operator: '' as string | null,
    waitingForSecondOperand: false
  });

  useEffect(() => {
    // Show emergency exit animation
    const overlayTimer = setTimeout(() => {
      setShowOverlay(false);
    }, 800);
    
    // Keep time updated
    const timer = setInterval(() => {
      setTime(getCurrentTime());
      setDate(getCurrentDate());
    }, 1000);

    // Auto-dismiss after 5 seconds in development mode
    const autoClose = setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        if (onClose) onClose();
        resetPanic();
      }
    }, 5000);
    
    return () => {
      clearInterval(timer);
      clearTimeout(autoClose);
      clearTimeout(overlayTimer);
    };
  }, [onClose, resetPanic]);

  // Handle calculator button clicks for calculator decoy
  const handleCalcKeyPress = (key: string) => {
    if (/[0-9]/.test(key)) {
      // Handle numeric input
      if (calculation.waitingForSecondOperand) {
        setDisplayValue(key);
        setCalculation({...calculation, waitingForSecondOperand: false});
      } else {
        setDisplayValue(displayValue === '0' ? key : displayValue + key);
      }
    } else if (key === '=') {
      // Basic calculator functionality for show
      if (calculation.firstOperand !== null && calculation.operator) {
        const firstNum = calculation.firstOperand;
        const secondNum = parseFloat(displayValue);
        let result = 0;
        
        switch (calculation.operator) {
          case '+':
            result = firstNum + secondNum;
            break;
          case '-':
            result = firstNum - secondNum;
            break;
          case '×':
            result = firstNum * secondNum;
            break;
          case '÷':
            result = secondNum !== 0 ? firstNum / secondNum : 0;
            break;
        }
        
        setDisplayValue(result.toString());
        setCalculation({
          firstOperand: 0,
          operator: '',
          waitingForSecondOperand: false
        });
      }
    } else if (['+', '-', '×', '÷'].includes(key)) {
      // Handle operators
      const currentValue = parseFloat(displayValue);
      setCalculation({
        firstOperand: currentValue,
        operator: key,
        waitingForSecondOperand: true
      });
    } else if (key === '.') {
      // Handle decimal
      if (!displayValue.includes('.')) {
        setDisplayValue(displayValue + '.');
      }
    }
  };

  const handleSystemAlertClick = () => {
    if (onClose) onClose();
    resetPanic();
  };
  
  // Emergency exit animation overlay
  const emergencyOverlay = (
    <div className={`fixed inset-0 z-50 bg-black transition-opacity duration-800 ${showOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-lg font-bold">
          <span className="material-icons text-red-500 mr-2 animate-pulse">security</span>
          Activating emergency mode...
        </div>
      </div>
    </div>
  );
  
  // Different decoy screen content based on settings
  let decoyContent;
  
  switch (panicSettings.decoyType) {
    case 'clock':
      decoyContent = (
        <div className="text-white text-center">
          <div className="text-8xl font-light mb-1">{time}</div>
          <div className="text-xl font-light mb-8">{date}</div>
          <div className="flex flex-col items-center">
            <span className="material-icons text-white/50 mb-2 swipe-hint">arrow_upward</span>
            <div className="text-sm opacity-60">Swipe up to unlock</div>
          </div>
        </div>
      );
      break;
      
    case 'calculator':
      decoyContent = (
        <div className="w-full max-w-xs mx-auto">
          <div className="text-right text-white text-4xl mb-6 bg-gray-900 p-4 rounded-lg h-20 flex items-center justify-end overflow-hidden">
            {displayValue}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '=', '+'].map((key) => (
              <div 
                key={key} 
                className="bg-gray-800 text-white text-center py-4 rounded-lg text-xl cursor-pointer active:bg-gray-700 select-none"
                onClick={() => handleCalcKeyPress(key)}
              >{key}</div>
            ))}
          </div>
        </div>
      );
      break;
      
    case 'notes':
      decoyContent = (
        <div className="w-full max-w-xs mx-auto bg-white text-black p-4 rounded-lg shadow-lg">
          <div className="border-b border-gray-200 pb-2 mb-4">
            <div className="font-medium text-lg">Shopping List</div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="material-icons text-green-500 mr-2">check_circle</span>
              <span>Milk</span>
            </div>
            <div className="flex items-center">
              <span className="material-icons text-green-500 mr-2">check_circle</span>
              <span>Bread</span>
            </div>
            <div className="flex items-center">
              <span className="material-icons text-gray-400 mr-2">circle</span>
              <span>Eggs</span>
            </div>
            <div className="flex items-center">
              <span className="material-icons text-gray-400 mr-2">circle</span>
              <span>Apples</span>
            </div>
            <div className="flex items-center">
              <span className="material-icons text-gray-400 mr-2">circle</span>
              <span>Coffee</span>
            </div>
            <div className="flex items-center">
              <span className="material-icons text-gray-400 mr-2">circle</span>
              <span>Cereal</span>
            </div>
          </div>
        </div>
      );
      break;
      
    case 'gallery':
      decoyContent = (
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="material-icons text-white">arrow_back</span>
            <h3 className="text-white">Gallery</h3>
            <span className="material-icons text-white">more_vert</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      );
      break;
      
    default:
      decoyContent = (
        <div className="text-white text-center">
          <div className="text-8xl font-light mb-1">{time}</div>
          <div className="text-xl font-light mb-8">{date}</div>
          <div className="flex flex-col items-center">
            <span className="material-icons text-white/50 mb-2 swipe-hint">arrow_upward</span>
            <div className="text-sm opacity-60">Swipe up to unlock</div>
          </div>
        </div>
      );
  }

  return (
    <>
      {/* Emergency exit animation overlay */}
      {emergencyOverlay}
    
      {/* Decoy app screen */}
      <div className="fixed inset-0 bg-black">
        {/* Status bar at top of screen */}
        <div className="flex justify-between items-center py-1 px-4 text-xs text-white">
          <div>{time}</div>
          <div className="flex items-center space-x-1">
            <span className="material-icons text-xs">signal_cellular_alt</span>
            <span className="material-icons text-xs">wifi</span>
            <span className="material-icons text-xs">battery_full</span>
          </div>
        </div>
        
        <div className="h-full flex flex-col justify-center items-center px-5">
          {decoyContent}
          
          {/* System message overlay */}
          {panicSettings.fakeSystemAlert && (
            <div className="fixed top-1/4 left-0 right-0 mx-auto w-5/6 bg-card rounded-lg p-4 shadow-2xl">
              <div className="flex items-start">
                {panicSettings.systemAlertType === 'low_battery' && (
                  <>
                    <span className="material-icons text-red-500 mr-3">battery_alert</span>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Low Battery</h3>
                      <p className="text-muted-foreground text-xs mb-2">Your device is at 5% battery. Connect to a power source soon to avoid shutdown.</p>
                      <button 
                        className="text-secondary text-xs"
                        onClick={handleSystemAlertClick}
                      >
                        OK
                      </button>
                    </div>
                  </>
                )}
                
                {panicSettings.systemAlertType === 'system_update' && (
                  <>
                    <span className="material-icons text-blue-500 mr-3">system_update</span>
                    <div>
                      <h3 className="text-sm font-medium mb-1">System Update Required</h3>
                      <p className="text-muted-foreground text-xs mb-2">Your system needs to be updated for security patches. Please update now.</p>
                      <button 
                        className="text-secondary text-xs"
                        onClick={handleSystemAlertClick}
                      >
                        Later
                      </button>
                    </div>
                  </>
                )}
                
                {panicSettings.systemAlertType === 'storage_full' && (
                  <>
                    <span className="material-icons text-amber-500 mr-3">storage</span>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Storage Almost Full</h3>
                      <p className="text-muted-foreground text-xs mb-2">You have less than 500MB of storage remaining. Free up space to continue using your device normally.</p>
                      <button 
                        className="text-secondary text-xs"
                        onClick={handleSystemAlertClick}
                      >
                        Manage Storage
                      </button>
                    </div>
                  </>
                )}
                
                {panicSettings.systemAlertType === 'network_lost' && (
                  <>
                    <span className="material-icons text-red-500 mr-3">wifi_off</span>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Network Connection Lost</h3>
                      <p className="text-muted-foreground text-xs mb-2">Your device is no longer connected to the internet. Check your connection settings.</p>
                      <button 
                        className="text-secondary text-xs"
                        onClick={handleSystemAlertClick}
                      >
                        Settings
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmergencyTriggered;

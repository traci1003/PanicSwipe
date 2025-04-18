import React from 'react';

const StatusBar: React.FC = () => {
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const [time, setTime] = React.useState(getCurrentTime());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(getCurrentTime());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="status-bar bg-background">
      <div className="time text-sm font-medium">{time}</div>
      <div className="icons flex space-x-1.5">
        <span className="material-icons text-xs">signal_cellular_alt</span>
        <span className="material-icons text-xs">wifi</span>
        <span className="material-icons text-xs">battery_full</span>
      </div>
    </div>
  );
};

export default StatusBar;

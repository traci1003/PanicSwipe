import React from 'react';
import { useLocation, Link } from 'wouter';

const BottomNav: React.FC = () => {
  const [location] = useLocation();

  return (
    <div className="bottom-nav bg-surface flex justify-around items-center">
      <Link href="/">
        <div className="flex flex-col items-center justify-center h-full px-2 w-1/4" role="button" tabIndex={0} aria-label="Home">
          <span className={`material-icons ${location === '/' ? 'text-secondary' : 'text-foreground'}`}>shield</span>
          <span className="text-foreground text-xs mt-1">Home</span>
        </div>
      </Link>
      
      <Link href="/app-locker-settings">
        <div className="flex flex-col items-center justify-center h-full px-2 w-1/4" role="button" tabIndex={0} aria-label="Apps">
          <span className={`material-icons ${location.startsWith('/app-locker-settings') ? 'text-secondary' : 'text-foreground'}`}>apps</span>
          <span className="text-foreground text-xs mt-1">Apps</span>
        </div>
      </Link>
      
      <Link href="/settings">
        <div className="flex flex-col items-center justify-center h-full px-2 w-1/4" role="button" tabIndex={0} aria-label="Settings">
          <span className={`material-icons ${location === '/settings' ? 'text-secondary' : 'text-foreground'}`}>tune</span>
          <span className="text-foreground text-xs mt-1">Settings</span>
        </div>
      </Link>
      
      <Link href="/help">
        <div className="flex flex-col items-center justify-center h-full px-2 w-1/4" role="button" tabIndex={0} aria-label="Help">
          <span className={`material-icons ${location === '/help' ? 'text-secondary' : 'text-foreground'}`}>help_outline</span>
          <span className="text-foreground text-xs mt-1">Help</span>
        </div>
      </Link>
    </div>
  );
};

export default BottomNav;

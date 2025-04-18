import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Download, HelpCircle, ArrowLeft, Smartphone } from "lucide-react";

// BeforeInstallPromptEvent is not in the standard TypeScript types
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOSDevice(isIOS);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      // Log app installation
      console.log('App was installed');
      setIsInstalled(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Clear the saved prompt since it can't be used again
    setDeferredPrompt(null);
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Install App</h1>
      </div>

      {isInstalled ? (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4 text-green-500">
              <Smartphone className="h-12 w-12" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">Successfully Installed</h2>
            <p className="text-center text-muted-foreground mb-4">
              The app is already installed on your device.
            </p>
            <Link href="/">
              <Button className="w-full">Return to App</Button>
            </Link>
          </CardContent>
        </Card>
      ) : isIOSDevice ? (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4 text-primary">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-4">iOS Installation</h2>
            <p className="mb-4">To install on iOS:</p>
            <ol className="list-decimal ml-5 mb-4 space-y-2">
              <li>Tap the <span className="inline-flex items-center border px-2 py-1 rounded text-sm">Share <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 2C7.77614 2 8 2.22386 8 2.5L8 8.5C8 8.77614 7.77614 9 7.5 9C7.22386 9 7 8.77614 7 8.5L7 2.5C7 2.22386 7.22386 2 7.5 2ZM4.89645 4.60355C5.09171 4.40829 5.4083 4.40829 5.60355 4.60355L7.5 6.5L9.39645 4.60355C9.59171 4.40829 9.9083 4.40829 10.1036 4.60355C10.2988 4.7988 10.2988 5.1154 10.1036 5.31066L7.85355 7.56066C7.75979 7.65442 7.63261 7.70711 7.5 7.70711C7.36739 7.70711 7.24021 7.65442 7.14645 7.56066L4.89645 5.31066C4.70118 5.1154 4.70118 4.7988 4.89645 4.60355ZM2.5 10C2.22386 10 2 10.2239 2 10.5C2 10.7761 2.22386 11 2.5 11H12.5C12.7761 11 13 10.7761 13 10.5C13 10.2239 12.7761 10 12.5 10H2.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg></span> icon</li>
              <li>Scroll down and tap <strong className="font-medium">Add to Home Screen</strong></li>
              <li>Tap <strong className="font-medium">Add</strong> in the top-right</li>
            </ol>
            <div className="flex justify-center mt-6">
              <Link href="/help">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <HelpCircle className="h-4 w-4" />
                  Need Help?
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Download className="h-8 w-8 text-primary" />
                </div>
                {deferredPrompt && (
                  <div className="absolute -top-1 -right-1">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2">Install App</h2>
              <p className="text-center text-muted-foreground mb-4">
                Install the app for better performance, offline access, and a native experience.
              </p>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={handleInstallClick} 
                className="w-full" 
                disabled={!deferredPrompt}
              >
                <Download className="mr-2 h-5 w-5" />
                Install Now
              </Button>
              {!deferredPrompt && (
                <p className="text-sm text-muted-foreground text-center">
                  Your browser doesn't support app installation at this time, or this app is already installed.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6">
        <h3 className="font-medium mb-2">Why Install This App?</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start">
            <span className="mr-2 mt-0.5">•</span>
            <span>Faster access with no browser address bar</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 mt-0.5">•</span>
            <span>More discreet usage with a standard app icon</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 mt-0.5">•</span>
            <span>Improved performance and offline access</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 mt-0.5">•</span>
            <span>Better security for your sensitive information</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
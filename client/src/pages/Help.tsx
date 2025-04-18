import React from 'react';
import { Link } from 'wouter';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Help: React.FC = () => {
  const { panicSettings } = useAppContext();

  // Adjust text size based on accessibility settings
  const getFontSize = (baseSize: string, increment: string = '0.2') => {
    if (panicSettings.largerText) {
      return `calc(${baseSize} + ${increment}rem)`;
    }
    return baseSize;
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 pb-20">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="p-0 mr-2"
            aria-label="Back to Home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 
          className="text-2xl font-bold" 
          style={{ fontSize: getFontSize('1.5rem') }}
        >
          Help & Information
        </h1>
      </div>

      <Card className="p-4 mb-6 bg-red-50 border-red-200">
        <h2 
          className="text-xl font-semibold mb-3 text-red-700" 
          style={{ fontSize: getFontSize('1.25rem') }}
        >
          Emergency Use
        </h2>
        <p 
          className="text-gray-700 mb-2" 
          style={{ fontSize: getFontSize('1rem') }}
        >
          Panic Swipe is designed to help you quickly protect sensitive information in emergency situations.
        </p>
        <div className="flex flex-col space-y-2">
          <div className="p-3 bg-white rounded-lg border border-red-200">
            <span className="font-medium block mb-1" style={{ fontSize: getFontSize('1rem') }}>To trigger emergency mode:</span>
            <ul className="list-disc pl-5" style={{ fontSize: getFontSize('0.875rem') }}>
              <li>Use the configured panic gesture (long press or swipe)</li>
              <li>Tap the "Panic" button on the home screen</li>
              <li>Use the keyboard shortcut (Alt+P) if enabled</li>
            </ul>
          </div>
        </div>
      </Card>

      <Accordion type="single" collapsible className="mb-6">
        <AccordionItem value="features">
          <AccordionTrigger 
            className="text-lg font-medium" 
            style={{ fontSize: getFontSize('1.125rem') }}
          >
            Features Guide
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-3 space-y-4">
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  Long-Press Zones
                </h3>
                <p 
                  className="text-gray-700 mb-2" 
                  style={{ fontSize: getFontSize('0.875rem') }}
                >
                  Invisible touch areas that trigger panic mode when pressed and held. You can configure their location and timing.
                </p>
              </div>
              
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  Decoy Screens
                </h3>
                <p 
                  className="text-gray-700 mb-2" 
                  style={{ fontSize: getFontSize('0.875rem') }}
                >
                  When panic mode activates, the app can display a harmless decoy screen like a calculator, notes, or weather app.
                </p>
              </div>
              
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  App Protection
                </h3>
                <p 
                  className="text-gray-700 mb-2" 
                  style={{ fontSize: getFontSize('0.875rem') }}
                >
                  Quickly hide and lock sensitive apps with a single tap. Configure which apps should be protected.
                </p>
              </div>
              
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  Timed Panic
                </h3>
                <p 
                  className="text-gray-700 mb-2" 
                  style={{ fontSize: getFontSize('0.875rem') }}
                >
                  Set panic mode to trigger automatically after a delay. Useful if you're entering a situation where you may not be able to activate it manually.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="accessibility">
          <AccordionTrigger 
            className="text-lg font-medium" 
            style={{ fontSize: getFontSize('1.125rem') }}
          >
            Accessibility Features
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-3 space-y-4">
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  Larger Text
                </h3>
                <p 
                  className="text-gray-700 mb-2" 
                  style={{ fontSize: getFontSize('0.875rem') }}
                >
                  Increases text size throughout the app for better readability.
                </p>
              </div>
              
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  Visible Trigger Zones
                </h3>
                <p 
                  className="text-gray-700 mb-2" 
                  style={{ fontSize: getFontSize('0.875rem') }}
                >
                  Makes long-press zones visible with clear visual indicators.
                </p>
              </div>
              
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  Keyboard Controls
                </h3>
                <p 
                  className="text-gray-700 mb-2" 
                  style={{ fontSize: getFontSize('0.875rem') }}
                >
                  All functions are accessible via keyboard shortcuts for those who cannot use touch controls.
                </p>
              </div>
              
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  Haptic Feedback
                </h3>
                <p 
                  className="text-gray-700 mb-2" 
                  style={{ fontSize: getFontSize('0.875rem') }}
                >
                  Optional vibration feedback when panic mode is triggered or actions are performed.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="setup">
          <AccordionTrigger 
            className="text-lg font-medium" 
            style={{ fontSize: getFontSize('1.125rem') }}
          >
            Setting Up Panic Swipe
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-3 space-y-4">
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  Initial Configuration
                </h3>
                <ol className="list-decimal pl-5 space-y-2" style={{ fontSize: getFontSize('0.875rem') }}>
                  <li>Configure your preferred panic trigger method (long press or swipe)</li>
                  <li>Select your preferred decoy screen</li>
                  <li>Choose which apps to protect when panic mode activates</li>
                  <li>Set up any accessibility features you need</li>
                </ol>
              </div>
              
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  Practice Mode
                </h3>
                <p 
                  className="text-gray-700 mb-2" 
                  style={{ fontSize: getFontSize('0.875rem') }}
                >
                  Use the Gesture Training page to practice triggering panic mode and become familiar with the app's response.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="installation">
          <AccordionTrigger 
            className="text-lg font-medium" 
            style={{ fontSize: getFontSize('1.125rem') }}
          >
            Installing as App (PWA)
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-3 space-y-4">
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  What is PWA installation?
                </h3>
                <p 
                  className="text-gray-700 mb-2" 
                  style={{ fontSize: getFontSize('0.875rem') }}
                >
                  Installing Panic Swipe as a Progressive Web App (PWA) lets you use it like a native app on your device with improved performance and the ability to work offline.
                </p>
              </div>
              
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  How to install on Android
                </h3>
                <ol className="list-decimal pl-5 space-y-2" style={{ fontSize: getFontSize('0.875rem') }}>
                  <li>Tap the <span className="font-medium">Download</span> button in the app header</li>
                  <li>Select <span className="font-medium">Install Now</span> on the install page</li>
                  <li>When prompted, tap <span className="font-medium">Add to Home Screen</span></li>
                </ol>
              </div>
              
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  How to install on iPhone/iPad
                </h3>
                <ol className="list-decimal pl-5 space-y-2" style={{ fontSize: getFontSize('0.875rem') }}>
                  <li>Tap the <span className="font-medium">Share</span> button in Safari</li>
                  <li>Scroll down and select <span className="font-medium">Add to Home Screen</span></li>
                  <li>Tap <span className="font-medium">Add</span> in the upper-right corner</li>
                </ol>
              </div>
              
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  Benefits of installation
                </h3>
                <ul className="list-disc pl-5 space-y-1" style={{ fontSize: getFontSize('0.875rem') }}>
                  <li>More discreet app icon and usage experience</li>
                  <li>Works without an internet connection</li>
                  <li>Faster performance</li>
                  <li>No browser address bar or navigation controls</li>
                  <li>Better security for sensitive information</li>
                </ul>
              </div>
              
              <div className="mt-2">
                <Link href="/install">
                  <Button className="w-full">
                    <span className="material-icons mr-1 text-sm">get_app</span>
                    Go to Installation Page
                  </Button>
                </Link>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq">
          <AccordionTrigger 
            className="text-lg font-medium" 
            style={{ fontSize: getFontSize('1.125rem') }}
          >
            Frequently Asked Questions
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-3 space-y-4">
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  How do I exit panic mode?
                </h3>
                <p 
                  className="text-gray-700 mb-2" 
                  style={{ fontSize: getFontSize('0.875rem') }}
                >
                  From the decoy screen, you can triple-tap anywhere on the screen or press the "Emergency" button on the fake lock screen to return to the app.
                </p>
              </div>
              
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  Will others know I'm using this app?
                </h3>
                <p 
                  className="text-gray-700 mb-2" 
                  style={{ fontSize: getFontSize('0.875rem') }}
                >
                  Panic Swipe is designed to be discreet. It can be disguised or hidden from the app drawer depending on your settings.
                </p>
              </div>
              
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  Can I recover my protected data?
                </h3>
                <p 
                  className="text-gray-700 mb-2" 
                  style={{ fontSize: getFontSize('0.875rem') }}
                >
                  Yes, all protected data and apps are simply hidden, not deleted. They can be restored once you exit panic mode.
                </p>
              </div>
              
              <div>
                <h3 
                  className="font-semibold mb-2" 
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  What if someone forces me to unlock my phone?
                </h3>
                <p 
                  className="text-gray-700 mb-2" 
                  style={{ fontSize: getFontSize('0.875rem') }}
                >
                  If you've activated panic mode, the decoy screen will appear normal. The fake lock screen can be "unlocked" to show a harmless decoy app, keeping your sensitive data hidden.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card className="p-4 mb-20 bg-blue-50 border-blue-200">
        <h2 
          className="text-xl font-semibold mb-3 text-blue-700" 
          style={{ fontSize: getFontSize('1.25rem') }}
        >
          Safety Notice
        </h2>
        <p 
          className="text-gray-700 mb-4" 
          style={{ fontSize: getFontSize('0.875rem') }}
        >
          While Panic Swipe provides tools to protect your privacy, your safety is the top priority. If you're in danger, please:
        </p>
        <ul className="list-disc pl-5 space-y-2" style={{ fontSize: getFontSize('0.875rem') }}>
          <li>Contact emergency services if it's safe to do so</li>
          <li>Reach out to trusted friends, family, or organizations</li>
          <li>Consider securing your accounts with strong, unique passwords</li>
          <li>Remember that no app can guarantee complete protection</li>
        </ul>
      </Card>

      <div className="text-center text-gray-500 text-sm mb-20" style={{ fontSize: getFontSize('0.75rem') }}>
        <p>Panic Swipe v1.0</p>
        <p>Created for privacy and security</p>
      </div>
    </div>
  );
};

export default Help;
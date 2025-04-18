import React from 'react';
import { Link } from 'wouter';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Settings: React.FC = () => {
  const { panicSettings, updatePanicSettings } = useAppContext();

  // Adjust text size based on accessibility settings
  const getFontSize = (baseSize: string, increment: string = '0.2') => {
    if (panicSettings.largerText) {
      return `calc(${baseSize} + ${increment}rem)`;
    }
    return baseSize;
  };

  // Handle checkbox/switch changes
  const handleSwitchChange = (setting: string, checked: boolean) => {
    updatePanicSettings({ [setting]: checked });
  };

  // Handle slider changes
  const handleSliderChange = (setting: string, value: number[]) => {
    updatePanicSettings({ [setting]: value[0] });
  };

  // Handle select changes
  const handleSelectChange = (setting: string, value: string) => {
    updatePanicSettings({ [setting]: value });
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
          Settings
        </h1>
      </div>

      <Tabs defaultValue="general" className="mb-20">
        <TabsList className="mb-4">
          <TabsTrigger 
            value="general" 
            style={{ fontSize: getFontSize('0.875rem') }}
          >
            General
          </TabsTrigger>
          <TabsTrigger 
            value="triggers" 
            style={{ fontSize: getFontSize('0.875rem') }}
          >
            Triggers
          </TabsTrigger>
          <TabsTrigger 
            value="decoy" 
            style={{ fontSize: getFontSize('0.875rem') }}
          >
            Decoy
          </TabsTrigger>
          <TabsTrigger 
            value="accessibility" 
            style={{ fontSize: getFontSize('0.875rem') }}
          >
            Accessibility
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card className="p-5 mb-4">
            <h2 
              className="text-xl font-semibold mb-4" 
              style={{ fontSize: getFontSize('1.25rem') }}
            >
              General Settings
            </h2>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label 
                    htmlFor="autoHideApp" 
                    className="font-medium block mb-1"
                    style={{ fontSize: getFontSize('1rem') }}
                  >
                    Auto-hide from app drawer
                  </Label>
                  <p 
                    className="text-gray-500" 
                    style={{ fontSize: getFontSize('0.75rem') }}
                  >
                    Hide this app from appearing in your recent apps
                  </p>
                </div>
                <Switch
                  id="autoHideApp"
                  checked={panicSettings.autoHideApp || false}
                  onCheckedChange={(checked) => handleSwitchChange('autoHideApp', checked)}
                  aria-label="Auto-hide from app drawer"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label 
                    htmlFor="exitPassword" 
                    className="font-medium block mb-1"
                    style={{ fontSize: getFontSize('1rem') }}
                  >
                    Enable exit password
                  </Label>
                  <p 
                    className="text-gray-500" 
                    style={{ fontSize: getFontSize('0.75rem') }}
                  >
                    Require a password to exit panic mode
                  </p>
                </div>
                <Switch
                  id="exitPassword"
                  checked={panicSettings.exitPassword || false}
                  onCheckedChange={(checked) => handleSwitchChange('exitPassword', checked)}
                  aria-label="Enable exit password"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label 
                    htmlFor="enableNotifications" 
                    className="font-medium block mb-1"
                    style={{ fontSize: getFontSize('1rem') }}
                  >
                    Security notifications
                  </Label>
                  <p 
                    className="text-gray-500" 
                    style={{ fontSize: getFontSize('0.75rem') }}
                  >
                    Receive notifications about security events
                  </p>
                </div>
                <Switch
                  id="enableNotifications"
                  checked={panicSettings.enableNotifications || false}
                  onCheckedChange={(checked) => handleSwitchChange('enableNotifications', checked)}
                  aria-label="Enable security notifications"
                />
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* Trigger Settings */}
        <TabsContent value="triggers">
          <Card className="p-5 mb-4">
            <h2 
              className="text-xl font-semibold mb-4" 
              style={{ fontSize: getFontSize('1.25rem') }}
            >
              Panic Trigger Settings
            </h2>
            
            <div className="space-y-5">
              <div>
                <Label 
                  htmlFor="triggerType" 
                  className="font-medium block mb-1"
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  Trigger Type
                </Label>
                <Select
                  value={panicSettings.triggerType || 'long_press'}
                  onValueChange={(value) => handleSelectChange('triggerType', value)}
                  aria-label="Select trigger type"
                >
                  <SelectTrigger id="triggerType" style={{ fontSize: getFontSize('0.875rem') }}>
                    <SelectValue placeholder="Select a trigger type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="long_press" style={{ fontSize: getFontSize('0.875rem') }}>Long Press</SelectItem>
                    <SelectItem value="rapid_tap" style={{ fontSize: getFontSize('0.875rem') }}>Rapid Tap</SelectItem>
                    <SelectItem value="swipe" style={{ fontSize: getFontSize('0.875rem') }}>Swipe Gesture</SelectItem>
                    <SelectItem value="volume_buttons" style={{ fontSize: getFontSize('0.875rem') }}>Volume Buttons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label 
                  htmlFor="triggerPosition" 
                  className="font-medium block mb-1"
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  Trigger Position
                </Label>
                <Select
                  value={panicSettings.triggerPosition || 'bottom_right'}
                  onValueChange={(value) => handleSelectChange('triggerPosition', value)}
                  aria-label="Select trigger position"
                >
                  <SelectTrigger id="triggerPosition" style={{ fontSize: getFontSize('0.875rem') }}>
                    <SelectValue placeholder="Select a trigger position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top_left" style={{ fontSize: getFontSize('0.875rem') }}>Top Left</SelectItem>
                    <SelectItem value="top_right" style={{ fontSize: getFontSize('0.875rem') }}>Top Right</SelectItem>
                    <SelectItem value="bottom_left" style={{ fontSize: getFontSize('0.875rem') }}>Bottom Left</SelectItem>
                    <SelectItem value="bottom_right" style={{ fontSize: getFontSize('0.875rem') }}>Bottom Right</SelectItem>
                    <SelectItem value="center" style={{ fontSize: getFontSize('0.875rem') }}>Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label 
                  htmlFor="triggerSensitivity" 
                  className="font-medium block mb-1"
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  Trigger Sensitivity
                </Label>
                <p 
                  className="text-gray-500 mb-2" 
                  style={{ fontSize: getFontSize('0.75rem') }}
                >
                  How long to hold before triggering: {(panicSettings.triggerSensitivity || 15) / 10} seconds
                </p>
                <Slider
                  id="triggerSensitivity"
                  defaultValue={[panicSettings.triggerSensitivity || 15]}
                  min={5}
                  max={30}
                  step={1}
                  onValueChange={(value) => handleSliderChange('triggerSensitivity', value)}
                  aria-label="Adjust trigger sensitivity"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label 
                    htmlFor="enableTimedPanic" 
                    className="font-medium block mb-1"
                    style={{ fontSize: getFontSize('1rem') }}
                  >
                    Enable timed panic
                  </Label>
                  <p 
                    className="text-gray-500" 
                    style={{ fontSize: getFontSize('0.75rem') }}
                  >
                    Allow setting a timer to activate panic mode
                  </p>
                </div>
                <Switch
                  id="enableTimedPanic"
                  checked={panicSettings.enableTimedPanic || false}
                  onCheckedChange={(checked) => handleSwitchChange('enableTimedPanic', checked)}
                  aria-label="Enable timed panic mode"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label 
                    htmlFor="keyboardShortcut" 
                    className="font-medium block mb-1"
                    style={{ fontSize: getFontSize('1rem') }}
                  >
                    Enable keyboard shortcut
                  </Label>
                  <p 
                    className="text-gray-500" 
                    style={{ fontSize: getFontSize('0.75rem') }}
                  >
                    Use Alt+P to trigger panic mode
                  </p>
                </div>
                <Switch
                  id="keyboardShortcut"
                  checked={panicSettings.keyboardShortcut || false}
                  onCheckedChange={(checked) => handleSwitchChange('keyboardShortcut', checked)}
                  aria-label="Enable keyboard shortcut"
                />
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* Decoy Settings */}
        <TabsContent value="decoy">
          <Card className="p-5 mb-4">
            <h2 
              className="text-xl font-semibold mb-4" 
              style={{ fontSize: getFontSize('1.25rem') }}
            >
              Decoy Screen Settings
            </h2>
            
            <div className="space-y-5">
              <div>
                <Label 
                  htmlFor="decoyType" 
                  className="font-medium block mb-1"
                  style={{ fontSize: getFontSize('1rem') }}
                >
                  Default Decoy Screen
                </Label>
                <Select
                  value={panicSettings.decoyType || 'fake_lock_screen'}
                  onValueChange={(value) => handleSelectChange('decoyType', value)}
                  aria-label="Select default decoy screen"
                >
                  <SelectTrigger id="decoyType" style={{ fontSize: getFontSize('0.875rem') }}>
                    <SelectValue placeholder="Select a decoy screen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fake_lock_screen" style={{ fontSize: getFontSize('0.875rem') }}>Fake Lock Screen</SelectItem>
                    <SelectItem value="calculator" style={{ fontSize: getFontSize('0.875rem') }}>Calculator</SelectItem>
                    <SelectItem value="notes" style={{ fontSize: getFontSize('0.875rem') }}>Notes App</SelectItem>
                    <SelectItem value="browser" style={{ fontSize: getFontSize('0.875rem') }}>Browser</SelectItem>
                    <SelectItem value="external_site_weather" style={{ fontSize: getFontSize('0.875rem') }}>Weather Website</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label 
                    htmlFor="randomizeDecoy" 
                    className="font-medium block mb-1"
                    style={{ fontSize: getFontSize('1rem') }}
                  >
                    Randomize decoy
                  </Label>
                  <p 
                    className="text-gray-500" 
                    style={{ fontSize: getFontSize('0.75rem') }}
                  >
                    Show a random decoy screen each time
                  </p>
                </div>
                <Switch
                  id="randomizeDecoy"
                  checked={panicSettings.randomizeDecoy || false}
                  onCheckedChange={(checked) => handleSwitchChange('randomizeDecoy', checked)}
                  aria-label="Randomize decoy screen"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label 
                    htmlFor="clearBrowserHistory" 
                    className="font-medium block mb-1"
                    style={{ fontSize: getFontSize('1rem') }}
                  >
                    Clear browser history
                  </Label>
                  <p 
                    className="text-gray-500" 
                    style={{ fontSize: getFontSize('0.75rem') }}
                  >
                    Clear browser history when panic mode activates
                  </p>
                </div>
                <Switch
                  id="clearBrowserHistory"
                  checked={panicSettings.clearBrowserHistory || false}
                  onCheckedChange={(checked) => handleSwitchChange('clearBrowserHistory', checked)}
                  aria-label="Clear browser history"
                />
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* Accessibility Settings */}
        <TabsContent value="accessibility">
          <Card className="p-5 mb-4">
            <h2 
              className="text-xl font-semibold mb-4" 
              style={{ fontSize: getFontSize('1.25rem') }}
            >
              Accessibility Settings
            </h2>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label 
                    htmlFor="accessibilityMode" 
                    className="font-medium block mb-1"
                    style={{ fontSize: getFontSize('1rem') }}
                  >
                    Accessibility mode
                  </Label>
                  <p 
                    className="text-gray-500" 
                    style={{ fontSize: getFontSize('0.75rem') }}
                  >
                    Enable enhanced accessibility features
                  </p>
                </div>
                <Switch
                  id="accessibilityMode"
                  checked={panicSettings.accessibilityMode || false}
                  onCheckedChange={(checked) => handleSwitchChange('accessibilityMode', checked)}
                  aria-label="Enable accessibility mode"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label 
                    htmlFor="largerText" 
                    className="font-medium block mb-1"
                    style={{ fontSize: getFontSize('1rem') }}
                  >
                    Larger text
                  </Label>
                  <p 
                    className="text-gray-500" 
                    style={{ fontSize: getFontSize('0.75rem') }}
                  >
                    Increase text size throughout the app
                  </p>
                </div>
                <Switch
                  id="largerText"
                  checked={panicSettings.largerText || false}
                  onCheckedChange={(checked) => handleSwitchChange('largerText', checked)}
                  aria-label="Enable larger text"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label 
                    htmlFor="showTriggerZones" 
                    className="font-medium block mb-1"
                    style={{ fontSize: getFontSize('1rem') }}
                  >
                    Show trigger zones
                  </Label>
                  <p 
                    className="text-gray-500" 
                    style={{ fontSize: getFontSize('0.75rem') }}
                  >
                    Make panic trigger zones visible
                  </p>
                </div>
                <Switch
                  id="showTriggerZones"
                  checked={panicSettings.showTriggerZones || false}
                  onCheckedChange={(checked) => handleSwitchChange('showTriggerZones', checked)}
                  aria-label="Show trigger zones"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label 
                    htmlFor="vibrationFeedback" 
                    className="font-medium block mb-1"
                    style={{ fontSize: getFontSize('1rem') }}
                  >
                    Haptic feedback
                  </Label>
                  <p 
                    className="text-gray-500" 
                    style={{ fontSize: getFontSize('0.75rem') }}
                  >
                    Vibrate when actions are performed
                  </p>
                </div>
                <Switch
                  id="vibrationFeedback"
                  checked={panicSettings.vibrationFeedback || false}
                  onCheckedChange={(checked) => handleSwitchChange('vibrationFeedback', checked)}
                  aria-label="Enable haptic feedback"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label 
                    htmlFor="highContrast" 
                    className="font-medium block mb-1"
                    style={{ fontSize: getFontSize('1rem') }}
                  >
                    High contrast
                  </Label>
                  <p 
                    className="text-gray-500" 
                    style={{ fontSize: getFontSize('0.75rem') }}
                  >
                    Use high contrast colors for better visibility
                  </p>
                </div>
                <Switch
                  id="highContrast"
                  checked={panicSettings.highContrast || false}
                  onCheckedChange={(checked) => handleSwitchChange('highContrast', checked)}
                  aria-label="Enable high contrast mode"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label 
                    htmlFor="reduceMotion" 
                    className="font-medium block mb-1"
                    style={{ fontSize: getFontSize('1rem') }}
                  >
                    Reduce motion
                  </Label>
                  <p 
                    className="text-gray-500" 
                    style={{ fontSize: getFontSize('0.75rem') }}
                  >
                    Minimize animations and transitions
                  </p>
                </div>
                <Switch
                  id="reduceMotion"
                  checked={panicSettings.reduceMotion || false}
                  onCheckedChange={(checked) => handleSwitchChange('reduceMotion', checked)}
                  aria-label="Enable reduced motion"
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
import React from 'react';
import StatusBar from '@/components/layout/StatusBar';
import { useLocation } from 'wouter';
import { SwitchWithTrack } from '@/components/ui/switch-with-track';
import { useAppContext } from '@/context/app-context';

const DecoySetup = () => {
  const [_, navigate] = useLocation();
  const { panicSettings, updatePanicSettings } = useAppContext();
  
  return (
    <>
      <StatusBar />
      <div className="content-area h-[685px] overflow-y-auto">
        <div className="px-5 py-4">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button className="mr-3" onClick={() => navigate('/')}>
              <span className="material-icons">arrow_back</span>
            </button>
            <h1 className="text-xl font-semibold">Decoy Setup</h1>
          </div>
          
          <div className="text-muted-foreground text-sm mb-4">
            Choose what will appear when panic mode is triggered. The decoy screen should look harmless.
          </div>
          
          {/* Decoy Selection */}
          <h2 className="text-lg font-medium mb-3">Choose Decoy Type</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div 
              className={`bg-card rounded-lg p-4 shadow-md ${panicSettings.decoyType === 'clock' ? 'border-2 border-secondary' : ''}`}
              onClick={() => updatePanicSettings({ decoyType: 'clock' })}
            >
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-2">
                <span className={`material-icons ${panicSettings.decoyType === 'clock' ? 'text-secondary' : ''}`}>access_time</span>
              </div>
              <h3 className="text-sm font-medium">Clock App</h3>
              <p className="text-muted-foreground text-xs">Simple time display</p>
            </div>
            
            <div 
              className={`bg-card rounded-lg p-4 shadow-md ${panicSettings.decoyType === 'calculator' ? 'border-2 border-secondary' : ''}`}
              onClick={() => updatePanicSettings({ decoyType: 'calculator' })}
            >
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-2">
                <span className={`material-icons ${panicSettings.decoyType === 'calculator' ? 'text-secondary' : ''}`}>calculate</span>
              </div>
              <h3 className="text-sm font-medium">Calculator</h3>
              <p className="text-muted-foreground text-xs">Basic calculator app</p>
            </div>
            
            <div 
              className={`bg-card rounded-lg p-4 shadow-md ${panicSettings.decoyType === 'notes' ? 'border-2 border-secondary' : ''}`}
              onClick={() => updatePanicSettings({ decoyType: 'notes' })}
            >
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-2">
                <span className={`material-icons ${panicSettings.decoyType === 'notes' ? 'text-secondary' : ''}`}>note_alt</span>
              </div>
              <h3 className="text-sm font-medium">Notes</h3>
              <p className="text-muted-foreground text-xs">Shopping list or notes</p>
            </div>
            
            <div 
              className={`bg-card rounded-lg p-4 shadow-md ${panicSettings.decoyType === 'gallery' ? 'border-2 border-secondary' : ''}`}
              onClick={() => updatePanicSettings({ decoyType: 'gallery' })}
            >
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-2">
                <span className={`material-icons ${panicSettings.decoyType === 'gallery' ? 'text-secondary' : ''}`}>image</span>
              </div>
              <h3 className="text-sm font-medium">Photo Gallery</h3>
              <p className="text-muted-foreground text-xs">Safe images only</p>
            </div>
            
            <div 
              className={`bg-card rounded-lg p-4 shadow-md ${panicSettings.decoyType === 'external_site_weather' ? 'border-2 border-secondary' : ''}`}
              onClick={() => updatePanicSettings({ decoyType: 'external_site_weather' })}
            >
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-2">
                <span className={`material-icons ${panicSettings.decoyType === 'external_site_weather' ? 'text-secondary' : ''}`}>cloud</span>
              </div>
              <h3 className="text-sm font-medium">Weather Site</h3>
              <p className="text-muted-foreground text-xs">Redirect to weather site</p>
            </div>
            
            <div 
              className={`bg-card rounded-lg p-4 shadow-md ${panicSettings.decoyType === 'external_site_recipes' ? 'border-2 border-secondary' : ''}`}
              onClick={() => updatePanicSettings({ decoyType: 'external_site_recipes' })}
            >
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-2">
                <span className={`material-icons ${panicSettings.decoyType === 'external_site_recipes' ? 'text-secondary' : ''}`}>restaurant_menu</span>
              </div>
              <h3 className="text-sm font-medium">Recipe Site</h3>
              <p className="text-muted-foreground text-xs">Redirect to cooking site</p>
            </div>
            
            <div 
              className={`bg-card rounded-lg p-4 shadow-md ${panicSettings.decoyType === 'external_site_homework' ? 'border-2 border-secondary' : ''}`}
              onClick={() => updatePanicSettings({ decoyType: 'external_site_homework' })}
            >
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-2">
                <span className={`material-icons ${panicSettings.decoyType === 'external_site_homework' ? 'text-secondary' : ''}`}>school</span>
              </div>
              <h3 className="text-sm font-medium">Homework Planner</h3>
              <p className="text-muted-foreground text-xs">School assignment tracker</p>
            </div>
            
            <div 
              className={`bg-card rounded-lg p-4 shadow-md ${panicSettings.decoyType === 'external_site_news' ? 'border-2 border-secondary' : ''}`}
              onClick={() => updatePanicSettings({ decoyType: 'external_site_news' })}
            >
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-2">
                <span className={`material-icons ${panicSettings.decoyType === 'external_site_news' ? 'text-secondary' : ''}`}>article</span>
              </div>
              <h3 className="text-sm font-medium">News Site</h3>
              <p className="text-muted-foreground text-xs">Redirect to news website</p>
            </div>
            
            <div 
              className={`bg-card rounded-lg p-4 shadow-md ${panicSettings.decoyType === 'fake_lock_screen' ? 'border-2 border-secondary' : ''}`}
              onClick={() => updatePanicSettings({ decoyType: 'fake_lock_screen', enableFakeLockScreen: true })}
            >
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-2">
                <span className={`material-icons ${panicSettings.decoyType === 'fake_lock_screen' ? 'text-secondary' : ''}`}>lock</span>
              </div>
              <h3 className="text-sm font-medium">Fake Lock Screen</h3>
              <p className="text-muted-foreground text-xs">Show device lock screen</p>
            </div>
          </div>
          
          {/* External redirection settings (only visible when external site is selected) */}
          {(panicSettings.decoyType.startsWith('external_site_')) && (
            <div className="bg-card rounded-lg p-4 shadow-md mb-6">
              <h3 className="text-sm font-medium mb-3">External Site Options</h3>
              <div className="text-muted-foreground text-xs mb-4">
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs mr-2">Note:</span>
                In a real mobile app, this would redirect to another site. In this demo, we'll simulate redirection.
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <SwitchWithTrack 
                  label="Random Site Selection"
                  description="Choose a random site each time"
                  checked={panicSettings.randomizeExternalSite}
                  onChange={() => updatePanicSettings({ 
                    randomizeExternalSite: !panicSettings.randomizeExternalSite 
                  })}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <SwitchWithTrack 
                  label="Clear History After"
                  description="Clear browsing history after redirect"
                  checked={panicSettings.clearBrowserHistory}
                  onChange={() => updatePanicSettings({ 
                    clearBrowserHistory: !panicSettings.clearBrowserHistory 
                  })}
                />
              </div>
            </div>
          )}
          
          {/* Decoy Preview */}
          <h2 className="text-lg font-medium mb-3">Decoy Preview</h2>
          
          <div className="bg-card rounded-lg overflow-hidden shadow-md mb-6">
            {panicSettings.decoyType === 'clock' && (
              <div className="p-4 bg-black text-white text-center">
                <div className="text-6xl font-light mb-1">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
                <div className="text-sm">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )}
            
            {panicSettings.decoyType === 'calculator' && (
              <div className="p-4 bg-black text-white">
                <div className="text-right text-3xl mb-4 font-light">42.5</div>
                <div className="grid grid-cols-4 gap-2">
                  {['AC', '+/-', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '00', '.', '='].map((key, index) => (
                    <div 
                      key={key} 
                      className={`
                        text-center py-3 rounded-lg
                        ${index < 3 ? 'bg-gray-600' : ''}
                        ${[3, 7, 11, 15, 19].includes(index) ? 'bg-orange-500' : ''}
                        ${![3, 7, 11, 15, 19].includes(index) && index >= 4 ? 'bg-gray-800' : ''}
                      `}
                    >
                      {key}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-3">
                  <div className="h-1 w-1/3 bg-gray-700 rounded"></div>
                </div>
              </div>
            )}
            
            {panicSettings.decoyType === 'notes' && (
              <div className="p-4 bg-white text-black">
                <div className="border-b border-gray-200 pb-2 mb-2">
                  <div className="font-medium">Shopping List</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className="material-icons text-xs mr-2">check_circle</span>
                    <span>Milk</span>
                  </div>
                  <div className="flex items-center">
                    <span className="material-icons text-xs mr-2">check_circle</span>
                    <span>Bread</span>
                  </div>
                  <div className="flex items-center">
                    <span className="material-icons text-xs mr-2">check_circle_outline</span>
                    <span>Eggs</span>
                  </div>
                  <div className="flex items-center">
                    <span className="material-icons text-xs mr-2">check_circle_outline</span>
                    <span>Apples</span>
                  </div>
                </div>
              </div>
            )}
            
            {panicSettings.decoyType === 'gallery' && (
              <div className="p-2 bg-black">
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            )}
            
            {panicSettings.decoyType === 'external_site_weather' && (
              <div className="p-4 bg-blue-50 text-black">
                <div className="flex items-center mb-2">
                  <span className="material-icons text-blue-500 mr-2">public</span>
                  <span className="text-xs text-gray-500">weather.com</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-medium">New York</div>
                    <div className="text-3xl font-light">72°</div>
                    <div className="text-sm text-gray-500">Partly Cloudy</div>
                  </div>
                  <span className="material-icons text-5xl text-blue-500">cloud</span>
                </div>
                <div className="text-center mt-2 text-xs text-gray-500">
                  Redirecting to external weather site...
                </div>
              </div>
            )}
            
            {panicSettings.decoyType === 'external_site_recipes' && (
              <div className="p-4 bg-amber-50 text-black">
                <div className="flex items-center mb-2">
                  <span className="material-icons text-amber-700 mr-2">public</span>
                  <span className="text-xs text-gray-500">recipes.com</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-medium">Popular Recipes</div>
                    <div className="text-sm text-gray-600 mt-1">Easy Dinner Ideas</div>
                    <ul className="text-xs text-gray-500 mt-2 space-y-1">
                      <li>• Pasta Primavera</li>
                      <li>• Chicken Stir Fry</li>
                      <li>• Easy Lasagna</li>
                    </ul>
                  </div>
                  <span className="material-icons text-3xl text-amber-500">restaurant</span>
                </div>
                <div className="text-center mt-2 text-xs text-gray-500">
                  Redirecting to external recipe site...
                </div>
              </div>
            )}
            
            {panicSettings.decoyType === 'external_site_homework' && (
              <div className="p-4 bg-green-50 text-black">
                <div className="flex items-center mb-2">
                  <span className="material-icons text-green-700 mr-2">public</span>
                  <span className="text-xs text-gray-500">homework-planner.com</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-medium">Upcoming Assignments</div>
                    <div className="text-sm text-gray-600 mt-1">Week of Apr 8 - Apr 14</div>
                    <ul className="text-xs text-gray-500 mt-2 space-y-1">
                      <li>• <span className="text-red-500">Due Today:</span> History Essay</li>
                      <li>• <span className="text-green-500">In Progress:</span> Math Problems</li>
                      <li>• <span className="text-blue-500">Due Fri:</span> Science Lab Report</li>
                    </ul>
                  </div>
                  <span className="material-icons text-3xl text-green-600">assignment</span>
                </div>
                <div className="text-center mt-2 text-xs text-gray-500">
                  Redirecting to homework planner site...
                </div>
              </div>
            )}
            
            {panicSettings.decoyType === 'external_site_news' && (
              <div className="p-4 bg-gray-50 text-black">
                <div className="flex items-center mb-2">
                  <span className="material-icons text-gray-700 mr-2">public</span>
                  <span className="text-xs text-gray-500">news-site.com</span>
                </div>
                <div className="flex flex-col">
                  <div className="text-lg font-medium mb-2">Today's Headlines</div>
                  <div className="space-y-2">
                    <div className="flex">
                      <div className="w-12 h-12 bg-gray-200 mr-2 rounded flex-shrink-0"></div>
                      <div>
                        <div className="text-sm font-medium">Local Park Renovation Complete</div>
                        <div className="text-xs text-gray-500">Community celebrates new facilities</div>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-12 h-12 bg-gray-200 mr-2 rounded flex-shrink-0"></div>
                      <div>
                        <div className="text-sm font-medium">Weather: Mild Temperatures Expected</div>
                        <div className="text-xs text-gray-500">Clear skies for the weekend</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-2 text-xs text-gray-500">
                  Redirecting to news site...
                </div>
              </div>
            )}
            
            {panicSettings.decoyType === 'fake_lock_screen' && (
              <div className="p-4 bg-black text-white">
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-light mb-1">
                    {new Date().toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </div>
                  <div className="text-sm mb-4">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  <div className="flex space-x-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  </div>
                  <div className="text-xs text-gray-400">Enter Passcode</div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {[1, 2, 3].map(num => (
                      <div 
                        key={num} 
                        className="bg-gray-800/60 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-4 border-t border-muted">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Customize Display</h3>
                <button className="text-secondary text-sm">Edit</button>
              </div>
            </div>
          </div>
          
          {/* System Alert */}
          <div className="bg-card rounded-lg p-4 shadow-md mb-6">
            <h3 className="text-sm font-medium mb-3">Additional Options</h3>
            
            <div className="flex justify-between items-center mb-3">
              <SwitchWithTrack 
                label="Fake System Alert"
                description="Show system message on trigger"
                checked={panicSettings.fakeSystemAlert}
                onChange={() => updatePanicSettings({ 
                  fakeSystemAlert: !panicSettings.fakeSystemAlert 
                })}
              />
            </div>
            
            <select 
              className="w-full bg-accent border border-muted rounded px-3 py-2 text-sm mb-4"
              value={panicSettings.systemAlertType}
              onChange={(e) => updatePanicSettings({ systemAlertType: e.target.value })}
              disabled={!panicSettings.fakeSystemAlert}
            >
              <option value="low_battery">Low Battery Warning</option>
              <option value="system_update">System Update Required</option>
              <option value="storage_full">Storage Almost Full</option>
              <option value="network_lost">Network Connection Lost</option>
            </select>
            
            <div className="flex justify-between items-center">
              <SwitchWithTrack 
                label="Disable Notifications"
                description="Hide all notifications in panic mode"
                checked={panicSettings.disableNotifications}
                onChange={() => updatePanicSettings({ 
                  disableNotifications: !panicSettings.disableNotifications 
                })}
              />
            </div>
          </div>
          
          <button 
            className="w-full py-3 rounded bg-primary text-primary-foreground text-sm font-medium"
            onClick={() => navigate('/')}
          >
            Save Decoy Settings
          </button>
        </div>
      </div>
    </>
  );
};

export default DecoySetup;

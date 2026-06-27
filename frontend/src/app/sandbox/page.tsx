'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Wifi, 
  Bluetooth, 
  Bell, 
  Lock, 
  Volume2, 
  Sun, 
  Moon, 
  Camera, 
  Compass,
  Battery,
  Sliders,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';

import { useTheme } from '@/common/contexts/ThemeContext';

export default function SandboxPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen w-full p-8 md:p-16 bg-background text-foreground transition-colors duration-300 relative overflow-hidden font-sans">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-teal-500 font-mono text-sm tracking-wider uppercase mb-1">
              <Sparkles size={16} /> Theme Lab
            </div>
            <h1 className="text-4xl font-extrabold font-heading tracking-tight">Skeuomorphic & 3D UI Showcase</h1>
            <p className="text-muted-foreground mt-2">
              Interactive sandbox demonstrating soft plush/felted and glossy skeuomorphic gel buttons.
            </p>
          </div>
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="btn-gel btn-gel-blue px-6 py-3 text-sm flex items-center gap-2"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>

        {/* Section A: Soft 3D Plush/Felt Elements */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-3 h-6 bg-teal-500 rounded-full inline-block" />
            Style A: Soft Tactile Plush / Felt
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Widget 1: System Toggles Block */}
            <div className="btn-plush-base btn-plush-beige p-6 flex flex-col gap-6 items-center w-full min-h-[220px]">
              <div className="text-xs font-mono opacity-60 uppercase tracking-wider">Quick Actions</div>
              <div className="grid grid-cols-2 gap-4">
                <button className="icon-recessed w-12 h-12 hover:scale-105 transition-transform text-red-500">
                  <Plane size={20} />
                </button>
                <button className="icon-recessed w-12 h-12 hover:scale-105 transition-transform text-blue-500">
                  <Wifi size={20} />
                </button>
                <button className="icon-recessed w-12 h-12 hover:scale-105 transition-transform text-indigo-500">
                  <Bluetooth size={20} />
                </button>
                <button className="icon-recessed w-12 h-12 hover:scale-105 transition-transform text-yellow-600">
                  <Bell size={20} />
                </button>
              </div>
            </div>

            {/* Widget 2: Large Rounded Pill Controller */}
            <div className="btn-plush-base btn-plush-blue p-6 flex flex-col justify-between items-center w-full min-h-[220px]">
              <div className="text-xs font-mono uppercase tracking-wider text-sky-900 dark:text-sky-100">Tactile Slider</div>
              <div className="w-16 h-28 bg-sky-600/20 dark:bg-sky-950/40 rounded-full flex flex-col justify-between items-center p-2 relative shadow-inner">
                <div className="w-12 h-12 btn-plush-base btn-plush-beige rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                  <Sun size={18} className="text-yellow-600" />
                </div>
                <div className="text-[10px] font-mono opacity-70 mb-2">MAX</div>
              </div>
            </div>

            {/* Widget 3: Lock Screen Control */}
            <div className="btn-plush-base btn-plush-beige p-6 flex flex-col justify-around items-center w-full min-h-[220px]">
              <div className="text-xs font-mono opacity-60 uppercase tracking-wider">Security State</div>
              <button className="w-20 h-20 btn-plush-base btn-plush-blue rounded-full flex items-center justify-center">
                <Lock size={32} className="text-sky-900" />
              </button>
              <div className="text-xs font-semibold opacity-80">Tap to Unlock</div>
            </div>

            {/* Widget 4: Utility Controls */}
            <div className="btn-plush-base btn-plush-beige p-6 flex flex-col justify-between w-full min-h-[220px]">
              <div className="text-xs font-mono opacity-60 uppercase tracking-wider text-center">System Info</div>
              <div className="flex justify-around items-center w-full">
                <div className="flex flex-col items-center gap-1">
                  <div className="icon-recessed w-10 h-10">
                    <Battery size={16} />
                  </div>
                  <span className="text-[10px] font-mono mt-1">94%</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="icon-recessed w-10 h-10">
                    <Volume2 size={16} />
                  </div>
                  <span className="text-[10px] font-mono mt-1">80%</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="icon-recessed w-10 h-10">
                    <Camera size={16} />
                  </div>
                  <span className="text-[10px] font-mono mt-1">CAM</span>
                </div>
              </div>
              <div className="text-[10px] text-center opacity-50 font-mono">STATUS: OPTIMAL</div>
            </div>

          </div>
        </div>

        {/* Section B: Skeuomorphic Gel Glass Elements */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-3 h-6 bg-purple-500 rounded-full inline-block" />
            Style B: Glossy Skeuomorphic Gel Glass
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Blue Gel Button */}
            <div className="bg-card border border-border p-6 rounded-3xl flex flex-col justify-between items-center min-h-[220px]">
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Blue Gel Capsule</div>
              <button className="btn-gel btn-gel-blue w-full py-4 px-6 text-base font-bold flex items-center justify-center gap-2">
                <Play size={18} /> START MISSION
              </button>
              <div className="text-xs text-muted-foreground font-mono">Active State</div>
            </div>

            {/* Red Gel Button */}
            <div className="bg-card border border-border p-6 rounded-3xl flex flex-col justify-between items-center min-h-[220px]">
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Red Gel Capsule</div>
              <button className="btn-gel btn-gel-red w-full py-4 px-6 text-base font-bold flex items-center justify-center gap-2">
                <Lock size={18} /> LOCK SYSTEM
              </button>
              <div className="text-xs text-muted-foreground font-mono">Emergency Control</div>
            </div>

            {/* Green Gel Button */}
            <div className="bg-card border border-border p-6 rounded-3xl flex flex-col justify-between items-center min-h-[220px]">
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Green Gel Capsule</div>
              <button className="btn-gel btn-gel-green w-full py-4 px-6 text-base font-bold flex items-center justify-center gap-2">
                <Compass size={18} /> INITIALIZE GPS
              </button>
              <div className="text-xs text-muted-foreground font-mono">Navigation Mode</div>
            </div>

            {/* Orange Gel Button */}
            <div className="bg-card border border-border p-6 rounded-3xl flex flex-col justify-between items-center min-h-[220px]">
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Orange Gel Capsule</div>
              <button className="btn-gel btn-gel-orange w-full py-4 px-6 text-base font-bold flex items-center justify-center gap-2">
                <RotateCcw size={18} /> RESET DATA
              </button>
              <div className="text-xs text-muted-foreground font-mono">System Cleanse</div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

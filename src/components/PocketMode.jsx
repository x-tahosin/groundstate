import React, { useState, useEffect } from 'react';
import { PhoneOff, Mountain, Moon, Check, ArrowLeft } from 'lucide-react';
import { formatTime } from '../utils/terrainEngine.js';

export function PocketMode({ trail, calculations, briefingData, onClose }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isPast: false });

  const { ridgeShadowTime, thermalPlungeTime } = calculations;

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diffMs = ridgeShadowTime.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isPast: true });
      } else {
        const totalSec = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSec / 3600);
        const minutes = Math.floor((totalSec % 3600) / 60);
        const seconds = totalSec % 60;
        setTimeLeft({ hours, minutes, seconds, isPast: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [ridgeShadowTime]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0E1513] text-[#E89A3C] flex flex-col justify-between p-6 sm:p-12 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-[#72807A]">
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-[#D97724]" />
          <span className="uppercase tracking-widest text-[#D97724]">
            Rhodopsin Night-Vision Mode · Screen Lock
          </span>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg border border-[#2B3531] text-[#A6B2AB] hover:text-white hover:border-[#D97724] transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Pocket Mode</span>
        </button>
      </div>

      {/* Main Countdown & Mandate */}
      <div className="max-w-2xl mx-auto text-center my-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#1A2622] border border-[#2E3C36] mx-auto flex items-center justify-center text-[#E89A3C] mb-6 shadow-2xl">
          <PhoneOff className="w-8 h-8 stroke-[1.75]" />
        </div>

        <span className="text-xs font-mono uppercase tracking-widest text-[#72807A] block mb-2">
          Countdown to {trail.name} Ridge Shadow
        </span>

        {timeLeft.isPast ? (
          <div className="font-serif text-3xl sm:text-4xl text-[#C8622A] font-bold mb-4">
            Ridge Shadow Reached ({formatTime(ridgeShadowTime)})
          </div>
        ) : (
          <div className="font-mono text-5xl sm:text-7xl font-bold tracking-tight text-[#E89A3C] mb-4">
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </div>
        )}

        <p className="font-serif text-lg sm:text-xl text-[#F4F0E8] max-w-lg mx-auto mb-6 leading-relaxed">
          Your phone is stowed in your jacket pocket. Look up at the granite ridges. Feel the cool alpine air.
        </p>

        {/* Tactical Timers */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-left text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#16211E] border border-[#23332E]">
            <span className="text-[#72807A] text-[10px] uppercase block mb-1">Turnaround Deadline</span>
            <span className="text-[#E89A3C] text-sm font-bold block">{briefingData?.turnaroundFormatted}</span>
            <span className="text-[#5F6E67] text-[10px]">Head down the mountain</span>
          </div>
          <div className="p-3 rounded-xl bg-[#16211E] border border-[#23332E]">
            <span className="text-[#72807A] text-[10px] uppercase block mb-1">Thermal Plunge</span>
            <span className="text-[#C8622A] text-sm font-bold block">{briefingData?.thermalPlungeFormatted}</span>
            <span className="text-[#5F6E67] text-[10px]">Put on windshell layer</span>
          </div>
        </div>
      </div>

      {/* Bottom Dismiss */}
      <div className="text-center pt-6 border-t border-[#1F2B26]">
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl bg-[#1E2E28] hover:bg-[#283E36] text-[#E89A3C] border border-[#344D44] font-mono text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-green-500" />
          <span>I Have Returned From the Trail · Unlock Screen</span>
        </button>
      </div>
    </div>
  );
}

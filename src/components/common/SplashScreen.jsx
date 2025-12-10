import React, { useEffect, useState } from 'react';

const SplashScreen = ({ finishLoading }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [isExiting, setIsExiting] = useState(false);

  // Efek untuk Progress Bar Palsu (Fake Progress) + Text Change
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        // Jika loading dari parent (auth) sudah selesai (finishLoading=true), 
        // kita percepat progress ke 100%
        if (finishLoading && prev >= 70) {
            return Math.min(prev + 5, 100);
        }
        // Jika belum, kita mentok di 90%
        if (prev >= 90) return 90;
        
        // Random increment agar terlihat natural
        return prev + Math.random() * 10;
      });
    }, 200);

    // Ganti text berdasarkan progress
    if (progress > 30 && progress < 60) setLoadingText('Connecting to server...');
    if (progress >= 60 && progress < 80) setLoadingText('Preparing your dashboard...');
    if (progress >= 80) setLoadingText('Welcome to SignTalk...');

    // Trigger exit animation jika progress sudah 100
    if (progress === 100) {
        clearInterval(timer);
        setTimeout(() => setIsExiting(true), 200); // Tahan sebentar di 100%
    }

    return () => clearInterval(timer);
  }, [progress, finishLoading]);

  // Jika sedang exit, komponen akan di-unmount oleh Parent setelah delay animasi CSS selesai
  // Namun di sini kita handle style opacity-nya
  
  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-all duration-700 ease-in-out
      ${isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}
    >
      {/* Background Gradient Spot (Hiasan) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#1d9bf0] rounded-full blur-[100px] opacity-20 animate-glow-pulse"></div>

      {/* Logo Container */}
      <div className="relative z-10 flex flex-col items-center animate-float">
        <div className="relative">
             {/* Logo Image */}
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-32 md:w-40 h-auto object-contain drop-shadow-2xl"
            />
        </div>
        
        {/* App Name */}
        <h1 className="mt-6 text-2xl font-grotesk font-bold text-white tracking-widest uppercase">
          SignTalk <span className="text-[#1d9bf0]">Connect</span>
        </h1>
      </div>

      {/* Loading Container (Bottom) */}
      <div className="absolute bottom-16 w-64 flex flex-col gap-2">
        {/* Loading Text */}
        <p className="text-[#71767b] text-xs text-center font-mono h-4">
          {loadingText}
        </p>

        {/* Progress Bar Track */}
        <div className="w-full h-1 bg-[#2f3336] rounded-full overflow-hidden">
          {/* Progress Bar Fill */}
          <div 
            className="h-full bg-gradient-to-r from-[#1d9bf0] to-[#00ba7c] transition-all duration-300 ease-out shadow-[0_0_10px_#1d9bf0]"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Percentage */}
        <p className="text-[#1d9bf0] text-[10px] text-right font-bold">
            {Math.floor(progress)}%
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
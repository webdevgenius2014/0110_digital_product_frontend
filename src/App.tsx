import Header from './components/Header';
import HeroSection from './components/HeroSection';
import WhatWeDo from './components/WhatWeDo';
import { useEffect, useState } from 'react';
import './index.css';
import CollaboratePopup from './components/ColloaboRate';

function App() {
  const [showPopup, setShowPopup] = useState(false);

  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    return (
      <div className="bg-[#0E0E0E] min-h-screen flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-t-[#BFBFBF] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-t-transparent border-r-[#BFBFBF] border-b-transparent border-l-transparent rounded-full animate-spin animation-delay-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0E0E0E] xl:min-h-screen overflow-hidden flex flex-col items-start justify-between">
      <Header />
      <HeroSection />
      <WhatWeDo />
      <div className="max-w-[1383px] lg:justify-start justify-between foot w-full mx-auto px-4 lg:pb-5 pb-4 lg:px-[30px] xl:px-[60px] flex text-[#BFBFBF] items-center text-[12px] lg:gap-4 gap-2">
        <div className="flex items-center space-x-1 sm:mb-0">
          <span>© 2025 · 0110 · London, UK</span>
        </div>

        <a
          href="mailto:hello@01io.sport"
          className="transition-underline"
        >
          hello@01io.sport
        </a>
      </div>

      <div className='show-tab navHead sm:hidden w-full gradient-border-nav mx-auto px-4 lg:px-[30px] xl:px-[60px]'>
        <div
          className="absolute h-[99%] w-[99%] opacity-[0.5]"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(141,38,41,0.2) 0%, rgba(249,224,114,0.2) 3.65%, rgba(255,255,255,0.2) 8.48%, rgba(119,46,171,0.2) 12.69%, rgba(77,53,145,0.2) 16.63%, rgba(191,232,241,0.2) 20.71%, rgba(255,255,255,0.2) 25.04%, rgba(248,254,155,0.2) 31.53%, rgba(255,224,93,0.2) 35.1%, rgba(233,104,28,0.2) 38.92%, rgba(163,40,37,0.2) 43.25%, rgba(36,58,66,0.2) 47.2%, rgba(47,14,3,0.2) 50.89%, rgba(58,65,91,0.2) 54.96%, rgba(68,73,46,0.2) 58.91%, rgba(99,80,65,0.2) 62.61%, rgba(23,12,8,0.2) 66.55%, rgba(237,243,243,0.2) 89.35%, rgba(217,253,255,0.2) 92.28%, rgba(178,236,255,0.2) 95.2%, rgba(139,72,221,0.2) 97.5%, rgba(88,36,131,0.2) 100%)'
          }}
        >
        </div>
        <div className='flex justify-between items-center w-full relative z-1'>
          <div className="header-bar h-14 py-3">
            <a href="/">
              <img src="./Logo.svg" className="w-[90px] h-8" /></a>
          </div>
          <div className="rounded-md overflow-hidden w-full max-w-[162px]">
            <button className="bg-[#FAFAFA] h-8 text-[#0E0E0E] font-dm-Medium rounded-sm w-full text-base leading-6" onClick={() => setShowPopup(true)}>Request the deck</button>
          </div>
        </div>
      </div>
      <CollaboratePopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
}

export default App;
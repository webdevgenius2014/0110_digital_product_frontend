"use client";

import React, { useState, useRef } from "react";
import CollaboratePopup from "./ColloaboRate";

interface HeroSectionProps {
  triggerGlow: boolean;
}

export default function HeroSection({ triggerGlow }: HeroSectionProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsHovering(true);

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const limit = 100;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const moveX = Math.max(-limit, Math.min((x - centerX) / 2, limit));
    const moveY = Math.max(-limit, Math.min((y - centerY) / 2, limit));
    setPosition({ x: moveX, y: moveY });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setPosition({ x: 0, y: 0 });
  };
 
  return (
    <section className="max-w-[1383px] CustmWidth heroSec w-full pt-20 pb-8 px-4 lg:px-[30px] xl:px-[60px] flex items-center mx-auto justify-between sm:py-10">
      <div className="Gray50">
        <h1 className="cusm-heads Heading1 font-dm-Medium mb-6 max-w-[500px] lg:max-w-[700px]">
          Simple, efficient digital solutions for sport brands.
        </h1>
        <p className="BodyLarge custmP font-dm-Regular font-medium max-w-[387px] md:mb-6">
          We design and build digital products for sport. From race platforms to watch faces, our work helps athletes
          perform with clarity and focus.
        </p>

        <div className="rounded-sm hidden sm:inline-block hide-tab w-full overflow-hidden mb-6 xl:mb-10">
          <button
            className="gradient-border-btn group relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] backdrop-blur-[2px] bg-white/5 hover:bg-white/10"
            onClick={() => setShowPopup(true)}
            data-active={triggerGlow || undefined}
          >
            <div
              className={`
        absolute inset-0 opacity-0 scale-95 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] blur-[2px]
        ${triggerGlow ? 'opacity-[0.2]! scale-100' : 'group-hover:opacity-[0.2]! group-hover:scale-100'}
      `}
              style={{
                background: `linear-gradient(90deg,
          #8D2629 0%,
          #F9E072 8%,
          #772EAB 16%,
          #4D3591 24%,
          #BFE8F1 32%,
          #F8FE9B 40%,
          #FFE05D 48%,
          #E9681C 56%,
          #A32825 64%,
          #243A42 72%,
          #2F0E03 80%,
          #3A415B 86%,
          #44492E 92%,
          #635041 96%,
          #170C08 100%)`,
                boxShadow: `
                0 0 2px 1px rgba(255,255,255,0.05) inset,
                0 0 10px 4px rgba(255,255,255,0.08) inset,
                0px 4px 16px rgba(17,17,26,0.05),
                0px 8px 24px rgba(17,17,26,0.05),
                0px 16px 56px rgba(17,17,26,0.05)
              `,
                filter: "saturate(  %) brightness(1.1) contrast(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.2))",
                mixBlendMode: "screen",
              }}
            />
            <span className="relative z-10 font-dm-Regular tracking-wide">
              Request the deck
            </span>
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative hidden sm:block deskMn hide-tab"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
       <img src="./Logo.svg" alt="0110 Logo" id="hero-section-logo" className="w-[370px] object-contain opacity-[0.3]" />
        
        <div
          className={`absolute w-[400px] left-[-15px] h-[190px] overflow-hidden rounded-[95px]
            bg-[#212121]/10 border border-white/20 shadow-md hidden
            transition-all duration-300 ease-out`}
          style={{
            opacity: 1,
            transform: isHovering
              ? `translate(${position.x}px, ${position.y}px)`
              : "translateY(70px)",
            bottom: 0,
            boxShadow: `
              0 0 2px 1px rgba(255,255,255,0.05) inset,
              0 0 10px 4px rgba(255,255,255,0.08) inset,
              0px 4px 16px rgba(17,17,26,0.05),
              0px 8px 24px rgba(17,17,26,0.05),
              0px 16px 56px rgba(17,17,26,0.05)
            `,
            backdropFilter: "url(#filter) blur(2px) brightness(1.2)",
            WebkitBackdropFilter: "url(#filter) blur(2px) brightness(1.2)",
            mixBlendMode: "screen",
          }}
        >
          <img src="./Glass-shape.png" alt="" className="absolute bottom-0 pointer-events-none select-none" />
        </div>
      </div>

      {/* <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="filter" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.00 0.022"
              numOctaves="2"
              seed="1"
              stitchTiles="stitch"
              result="map"
            />

            <feDisplacementMap in="SourceGraphic" in2="map" scale="20" xChannelSelector="R" yChannelSelector="G" result="dispRed" />

            <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />

            <feDisplacementMap in="SourceGraphic" in2="map" scale="20" xChannelSelector="R" yChannelSelector="G" result="dispGreen" />
            <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />

            <feDisplacementMap in="SourceGraphic" in2="map" scale="25" xChannelSelector="R" yChannelSelector="G" result="dispBlue" />
            <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />

            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur in="output" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg> */}

      <CollaboratePopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </section>
  );
}

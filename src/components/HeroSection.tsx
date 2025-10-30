"use client";

import React, { useState, useRef } from "react";
import CollaboratePopup from "./ColloaboRate";

export default function HeroSection() {
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
    <section className="max-w-[1383px] heroSec w-full pt-20 pb-8 px-4 lg:px-[30px] xl:px-[60px] flex items-center mx-auto justify-between sm:py-10">
      <div className="text-[#FAFAFA]">
        <h1 className="text-[36px] cusm-heads md:text-[56px] leading-11 font-dm-Medium md:leading-[60px] mb-6 max-w-[500px] lg:max-w-[700px]">
          Simple, efficient digital  solutions for sport brands.
        </h1>
        <p className="text-base custmP leading-6 font-dm-Regular font-medium max-w-[395px] md:mb-6">
          We design and build digital products for sport. From race platforms to watch faces, our work helps athletes
          perform with clarity and focus.
        </p>

        <div className="rounded-md hidden sm:inline-block hide-tab w-full overflow-hidden mb-6 xl:mb-10">
          <button
            className="gradient-border-btn group relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] backdrop-blur-[2px] bg-white/5 hover:bg-white/10"
            onClick={() => setShowPopup(true)}
          >
            <div
              className="absolute inset-0 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] blur-[2px]"
              style={{
                background: `linear-gradient(90deg, rgba(141, 38, 41, 0.2) 0%, rgba(249, 224, 114, 0.2) 3.65%, rgba(255, 255, 255, 0.2) 8.48%, rgba(119, 46, 171, 0.2) 12.69%, rgba(77, 53, 145, 0.2) 16.63%, rgba(191, 232, 241, 0.2) 20.71%, rgba(255, 255, 255, 0.2) 25.04%, rgba(248, 254, 155, 0.2) 31.53%, rgba(255, 224, 93, 0.2) 35.1%, rgba(233, 104, 28, 0.2) 38.92%, rgba(163, 40, 37, 0.2) 43.25%, rgba(36, 58, 66, 0.2) 47.2%, rgba(47, 14, 3, 0.2) 50.89%, rgba(58, 65, 91, 0.2) 54.96%, rgba(68, 73, 46, 0.2) 58.91%, rgba(99, 80, 65, 0.2) 62.61%, rgba(23, 12, 8, 0.2) 66.55%, rgba(237, 243, 243, 0.2) 89.35%, rgba(217, 253, 255, 0.2) 92.28%, rgba(178, 236, 255, 0.2) 95.2%, rgba(139, 72, 221, 0.2) 97.5%, rgba(88, 36, 131, 0.2) 100%)`,
                boxShadow: `
              0 0 2px 1px rgba(255,255,255,0.05) inset,
              0 0 10px 4px rgba(255,255,255,0.08) inset,
              0px 4px 16px rgba(17,17,26,0.05),
              0px 8px 24px rgba(17,17,26,0.05),
              0px 16px 56px rgba(17,17,26,0.05)
            `,
                filter:
                  "saturate(120%) brightness(1.3) contrast(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.2))",
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
        <img src="./Logo.svg" alt="0110 Logo" className="w-[370px] object-contain opacity-[0.3]" />

        <div
          className={`absolute w-[400px] left-[-15px] h-[190px] overflow-hidden rounded-[95px]
            bg-[#212121]/10 border border-white/20 shadow-md
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
            backdropFilter: "url(#filter) brightness(1.1) saturate(0)",
            WebkitBackdropFilter: "url(#filter) brightness(1.1) saturate(0)",
            mixBlendMode: "screen",
          }}
        >
          <img src="./Glass-shape.png" alt="" className="absolute bottom-0" />
        </div>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: "absolute" }}>
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
      </svg>


      {/* <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="filter" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.03" numOctaves="0.1" seed="1" stitchTiles="stitch" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="0" result="blurred" />

            <feMerge result="corners">
              <feMergeNode in="topLeft" />
              <feMergeNode in="topRight" />
              <feMergeNode in="bottomLeft" />
              <feMergeNode in="bottomRight" />
            </feMerge>

            <feComposite in="blurred" in2="corners" operator="in" result="cornerEffect" />
            <feBlend in="SourceGraphic" in2="cornerEffect" mode="lighten" />
          </filter>
        </defs>
      </svg> */}

      {/* <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="filter" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.02"
              numOctaves="2"
              seed="2"
              stitchTiles="stitch"
              result="map"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale="25"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />

            <feGaussianBlur in="displaced" stdDeviation="0.5" result="blurred" />

            <feImage
              preserveAspectRatio="none"
              xlinkHref="data:image/svg+xml;utf8,
          <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
            <radialGradient id='g' cx='50%' cy='50%' r='75%'>
              <stop offset='60%' stop-color='black'/>
              <stop offset='100%' stop-color='white'/>
            </radialGradient>
            <rect width='100%' height='100%' fill='url(#g)'/>
          </svg>"
              result="maskImage"
            />

            <feComposite in="blurred" in2="maskImage" operator="out" result="edgesOnly" />
            <feBlend in="SourceGraphic" in2="edgesOnly" mode="normal" />
          </filter>
        </defs>
      </svg> */}

      <CollaboratePopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </section>
  );
}

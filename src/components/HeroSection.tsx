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

    // Cursor position relative to container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Define movement limit range
    const limit = 100; // max ±100px movement

    // Center of the container
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate how far to move (clamped)
    const moveX = Math.max(-limit, Math.min((x - centerX) / 2, limit));
    const moveY = Math.max(-limit, Math.min((y - centerY) / 2, limit));

    // Apply movement
    setPosition({ x: moveX, y: moveY });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setPosition({ x: 0, y: 0 }); // Reset
  };

  return (
    <section className="max-w-[1423px] heroSec w-full pt-20 pb-8 px-4 xl:px-[60px] flex items-center mx-auto justify-between sm:py-10">
      <div className="text-[#FAFAFA]">
        <h1 className="text-[36px] cusm-heads md:text-[56px] leading-11 font-dm-Medium md:leading-[60px] mb-6">
          Simple, efficient digital <br /> solutions for sport brands.
        </h1>
        <p className="text-base custmP leading-6 font-dm-Regular font-medium max-w-[395px] md:mb-6">
          We design and build digital products for sport. From race platforms to watch faces, our work helps athletes
          perform with clarity and focus.
        </p>

        <div className="rounded-md hidden sm:inline-block hide-tab w-full overflow-hidden mb-6">
          <button
            className="gradient-border-btn group relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] backdrop-blur-[2px] bg-white/5 hover:bg-white/10"
            onClick={() => setShowPopup(true)}
          >
            <div
              className="absolute inset-0 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] blur-[2px]"
              style={{
                background: `linear-gradient(
                  90deg,
                  rgba(141, 38, 41, 0.2) 0%,
                  rgba(249, 224, 114, 0.2) 3.65%,
                  rgba(255, 255, 255, 0.2) 8.48%,
                  rgba(119, 46, 171, 0.2) 12.69%,
                  rgba(77, 53, 145, 0.2) 16.63%,
                  rgba(191, 232, 241, 0.2) 20.71%,
                  rgba(255, 255, 255, 0.2) 25.04%,
                  rgba(248, 254, 155, 0.2) 31.53%,
                  rgba(255, 224, 93, 0.2) 35.1%,
                  rgba(233, 104, 28, 0.2) 38.92%,
                  rgba(163, 40, 37, 0.2) 43.25%,
                  rgba(36, 58, 66, 0.2) 47.2%,
                  rgba(47, 14, 3, 0.2) 50.89%,
                  rgba(58, 65, 91, 0.2) 54.96%,
                  rgba(68, 73, 46, 0.2) 58.91%,
                  rgba(99, 80, 65, 0.2) 62.61%,
                  rgba(23, 12, 8, 0.2) 66.55%,
                  rgba(237, 243, 243, 0.2) 89.35%,
                  rgba(217, 253, 255, 0.2) 92.28%,
                  rgba(178, 236, 255, 0.2) 95.2%,
                  rgba(139, 72, 221, 0.2) 97.5%,
                  rgba(88, 36, 131, 0.2) 100%
                )`,
                filter:
                  "saturate(120%) brightness(1.3) contrast(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.2))",
                mixBlendMode: "screen",
              }}
            />
            <span className="relative z-10 font-dm-Medium tracking-wide">
              Request the deck
            </span>
          </button>
        </div>

      </div>

      <div
        ref={containerRef}
        className="relative hidden sm:block hide-tab"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img src="./Logo.svg" alt="0110 Logo" className="w-[400px] object-contain opacity-[0.6]" />

        <div
          className={`absolute w-[400px] h-[190px] overflow-hidden rounded-[95px] bg-[#212121]/10 backdrop-blur-[2px] border border-white/20 shadow-md transition-all duration-300 ease-out`}
          style={{
            opacity: 1,
            transform: isHovering
              ? `translate(${position.x}px, ${position.y}px)`
              : "translateY(60px)",
            bottom: "0",
          }}

        >
          {/* <div className="absolute flex items-center justify-center h-[108px] w-full px-4 py-2 bottom-0 rounded-b-[77px] text-white cursor-pointer z-1 transition-all duration-300 ease-in-out"
            style={{
              background:
                "linear-gradient(90deg, #8D2629 0%, #F9E072 3.65%, #FFFFFF 8.48%, #772EAB 12.69%, #4D3591 16.63%, #BFE8F1 20.71%, #FFFFFF 25.04%, #F8FE9B 31.53%, #FFE05D 35.1%, #E9681C 38.92%, #A32825 43.25%, #243A42 47.2%, #2F0E03 50.89%, #3A415B 54.96%, #44492E 58.91%, #635041 62.61%, #170C08 66.55%, #EDF3F3 89.35%, #D9FDFF 92.28%, #B2ECFF 95.2%, #8B48DD 97.5%, #582483 100%)",
                opacity:"0.5"
            }}
          /> */}
          <img src="./Glass-shape.png" alt=""  className="absolute bottom-0"/>
          </div>
      </div>

      <CollaboratePopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </section>
  );
}

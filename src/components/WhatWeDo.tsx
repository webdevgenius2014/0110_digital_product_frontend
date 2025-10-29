"use client"

import React, { useState, useRef } from "react"

const categories = [
  "Sport digital solutions",
  "UI design",
  "Development",
  "Web platforms",
  "Web apps",
  "Mobile apps",
  "Race platforms",
  "GPX tracking software",
  "Geo tagging",
  "Mapping tools",
]

const WhatWeDo = () => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [visible, setVisible] = useState(false)
  const dragDivRef = useRef<HTMLDivElement>(null)
  const isFirstEnter = useRef(true)
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const OVERFLOW = 10
  const DIV_WIDTH = 204
  const DIV_HEIGHT = 112

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(val, max))

  const getClampedPos = (e: React.MouseEvent) => {
    if (!dragDivRef.current) return null
    const container = dragDivRef.current.parentElement
    if (!container) return null
    const rect = container.getBoundingClientRect()
    const newX = e.clientX - rect.left - DIV_WIDTH / 2
    const newY = e.clientY - rect.top - DIV_HEIGHT / 2
    const minX = -OVERFLOW
    const maxX = rect.width - DIV_WIDTH + OVERFLOW
    const minY = -OVERFLOW
    const maxY = rect.height - DIV_HEIGHT + OVERFLOW
    return { x: clamp(newX, minX, maxX), y: clamp(newY, minY, maxY) }
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current)
      hideTimeout.current = null
    }
    const pos = getClampedPos(e)
    if (pos) {
      setPosition(pos)
      setVisible(true)
      isFirstEnter.current = false
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current)
      hideTimeout.current = null
    }
    const pos = getClampedPos(e)
    if (!pos) return
    setPosition(pos)
    if (!visible) setVisible(true)
  }

  const handleMouseLeave = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current)
    hideTimeout.current = setTimeout(() => {
      setVisible(false)
      setPosition(null)
      isFirstEnter.current = true
    }, 3000)
  }


  return (
    <section className="max-w-[1383px] WhatWeDo w-full mx-auto px-4 lg:px-[30px] xl:px-[60px] text-white py-10 overflow-hidden">
      <h2 className="text-[24px] leading-7 tracking-[-0.25px] text-[#BFBFBF] font-dm-regular mb-6">
        What we do
      </h2>

      <div className="flex flex-wrap lg:gap-4 gap-2 mb-4">
        {categories.map((cat, idx) => (
          <span key={idx} className="what-wedo-btn h-7 font-dm-Medium text-[12px] leading-base tracking-[-0.2px]">
            {cat}
          </span>
        ))}
      </div>

      <div className="relative hideMb overflow-visible">
        <div
          className="grid grid-cols-1 group tabView sm:grid-cols-2 md:grid-cols-6 gap-4"
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden">
            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-8 bg-[linear-gradient(90deg,#8D2629_0%,#F9E072_25.96%,#FFFFFF_54.81%,#772EAB_80.77%,#4D3591_100%)]" />
            <div className="relative z-10">
              <h3 className="text-base font-medium leading-6 tracking-[-0.2px] mb-2">Pace IQ</h3>
              <p className="text-[#BFBFBF] text-[12px] leading-4">
                Smart pacing and
                <br />
                analytics for ultra events
              </p>
            </div>
          </div>

          <div className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden">
            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-8 bg-[linear-gradient(90deg,#4D3591_0%,#FFFFFF_54.81%,#F9E072_100%)]" />
            <div className="relative z-10">
              <h3 className="text-base font-medium leading-6 tracking-[-0.2px] mb-2">Transpyrenea</h3>
              <p className="text-[#BFBFBF] text-[12px] leading-4">
                Ultra-race site + live
                <br />
                tracking
              </p>
            </div>
          </div>

          <div className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden">
            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-8 bg-[linear-gradient(90deg,#FFE05D_0%,#E9681C_29.81%,#A32825_53.85%,#243A42_81.25%,#2F0E03_100%)]" />
            <div className="relative z-10">
              <h3 className="text-base font-medium leading-6 tracking-[-0.2px] mb-2">Water Finder</h3>
              <p className="text-[#BFBFBF] text-[12px] leading-4">
                Offline water geo tagging
                <br />
                for runners
              </p>
            </div>
          </div>

          <div className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden">
            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-8 bg-[linear-gradient(90deg,#3A415B_0%,#44492E_25%,#635041_50.48%,#170C08_70.67%,#EDF3F3_100%)]" />
            <div className="relative z-10">
              <h3 className="text-base font-medium leading-6 tracking-[-0.2px] mb-2">Checkpoint</h3>
              <p className="text-[#BFBFBF] text-[12px] leading-4">
                Volunteer and checkpoint
                <br />
                coordination for races
              </p>
            </div>
          </div>

          <div className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden">
            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-9 bg-[linear-gradient(90deg,#EDF3F3_0%,#EDF3F3_25%,#EDF3F3_50.48%,#EDF3F3_70.67%,#EDF3F3_100%)]" />
            <div className="relative z-10">
              <h3 className="text-base font-medium leading-6 tracking-[-0.2px] mb-2">Athlete Payments</h3>
              <p className="text-[#BFBFBF] text-[12px] leading-4">
                Payments flow for
                <br />
                organisers
              </p>
            </div>
          </div>

          <div className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden">
            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-8 bg-[linear-gradient(90deg,#B2ECFF_0%,#8B48DD_52.4%,#582483_100%)]" />
            <div className="relative z-10">
              <h3 className="text-base font-medium leading-6 tracking-[-0.2px] mb-2">Garmin Race Face</h3>
              <p className="text-[#BFBFBF] text-[12px] leading-4">
                Connect IQ watch face
              </p>
            </div>
          </div>

          <div
            ref={dragDivRef}
            className={`absolute rounded-md w-[204px] backdrop-blur-[1px] h-28 z-5 pointer-events-none overflow-hidden transition-all duration-500 ease-out ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            style={{
              transform: position
                ? `translate(${position.x}px, ${position.y}px)`
                : "translate(-9999px, -9999px)",
              transition:
                position && visible
                  ? "transform 0.15s ease-out, opacity 3s ease, scale 0.15s ease"
                  : "opacity 3s ease",
              border: "1px solid #6363634d",
              boxShadow:
                "inset 0 0 30px #0000004f, 0 0 60px rgba(255,255,255,0.15), inset 0 0 80px #0000004f",
              backdropFilter: "url(#filterWhatwedo)",
              WebkitBackdropFilter: "url(#filterWhatwedo)",
              mixBlendMode: "screen",
              filter:
                "drop-shadow(0 0 6px #0000004f)",
              animation: "distort 3s ease-in-out infinite",
            }}
          />

          <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" className="absolute">
            <defs>
              <filter id="filterWhatwedo" color-interpolation-filters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" seed="3" result="noise" />
                <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  
                                                            0 1 0 0 0  
                                                            0 0 1 0 0  
                                                            0 0 0 1 0" result="original" />
                {/* <!-- Red channel shift --> */}
                <feOffset in="original" dx="2" dy="0" result="redShift" />
                <feColorMatrix in="redShift" type="matrix" values="1 0 0 0 0  
                                                        0 0 0 0 0  
                                                        0 0 0 0 0  
                                                        0 0 0 1 0" result="red" />
                {/* <!-- Green channel shift --> */}
                <feOffset in="original" dx="-2" dy="0" result="greenShift" />
                <feColorMatrix in="greenShift" type="matrix" values="0 0 0 0 0  
                                                          0 1 0 0 0  
                                                          0 0 0 0 0  
                                                          0 0 0 1 0" result="green" />
                {/* <!-- Blue channel stays centered --> */}
                <feColorMatrix in="original" type="matrix" values="0 0 0 0 0  
                                                        0 0 0 0 0  
                                                        0 0 1 0 0  
                                                        0 0 0 1 0" result="blue" />

                <feBlend in="red" in2="green" mode="screen" result="rg" />
                <feBlend in="rg" in2="blue" mode="screen" result="glitched" />
                <feMerge>
                  <feMergeNode in="glitched" />
                </feMerge>
              </filter>
            </defs>
          </svg>

        </div>
      </div>

      <div className="relative sm:hidden hide-tab overflow-visible mt-10">
        <div className="grid grid-cols-2 group tabView gap-4">
          <div className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden w-full col-span-full max-w-[75%] ml-auto!">
            <div className="absolute h-[99%] w-[99%] opacity-[0.07]" style={{
              background: 'linear-gradient(180deg, #8D2629 0%, #F9E072 25.96%, #FFFFFF 54.81%, #772EAB 80.77%, #4D3591 100%)'
            }}
            >
            </div>
            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-[0.1]" />
            <div className="relative z-10">
              <h3 className="text-base font-medium leading-6 tracking-[-0.2px] mb-2">Pace IQ</h3>
              <p className="text-[#BFBFBF] text-[12px] leading-4" dangerouslySetInnerHTML={{ __html: "Smart pacing and analytics for ultra <br /> events" }} />
            </div>
          </div>

          <div className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden w-full">
            <div
              className="absolute h-[99%] w-[99%] opacity-[0.07]"
              style={{
                background:
                  'linear-gradient(180deg, #FFE05D 0%, #E9681C 29.81%, #A32825 53.85%, #243A42 81.25%, #2F0E03 100%)'
              }}
            >
            </div>

            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-[0.1]" />
            <div className="relative z-10">
              <h3 className="text-base font-medium leading-6 tracking-[-0.2px] mb-2">Transpyrenea</h3>
              <p className="text-[#BFBFBF] text-[12px] leading-4" dangerouslySetInnerHTML={{ __html: "Ultra-race site + live <br /> tracking" }} />
            </div>
          </div>

          <div className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden w-full">
            <div
              className="absolute h-[99%] w-[99%] opacity-[0.07]"
              style={{
                background:
                  'linear-gradient(180deg, #FFE05D 0%, #E9681C 29.81%, #A32825 53.85%, #243A42 81.25%, #2F0E03 100%)'
              }}
            >
            </div>

            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-[0.1]" />
            <div className="relative z-10">
              <h3 className="text-base font-medium leading-6 tracking-[-0.2px] mb-2">Water Finder</h3>
              <p className="text-[#BFBFBF] text-[12px] leading-4" dangerouslySetInnerHTML={{ __html: "Offline water geo <br /> tagging for runners" }} />
            </div>
          </div>

          <div className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden w-full col-span-full max-w-[75%] mr-auto!">
            <div
              className="absolute h-[99%] w-[99%] opacity-[0.07]"
              style={{
                background:
                  'linear-gradient(180deg, #3A415B 0%, #44492E 25%, #635041 50.48%, #170C08 70.67%, #EDF3F3 100%)'
              }}
            >
            </div>

            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-[0.1]" />
            <div className="relative z-10">
              <h3 className="text-base font-medium leading-6 tracking-[-0.2px] mb-2">Checkpoint</h3>
              <p className="text-[#BFBFBF] text-[12px] leading-4" dangerouslySetInnerHTML={{ __html: "Volunteer and checkpoint <br /> coordination for races" }} />
            </div>
          </div>

          <div className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden w-full">
            <div
              className="absolute h-[99%] w-[99%] opacity-[0.07]"
              style={{
                background:
                  'linear-gradient(180deg, #B2ECFF 0%, #8B48DD 52.4%, #582483 100%)'
              }}
            >
            </div>

            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-[0.1]" />
            <div className="relative z-10">
              <h3 className="text-base font-medium leading-6 tracking-[-0.2px] mb-2">Athlete  <br /> Payments</h3>
              <p className="text-[#BFBFBF] text-[12px] leading-4" dangerouslySetInnerHTML={{ __html: "Payments flow for <br /> organisers" }} />
            </div>
          </div>

          <div className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden w-full">
            <div
              className="absolute h-[99%] w-[99%] opacity-[0.07]"
              style={{
                background:
                  'linear-gradient(180deg, #B2ECFF 0%, #8B48DD 52.4%, #582483 100%)'
              }}
            >
            </div>
            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-[0.1]" />
            <div className="relative z-10">
              <h3 className="text-base font-medium leading-6 tracking-[-0.2px] mb-2">Garmin  <br /> Race Face</h3>
              <p className="text-[#BFBFBF] text-[12px] leading-4" dangerouslySetInnerHTML={{ __html: "Connect IQ watch <br /> face" }} />
            </div>
          </div>
        </div>
      </div>


    </section>
  )
}

export default WhatWeDo
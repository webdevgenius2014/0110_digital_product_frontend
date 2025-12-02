"use client";

import React, { useRef } from "react";

interface WhatWeDoProps {
  setTriggerGlow: (value: boolean) => void; // NEW
}

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
];

const WhatWeDo = ({ setTriggerGlow }: WhatWeDoProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const glowTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup glow timeout on unmount
  React.useEffect(() => {
    return () => {
      if (glowTimeoutRef.current) {
        clearTimeout(glowTimeoutRef.current);
      }
    };
  }, []);

  const handleCardClick = () => {
    // Clear any existing timeout
    if (glowTimeoutRef.current) {
      clearTimeout(glowTimeoutRef.current);
    }

    // Reset to false first to restart the animation
    setTriggerGlow(false);

    // Use requestAnimationFrame to ensure the state reset is processed before setting to true
    requestAnimationFrame(() => {
      setTriggerGlow(true);

      // Set timeout to turn off the glow after animation completes
      glowTimeoutRef.current = setTimeout(() => {
        setTriggerGlow(false);
        glowTimeoutRef.current = null;
      }, 1500);
    });
  };

  return (
    <section className="max-w-[1383px] CustmWidth WhatWeDo w-full mx-auto px-4 lg:px-[30px] xl:px-[60px] Gray50 py-10 overflow-hidden">
      <h2 className="Heading2 Gray200 font-dm-regular mb-6">What we do</h2>

      <div className="flex flex-wrap lg:gap-4 gap-2 mb-4">
        {categories.map((cat, idx) => (
          <span
            key={idx}
            className="what-wedo-btn font-dm-Regular Gray50 BodySmall"
          >
            {cat}
          </span>
        ))}
      </div>

      <div id="what-we-do-cards" className="relative hideMb overflow-visible">
        <div
          ref={gridRef}
          className="grid grid-cols-1 group tabView sm:grid-cols-2 md:grid-cols-6 gap-4"
        >
          <div
            className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden"
            onClick={handleCardClick}
          >
            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-8 bg-[linear-gradient(90deg,#8D2629_0%,#F9E072_25.96%,#FFFFFF_54.81%,#772EAB_80.77%,#4D3591_100%)]" />
            <div className="relative z-10">
              <h3 className="BodyLarge font-medium  mb-2">Pace IQ</h3>
              <p className="Gray200 BodySmall leading-4">
                Smart pacing and
                <br />
                analytics for ultra events
              </p>
            </div>
          </div>

          <div
            className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden "
            onClick={handleCardClick}
          >
            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-8 bg-[linear-gradient(90deg,#4D3591_0%,#FFFFFF_54.81%,#F9E072_100%)]" />
            <div className="relative z-10">
              <h3 className="BodyLarge font-medium  mb-2">Transpyrenea</h3>
              <p className="Gray200 BodySmall leading-4">
                Ultra-race site + live
                <br />
                tracking
              </p>
            </div>
          </div>

          <div
            className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden"
            onClick={handleCardClick}
          >
            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-8 bg-[linear-gradient(90deg,#FFE05D_0%,#E9681C_29.81%,#A32825_53.85%,#243A42_81.25%,#2F0E03_100%)]" />
            <div className="relative z-10">
              <h3 className="BodyLarge font-medium  mb-2">Water Finder</h3>
              <p className="Gray200 BodySmall leading-4">
                Offline water geo tagging
                <br />
                for runners
              </p>
            </div>
          </div>

          <div
            className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden"
            onClick={handleCardClick}
          >
            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-8 bg-[linear-gradient(90deg,#3A415B_0%,#44492E_25%,#635041_50.48%,#170C08_70.67%,#EDF3F3_100%)]" />
            <div className="relative z-10">
              <h3 className="BodyLarge font-medium  mb-2">Checkpoint</h3>
              <p className="Gray200 BodySmall leading-4">
                Volunteer and checkpoint
                <br />
                coordination for races
              </p>
            </div>
          </div>

          <div
            className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden"
            onClick={handleCardClick}
          >
            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-9 bg-[linear-gradient(90deg,#EDF3F3_0%,#EDF3F3_25%,#EDF3F3_50.48%,#EDF3F3_70.67%,#EDF3F3_100%)]" />
            <div className="relative z-10">
              <h3 className="BodyLarge font-medium  mb-2">Athlete Payments</h3>
              <p className="Gray200 BodySmall leading-4">
                Payments flow for
                <br />
                organisers
              </p>
            </div>
          </div>

          <div
            className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden"
            onClick={handleCardClick}
          >
            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-8 bg-[linear-gradient(90deg,#B2ECFF_0%,#8B48DD_52.4%,#582483_100%)]" />
            <div className="relative z-10">
              <h3 className="BodyLarge font-medium  mb-2">Garmin Race Face</h3>
              <p className="Gray200 BodySmall leading-4">
                Connect IQ watch face
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative sm:hidden hide-tab overflow-visible mt-10">
        <div className="grid grid-cols-2 group tabView gap-4">
          <div
            className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden w-full col-span-full max-w-[75%] ml-auto!"
            onClick={handleCardClick}
          >
            <div
              className="absolute h-[99%] w-[99%] opacity-[0.07]"
              style={{
                background:
                  "linear-gradient(180deg, #8D2629 0%, #F9E072 25.96%, #FFFFFF 54.81%, #772EAB 80.77%, #4D3591 100%)",
              }}
            ></div>
            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-[0.1]" />
            <div className="relative z-10">
              <h3 className="BodyLarge font-medium  mb-2">Pace IQ</h3>
              <p
                className="Gray200 BodySmall leading-4"
                dangerouslySetInnerHTML={{
                  __html: "Smart pacing and analytics for ultra <br /> events",
                }}
              />
            </div>
          </div>

          <div
            className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden w-full"
            onClick={handleCardClick}
          >
            <div
              className="absolute h-[99%] w-[99%] opacity-[0.07]"
              style={{
                background:
                  "linear-gradient(180deg, #FFE05D 0%, #E9681C 29.81%, #A32825 53.85%, #243A42 81.25%, #2F0E03 100%)",
              }}
            ></div>

            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-[0.1]" />
            <div className="relative z-10">
              <h3 className="BodyLarge font-medium  mb-2">Transpyrenea</h3>
              <p
                className="Gray200 BodySmall leading-4"
                dangerouslySetInnerHTML={{
                  __html: "Ultra-race site + live <br /> tracking",
                }}
              />
            </div>
          </div>

          <div
            className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden w-full"
            onClick={handleCardClick}
          >
            <div
              className="absolute h-[99%] w-[99%] opacity-[0.07]"
              style={{
                background:
                  "linear-gradient(180deg, #FFE05D 0%, #E9681C 29.81%, #A32825 53.85%, #243A42 81.25%, #2F0E03 100%)",
              }}
            ></div>

            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-[0.1]" />
            <div className="relative z-10">
              <h3 className="BodyLarge font-medium  mb-2">Water Finder</h3>
              <p
                className="Gray200 BodySmall leading-4"
                dangerouslySetInnerHTML={{
                  __html: "Offline water geo <br /> tagging for runners",
                }}
              />
            </div>
          </div>

          <div
            className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden w-full col-span-full max-w-[75%] mr-auto!"
            onClick={handleCardClick}
          >
            <div
              className="absolute h-[99%] w-[99%] opacity-[0.07]"
              style={{
                background:
                  "linear-gradient(180deg, #3A415B 0%, #44492E 25%, #635041 50.48%, #170C08 70.67%, #EDF3F3 100%)",
              }}
            ></div>

            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-[0.1]" />
            <div className="relative z-10">
              <h3 className="BodyLarge font-medium  mb-2">Checkpoint</h3>
              <p
                className="Gray200 BodySmall leading-4"
                dangerouslySetInnerHTML={{
                  __html:
                    "Volunteer and checkpoint <br /> coordination for races",
                }}
              />
            </div>
          </div>

          <div
            className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden w-full"
            onClick={handleCardClick}
          >
            <div
              className="absolute h-[99%] w-[99%] opacity-[0.07]"
              style={{
                background:
                  "linear-gradient(180deg, #B2ECFF 0%, #8B48DD 52.4%, #582483 100%)",
              }}
            ></div>

            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-[0.1]" />
            <div className="relative z-10">
              <h3 className="BodyLarge font-medium  mb-2">
                Athlete <br /> Payments
              </h3>
              <p
                className="Gray200 BodySmall leading-4"
                dangerouslySetInnerHTML={{
                  __html: "Payments flow for <br /> organisers",
                }}
              />
            </div>
          </div>

          <div
            className="card-btn backdrop-blur-2xl bg-white/5 transition-colors relative overflow-hidden w-full"
            onClick={handleCardClick}
          >
            <div
              className="absolute h-[99%] w-[99%] opacity-[0.07]"
              style={{
                background:
                  "linear-gradient(180deg, #B2ECFF 0%, #8B48DD 52.4%, #582483 100%)",
              }}
            ></div>
            <div className="absolute h-[99%] w-[99%] left-[0.5%] top-[0.5%] opacity-[0.1]" />
            <div className="relative z-10">
              <h3 className="BodyLarge font-medium  mb-2">
                Garmin <br /> Race Face
              </h3>
              <p
                className="Gray200 BodySmall leading-4"
                dangerouslySetInnerHTML={{
                  __html: "Connect IQ watch <br /> face",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;

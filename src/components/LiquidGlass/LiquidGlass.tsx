// @ts-ignore
import LGMeshes from "./classes/LiquidGlass.js";
import { useEffect, useRef } from "react";

const LiquidGlass = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const LGMeshesRef = useRef(null);

  useEffect(() => {
    let bar = document.getElementById("mobile-bar");

    let updateHeight = () => {
      if (window.innerWidth <= 1024) {
        containerRef.current!.style.height = bar?.clientHeight + "px";
      } else {
        containerRef.current!.style.height = "100dvh";
      }
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);

    if (!LGMeshesRef.current) {
      LGMeshesRef.current = new LGMeshes(containerRef.current);
    }
  }, []);

  return (
    <div
      className="fixed h-0 left-0 bottom-0 right-0 lg:h-[100dvh] z-50 pointer-events-none"
      data-html2canvas-ignore
      ref={containerRef}
    >
      <></>
    </div>
  );
};

export default LiquidGlass;

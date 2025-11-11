// @ts-ignore
import LGMeshes from "./classes/LiquidGlass.js";
import { useEffect, useRef } from "react";

const LiquidGlass = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const LGMeshesRef = useRef(null);

  useEffect(() => {
    if (!LGMeshesRef.current) {
      LGMeshesRef.current = new LGMeshes(containerRef.current);
    }
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 opacity-100"
      data-html2canvas-ignore
      ref={containerRef}
    >
      <></>
    </div>
  );
};

export default LiquidGlass;

import { useEffect, useRef } from "react";

/**
 * Hook that makes dog eyes track the cursor using requestAnimationFrame.
 * @param {Object} dogCenterRef - Ref to an element whose center is the dog's head center.
 */
export const useDogEyes = (dogCenterRef) => {
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rafId = useRef(null);
  const pupilOffset = useRef({ lx: 0, ly: 0, rx: 0, ry: 0 });
  const irisOffset = useRef({ lx: 0, ly: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const leftPupil = document.getElementById("dogLeftPupil");
      const rightPupil = document.getElementById("dogRightPupil");
      const leftIris = document.getElementById("dogLeftIris");
      const rightIris = document.getElementById("dogRightIris");

      if (leftPupil && rightPupil && dogCenterRef?.current) {
        const rect = dogCenterRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = mousePos.current.x - cx;
        const dy = mousePos.current.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const maxPupil = 3.5;
        const maxIris = 1.5;

        // Target offsets
        const tpx = (dx / dist) * maxPupil;
        const tpy = (dy / dist) * maxPupil;
        const tix = (dx / dist) * maxIris;
        const tiy = (dy / dist) * maxIris;

        // Lerp
        const lerp = 0.15;
        pupilOffset.current.lx += (tpx - pupilOffset.current.lx) * lerp;
        pupilOffset.current.ly += (tpy - pupilOffset.current.ly) * lerp;
        pupilOffset.current.rx += (tpx - pupilOffset.current.rx) * lerp;
        pupilOffset.current.ry += (tpy - pupilOffset.current.ry) * lerp;

        irisOffset.current.lx += (tix - irisOffset.current.lx) * lerp;
        irisOffset.current.ly += (tiy - irisOffset.current.ly) * lerp;
        irisOffset.current.rx += (tix - irisOffset.current.rx) * lerp;
        irisOffset.current.ry += (tiy - irisOffset.current.ry) * lerp;

        leftPupil.setAttribute(
          "transform",
          `translate(${pupilOffset.current.lx}, ${pupilOffset.current.ly})`
        );
        rightPupil.setAttribute(
          "transform",
          `translate(${pupilOffset.current.rx}, ${pupilOffset.current.ry})`
        );

        if (leftIris) {
          leftIris.setAttribute(
            "transform",
            `translate(${irisOffset.current.lx}, ${irisOffset.current.ly})`
          );
        }
        if (rightIris) {
          rightIris.setAttribute(
            "transform",
            `translate(${irisOffset.current.rx}, ${irisOffset.current.ry})`
          );
        }
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [dogCenterRef]);
};

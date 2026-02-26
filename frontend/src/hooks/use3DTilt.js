import { useRef, useEffect } from "react";

/**
 * 3D tilt effect hook with lerp smoothing.
 * Attach the returned ref to any element to enable perspective tilt.
 */
export const use3DTilt = (maxTilt = 8, lerpFactor = 0.1) => {
  const ref = useRef(null);
  const currentRotation = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Normalize to -1 to 1
      const nx = mouseX / (rect.width / 2);
      const ny = mouseY / (rect.height / 2);

      // Clamp
      targetRotation.current = {
        x: Math.max(-1, Math.min(1, -ny)) * maxTilt,
        y: Math.max(-1, Math.min(1, nx)) * maxTilt,
      };
    };

    const handleMouseLeave = () => {
      targetRotation.current = { x: 0, y: 0 };
    };

    const animate = () => {
      const cur = currentRotation.current;
      const tar = targetRotation.current;

      cur.x += (tar.x - cur.x) * lerpFactor;
      cur.y += (tar.y - cur.y) * lerpFactor;

      el.style.transform = `perspective(800px) rotateX(${cur.x}deg) rotateY(${cur.y}deg)`;

      rafId.current = requestAnimationFrame(animate);
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [maxTilt, lerpFactor]);

  return ref;
};

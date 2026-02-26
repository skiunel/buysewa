import { useRef, useEffect, useState } from "react";
import { use3DTilt } from "../hooks/use3DTilt";

const Card3D = ({ children, className = "", style = {}, onClick }) => {
  const tiltRef = use3DTilt(8, 0.1);
  const innerRef = useRef(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setGlowPos({ x, y });
    };

    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={(node) => {
        tiltRef.current = node;
        innerRef.current = node;
      }}
      className={`card-3d ${className}`}
      onClick={onClick}
      style={{
        ...style,
        animation: "fadeInUp 0.6s ease forwards",
        background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(59,130,246,0.06), transparent 50%), var(--card)`,
      }}
    >
      <div className="scan-line" />
      {children}
    </div>
  );
};

export default Card3D;

import { useEffect, useRef } from "react";
import { useDogEyes } from "../hooks/useDogEyes";
import OrbitNodes from "./OrbitNodes";

const DogMascot = ({ size = 320, showOrbits = true, mini = false }) => {
  const wrapperRef = useRef(null);
  const dogRef = useRef(null);
  const bodyRotation = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const tailRef = useRef(null);
  const blinkIntervalRef = useRef(null);

  // Eye tracking hook
  useDogEyes(dogRef);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Calculate normalized position
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;

      targetRotation.current = {
        x: -ny * 18,
        y: nx * 22,
      };

      // Tail wag speed based on distance to dog
      if (wrapperRef.current && tailRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.sqrt(
          (e.clientX - cx) ** 2 + (e.clientY - cy) ** 2
        );
        const speed = dist < 200 ? 0.3 : 0.6;
        tailRef.current.style.animationDuration = `${speed}s`;
      }
    };

    // 3D body rotation animation
    const animate = () => {
      const cur = bodyRotation.current;
      const tar = targetRotation.current;

      cur.x += (tar.x - cur.x) * 0.08;
      cur.y += (tar.y - cur.y) * 0.08;

      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `perspective(800px) rotateX(${cur.x}deg) rotateY(${cur.y}deg)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    // Blinking
    const startBlink = () => {
      const leftEye = document.getElementById("dogLeftEyeGroup");
      const rightEye = document.getElementById("dogRightEyeGroup");

      const doBlink = () => {
        if (leftEye) leftEye.style.transform = "scaleY(0.05)";
        if (rightEye) rightEye.style.transform = "scaleY(0.05)";
        setTimeout(() => {
          if (leftEye) leftEye.style.transform = "scaleY(1)";
          if (rightEye) rightEye.style.transform = "scaleY(1)";
        }, 200);
      };

      blinkIntervalRef.current = setInterval(() => {
        doBlink();
      }, 3000 + Math.random() * 2000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId.current = requestAnimationFrame(animate);
    startBlink();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current);
    };
  }, []);

  const svgSize = mini ? 60 : size;

  return (
    <div
      style={{
        position: "relative",
        width: mini ? 60 : size + 80,
        height: mini ? 60 : size + 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Glow ring beneath dog */}
      {!mini && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: size * 0.6,
            height: size * 0.12,
            background:
              "radial-gradient(ellipse, rgba(59,130,246,0.4), transparent 70%)",
            borderRadius: "50%",
            animation: "float 3.5s ease-in-out infinite",
            filter: "blur(8px)",
          }}
        />
      )}

      {/* Orbiting nodes */}
      {showOrbits && !mini && <OrbitNodes size={size + 60} />}

      {/* Dog wrapper — floating + 3D rotation */}
      <div
        ref={wrapperRef}
        style={{
          animation: mini ? "none" : "float 3.5s ease-in-out infinite",
          filter: "drop-shadow(0 0 20px rgba(59,130,246,0.5))",
          animationName: mini ? "none" : "pulseGlow, float",
          animationDuration: mini ? "none" : "2s, 3.5s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          transformStyle: "preserve-3d",
        }}
      >
        <div ref={dogRef}>
          <svg
            width={svgSize}
            height={svgSize}
            viewBox="0 0 200 220"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* TAIL — animated wag */}
            <g ref={tailRef} style={{ transformOrigin: "155px 130px", animation: "tailWag 0.6s ease-in-out infinite" }}>
              <path
                d="M155,130 Q175,110 180,90 Q182,82 178,80 Q174,82 172,90 Q168,108 150,125"
                fill="none"
                stroke="#8B6914"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </g>

            {/* BODY */}
            <ellipse cx="100" cy="145" rx="55" ry="45" fill="#8B6914" />
            {/* Belly */}
            <ellipse cx="100" cy="155" rx="35" ry="28" fill="#F5DEB3" />

            {/* Blockchain emblem on chest */}
            <g style={{ animation: "emblemPulse 2s ease-in-out infinite" }}>
              <polygon
                points="100,128 109,133 109,143 100,148 91,143 91,133"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="1.5"
              />
              <text
                x="100"
                y="142"
                textAnchor="middle"
                fontSize="10"
                fill="#3B82F6"
                fontFamily="Orbitron, monospace"
              >
                &#x26D3;
              </text>
            </g>

            {/* COLLAR */}
            <rect x="72" y="108" width="56" height="8" rx="4" fill="#1D4ED8" />
            <circle cx="100" cy="118" r="7" fill="#1D4ED8" stroke="#00D4FF" strokeWidth="1" />
            <text
              x="100"
              y="121"
              textAnchor="middle"
              fontSize="6"
              fill="#E8E8F0"
              fontFamily="Orbitron, monospace"
              fontWeight="700"
            >
              BR
            </text>

            {/* LEFT EAR */}
            <g style={{ transformOrigin: "65px 55px", animation: "earBounce 2s ease-in-out infinite" }}>
              <path d="M65,55 Q50,30 40,55 Q38,65 55,75 Q65,65 65,55Z" fill="#5C4008" />
              <path d="M60,58 Q52,42 47,58 Q47,65 56,70 Q60,65 60,58Z" fill="#FFB6C1" opacity="0.6" />
            </g>

            {/* RIGHT EAR */}
            <g style={{ transformOrigin: "135px 55px", animation: "earBounce 2s ease-in-out infinite", animationDelay: "0.3s" }}>
              <path d="M135,55 Q150,30 160,55 Q162,65 145,75 Q135,65 135,55Z" fill="#5C4008" />
              <path d="M140,58 Q148,42 153,58 Q153,65 144,70 Q140,65 140,58Z" fill="#FFB6C1" opacity="0.6" />
            </g>

            {/* HEAD */}
            <ellipse cx="100" cy="75" rx="48" ry="40" fill="#8B6914" />

            {/* Dark eye patches */}
            <ellipse cx="80" cy="72" rx="16" ry="12" fill="#5C4008" opacity="0.6" />
            <ellipse cx="120" cy="72" rx="16" ry="12" fill="#5C4008" opacity="0.6" />

            {/* LEFT EYE */}
            <g id="dogLeftEyeGroup" style={{ transformOrigin: "80px 72px", transition: "transform 0.2s" }}>
              <ellipse cx="80" cy="72" rx="12" ry="11" fill="white" />
              <g id="dogLeftIris">
                <circle cx="80" cy="72" r="7" fill="#3B82F6" style={{ filter: "drop-shadow(0 0 3px rgba(59,130,246,0.8))" }} />
              </g>
              <g id="dogLeftPupil">
                <circle cx="80" cy="72" r="3.5" fill="#111" />
                <circle cx="82" cy="70" r="1.5" fill="white" opacity="0.9" />
              </g>
            </g>

            {/* LEFT EYEBROW */}
            <path d="M67,58 Q80,52 93,58" fill="none" stroke="#3D2400" strokeWidth="2.5" strokeLinecap="round" />

            {/* RIGHT EYE */}
            <g id="dogRightEyeGroup" style={{ transformOrigin: "120px 72px", transition: "transform 0.2s" }}>
              <ellipse cx="120" cy="72" rx="12" ry="11" fill="white" />
              <g id="dogRightIris">
                <circle cx="120" cy="72" r="7" fill="#3B82F6" style={{ filter: "drop-shadow(0 0 3px rgba(59,130,246,0.8))" }} />
              </g>
              <g id="dogRightPupil">
                <circle cx="120" cy="72" r="3.5" fill="#111" />
                <circle cx="122" cy="70" r="1.5" fill="white" opacity="0.9" />
              </g>
            </g>

            {/* RIGHT EYEBROW */}
            <path d="M107,58 Q120,52 133,58" fill="none" stroke="#3D2400" strokeWidth="2.5" strokeLinecap="round" />

            {/* SNOUT */}
            <ellipse cx="100" cy="88" rx="18" ry="12" fill="#F5DEB3" />

            {/* NOSE */}
            <ellipse cx="100" cy="84" rx="7" ry="5" fill="#111" />
            <ellipse cx="102" cy="82.5" rx="2" ry="1.5" fill="white" opacity="0.7" />

            {/* MOUTH */}
            <path d="M93,90 Q100,97 107,90" fill="none" stroke="#5C4008" strokeWidth="1.5" strokeLinecap="round" />

            {/* CHEEK BLUSH */}
            <circle cx="68" cy="82" r="7" fill="rgba(255,150,150,0.3)" />
            <circle cx="132" cy="82" r="7" fill="rgba(255,150,150,0.3)" />

            {/* PAWS */}
            <ellipse cx="72" cy="190" rx="14" ry="8" fill="#8B6914" />
            <ellipse cx="128" cy="190" rx="14" ry="8" fill="#8B6914" />
            {/* Paw pads */}
            <circle cx="67" cy="190" r="3" fill="#5C4008" opacity="0.5" />
            <circle cx="77" cy="190" r="3" fill="#5C4008" opacity="0.5" />
            <circle cx="123" cy="190" r="3" fill="#5C4008" opacity="0.5" />
            <circle cx="133" cy="190" r="3" fill="#5C4008" opacity="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DogMascot;

const OrbitNodes = ({ size = 280 }) => {
  const innerRadius = size * 0.42;
  const outerRadius = size * 0.55;

  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    >
      {/* Inner orbit ring */}
      <div
        style={{
          position: "absolute",
          width: innerRadius * 2,
          height: innerRadius * 2,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px dashed rgba(59,130,246,0.2)",
          borderRadius: "50%",
          animation: "orbitSpin 8s linear infinite",
          transformStyle: "preserve-3d",
        }}
      >
        {[0, 120, 240].map((deg) => (
          <div
            key={`inner-${deg}`}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              background: "#3B82F6",
              borderRadius: "50%",
              boxShadow: "0 0 8px #3B82F6, 0 0 16px rgba(59,130,246,0.4)",
              top: "50%",
              left: "50%",
              transform: `rotate(${deg}deg) translateX(${innerRadius}px) translate(-50%, -50%)`,
            }}
          />
        ))}
      </div>

      {/* Outer orbit ring */}
      <div
        style={{
          position: "absolute",
          width: outerRadius * 2,
          height: outerRadius * 2,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px dashed rgba(0,212,255,0.15)",
          borderRadius: "50%",
          animation: "orbitSpinReverse 12s linear infinite",
          transformStyle: "preserve-3d",
        }}
      >
        {[0, 120, 240].map((deg) => (
          <div
            key={`outer-${deg}`}
            style={{
              position: "absolute",
              width: 6,
              height: 6,
              background: "#00D4FF",
              borderRadius: "50%",
              boxShadow: "0 0 8px #00D4FF, 0 0 16px rgba(0,212,255,0.4)",
              top: "50%",
              left: "50%",
              transform: `rotate(${deg}deg) translateX(${outerRadius}px) translate(-50%, -50%)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default OrbitNodes;

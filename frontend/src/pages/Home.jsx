import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Card3D from "../components/Card3D";
import DogMascot from "../components/DogMascot";

const FEATURES = [
  {
    icon: "🛡️",
    title: "Verified Purchase Only",
    desc: "Only buyers with a valid Standard Delivery Code can write reviews. No fake reviews, ever.",
    color: "var(--blue)",
  },
  {
    icon: "🗄️",
    title: "IPFS Stored Reviews",
    desc: "Review content is stored on IPFS for decentralized, censorship-resistant persistence.",
    color: "var(--teal)",
  },
  {
    icon: "⛓️",
    title: "Ethereum Immutability",
    desc: "Content hashes are committed to Ethereum. Reviews cannot be altered or deleted.",
    color: "var(--blue)",
  },
];

const AnimatedCounter = ({ target, label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let current = 0;
          const step = Math.ceil(target / 60);
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(interval);
            }
            setCount(current);
          }, 30);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          fontWeight: 800,
          color: "var(--blue)",
          textShadow: "0 0 20px rgba(59,130,246,0.4)",
        }}
      >
        {count.toLocaleString()}
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.9rem",
          color: "var(--text-dim)",
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const Home = () => (
  <div className="page" style={{ position: "relative", zIndex: 1 }}>
    {/* HERO SECTION */}
    <section
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          textAlign: "center",
          animation: "fadeInUp 0.8s ease forwards",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 900,
            letterSpacing: 4,
            lineHeight: 1.2,
            marginBottom: 20,
            background: "linear-gradient(135deg, var(--blue-glow), var(--teal))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          REVIEWS YOU CAN TRUST ON-CHAIN
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.2rem",
            color: "var(--text-dim)",
            maxWidth: 600,
            margin: "0 auto 36px",
            lineHeight: 1.7,
          }}
        >
          The first decentralized review platform where every review is verified
          through blockchain technology. No fakes. No manipulation. Pure trust.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/products">
            <button className="btn-primary" style={{ fontSize: "0.85rem", padding: "16px 36px" }}>
              BROWSE PRODUCTS
            </button>
          </Link>
          <a href="#features">
            <button className="btn-secondary" style={{ fontSize: "0.85rem", padding: "14px 32px" }}>
              HOW IT WORKS
            </button>
          </a>
        </div>
      </div>

      {/* Small dog in bottom-right of hero */}
      <div style={{ position: "absolute", bottom: 30, right: 40 }}>
        <DogMascot size={120} showOrbits={false} />
      </div>
    </section>

    {/* FEATURES SECTION */}
    <section
      id="features"
      style={{
        padding: "80px 24px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontFamily: "var(--font-display)",
          fontSize: "1.8rem",
          letterSpacing: 3,
          marginBottom: 48,
        }}
      >
        HOW IT WORKS
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
        }}
      >
        {FEATURES.map((f, i) => (
          <Card3D
            key={i}
            style={{
              padding: "36px 28px",
              textAlign: "center",
              animationDelay: `${i * 0.15}s`,
            }}
          >
            <div
              style={{
                fontSize: "2.5rem",
                marginBottom: 16,
                filter: `drop-shadow(0 0 10px ${f.color})`,
              }}
            >
              {f.icon}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                letterSpacing: 2,
                marginBottom: 12,
                color: f.color,
              }}
            >
              {f.title}
            </h3>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>{f.desc}</p>
          </Card3D>
        ))}
      </div>
    </section>

    {/* STATS BAR */}
    <section
      style={{
        padding: "60px 24px",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <Card3D style={{ padding: "40px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          <AnimatedCounter target={12841} label="Reviews On-Chain" />
          <AnimatedCounter target={3291} label="Verified Buyers" />
          <AnimatedCounter target={99} label="% Tamperproof" />
        </div>
      </Card3D>
    </section>
  </div>
);

export default Home;

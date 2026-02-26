import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card3D from "../components/Card3D";
import DogMascot from "../components/DogMascot";

const HASH_STRINGS = [
  "0x7f3a92b1c4e5d6f8a9b0c1d2e3f4a5b6c7d8e9f0",
  "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
  "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [hashIndex, setHashIndex] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Cycling hash display
  useEffect(() => {
    const interval = setInterval(() => {
      setHashIndex((i) => (i + 1) % HASH_STRINGS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      setSuccess(true);
      setTimeout(() => {
        if (user.role === "admin") navigate("/admin");
        else if (user.role === "seller") navigate("/seller");
        else navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { key: "buyer", icon: "🛒", label: "Buyer" },
    { key: "seller", icon: "🏪", label: "Seller" },
    { key: "admin", icon: "⚡", label: "Admin" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 60,
          maxWidth: 1000,
          width: "100%",
          padding: "0 24px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Dog mascot — left side */}
        <div style={{ flex: "0 0 auto" }}>
          <DogMascot size={300} showOrbits={true} />
        </div>

        {/* Login card — right side */}
        <Card3D
          style={{
            flex: "1 1 380px",
            maxWidth: 440,
            padding: "40px 36px",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                letterSpacing: 3,
              }}
            >
              🐶 BLOCKREVIEW
            </h2>
          </div>

          {/* Scrolling hash display */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 24,
              height: 20,
              overflow: "hidden",
            }}
          >
            <span
              key={hashIndex}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.65rem",
                color: "var(--teal)",
                letterSpacing: 1,
                animation: "fadeInUp 0.5s ease forwards",
                display: "block",
              }}
            >
              {HASH_STRINGS[hashIndex]}
            </span>
          </div>

          {/* Role selector */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              justifyContent: "center",
            }}
          >
            {roles.map((r) => (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                style={{
                  flex: 1,
                  padding: "10px 8px",
                  background:
                    role === r.key
                      ? "rgba(59,130,246,0.2)"
                      : "rgba(0,0,0,0.3)",
                  border: `1px solid ${role === r.key ? "var(--blue)" : "rgba(59,130,246,0.15)"}`,
                  borderRadius: 10,
                  color: role === r.key ? "var(--blue)" : "var(--text-dim)",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.7rem",
                  letterSpacing: 1,
                  transition: "all 0.3s",
                }}
              >
                <div style={{ fontSize: "1.2rem", marginBottom: 4 }}>
                  {r.icon}
                </div>
                {r.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-icon">📧</span>
              <input
                type="email"
                className="input-field"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p
                style={{
                  color: "var(--red)",
                  fontSize: "0.85rem",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className={`btn-primary ${loading ? "loading" : ""} ${success ? "success" : ""}`}
              style={{ width: "100%", marginTop: 8 }}
              disabled={loading || success}
            >
              {loading ? (
                <span className="spinner" />
              ) : success ? (
                "CONNECTED ✓"
              ) : (
                "CONNECT TO CHAIN"
              )}
            </button>
          </form>

          {/* Register link */}
          <p
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: "0.9rem",
            }}
          >
            New to BlockReview?{" "}
            <Link
              to="/register"
              style={{ color: "var(--blue)", fontWeight: 600 }}
            >
              Create Account
            </Link>
          </p>

          {/* Security badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 20,
              padding: "8px 16px",
              background: "rgba(0,0,0,0.3)",
              borderRadius: 8,
              border: "1px solid rgba(0,212,255,0.15)",
            }}
          >
            <span className="status-dot teal" />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--text-dim)",
                letterSpacing: 1,
              }}
            >
              End-to-End Encrypted · Blockchain Secured
            </span>
          </div>
        </Card3D>
      </div>
    </div>
  );
};

export default Login;

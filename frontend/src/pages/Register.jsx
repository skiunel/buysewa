import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card3D from "../components/Card3D";
import DogMascot from "../components/DogMascot";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await register(name, email, password, role);
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "seller") navigate("/seller");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
        <div style={{ flex: "0 0 auto" }}>
          <DogMascot size={280} showOrbits={true} />
        </div>

        <Card3D
          style={{
            flex: "1 1 380px",
            maxWidth: 440,
            padding: "36px 36px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", letterSpacing: 3 }}>
              JOIN BLOCKREVIEW
            </h2>
            <p style={{ fontSize: "0.85rem", marginTop: 8 }}>
              Create your decentralized account
            </p>
          </div>

          {/* Role selector */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "center" }}>
            {roles.map((r) => (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                style={{
                  flex: 1,
                  padding: "10px 8px",
                  background: role === r.key ? "rgba(59,130,246,0.2)" : "rgba(0,0,0,0.3)",
                  border: `1px solid ${role === r.key ? "var(--blue)" : "rgba(59,130,246,0.15)"}`,
                  borderRadius: 10,
                  color: role === r.key ? "var(--blue)" : "var(--text-dim)",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.7rem",
                  letterSpacing: 1,
                  transition: "all 0.3s",
                }}
              >
                <div style={{ fontSize: "1.2rem", marginBottom: 4 }}>{r.icon}</div>
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input type="text" className="input-field" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="input-group">
              <span className="input-icon">📧</span>
              <input type="email" className="input-field" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input type="password" className="input-field" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>

            {error && (
              <p style={{ color: "var(--red)", fontSize: "0.85rem", marginBottom: 16, textAlign: "center" }}>
                {error}
              </p>
            )}

            <button type="submit" className={`btn-primary ${loading ? "loading" : ""}`} style={{ width: "100%", marginTop: 8 }} disabled={loading}>
              {loading ? <span className="spinner" /> : "CREATE ACCOUNT"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--blue)", fontWeight: 600 }}>Sign In</Link>
          </p>
        </Card3D>
      </div>
    </div>
  );
};

export default Register;

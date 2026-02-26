import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const walletDisplay = user?.walletAddress
    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
    : "0x0000...0000";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        background: "rgba(10,10,15,0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        zIndex: 1000,
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        transition: "border-color 0.3s",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
        }}
      >
        {/* Spinning hex frame */}
        <div
          style={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            animation: "spin 8s linear infinite",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32">
            <polygon
              points="16,2 28,9 28,23 16,30 4,23 4,9"
              fill="none"
              stroke="var(--blue)"
              strokeWidth="2"
            />
          </svg>
        </div>
        <span style={{ fontSize: "1.1rem", position: "absolute", left: 32, top: 17 }}>
          🐶
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1rem",
            color: "var(--text)",
            letterSpacing: 2,
            marginLeft: 8,
          }}
        >
          BLOCKREVIEW
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {[
          { to: "/", label: "HOME" },
          { to: "/products", label: "PRODUCTS" },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "0.9rem",
              textTransform: "uppercase",
              letterSpacing: 1,
              color: isActive(link.to) ? "var(--blue)" : "var(--text-dim)",
              textDecoration: "none",
              borderBottom: isActive(link.to)
                ? "2px solid var(--blue)"
                : "2px solid transparent",
              paddingBottom: 4,
              transition: "all 0.3s",
              textShadow: isActive(link.to) ? "0 0 10px rgba(59,130,246,0.5)" : "none",
            }}
          >
            {link.label}
          </Link>
        ))}

        {user && (
          <>
            {user.role === "buyer" && (
              <>
                <Link
                  to="/cart"
                  style={{
                    color: isActive("/cart") ? "var(--blue)" : "var(--text-dim)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                    position: "relative",
                  }}
                >
                  CART
                  {itemCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -14,
                        background: "var(--blue)",
                        color: "#fff",
                        borderRadius: "50%",
                        width: 18,
                        height: 18,
                        fontSize: "0.65rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/dashboard"
                  style={{
                    color: isActive("/dashboard") ? "var(--blue)" : "var(--text-dim)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                  }}
                >
                  DASHBOARD
                </Link>
              </>
            )}
            {user.role === "seller" && (
              <Link
                to="/seller"
                style={{
                  color: isActive("/seller") ? "var(--blue)" : "var(--text-dim)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                SELLER HQ
              </Link>
            )}
            {user.role === "admin" && (
              <Link
                to="/admin"
                style={{
                  color: isActive("/admin") ? "var(--blue)" : "var(--text-dim)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                ADMIN
              </Link>
            )}
          </>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {user ? (
          <>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.7rem",
                color: "var(--teal)",
                letterSpacing: 1,
              }}
            >
              {walletDisplay}
            </span>
            <span className="status-dot teal" />
            <button
              onClick={handleLogout}
              className="btn-secondary"
              style={{ padding: "6px 16px", fontSize: "0.7rem" }}
            >
              LOGOUT
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="btn-primary" style={{ padding: "8px 20px", fontSize: "0.7rem" }}>
              CONNECT
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

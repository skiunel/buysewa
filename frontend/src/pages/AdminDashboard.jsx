import { useState, useEffect } from "react";
import api from "../services/api";
import Card3D from "../components/Card3D";
import HashDisplay from "../components/HashDisplay";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, reviews: 0 });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, productsRes] = await Promise.all([
        api.get("/api/users"),
        api.get("/api/products"),
      ]);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setStats({ users: usersRes.data.length, products: productsRes.data.length, orders: 42, reviews: 28 });
    } catch {
      // Demo data
      setUsers([
        { _id: "u1", name: "Alice Johnson", email: "alice@example.com", role: "buyer", status: "active" },
        { _id: "u2", name: "Bob Smith", email: "bob@example.com", role: "seller", status: "active" },
        { _id: "u3", name: "Charlie Admin", email: "charlie@example.com", role: "admin", status: "active" },
        { _id: "u4", name: "Diana Buyer", email: "diana@example.com", role: "buyer", status: "suspended" },
      ]);
      setProducts([
        { _id: "p1", name: "Blockchain Headphones", seller: { name: "Bob" }, status: "active" },
        { _id: "p2", name: "Crypto Wallet", seller: { name: "Bob" }, status: "active" },
      ]);
      setStats({ users: 4, products: 6, orders: 42, reviews: 28 });
    }

    // Mock blockchain events
    setEvents([
      { type: "ReviewSubmitted", sdcHash: "0x7f3a92b1c4e5d6f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2", txHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890", block: 482931, time: "2 min ago" },
      { type: "SDCCommitted", sdcHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab", txHash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba", block: 482928, time: "5 min ago" },
      { type: "SDCCommitted", sdcHash: "0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff", txHash: "0xaaaabbbbccccdddd1111222233334444555566667777888899990000eeeeffff", block: 482920, time: "12 min ago" },
    ]);
  };

  const handleSuspend = async (userId) => {
    try {
      await api.put(`/api/users/${userId}/suspend`);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, status: "suspended" } : u)));
    } catch {
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, status: "suspended" } : u)));
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/api/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch {
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      await api.delete(`/api/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch {
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    }
  };

  const roleBadge = { buyer: "badge-teal", seller: "badge-blue", admin: "badge-red" };

  return (
    <div className="page" style={{ position: "relative", zIndex: 1 }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: 3, marginBottom: 32 }}>
          ADMIN CONTROL ⚡
        </h1>

        {/* KPI cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
          {[
            { label: "Total Users", value: stats.users, icon: "👥" },
            { label: "Products", value: stats.products, icon: "📦" },
            { label: "Orders", value: stats.orders, icon: "🛒" },
            { label: "Reviews On-Chain", value: stats.reviews, icon: "⛓️" },
          ].map((s, i) => (
            <Card3D key={i} style={{ padding: "24px 16px", textAlign: "center" }}>
              <div style={{ fontSize: "1.3rem", marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, color: "var(--blue)" }}>{s.value}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--text-dim)" }}>{s.label}</div>
            </Card3D>
          ))}
        </div>

        {/* User Management */}
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", letterSpacing: 2, marginBottom: 16 }}>USER MANAGEMENT</h2>
        <Card3D style={{ padding: 0, marginBottom: 40, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(59,130,246,0.08)" }}>
                {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "14px 16px", fontFamily: "var(--font-display)", fontSize: "0.7rem", letterSpacing: 2, color: "var(--text-dim)", textAlign: "left", textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderTop: "1px solid rgba(59,130,246,0.1)", transition: "background 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(59,130,246,0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-body)", fontSize: "0.9rem" }}>{u.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--text-dim)" }}>{u.email}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className={`badge ${roleBadge[u.role]}`}>{u.role.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className={`badge ${u.status === "active" ? "badge-green" : "badge-red"}`}>{u.status.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {u.status === "active" && u.role !== "admin" && (
                        <button className="btn-secondary" style={{ padding: "4px 10px", fontSize: "0.6rem" }} onClick={() => handleSuspend(u._id)}>SUSPEND</button>
                      )}
                      {u.role !== "admin" && (
                        <button style={{ padding: "4px 10px", fontSize: "0.6rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--red)", borderRadius: 8, fontFamily: "var(--font-display)", letterSpacing: 1 }} onClick={() => handleDelete(u._id)}>DELETE</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card3D>

        {/* Product Moderation */}
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", letterSpacing: 2, marginBottom: 16 }}>PRODUCT MODERATION</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
          {products.map((p) => (
            <Card3D key={p._id} style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: 1 }}>{p.name}</h4>
                <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>by {p.seller?.name || "Unknown"}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span className="badge badge-green">APPROVED</span>
                <button style={{ padding: "4px 10px", fontSize: "0.6rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--red)", borderRadius: 8, fontFamily: "var(--font-display)", letterSpacing: 1 }} onClick={() => handleRemoveProduct(p._id)}>REMOVE</button>
              </div>
            </Card3D>
          ))}
        </div>

        {/* Blockchain Monitor */}
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", letterSpacing: 2, marginBottom: 16 }}>BLOCKCHAIN MONITOR</h2>
        <Card3D style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {events.map((ev, i) => (
              <div
                key={i}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 16px", background: "rgba(0,0,0,0.3)", borderRadius: 10,
                  borderLeft: `3px solid ${ev.type === "ReviewSubmitted" ? "var(--teal)" : "var(--blue)"}`,
                  animation: "fadeInUp 0.4s ease forwards",
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <div>
                  <span className={`badge ${ev.type === "ReviewSubmitted" ? "badge-teal" : "badge-blue"}`} style={{ marginBottom: 6, display: "inline-block" }}>
                    {ev.type}
                  </span>
                  <div style={{ marginTop: 6 }}>
                    <HashDisplay hash={ev.txHash} prefix="TX/" />
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--blue)" }}>
                    BLOCK #{ev.block}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: 4 }}>{ev.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card3D>
      </div>
    </div>
  );
};

export default AdminDashboard;

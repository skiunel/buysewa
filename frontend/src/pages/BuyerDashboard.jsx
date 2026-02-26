import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Card3D from "../components/Card3D";
import HashDisplay from "../components/HashDisplay";
import DogMascot from "../components/DogMascot";

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ orders: 0, reviews: 0, sdcs: 0 });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/orders/my");
      setOrders(res.data);
      setStats({
        orders: res.data.length,
        reviews: res.data.filter((o) => o.reviewed).length,
        sdcs: res.data.filter((o) => o.sdc).length,
      });
    } catch {
      // Demo data
      setOrders([
        {
          id: "ord1", product: { name: "Blockchain Headphones", price: 299.99 },
          quantity: 1, totalPrice: 299.99, status: "delivered",
          sdc: "SDC-A1B2C3D4E5F6-18F3A2B1C",
          sdcHash: "0x7f3a92b1c4e5d6f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2",
          sdcTxHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
          sdcBlockNumber: 482931, createdAt: new Date().toISOString(),
        },
        {
          id: "ord2", product: { name: "Crypto Hardware Wallet", price: 149.99 },
          quantity: 1, totalPrice: 149.99, status: "shipped",
          sdc: null, sdcHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
          sdcTxHash: "0x0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba",
          sdcBlockNumber: 482845, createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "ord3", product: { name: "Web3 Keyboard", price: 159.99 },
          quantity: 1, totalPrice: 159.99, status: "pending",
          sdc: null, sdcHash: "0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff",
          sdcTxHash: "0xeeeeffffaaaabbbb1111222233334444555566667777888899990000ccccdddd",
          sdcBlockNumber: 482790, createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);
      setStats({ orders: 3, reviews: 0, sdcs: 1 });
    }
  };

  const statusColors = {
    pending: "badge-yellow",
    shipped: "badge-blue",
    delivered: "badge-green",
  };

  const copySDC = (sdc) => {
    navigator.clipboard.writeText(sdc);
  };

  return (
    <div className="page" style={{ position: "relative", zIndex: 1 }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: 3 }}>MY DASHBOARD</h1>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--teal)", letterSpacing: 1 }}>
              {user?.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : "0x0000...0000"}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Orders Placed", value: stats.orders, icon: "📦" },
            { label: "Reviews Submitted", value: stats.reviews, icon: "📝" },
            { label: "SDCs Active", value: stats.sdcs, icon: "🔑" },
          ].map((s, i) => (
            <Card3D key={i} style={{ padding: "24px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, color: "var(--blue)" }}>
                {s.value}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-dim)" }}>{s.label}</div>
            </Card3D>
          ))}
        </div>

        {/* Orders list */}
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", letterSpacing: 2, marginBottom: 20 }}>
          MY ORDERS
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((order) => (
            <Card3D key={order.id} style={{ padding: "24px 28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", letterSpacing: 1, marginBottom: 6 }}>
                    {order.product?.name}
                  </h4>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>
                      Qty: {order.quantity}
                    </span>
                    <span style={{ fontFamily: "var(--font-display)", color: "var(--blue)" }}>
                      ${order.totalPrice?.toFixed(2)}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <HashDisplay hash={order.sdcTxHash} prefix="TX/" />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <span className={`badge ${statusColors[order.status]}`}>
                    {order.status.toUpperCase()}
                  </span>

                  {order.status === "delivered" && order.sdc && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--teal)", letterSpacing: 1 }}>
                        SDC: {order.sdc}
                      </span>
                      <button
                        className="btn-secondary"
                        style={{ padding: "2px 10px", fontSize: "0.65rem" }}
                        onClick={() => copySDC(order.sdc)}
                      >
                        COPY
                      </button>
                    </div>
                  )}

                  {order.status === "delivered" && (
                    <Link to={`/review/${order.product?._id || "1"}?orderId=${order.id}&sdc=${order.sdc || ""}`}>
                      <button className="btn-primary" style={{ padding: "8px 20px", fontSize: "0.7rem" }}>
                        WRITE REVIEW
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </Card3D>
          ))}
        </div>

        {/* Dog mascot bottom-right */}
        <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 10 }}>
          <DogMascot size={100} showOrbits={false} mini />
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;

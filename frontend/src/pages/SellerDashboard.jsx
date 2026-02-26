import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Card3D from "../components/Card3D";
import StarRating from "../components/StarRating";

const SellerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", image: "" });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data.filter((p) => p.seller?._id === user?.id || p.seller?.name));
    } catch {
      setProducts([
        { _id: "p1", name: "Blockchain Headphones", price: 299.99, category: "Electronics", averageRating: 4.5, reviewCount: 12, status: "active" },
        { _id: "p2", name: "Crypto Hardware Wallet", price: 149.99, category: "Security", averageRating: 4.8, reviewCount: 24, status: "active" },
      ]);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/orders/seller");
      setOrders(res.data);
    } catch {
      setOrders([
        { _id: "o1", buyer: { name: "Alice" }, product: { name: "Blockchain Headphones" }, quantity: 1, totalPrice: 299.99, status: "pending", createdAt: new Date().toISOString() },
        { _id: "o2", buyer: { name: "Bob" }, product: { name: "Crypto Hardware Wallet" }, quantity: 2, totalPrice: 299.98, status: "shipped", createdAt: new Date(Date.now() - 86400000).toISOString() },
      ]);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditProduct(product);
      setForm({ name: product.name, description: product.description || "", price: product.price.toString(), category: product.category, image: product.image || "" });
    } else {
      setEditProduct(null);
      setForm({ name: "", description: "", price: "", category: "", image: "" });
    }
    setShowModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await api.put(`/api/products/${editProduct._id}`, { ...form, price: parseFloat(form.price) });
      } else {
        await api.post("/api/products", { ...form, price: parseFloat(form.price) });
      }
      setShowModal(false);
      fetchProducts();
    } catch {
      setShowModal(false);
    }
  };

  const handleShip = async (orderId) => {
    try {
      await api.put(`/api/orders/${orderId}/ship`);
      fetchOrders();
    } catch {
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: "shipped" } : o)));
    }
  };

  const handleDeliver = async (orderId) => {
    try {
      await api.put(`/api/orders/${orderId}/deliver`);
      fetchOrders();
    } catch {
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: "delivered" } : o)));
    }
  };

  const statusColors = { pending: "badge-yellow", shipped: "badge-blue", delivered: "badge-green" };

  return (
    <div className="page" style={{ position: "relative", zIndex: 1 }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: 3 }}>SELLER HQ</h1>
          <button className="btn-primary" onClick={() => openModal()} style={{ fontSize: "0.8rem" }}>
            + ADD NEW PRODUCT
          </button>
        </div>

        {/* Product grid */}
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", letterSpacing: 2, marginBottom: 16 }}>MY PRODUCTS</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20, marginBottom: 40 }}>
          {products.map((p) => (
            <Card3D key={p._id} style={{ padding: "20px" }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: 1, marginBottom: 8 }}>{p.name}</h4>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--blue)", fontWeight: 800, marginBottom: 8 }}>${p.price.toFixed(2)}</div>
              <div style={{ marginBottom: 8 }}>
                <StarRating rating={Math.round(p.averageRating || 0)} />
                <span style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", color: "var(--teal)", marginLeft: 8 }}>{p.reviewCount || 0} reviews</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-secondary" style={{ padding: "6px 14px", fontSize: "0.65rem" }} onClick={() => openModal(p)}>EDIT</button>
                <span className={`badge ${p.status === "active" ? "badge-green" : "badge-yellow"}`}>{(p.status || "active").toUpperCase()}</span>
              </div>
            </Card3D>
          ))}
        </div>

        {/* Orders section */}
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", letterSpacing: 2, marginBottom: 16 }}>INCOMING ORDERS</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map((o) => (
            <Card3D key={o._id} style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: 1, marginBottom: 4 }}>{o.product?.name}</h4>
                <span style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>Buyer: {o.buyer?.name} | Qty: {o.quantity} | ${o.totalPrice?.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className={`badge ${statusColors[o.status]}`}>{o.status.toUpperCase()}</span>
                {o.status === "pending" && (
                  <button className="btn-primary" style={{ padding: "6px 14px", fontSize: "0.65rem" }} onClick={() => handleShip(o._id)}>MARK SHIPPED</button>
                )}
                {o.status === "shipped" && (
                  <button className="btn-primary" style={{ padding: "6px 14px", fontSize: "0.65rem" }} onClick={() => handleDeliver(o._id)}>MARK DELIVERED</button>
                )}
              </div>
            </Card3D>
          ))}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 2000, display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              width: 420, maxWidth: "100vw", height: "100%", background: "var(--card)",
              backdropFilter: "blur(24px)", borderLeft: "1px solid var(--border)",
              padding: "32px 28px", overflowY: "auto",
              animation: "fadeInUp 0.3s ease forwards",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: 2 }}>
                {editProduct ? "EDIT PRODUCT" : "ADD PRODUCT"}
              </h3>
              <button style={{ background: "none", border: "none", color: "var(--text-dim)", fontSize: "1.2rem" }} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveProduct}>
              {["name", "description", "price", "category"].map((field) => (
                <div className="input-group" key={field}>
                  <input
                    type={field === "price" ? "number" : "text"}
                    className="input-field"
                    style={{ paddingLeft: 16 }}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    required={field !== "image"}
                    step={field === "price" ? "0.01" : undefined}
                  />
                </div>
              ))}

              {/* Image drop zone */}
              <div
                style={{
                  border: "2px dashed var(--border)", borderRadius: 12, padding: "32px 16px",
                  textAlign: "center", marginBottom: 20, transition: "all 0.3s",
                }}
              >
                <p style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>Drag image here or click to upload</p>
                <input type="text" className="input-field" style={{ paddingLeft: 16, marginTop: 12 }} placeholder="Or enter image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", fontSize: "0.8rem" }}>
                {editProduct ? "SAVE CHANGES" : "PUBLISH PRODUCT"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;

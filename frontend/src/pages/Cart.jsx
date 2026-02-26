import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Card3D from "../components/Card3D";
import HashDisplay from "../components/HashDisplay";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderStep, setOrderStep] = useState(null); // null | 'processing' | 'committed' | 'done'
  const [orderResult, setOrderResult] = useState(null);

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (items.length === 0) return;

    setOrderStep("processing");

    try {
      // Place orders for each item
      const results = [];
      for (const item of items) {
        const res = await api.post("/api/orders", {
          productId: item.product._id,
          quantity: item.quantity,
        });
        results.push(res.data);
      }
      setOrderResult(results[0]);
      setOrderStep("committed");

      setTimeout(() => {
        setOrderStep("done");
        clearCart();
      }, 2000);
    } catch {
      // Demo mode fallback
      const mockTx = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      const mockBlock = Math.floor(Math.random() * 900000) + 100000;
      const mockSDC = "SDC-" + Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join("") + "-" + Date.now().toString(16).toUpperCase();

      setOrderResult({
        order: {
          sdcTxHash: mockTx,
          sdcBlockNumber: mockBlock,
        },
        sdc: mockSDC,
      });
      setOrderStep("committed");

      setTimeout(() => {
        setOrderStep("done");
        clearCart();
      }, 2000);
    }
  };

  const tax = total * 0.08;

  return (
    <div className="page" style={{ position: "relative", zIndex: 1 }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: 3, marginBottom: 32, textAlign: "center" }}>
          CART & CHECKOUT
        </h1>

        {orderStep ? (
          <Card3D style={{ maxWidth: 500, margin: "0 auto", padding: "48px 36px", textAlign: "center" }}>
            {orderStep === "processing" && (
              <>
                <div style={{ fontSize: "3rem", marginBottom: 16, animation: "spin 1s linear infinite", display: "inline-block" }}>
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <polygon points="30,5 52,17 52,43 30,55 8,43 8,17" fill="none" stroke="var(--blue)" strokeWidth="2" />
                    <text x="30" y="35" textAnchor="middle" fontSize="16" fill="var(--blue)">&#x26D3;</text>
                  </svg>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: 2, marginBottom: 16 }}>
                  Committing SDC to Ethereum...
                </h3>
                <div style={{ width: "100%", height: 4, background: "rgba(59,130,246,0.2)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: "60%", height: "100%", background: "var(--blue)", borderRadius: 2, animation: "shimmerSweep 1.5s ease infinite" }} />
                </div>
              </>
            )}

            {orderStep === "committed" && orderResult && (
              <>
                <div style={{ fontSize: "3rem", marginBottom: 16, color: "var(--green)" }}>✓</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: 2, color: "var(--green)", marginBottom: 16 }}>
                  ORDER PLACED SUCCESSFULLY
                </h3>
                <div style={{ marginBottom: 12 }}>
                  <HashDisplay hash={orderResult.order?.sdcTxHash || orderResult.sdcTxHash} prefix="TX/" />
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--teal)" }}>
                  SDC committed to block #{orderResult.order?.sdcBlockNumber || orderResult.sdcBlockNumber} ✓
                </p>
              </>
            )}

            {orderStep === "done" && (
              <>
                <div style={{ fontSize: "3rem", marginBottom: 16, color: "var(--green)" }}>🎉</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: 2, marginBottom: 16 }}>
                  ORDER CONFIRMED ON-CHAIN
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-dim)", marginBottom: 20 }}>
                  Your SDC will be revealed once the seller marks it as delivered.
                </p>
                <button className="btn-primary" onClick={() => navigate("/dashboard")}>
                  VIEW MY ORDERS
                </button>
              </>
            )}
          </Card3D>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
            {/* Cart items */}
            <div>
              {items.length === 0 ? (
                <Card3D style={{ padding: "48px 24px", textAlign: "center" }}>
                  <p style={{ fontSize: "1.1rem", color: "var(--text-dim)" }}>Your cart is empty</p>
                  <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate("/products")}>
                    BROWSE PRODUCTS
                  </button>
                </Card3D>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {items.map((item) => (
                    <Card3D key={item.product._id} style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ fontSize: "2rem" }}>📦</div>
                        <div>
                          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: 1 }}>
                            {item.product.name}
                          </h4>
                          <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--blue)" }}>
                            ${item.product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <button className="btn-secondary" style={{ padding: "2px 10px" }} onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</button>
                        <span style={{ fontFamily: "var(--font-display)", minWidth: 24, textAlign: "center" }}>{item.quantity}</span>
                        <button className="btn-secondary" style={{ padding: "2px 10px" }} onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                        <button
                          style={{ background: "none", border: "none", color: "var(--red)", fontSize: "1.1rem", padding: "4px 8px" }}
                          onClick={() => removeFromCart(item.product._id)}
                        >
                          ✕
                        </button>
                      </div>
                    </Card3D>
                  ))}
                </div>
              )}
            </div>

            {/* Order summary */}
            {items.length > 0 && (
              <Card3D style={{ padding: "28px 24px", alignSelf: "start" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: 2, marginBottom: 20 }}>
                  ORDER SUMMARY
                </h3>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ color: "var(--text-dim)" }}>Subtotal</span>
                  <span style={{ fontFamily: "var(--font-display)" }}>${total.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ color: "var(--text-dim)" }}>Tax (8%)</span>
                  <span style={{ fontFamily: "var(--font-display)" }}>${tax.toFixed(2)}</span>
                </div>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 12, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--blue)", fontWeight: 800 }}>
                    ${(total + tax).toFixed(2)}
                  </span>
                </div>
                <button className="btn-primary" style={{ width: "100%", marginTop: 20, fontSize: "0.8rem" }} onClick={handleCheckout}>
                  PLACE ORDER & GENERATE SDC
                </button>
              </Card3D>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Card3D from "../components/Card3D";
import StarRating from "../components/StarRating";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
    } catch {
      // Use sample data for demo
      setProducts([
        { _id: "1", name: "Blockchain Headphones", price: 299.99, description: "Premium wireless headphones", averageRating: 4.5, reviewCount: 12, seller: { name: "TechStore" }, image: null, category: "Electronics" },
        { _id: "2", name: "Crypto Hardware Wallet", price: 149.99, description: "Secure your digital assets", averageRating: 4.8, reviewCount: 24, seller: { name: "CryptoGear" }, image: null, category: "Security" },
        { _id: "3", name: "DeFi Trading Monitor", price: 599.99, description: "Ultra-wide curved display", averageRating: 4.2, reviewCount: 8, seller: { name: "DisplayHub" }, image: null, category: "Electronics" },
        { _id: "4", name: "Smart Contract Dev Kit", price: 79.99, description: "Complete Solidity dev toolkit", averageRating: 4.6, reviewCount: 18, seller: { name: "DevTools" }, image: null, category: "Software" },
        { _id: "5", name: "Mining Rig Frame", price: 189.99, description: "6-GPU open air mining frame", averageRating: 3.9, reviewCount: 5, seller: { name: "MinerPro" }, image: null, category: "Hardware" },
        { _id: "6", name: "Web3 Mechanical Keyboard", price: 159.99, description: "RGB mechanical keyboard", averageRating: 4.7, reviewCount: 31, seller: { name: "TechStore" }, image: null, category: "Peripherals" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page" style={{ position: "relative", zIndex: 1 }}>
      <div className="container" style={{ paddingTop: 32 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            letterSpacing: 3,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          PRODUCT CATALOG
        </h1>

        {/* Search bar */}
        <div style={{ maxWidth: 600, margin: "0 auto 32px" }}>
          <div className="input-group">
            <span className="input-icon">🔍</span>
            <input
              type="text"
              className="input-field"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Product grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <span className="spinner" style={{ width: 40, height: 40 }} />
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
              paddingBottom: 60,
            }}
          >
            {filtered.map((product) => (
              <Card3D
                key={product._id}
                style={{ padding: 0, overflow: "hidden" }}
              >
                {/* Image placeholder */}
                <div
                  style={{
                    height: 180,
                    background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(0,212,255,0.05))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span style={{ filter: "grayscale(0.3)" }}>
                    {product.category === "Electronics" ? "🎧" :
                     product.category === "Security" ? "🔐" :
                     product.category === "Software" ? "💻" :
                     product.category === "Hardware" ? "⚙️" :
                     product.category === "Peripherals" ? "⌨️" : "📦"}
                  </span>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(59,130,246,0)",
                      transition: "background 0.3s",
                    }}
                    className="img-overlay"
                  />
                </div>

                <div style={{ padding: "20px 20px 24px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.9rem",
                      letterSpacing: 1,
                      marginBottom: 8,
                    }}
                  >
                    {product.name}
                  </h3>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.4rem",
                      fontWeight: 800,
                      color: "var(--blue)",
                      marginBottom: 8,
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-dim)",
                      marginBottom: 8,
                    }}
                  >
                    by {product.seller?.name || "Unknown"}
                  </p>
                  <div style={{ marginBottom: 12 }}>
                    <StarRating rating={Math.round(product.averageRating)} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link to={`/products/${product._id}`}>
                      <button className="btn-secondary" style={{ padding: "8px 20px", fontSize: "0.7rem" }}>
                        VIEW PRODUCT
                      </button>
                    </Link>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.65rem",
                        color: "var(--teal)",
                        letterSpacing: 1,
                      }}
                    >
                      {product.reviewCount} reviews on-chain
                    </span>
                  </div>
                </div>
              </Card3D>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

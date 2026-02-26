import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Card3D from "../components/Card3D";
import StarRating from "../components/StarRating";
import HashDisplay from "../components/HashDisplay";
import BlockchainBadge from "../components/BlockchainBadge";
import DogMascot from "../components/DogMascot";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/api/products/${id}`);
      setProduct(res.data);
    } catch {
      setProduct({
        _id: id,
        name: "Blockchain Headphones",
        price: 299.99,
        description: "Premium wireless headphones with active noise cancellation. Built for the crypto community with 40-hour battery life and premium audio drivers. Experience immersive sound while monitoring your DeFi positions.",
        averageRating: 4.5,
        reviewCount: 12,
        seller: { name: "TechStore" },
        category: "Electronics",
      });
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/api/reviews/product/${id}`);
      setReviews(res.data);
    } catch {
      setReviews([]);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <div className="page" style={{ display: "flex", justifyContent: "center", paddingTop: 120, zIndex: 1, position: "relative" }}>
        <span className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div className="page" style={{ position: "relative", zIndex: 1 }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 48 }}>
          {/* Left: Image */}
          <Card3D style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 350 }}>
            <div style={{ fontSize: "6rem", filter: "drop-shadow(0 0 30px rgba(59,130,246,0.3))" }}>
              {product.category === "Electronics" ? "🎧" :
               product.category === "Security" ? "🔐" :
               product.category === "Software" ? "💻" : "📦"}
            </div>
          </Card3D>

          {/* Right: Details */}
          <Card3D style={{ padding: "36px 32px" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: 2, marginBottom: 12 }}>
              {product.name}
            </h1>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "var(--blue)", marginBottom: 16 }}>
              ${product.price.toFixed(2)}
            </div>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, marginBottom: 20 }}>
              {product.description}
            </p>
            <p style={{ fontSize: "0.9rem", color: "var(--text-dim)", marginBottom: 16 }}>
              Sold by <span style={{ color: "var(--text)" }}>{product.seller?.name}</span>
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <StarRating rating={Math.round(product.averageRating)} />
              <span style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--teal)" }}>
                {product.reviewCount} verified reviews
              </span>
            </div>

            {/* Quantity selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--text-dim)" }}>Qty:</span>
              <button
                className="btn-secondary"
                style={{ padding: "4px 12px", fontSize: "0.9rem" }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", minWidth: 30, textAlign: "center" }}>
                {quantity}
              </span>
              <button
                className="btn-secondary"
                style={{ padding: "4px 12px", fontSize: "0.9rem" }}
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            <button
              className={`btn-primary ${added ? "success" : ""}`}
              style={{ width: "100%", fontSize: "0.85rem" }}
              onClick={handleAddToCart}
            >
              {added ? "ADDED TO CART ✓" : "ADD TO CART"}
            </button>
          </Card3D>
        </div>

        {/* Reviews Section */}
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: 3, marginBottom: 24 }}>
          ON-CHAIN REVIEWS
        </h2>

        {reviews.length === 0 ? (
          <Card3D style={{ padding: "60px 24px", textAlign: "center" }}>
            <DogMascot size={140} showOrbits={false} />
            <p style={{ fontSize: "1.1rem", marginTop: 20, color: "var(--text-dim)" }}>
              No reviews yet. Be the first verified reviewer!
            </p>
          </Card3D>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {reviews.map((review) => (
              <Card3D key={review.id} style={{ padding: "24px 28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--teal)" }}>
                      {review.walletAddress ? `${review.walletAddress.slice(0, 6)}...${review.walletAddress.slice(-4)}` : review.reviewer}
                    </span>
                    <div style={{ marginTop: 4 }}>
                      <StarRating rating={review.rating} blue />
                    </div>
                  </div>
                  <BlockchainBadge />
                </div>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 12 }}>{review.content}</p>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <HashDisplay hash={review.ipfsHash} prefix="IPFS/" />
                  <HashDisplay hash={review.txHash} prefix="TX/" />
                </div>
              </Card3D>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

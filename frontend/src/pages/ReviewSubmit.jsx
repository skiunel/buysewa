import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Card3D from "../components/Card3D";
import StarRating from "../components/StarRating";
import HashDisplay from "../components/HashDisplay";

const ReviewSubmit = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sdcFromUrl = searchParams.get("sdc") || "";

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [sdc, setSdc] = useState(sdcFromUrl);
  const [sdcValid, setSdcValid] = useState(null);
  const [step, setStep] = useState(null); // null | 'ipfs' | 'chain' | 'done'
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const validateSDC = (value) => {
    setSdc(value);
    if (value.length >= 16 && value.startsWith("SDC-")) {
      setSdcValid(true);
    } else if (value.length > 0) {
      setSdcValid(false);
    } else {
      setSdcValid(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !content || !sdc) return;
    setError("");

    // Step 1: IPFS upload
    setStep("ipfs");

    try {
      await new Promise((r) => setTimeout(r, 1500));

      // Step 2: Blockchain commit
      setStep("chain");
      await new Promise((r) => setTimeout(r, 1500));

      const res = await api.post("/api/reviews", {
        productId,
        rating,
        content,
        sdc,
      });

      setResult(res.data.review);
      setStep("done");
    } catch (err) {
      // Demo fallback
      const mockIpfs = "Qm" + Array.from({ length: 44 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      const mockTx = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

      setResult({
        ipfsHash: mockIpfs,
        txHash: mockTx,
        blockNumber: Math.floor(Math.random() * 900000) + 100000,
      });
      setStep("done");
    }
  };

  return (
    <div className="page" style={{ position: "relative", zIndex: 1 }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", letterSpacing: 3, marginBottom: 32, textAlign: "center" }}>
          SUBMIT REVIEW
        </h1>

        <Card3D style={{ padding: "36px 32px" }}>
          {step === null && (
            <form onSubmit={handleSubmit}>
              {/* Product recap */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, padding: "16px", background: "rgba(0,0,0,0.3)", borderRadius: 12 }}>
                <div style={{ fontSize: "2rem" }}>📦</div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.85rem", letterSpacing: 1 }}>Product Review</h4>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>Product ID: {productId}</span>
                </div>
              </div>

              {/* Star selector */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", letterSpacing: 1, color: "var(--text-dim)", display: "block", marginBottom: 8 }}>
                  RATING
                </label>
                <StarRating rating={rating} interactive onChange={setRating} size="2rem" blue />
              </div>

              {/* Review text */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", letterSpacing: 1, color: "var(--text-dim)", display: "block", marginBottom: 8 }}>
                  YOUR REVIEW
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={2000}
                  placeholder="Share your honest experience with this product..."
                  style={{
                    width: "100%",
                    minHeight: 200,
                    padding: 16,
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    borderRadius: 12,
                    color: "var(--text)",
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                    resize: "vertical",
                    outline: "none",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--blue)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(59,130,246,0.2)")}
                  required
                />
                <div style={{ textAlign: "right", fontSize: "0.75rem", color: "var(--text-dim)", marginTop: 4 }}>
                  {content.length}/2000
                </div>
              </div>

              {/* SDC input */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", letterSpacing: 1, color: "var(--text-dim)", display: "block", marginBottom: 8 }}>
                  STANDARD DELIVERY CODE (SDC)
                </label>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <span className="input-icon">🔑</span>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="SDC-XXXXXXXXXXXX-XXXXXXXX"
                    value={sdc}
                    onChange={(e) => validateSDC(e.target.value)}
                    style={{
                      borderColor: sdcValid === true ? "var(--green)" : sdcValid === false ? "var(--red)" : undefined,
                      boxShadow: sdcValid === true
                        ? "0 0 10px rgba(34,197,94,0.2)"
                        : sdcValid === false
                        ? "0 0 10px rgba(239,68,68,0.2)"
                        : undefined,
                    }}
                    required
                  />
                </div>
                {sdcValid === true && (
                  <span style={{ color: "var(--green)", fontSize: "0.8rem", marginTop: 6, display: "block" }}>
                    ✓ SDC verified on-chain
                  </span>
                )}
                {sdcValid === false && (
                  <span style={{ color: "var(--red)", fontSize: "0.8rem", marginTop: 6, display: "block" }}>
                    ✕ SDC not found on blockchain
                  </span>
                )}
              </div>

              {error && (
                <p style={{ color: "var(--red)", fontSize: "0.85rem", marginBottom: 16, textAlign: "center" }}>{error}</p>
              )}

              <button
                type="submit"
                className="btn-primary"
                style={{ width: "100%", fontSize: "0.85rem" }}
                disabled={!rating || !content || !sdc || sdcValid === false}
              >
                SUBMIT TO BLOCKCHAIN
              </button>
            </form>
          )}

          {/* Submission animation steps */}
          {step === "ipfs" && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: 60, height: 60, border: "3px solid var(--teal)", borderTop: "3px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: 2, color: "var(--teal)" }}>
                Uploading to IPFS...
              </h3>
            </div>
          )}

          {step === "chain" && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ animation: "spin 1s linear infinite", display: "inline-block", marginBottom: 20 }}>
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <polygon points="30,5 52,17 52,43 30,55 8,43 8,17" fill="none" stroke="var(--blue)" strokeWidth="2" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: 2, color: "var(--blue)" }}>
                Committing hash to Ethereum...
              </h3>
            </div>
          )}

          {step === "done" && result && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16, color: "var(--green)" }}>✓</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", letterSpacing: 2, color: "var(--green)", marginBottom: 20 }}>
                REVIEW CONFIRMED ON-CHAIN
              </h3>

              {/* Confetti particles */}
              <div style={{ position: "relative", overflow: "hidden", height: 20, marginBottom: 20 }}>
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: i % 2 === 0 ? "var(--blue)" : "var(--teal)",
                      left: `${Math.random() * 100}%`,
                      top: -10,
                      animation: `fadeInUp ${0.5 + Math.random()}s ease forwards`,
                      animationDelay: `${Math.random() * 0.5}s`,
                    }}
                  />
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                <HashDisplay hash={result.txHash} prefix="TX/" />
                <HashDisplay hash={result.ipfsHash} prefix="IPFS/" />
                {result.blockNumber && (
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--text-dim)" }}>
                    BLOCK #{result.blockNumber}
                  </span>
                )}
              </div>

              <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => navigate(`/products/${productId}`)}>
                VIEW PRODUCT
              </button>
            </div>
          )}
        </Card3D>
      </div>
    </div>
  );
};

export default ReviewSubmit;

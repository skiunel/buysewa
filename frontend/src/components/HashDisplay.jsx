import { useState, useEffect } from "react";

const truncateHash = (hash) => {
  if (!hash || hash.length < 12) return hash || "";
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const HashDisplay = ({ hash, prefix = "ETH/", full = false, copyable = true }) => {
  const [copied, setCopied] = useState(false);
  const [displayHash, setDisplayHash] = useState("");
  const [cycling, setCycling] = useState(true);

  useEffect(() => {
    if (!hash) return;

    if (cycling) {
      let frame = 0;
      const chars = "0123456789abcdef";
      const targetLength = full ? hash.length : 13;

      const interval = setInterval(() => {
        frame++;
        let str = "";
        for (let i = 0; i < targetLength; i++) {
          if (frame > i * 2) {
            str += (full ? hash : truncateHash(hash))[i] || "";
          } else {
            str += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        setDisplayHash(str);

        if (frame > targetLength * 2 + 10) {
          setDisplayHash(full ? hash : truncateHash(hash));
          setCycling(false);
          clearInterval(interval);
        }
      }, 40);

      return () => clearInterval(interval);
    } else {
      setDisplayHash(full ? hash : truncateHash(hash));
    }
  }, [hash, full, cycling]);

  const handleCopy = () => {
    if (!hash || !copyable) return;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span
      className="hash-display"
      onClick={handleCopy}
      style={{ cursor: copyable ? "pointer" : "default" }}
      title={hash}
    >
      <span className="hash-prefix">{prefix}</span>
      {displayHash}
      {copied && (
        <span style={{ color: "var(--green)", marginLeft: 6, fontSize: "0.7rem" }}>
          Copied!
        </span>
      )}
    </span>
  );
};

export default HashDisplay;

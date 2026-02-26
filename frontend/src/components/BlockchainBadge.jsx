const BlockchainBadge = ({ text = "Verified on Ethereum", verified = true }) => (
  <span
    className={`badge ${verified ? "badge-green" : "badge-yellow"}`}
    style={{ fontSize: "0.65rem" }}
  >
    <span
      className={`status-dot ${verified ? "green" : "red"}`}
      style={{ width: 6, height: 6 }}
    />
    {text} {verified ? "\u2713" : "\u2717"}
  </span>
);

export default BlockchainBadge;

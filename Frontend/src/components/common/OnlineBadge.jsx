const OnlineBadge = ({ isOnline, size = 9, borderColor = "var(--bg-sidebar)" }) => (
  <span style={{
    display: "inline-block",
    width: size, height: size, borderRadius: "50%",
    background: isOnline ? "#22c55e" : "#4a4a60",
    border: `2px solid ${borderColor}`,
    flexShrink: 0,
    animation: isOnline ? "pulseOnline 2.2s ease-in-out infinite" : "none",
  }} />
);

export default OnlineBadge;
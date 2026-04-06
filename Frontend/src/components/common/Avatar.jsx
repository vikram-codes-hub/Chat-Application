import { getInitials, getAvatarColor } from "../../utils/helpers";

const sizes = {
  xs: { px: 24, font: 9  },
  sm: { px: 32, font: 12 },
  md: { px: 40, font: 14 },
  lg: { px: 52, font: 18 },
  xl: { px: 72, font: 24 },
};

const Avatar = ({ user, size = "md", showOnline = false, isOnline = false }) => {
  const { px, font } = sizes[size] || sizes.md;
  const name    = user?.fullName || user?.name || "";
  const initials = user?.initials || getInitials(name);
  const color   = user?.color    || getAvatarColor(name);

  return (
    <div style={{
      width: px, height: px, borderRadius: "50%",
      background: color + "22", color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: font, fontWeight: 700,
      flexShrink: 0, position: "relative", userSelect: "none",
      border: `1.5px solid ${color}44`,
    }}>
      {user?.avatar
        ? <img src={user.avatar} alt={name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
        : initials
      }
      {showOnline && (
        <span style={{
          position: "absolute", bottom: 1, right: 1,
          width: size === "xl" ? 14 : 9, height: size === "xl" ? 14 : 9,
          borderRadius: "50%",
          background: isOnline ? "#22c55e" : "#4a4a60",
          border: "2px solid var(--bg-sidebar)",
          animation: isOnline ? "pulseOnline 2.2s ease-in-out infinite" : "none",
        }} />
      )}
    </div>
  );
};

export default Avatar;
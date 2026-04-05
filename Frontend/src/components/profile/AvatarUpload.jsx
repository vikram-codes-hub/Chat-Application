import { useRef } from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import Avatar from "../common/Avatar";

const AvatarUpload = ({ user, preview, onUpload }) => {
  const fileRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {preview
        ? <img
            src={preview}
            alt="avatar"
            style={{
              width: 80, height: 80, borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid var(--accent)",
            }}
          />
        : <Avatar user={user} size="xl" />
      }
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => fileRef.current?.click()}
        style={{
          position: "absolute", bottom: 2, right: 2,
          width: 26, height: 26, borderRadius: "50%",
          background: "var(--accent)",
          border: "2px solid var(--bg-base)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <Camera size={12} color="#fff" />
      </motion.button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </div>
  );
};

export default AvatarUpload;
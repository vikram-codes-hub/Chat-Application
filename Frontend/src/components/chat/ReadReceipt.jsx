import { Check, CheckCheck, Clock, AlertCircle } from "lucide-react";

const ReadReceipt = ({ status }) => {
  const s = { size: 12 };
  if (status === "sending")   return <Clock      {...s} color="var(--text-hint)" />;
  if (status === "sent")      return <Check      {...s} color="var(--text-muted)" />;
  if (status === "delivered") return <CheckCheck {...s} color="var(--text-muted)" />;
  if (status === "seen")      return <CheckCheck {...s} color="var(--accent)" />;
  if (status === "failed")    return <AlertCircle{...s} color="#ef4444" />;
  return null;
};

export default ReadReceipt;
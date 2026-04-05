import { useSocket } from "../context/SocketContext";

const useOnlineUsers = () => {
  const { onlineUsers, isUserOnline } = useSocket() || {};
  return { onlineUsers: onlineUsers || [], isUserOnline: isUserOnline || (() => false) };
};

export default useOnlineUsers;
import GroupLogo from "../assets/group.png";
import UserLogo from "../assets/dyp.png"; // default image for all individual users

const getChatName = (chat, authUserId) => {
  if (!chat || !chat.users || chat.users.length === 0) return "Unknown Chat";

  // Group chat
  if (chat.isGroupChat || chat.users.length > 2) {
    return chat.chatName || "Group Chat";
  }

  // One-to-one chat
  const otherUser = chat.users.find(user => user._id !== authUserId);
  return otherUser
    ? `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim()
    : "Unknown User";
};

export const getChatImage = (chat, authUserId) => {
  if (!chat || !chat.users || chat.users.length === 0) return UserLogo;

  // Group chat
  if (chat.isGroupChat || chat.users.length > 2) {
    return chat.chatImage || GroupLogo;
  }

  // One-to-one chat: always show default image
  return UserLogo;
};

export default getChatName;

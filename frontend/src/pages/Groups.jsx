import React, { useEffect, useState } from "react";
import { MdChat, MdGroups } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import UserSearch from "../components/chatComponents/UserSearch";
import MyChat from "../components/chatComponents/MyChat";
import MessageBox from "../components/messageComponents/MessageBox";
import ChatNotSelected from "../components/chatComponents/ChatNotSelected";
import GroupList from "../components/chatComponents/GroupsList"; 
import {
  setChatDetailsBox,
  setSocketConnected,
  setUserSearchBox,
} from "../redux/slices/conditionSlice";
import socket from "../socket/socket";
import { addAllMessages, addNewMessage } from "../redux/slices/messageSlice";
import {
  addNewChat,
  addNewMessageRecieved,
  deleteSelectedChat,
} from "../redux/slices/myChatSlice";
import { toast } from "react-toastify";
import { receivedSound } from "../utils/notificationSound";

let selectedChatCompare;

const Groups = () => {
  const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
  const dispatch = useDispatch();
  const isUserSearchBox = useSelector((store) => store?.condition?.isUserSearchBox);
  const authUserId = useSelector((store) => store?.auth?._id);

  const [isGroupSearchBox, setIsGroupSearchBox] = useState(false);

  useEffect(() => {
    if (!authUserId) return;
    socket.emit("setup", authUserId);
    socket.on("connected", () => dispatch(setSocketConnected(true)));
  }, [authUserId]);

  useEffect(() => {
    selectedChatCompare = selectedChat;
    const messageHandler = (newMessage) => {
      if (selectedChatCompare && selectedChatCompare._id === newMessage.chat._id) {
        dispatch(addNewMessage(newMessage));
      } else {
        receivedSound();
        dispatch(addNewMessageRecieved(newMessage));
      }
    };
    socket.on("message received", messageHandler);
    return () => socket.off("message received", messageHandler);
  }, [selectedChat]);

  useEffect(() => {
    const clearHandler = (chatId) => {
      if (chatId === selectedChat?._id) {
        dispatch(addAllMessages([]));
        toast.success("Cleared all messages");
      }
    };
    socket.on("clear chat", clearHandler);
    return () => socket.off("clear chat", clearHandler);
  }, [selectedChat]);

  useEffect(() => {
    const deleteHandler = (chatId) => {
      dispatch(setChatDetailsBox(false));
      if (selectedChat && chatId === selectedChat._id) dispatch(addAllMessages([]));
      dispatch(deleteSelectedChat(chatId));
      toast.success("Chat deleted successfully");
    };
    socket.on("delete chat", deleteHandler);
    return () => socket.off("delete chat", deleteHandler);
  }, [selectedChat]);

  useEffect(() => {
    const createdHandler = (chat) => {
      dispatch(addNewChat(chat));
      toast.success("Created & Selected chat");
    };
    socket.on("chat created", createdHandler);
    return () => socket.off("chat created", createdHandler);
  }, []);

  return (
    <div className="flex w-full border border-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* LEFT SIDE */}
      <div
        className={`${
          selectedChat && "hidden"
        } sm:block sm:w-[40%] w-full h-[80vh] bg-gray-900 text-gray-100 border-r border-gray-700 relative`}
      >
        <div className="p-4 h-full overflow-y-auto">
          {isUserSearchBox ? <UserSearch /> : isGroupSearchBox ? <GroupList /> : <MyChat />}
        </div>

        {/* Floating buttons */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-3">
          <button
            className="p-2 rounded-full bg-blue-600 text-white shadow hover:bg-blue-500 transition"
            onClick={() => {
              setIsGroupSearchBox(false);
              dispatch(setUserSearchBox());
            }}
            title="New Chat"
          >
            <MdChat size={24} />
          </button>
          <button
            className="p-2 rounded-full bg-blue-600 text-white shadow hover:bg-blue-500 transition"
            onClick={() => {
              dispatch(setUserSearchBox(false));
              setIsGroupSearchBox(true);
            }}
            title="Join Groups"
          >
            <MdGroups size={24} />
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        className={`${
          !selectedChat && "hidden"
        } sm:block sm:w-[60%] w-full h-[80vh] relative overflow-scroll bg-gradient-to-tr from-black via-blue-900 to-black text-gray-100`}
      >
        {selectedChat ? (
          <div className="h-full p-3">
            <MessageBox chatId={selectedChat?._id} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <ChatNotSelected />
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;

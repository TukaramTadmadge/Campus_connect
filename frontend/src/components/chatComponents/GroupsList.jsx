import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import socket from "../../socket/socket";

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const authUserId = useSelector((store) => store?.auth?._id);

  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/allgroups`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setGroups(data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGroups();
  }, []);

  const handleJoinGroup = async (chatId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/groupadd`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chatId, userId: authUserId }),
      });
      const json = await res.json();
      toast.success("Joined group successfully");
      socket.emit("group joined", json.data, authUserId);
    } catch (err) {
      console.error(err);
      toast.error("Failed to join group");
    }
  };

  return (
    <div className="flex flex-col w-full px-4 py-2 gap-2 overflow-y-auto h-[80vh]">
      {groups.length === 0 && <p className="text-white">No groups available</p>}
      {groups.map((group) => (
        <div
          key={group._id}
          className="flex justify-between items-center p-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition cursor-pointer"
        >
          <div>
            <h2 className="font-semibold">{group.chatName}</h2>
            <p className="text-xs">
              Members: {group.users.length} | Admin: {group.groupAdmin.firstName}
            </p>
          </div>
          {!group.users.some((u) => u._id === authUserId) && (
            <button
              className="bg-green-600 px-3 py-1 rounded hover:bg-green-500"
              onClick={() => handleJoinGroup(group._id)}
            >
              Join
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupList;

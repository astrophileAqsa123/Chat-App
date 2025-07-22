import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const RemoveMembersModal = ({ isOpen, onClose, group }) => {
  const { authUser } = useAuthStore();
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const res = await axiosInstance.get("/messages/users");

        const filtered = res.data.filter(
          (user) =>
            group.members.includes(user._id) && user._id !== authUser._id // exclude self
        );

        setMembers(filtered);
      } catch (err) {
        toast.error("Failed to load members");
      }
    };

    if (isOpen) {
      fetchGroupMembers();
      setSelectedMembers([]);
    }
  }, [isOpen, group, authUser]);

  const toggleSelect = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleRemove = async () => {
    if (selectedMembers.length === 0) {
      toast.error("Select at least one member to remove");
      return;
    }

    try {
      await Promise.all(
        selectedMembers.map((memberId) =>
          axiosInstance.put("/groups/remove-member", {
            groupId: group._id,
            memberId,
            adminId: authUser._id,
          })
        )
      );

      toast.success("Selected members removed");
      onClose();
      window.location.reload(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove members");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-zinc-900 text-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-white hover:text-red-400"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Remove Members</h2>

        <div className="max-h-60 overflow-y-auto space-y-2">
          {members.length === 0 && (
            <p className="text-sm text-zinc-400">No members to remove</p>
          )}

          {members.map((member) => (
            <label
              key={member._id}
              className="flex items-center justify-between px-3 py-2 bg-zinc-800 rounded cursor-pointer"
            >
              <span>{member.email}</span>
              <input
                type="checkbox"
                checked={selectedMembers.includes(member._id)}
                onChange={() => toggleSelect(member._id)}
              />
            </label>
          ))}
        </div>

        <button
          onClick={handleRemove}
          className="mt-4 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md"
        >
          Remove Selected
        </button>
      </div>
    </div>
  );
};

export default RemoveMembersModal;

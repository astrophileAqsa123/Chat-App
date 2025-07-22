import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { authUser } = useAuthStore();


  const admin=authUser;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axiosInstance.get("/messages/users");
        setUsers(res.data);
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    }

    if (isOpen) fetchUsers();
  }, [isOpen]);

  const handleToggleMember = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser?._id) return toast.error("User not authenticated");

    if (!groupName || selectedMembers.length === 0)
      return toast.error("Please enter group name and select members");

    const updatedMembers = [...new Set([...selectedMembers, authUser._id])];

    if (updatedMembers.length < 2) return toast.error("At least 2 members required");
    if (updatedMembers.length > 30) return toast.error("Max 30 members allowed");

    try {
      await axiosInstance.post("/groups/create", {
        name: groupName,
        members: updatedMembers,
        admin: admin
      });
      toast.success("Group created!");
      setGroupName("");
      setSelectedMembers([]);
      onClose(); // Close modal after success
        window.location.reload(); 
    } catch (err) {
      console.log(err);
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

        <h2 className="text-xl font-bold mb-4">Create New Group</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Group Name:</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <p className="mb-1 text-sm">You can add up to 30 members</p>
            <div className="max-h-40 overflow-y-auto border border-zinc-700 rounded-md p-2">
              {users.map((user) => (
                <label
                  key={user._id}
                  className="flex items-center text-sm space-x-2 py-1"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user._id)}
                    onChange={() => handleToggleMember(user._id)}
                  />
                  <span>{user.email}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-md"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;

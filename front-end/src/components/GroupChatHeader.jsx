// Make sure you have lucide-react installed: npm install lucide-react
import { MoreVertical } from "lucide-react";
import { useState} from "react";
import RemoveMembersModal from "./RemoveMembersModal.jsx";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { useRef, useEffect } from "react";


export default function GroupChatHeader() {
  const { authUser } = useAuthStore();
  const { selectedGroup, setSelectedGroup } = useChatStore();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const handleExitGroup = async () => {
    if (!selectedGroup || !authUser) return;

    const confirmExit = window.confirm("Are you sure you want to exit this group?");
    if (!confirmExit) return;

    try {
      await axiosInstance.put("/groups/exit", {
        groupId: selectedGroup._id,
        userId: authUser._id,
      });

      toast.success("You exited the group");
      setSelectedGroup(null);
      navigate("/");

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to exit group");
    }
          window.location.reload(); 
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!selectedGroup) return null;

  const memberCount = selectedGroup.members?.length || 0;

  return (
    <div className="px-4 sm:px-6 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-between">
      {/* Left: Group Info */}
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
          <span className="text-xl font-semibold">
            {selectedGroup.name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div>
          <h2 className="text-lg font-bold text-zinc-800 dark:text-white">
            {selectedGroup.name}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </p>
        </div>
      </div>

      {/* Right: Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800"
        >
          <MoreVertical className="text-zinc-800 dark:text-white" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 shadow-lg rounded-md py-1 z-50 border dark:border-zinc-700">
            <button
              onClick={handleExitGroup}
              className="w-full text-left px-4 py-2 text-sm hover:bg-red-100 dark:hover:bg-red-800 text-red-600 dark:text-red-400"
            >
              Exit Group
            </button>

            {selectedGroup.admin === authUser._id && (
              <button
                onClick={() => {
                  setShowRemoveModal(true);
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white"
              >
                Remove Members
              </button>
            )}
          </div>
        )}
      </div>

      <RemoveMembersModal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        group={selectedGroup}
      />
    </div>
  );
}

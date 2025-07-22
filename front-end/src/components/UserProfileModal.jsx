import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const UserProfileModal = ({ user, onClose }) => {
  const { getUserAbout } = useChatStore();
  const [about, setAbout] = useState("");

  useEffect(() => {
    if (user?._id) {
      const fetchAbout = async () => {
        const result = await getUserAbout(user._id);
        setAbout(result); // ✅ setting the returned string
      };
      fetchAbout();
    }
  }, [user]);

  return (
    <Dialog open={!!user} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="bg-base-100 p-6 rounded-xl z-50 w-96 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-200">
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center gap-4 text-center">
          <img
            src={user.profilePic || "/avatar.png"}
            alt={user.fullName}
            className="w-24 h-24 rounded-full object-cover border"
          />
          <h2 className="text-lg font-semibold">{user.fullName}</h2>
          <h4 className='text-sm' >{user.email}</h4>
          <p className="text-sm text-zinc-400">{about || "No status message yet."}</p> {/* ✅ uses `about` */}
        </div>
      </div>
    </Dialog>
  );
};

export default UserProfileModal;

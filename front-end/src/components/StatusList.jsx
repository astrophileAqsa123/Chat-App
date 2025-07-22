import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Heart } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const StatusList = () => {
  const { statuses, fetchStatuses } = useChatStore();
  const { authUser } = useAuthStore();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [localStatuses, setLocalStatuses] = useState([]);

  useEffect(() => {
    const loadStatuses = async () => {
      await fetchStatuses();
    };
    loadStatuses();
  }, [fetchStatuses]);

  useEffect(() => {
    setLocalStatuses(statuses);
  }, [statuses]);

  const toggleLike = async (statusId) => {
    try {
      const updated = await axiosInstance.put(`/status/${statusId}/like`);
      setLocalStatuses((prev) =>
        prev.map((s) =>
          s._id === statusId ? { ...s, likes: updated.data.likes } : s
        )
      );
    } catch (err) {
      console.error("Failed to like status", err);
    }
  };

  return (
    <div className="p-4 flex justify-center items-center min-h-screen">
      {selectedStatus ? (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-sm p-6 relative">
          <button
            onClick={() => setSelectedStatus(null)}
            className="absolute top-3 left-3 text-sm text-blue-500 hover:underline"
          >
            ← Back
          </button>

          <div className="flex flex-col items-center text-center space-y-4 mt-6">
            <img
              src={selectedStatus.user.profilePic || "/avatar1.png"}
              alt={selectedStatus.user.fullName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {selectedStatus.user.fullName}
            </h3>
            <p className="text-gray-700 dark:text-zinc-300">{selectedStatus.text}</p>

            <button
              onClick={() => toggleLike(selectedStatus._id)}
              className="flex items-center gap-1 mt-3 text-sm text-pink-500 hover:text-pink-600"
            >
              <Heart
                className={`w-5 h-5 ${
                  selectedStatus.likes?.includes(authUser._id)
                    ? "fill-pink-500"
                    : "fill-transparent"
                }`}
              />
              {selectedStatus.likes?.length || 0}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold text-center text-zinc-900 dark:text-white">
            Statuses
          </h2>

          {localStatuses.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-zinc-400 text-lg">
              No statuses yet. Be the first to post one!
            </p>
          ) : (
            <ul className="space-y-3">
              {localStatuses.map((status) => (
                <li
                  key={status._id}
                  className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded shadow transition"
                >
                  <div className="flex justify-between items-center">
                    <div
                      onClick={() => setSelectedStatus(status)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <img
                        src={status.user.profilePic || "/avatar1.png"}
                        alt={status.user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-zinc-800 dark:text-white">
                          {status.user.fullName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-zinc-400 truncate max-w-xs">
                          {status.text}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleLike(status._id)}
                      className="flex items-center gap-1 text-sm text-red-400 hover:text-pink-600"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          status.likes?.includes(authUser._id)
                            ? "fill-red-500"
                            : "fill-transparent"
                        }`}
                      />
                      {status.likes?.length || 0}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusList;

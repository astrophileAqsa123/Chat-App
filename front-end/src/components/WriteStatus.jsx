// components/WriteStatusModal.jsx
import React, { useState } from "react";
import {useChatStore} from "../store/useChatStore";
import { useModalStore } from "../store/useModalStore.js";

const WriteStatus = () => {
  const [text, setText] = useState("");
  const postTextStatus = useChatStore((state) => state.postTextStatus);
  const { isStatusModalOpen, closeStatusModal } = useModalStore();

  const handleSubmit = async () => {
    try {
      if (!text.trim()) return;
      await postTextStatus(text);
      setText("");
      closeStatusModal();
    } catch (err) {
      alert("Failed to post status.");
    }
  };

  if (!isStatusModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={closeStatusModal}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Write a Status</h2>

        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring"
          rows={4}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={closeStatusModal}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteStatus;

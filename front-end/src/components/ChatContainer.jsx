import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeleton/MessageSkeleton";

// Helper component to display message status icons
const MessageStatusIcon = ({ status }) => {
  switch (status) {
    case "sent":
      // Single checkmark for sent
      return <span className="text-gray-500">✓</span>;
    case "delivered":
      // Double checkmarks for delivered (e.g., blue for not read yet)
      return <span className="text-blue-500">✓✓</span>;
    case "read":
      // Double checkmarks for read (e.g., green for seen)
      return <span className="text-green-500">✓✓</span>;
    default:
      // No icon or a placeholder for unknown/initial states
      return null;
  }
};

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Effect to fetch messages and subscribe to real-time updates
  useEffect(() => {
    // Only fetch messages and subscribe if a user is selected
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    // Cleanup function to unsubscribe when the component unmounts or selectedUser changes
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]); // Dependencies

  // Effect to scroll to the latest message
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      // Scroll smoothly to the bottom of the messages list
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Dependency: messages array

  // Show a loading skeleton while messages are being fetched
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton /> {/* Placeholder for loading messages */}
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id} // Unique key for each message
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            {/* User avatar */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png" // Sender's profile pic
                      : selectedUser.profilePic || "/avatar.png" // Receiver's profile pic
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            {/* Message header with timestamp */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {/* Message bubble with text and/or image */}
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>

            {/* Message status icon (only for messages sent by the current user) */}
            {message.senderId === authUser._id && (
              <div className="text-xs text-right mt-1 pr-1 opacity-70">
                {/* Render the status icon based on message.status */}
                <MessageStatusIcon status={message.status} />
              </div>
            )}
          </div>
        ))}
        {/* Empty div to ensure scroll-to-bottom works reliably */}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;

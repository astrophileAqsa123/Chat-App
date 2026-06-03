import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { 
    selectedUser, 
    subscribeToMessages, 
    unsubscribeFromMessages,
    users,
    getUsers,
    setSelectedUser
  } = useChatStore();

  useEffect(() => {
    getUsers();
  }, []);

  // Auto-select first user once users are loaded
  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [users]);

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser]);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

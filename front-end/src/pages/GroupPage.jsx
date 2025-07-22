import React from 'react'
import ChatSidebar from "../components/ChatSidebar.jsx";
import GroupChatContainer from "../components/GroupChatContainer.jsx";
import GroupChatHeader from "../components/GroupChatHeader.jsx";

const GroupPage = () => {
  return (
     <div className="h-screen bg-base-200">
          <div className="flex items-center justify-center pt-20 px-4">
            <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
              <div className="flex h-full rounded-lg overflow-hidden">
                <ChatSidebar/>
    
                 <GroupChatContainer />
              </div>
            </div>
          </div>
        </div>
  )
}

export default GroupPage
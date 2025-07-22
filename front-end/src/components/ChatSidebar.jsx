import { useEffect,useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Users } from "lucide-react"; // Assuming you want a similar icon
import SidebarSkeleton from "./skeleton/SidebarSkeleton"; // Assuming you might want a loading state
import CreateGroupModal from "./CreateGroupModal.jsx";
export default function ChatSidebar() {
  const {
    groups,
    getGroups,
    setSelectedGroup,
    selectedGroup,
    unreadGroupMessages,
    isGroupsLoading, // Assuming you might add a loading state for groups
  } = useChatStore();
 const [showGroupModal, setShowGroupModal] = useState(false);

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  if (isGroupsLoading) return <SidebarSkeleton />; // Optional: Add a loading state like in Sidebar.jsx

  return (
    <aside className="relative h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Group Chats</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {groups.map((group) => (
          <button
            key={group._id}
            onClick={() => setSelectedGroup(group)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedGroup?._id === group._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              {/* You can use a generic group icon or a group-specific image */}
              <div className="size-12 rounded-full bg-base-300 flex items-center justify-center">
                <Users className="size-6 text-base-content" />
              </div>
            </div>

            {/* Group info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{group.name}</div>
              {/* You could add a member count or other info here */}
              <div className="text-sm text-zinc-400">
                {group.members.length} members
              </div>
            </div>

            {unreadGroupMessages[group._id] > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadGroupMessages[group._id]}
              </span>
            )}
          </button>
        ))}

        {groups.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No groups found</div>
        )}
      </div>
      <button
        onClick={() => setShowGroupModal(true)}
        className="fixed bottom-20 right-4 bg-orange-500 text-white rounded-full px-4 py-2 shadow-lg"
      >
        + Group
      </button>

      <CreateGroupModal isOpen={showGroupModal} onClose={() => setShowGroupModal(false)} />
       
    </aside>
  );
}
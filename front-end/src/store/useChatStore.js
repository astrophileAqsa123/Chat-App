import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { v4 as uuidv4 } from "uuid"; // Unique ID generator

export const useChatStore = create((set, get) => ({
  // Private chat state
  
  statuses: [],
  messages: [],
  users: [],
  selectedUser: null,
  unreadMessages: {},

  // Group chat state
  groups: [],
  selectedGroup: null,
  unreadGroupMessages: {},

  // Loading states
  isUsersLoading: false,
  isMessagesLoading: false,
  isGroupsLoading: false,
// Get "about" info of a user
getUserAbout: async (userId) => {
  try {
    const res = await axiosInstance.get(`/${userId}/about`);
    console.log(res.data.about);
    return res.data.about; // return or store in state if needed
  } catch (error) {
    console.error("Failed to fetch user about info:", error);
    toast.error("Could not fetch user info.");
    return "";
  }
},

// Update "about" info of the logged-in user
updateMyAbout: async (aboutText) => {
  try {
    const { authUser } = useAuthStore.getState();
    const res = await axiosInstance.put(
      `/${authUser._id}/about`,
      { about: aboutText },
      { withCredentials: true }
    );

    toast.success("About updated");
    return res.data.about;
  } catch (error) {
    console.error("Failed to update about:", error);
    toast.error("Could not update about.");
    return null;
  }
},

fetchStatuses: async () => {
    try {
      const res = await axiosInstance.get("/status/all", { withCredentials: true });
      console.log(res.data)
      set({ statuses: res.data });
    } catch (err) {
      console.error("Failed to fetch statuses:", err);
    }
  },
 postTextStatus: async (text) => {
    try {
      const res = await axiosInstance.post("/status/write", { text }, {
        withCredentials: true,
      });

      // Optional: update local state if you want
      set((state) => ({
        statuses: [...state.statuses, res.data],
      }));
toast.success("Status posted Successfully");
      return res.data;
    } catch (error) {
      console.error("Error posting status:", error);
      throw error;
    }
  },
   

  // Fetch private chat users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch private messages and mark as read
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    const { authUser, socket } = useAuthStore.getState();

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      const fetchedMessages = res.data;
      set({ messages: fetchedMessages });

      fetchedMessages.forEach((message) => {
        if (
          message.senderId === userId &&
          message.receiverId === authUser._id &&
          !message.seen
        ) {
          socket.emit("message:read", {
            messageId: message._id,
            senderId: message.senderId,
          });

          set((state) => ({
            messages: state.messages.map((msg) =>
              msg._id === message._id
                ? { ...msg, status: "read", seen: true }
                : msg
            ),
          }));
        }
      });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send private message
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempMessage = {
      _id: uuidv4(),
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      status: "sent",
      createdAt: new Date().toISOString(),
    };

    set({ messages: [...messages, tempMessage] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      const serverMessage = res.data;

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempMessage._id ? serverMessage : msg
        ),
      }));
    } catch (error) {
      toast.error(error.response.data.message);
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempMessage._id),
      }));
    }
  },

  // Fetch group list
  getGroups: async () => {
    set({ isGroupsLoading: true });
    const { authUser } = useAuthStore.getState();

    try {
      const res = await axiosInstance.get(`/groups/${authUser._id}`);
      set({ groups: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  // Fetch messages for a group
  getGroupMessages: async (groupId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/groupmsgs/${groupId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send a message to a group
  sendGroupMessage: async (groupId, messageData) => {
    const { messages } = get();
    try {
      const res = await axiosInstance.post(
        `/groupmsgs/send/${groupId}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Subscribe to real-time message events
  subscribeToMessages: () => {
    const { socket, authUser } = useAuthStore.getState();

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages, unreadMessages } = get();
      const isMessageForMe = newMessage.receiverId === authUser._id;
      const isActiveChat =
        selectedUser && newMessage.senderId === selectedUser._id;

      if (isMessageForMe) {
        socket.emit("message:delivered", {
          messageId: newMessage._id,
          senderId: newMessage.senderId,
        });
      }

      if (isMessageForMe && isActiveChat) {
        set({ messages: [...messages, newMessage] });

        setTimeout(() => {
          if (get().selectedUser?._id === newMessage.senderId) {
            socket.emit("message:read", {
              messageId: newMessage._id,
              senderId: newMessage.senderId,
            });
          }
        }, 1500);
      } else if (isMessageForMe) {
        const currentUnread = unreadMessages[newMessage.senderId] || 0;
        set({
          unreadMessages: {
            ...unreadMessages,
            [newMessage.senderId]: currentUnread + 1,
          },
        });
      }
    });

    socket.on("messageStatusUpdated", (data) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === data.messageId
            ? { ...msg, status: data.status, seen: data.status === "read" }
            : msg
        ),
      }));
    });

    socket.on("newGroupMessage", (newMessage) => {
      const { selectedGroup, messages, unreadGroupMessages } = get();
      const isActiveGroup =
        selectedGroup && newMessage.group === selectedGroup._id;

      if (isActiveGroup) {
        set({ messages: [...messages, newMessage] });
      } else {
        const currentUnread = unreadGroupMessages[newMessage.group] || 0;
        set({
          unreadGroupMessages: {
            ...unreadGroupMessages,
            [newMessage.group]: currentUnread + 1,
          },
        });
      }
    });
  },

  // Unsubscribe from all socket events
  unsubscribeFromMessages: () => {
    const { socket } = useAuthStore.getState();
    socket.off("newMessage");
    socket.off("newGroupMessage");
    socket.off("messageStatusUpdated");
  },

  // Select a user for private chat
  setSelectedUser: (selectedUser) => {
    const { unreadMessages } = get();
    const updatedUnread = { ...unreadMessages };
    if (updatedUnread[selectedUser._id]) {
      delete updatedUnread[selectedUser._id];
    }

    set({
      selectedUser,
      selectedGroup: null,
      unreadMessages: updatedUnread,
    });
  },

  // Select a group for group chat
  setSelectedGroup: (selectedGroup) => {
  const { unreadGroupMessages } = get();
  const updatedUnread = { ...unreadGroupMessages };

  if (updatedUnread[selectedGroup._id]) {
    delete updatedUnread[selectedGroup._id];
  }

  // ✅ Join group room via socket
  const socket = useAuthStore.getState().socket;
  socket.emit("joinGroup", selectedGroup._id);

  set({ selectedGroup, selectedUser: null, unreadGroupMessages: updatedUnread });
},


  // Clear all unread message indicators
  clearUnreadMessages: () => set({ unreadMessages: {}, unreadGroupMessages: {} }),
}));

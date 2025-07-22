import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    text: {
        type: String
    },
    image: {
        type: String
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        default: null,
    },
    sent: {
        type: Boolean,
        default: false,
    },
     status: {
      type: String,
      enum: ["sending", "sent", "delivered", "read"],
      default: "sent", // Default status when created on the server
    },
    seen: {
      type: Boolean,
      default: false,
    },
seenBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;

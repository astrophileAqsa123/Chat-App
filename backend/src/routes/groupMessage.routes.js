import express from 'express';
import Message from '../models/message.model.js';
import Group from '../models/group.model.js';
import {protectRoute} from "../middleware/auth.middleware.js"
import { getReceiverSocketId, io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";
const router = express.Router();

// // Send a message to a group
// router.post('/send/:groupId', async (req, res) => {
//     try {
//         const { groupId } = req.params;
//         const { senderId, text, image } = req.body;

//         // Optional: verify that group exists
//         const group = await Group.findById(groupId);
//         if (!group) return res.status(404).json({ message: 'Group not found' });

//          let imageUrl;
//             if (image) {
//               // Upload base64 image to cloudinary
//               const uploadResponse = await cloudinary.uploader.upload(image);
//               imageUrl = uploadResponse.secure_url;
//             }

//         const newMessage = new Message({
//             senderId,
//             group: groupId,
//             text,
//             image:imageUrl,
//             receiverId: null // <-- because this is group message
//         });

//         await newMessage.save();
//         res.status(201).json(newMessage);
//     } catch (err) {
//         res.status(500).json({ message: "Error sending group message", error: err.message });
//     }
// });
router.post('/send/:groupId', protectRoute, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: 'Message must have text or image' });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      group: groupId,
      text,
      image: imageUrl,
      receiverId: null
    });

    await newMessage.save();
await newMessage.populate('senderId', 'fullName profilePic'); 

    io.to(groupId).emit('newGroupMessage', newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending group message' });
  }
});









// Get all messages of a group
router.get('/:groupId', async (req, res) => {
    try {
        const messages = await Message.find({ group: req.params.groupId })
            .populate('senderId', 'fullName')  // populate sender name if needed
            .sort({ createdAt: 1 });  // oldest first
            console.log("Populated Message:", messages);

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Error fetching group messages", error: err.message });
    }
});

export default router;

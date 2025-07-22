import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";
const router=express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("contacts", "fullName email profilePic");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Add contact by email route

router.post('/add-by-email', protectRoute, async (req, res) => {
  const userId = req.user.id;  // comes from token
  const { email } = req.body;

  try {
    const contactUser = await User.findOne({ email });

    if (!contactUser) {
      return res.status(404).json({ message: 'User with this email not found' });
    }

    // Prevent adding self as contact
    if (contactUser._id.toString() === userId) {
      return res.status(400).json({ message: "You cannot add yourself as contact" });
    }

    const user = await User.findById(userId);

    if (user.contacts.includes(contactUser._id)) {
      return res.status(400).json({ message: "This user is already in your contacts" });
    }

    user.contacts.push(contactUser._id);
    await user.save();

    res.json({ message: "Contact added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




export default router;
import express from 'express';
import Group from '../models/group.model.js';
const router = express.Router();

// Create a new group
router.post('/create', async (req, res) => {
  try {
    const { name, members, admin } = req.body;
    if (!admin || !name || !Array.isArray(members)) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newGroup = new Group({ name, members, admin });
    await newGroup.save();

    res.status(201).json(newGroup);
  } catch (err) {
    res.status(500).json({ message: "Error creating group", error: err.message });
  }
});
router.put('/remove-member', async (req, res) => {
  try {
    const { groupId, memberId, adminId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== adminId) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    group.members = group.members.filter(id => id.toString() !== memberId);
    await group.save();

    res.json({ message: "Member removed", group });
  } catch (err) {
    res.status(500).json({ message: "Error removing member", error: err.message });
  }
});
router.put('/exit', async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.members.includes(userId)) {
      return res.status(400).json({ message: "User not in group" });
    }

    group.members = group.members.filter(id => id.toString() !== userId);

    // If user was admin, transfer to another member
    if (group.admin.toString() === userId) {
      if (group.members.length === 0) {
        await group.deleteOne(); // Delete group if empty
        return res.json({ message: "Group deleted, no members left" });
      }
      group.admin = group.members[0]; // Transfer admin to next member
    }

    await group.save();
    res.json({ message: "User exited group", group });
  } catch (err) {
    res.status(500).json({ message: "Error exiting group", error: err.message });
  }
});


// Get all groups for a user
router.get('/:userId', async (req, res) => {
    try {
        const groups = await Group.find({ members: req.params.userId });
        res.json(groups);
    } catch (err) {
        res.status(500).json({ message: "Error fetching groups", error: err.message });
    }
});

export default router;

// routes/status.routes.js
import express from "express";
import Status from "../models/status.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/status/write
router.post("/write", protectRoute, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const status = await Status.create({
      user: req.user._id,
      text,
    });

    res.status(201).json(status);
  } catch (err) {
    res.status(500).json({ message: "Failed to post status" });
  }
});
// routes/status.routes.js
router.get("/all", protectRoute, async (req, res) => {
  try {
    const statuses = await Status.find()
      .populate("user", "fullName profilePic") // return name & pic
      .sort({ createdAt: -1 }).lean();;
console.log(statuses);
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching statuses" });
  }
});
// PATCH /api/status/:id/like
// In routes/status.routes.js
router.put("/:id/like", protectRoute, async (req, res) => {
  try {
    const status = await Status.findById(req.params.id);
    if (!status) return res.status(404).json({ message: "Status not found" });

    const userId = req.user._id;
    const index = status.likes.indexOf(userId);

    if (index === -1) {
      status.likes.push(userId); // Like
    } else {
      status.likes.splice(index, 1); // Unlike
    }

    await status.save();
    res.json({ likes: status.likes });
  } catch (err) {
    res.status(500).json({ message: "Failed to update like" });
  }
});


export default router;

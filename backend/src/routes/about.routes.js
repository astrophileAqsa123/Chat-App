import express from "express";
import User from "../models/user.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/:id/about", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("about");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ about: user.about });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/:id/about — Update user's about section
router.put("/:id/about", protectRoute, async (req, res) => {
  try {
    const { about } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.about = about || user.about;
    await user.save();

    res.json({ message: "About updated", about: user.about });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
export default router;

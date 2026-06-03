import express from 'express'
const router=express.Router()
import {login,signup,logout,updateProfile,checkAuth} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)
router.get("/auth/user/:id", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("fullName email profilePic");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/update-profile",protectRoute,updateProfile)

router.get("/check",protectRoute,checkAuth);

export default router;

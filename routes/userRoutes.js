const express = require("express");
const router = express.Router();
const {
	registerUser,
	authUser,
	getUserProfile,
	logoutUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.post("/login", authUser);
router.post("/logout", logoutUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;

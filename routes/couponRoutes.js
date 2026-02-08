const express = require("express");
const router = express.Router();
const {
	getCoupons,
	createCoupon,
	deleteCoupon,
	validateCoupon,
} = require("../controllers/couponController");

const { protect, admin } = require("../middleware/authMiddleware");

// Validation is public
router.post("/validate", validateCoupon);

// Admin routes
router.route("/").get(protect, admin, getCoupons).post(protect, admin, createCoupon);
router.route("/:id").delete(protect, admin, deleteCoupon);

module.exports = router;

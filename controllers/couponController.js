const asyncHandler = require("express-async-handler");
const Coupon = require("../models/couponModel");

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
	const coupons = await Coupon.find({});
	res.json(coupons);
});

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
	const { code, discountType, discountValue, expiryDate, isActive } = req.body;

	const couponExists = await Coupon.findOne({ code });

	if (couponExists) {
		res.status(400);
		throw new Error("Coupon already exists");
	}

	const coupon = await Coupon.create({
		code,
		discountType,
		discountValue,
		expiryDate,
		isActive,
	});

	if (coupon) {
		res.status(201).json(coupon);
	} else {
		res.status(400);
		throw new Error("Invalid coupon data");
	}
});

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
	const coupon = await Coupon.findById(req.params.id);

	if (coupon) {
		await coupon.deleteOne();
		res.json({ message: "Coupon removed" });
	} else {
		res.status(404);
		throw new Error("Coupon not found");
	}
});

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = asyncHandler(async (req, res) => {
	const { code } = req.body;

	const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

	if (!coupon) {
		res.status(404);
		throw new Error("Invalid or inactive coupon code");
	}

	if (new Date(coupon.expiryDate) < new Date()) {
		res.status(400);
		throw new Error("Coupon has expired");
	}

	res.json({
		code: coupon.code,
		discountType: coupon.discountType,
		discountValue: coupon.discountValue,
	});
});

module.exports = {
	getCoupons,
	createCoupon,
	deleteCoupon,
	validateCoupon,
};

const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { protect, admin } = require("../middleware/authMiddleware");

const { createUser } = require("../controllers/userController");

// GET /api/admin/users - list users (admin only)
router
	.route("/users")
	.get(protect, admin, async (req, res) => {
		const users = await User.find({}).select("-password");
		res.json(users);
	})
	.post(protect, admin, createUser);

// GET /api/admin/stats - dashboard summary
router.get(
	"/stats",
	protect,
	admin,
	asyncHandler(async (req, res) => {
		const userCount = await User.countDocuments({});
		const productCount = await Product.countDocuments({});
		const orderCount = await Order.countDocuments({});
		const couponCount = await require("../models/couponModel").countDocuments({});

		const orders = await Order.find({});
		const totalRevenue = orders.reduce(
			(acc, order) => acc + order.totalPrice,
			0,
		);

		// Get sales for last 7 days
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const recentOrders = await Order.find({
			createdAt: { $gte: sevenDaysAgo },
		});

		// Group by date
		const salesData = [];
		for (let i = 6; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			const dateStr = date.toISOString().split("T")[0];

			const dayTotal = recentOrders
				.filter((o) => o.createdAt.toISOString().split("T")[0] === dateStr)
				.reduce((acc, o) => acc + o.totalPrice, 0);

			salesData.push({ date: dateStr, total: dayTotal });
		}

		res.json({
			userCount,
			productCount,
			orderCount,
			couponCount,
			totalRevenue,
			salesData,
		});
	}),
);

module.exports = router;

// Admin: get or update a user by id
router
	.route("/users/:id")
	.get(
		protect,
		admin,
		asyncHandler(async (req, res) => {
			const user = await User.findById(req.params.id).select("-password");
			if (user) res.json(user);
			else {
				res.status(404);
				throw new Error("User not found");
			}
		}),
	)
	.put(
		protect,
		admin,
		asyncHandler(async (req, res) => {
			const user = await User.findById(req.params.id);
			if (!user) {
				res.status(404);
				throw new Error("User not found");
			}

			const { name, email, isAdmin, password } = req.body;
			user.name = name ?? user.name;
			user.email = email ?? user.email;
			user.isAdmin = typeof isAdmin === "boolean" ? isAdmin : user.isAdmin;

			if (password) {
				const salt = await bcrypt.genSalt(10);
				user.password = await bcrypt.hash(password, salt);
			}

			const updated = await user.save();
			res.json({
				_id: updated._id,
				name: updated.name,
				email: updated.email,
				isAdmin: updated.isAdmin,
			});
		}),
	)
	.delete(
		protect,
		admin,
		asyncHandler(async (req, res) => {
			const user = await User.findById(req.params.id);
			if (!user) {
				res.status(404);
				throw new Error("User not found");
			}

			await user.deleteOne();
			res.json({ message: "User removed" });
		}),
	);

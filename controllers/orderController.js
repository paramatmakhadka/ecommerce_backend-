const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const addOrderItems = asyncHandler(async (req, res) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		totalPrice,
		couponCode,
		specialNote,
	} = req.body;

	if (orderItems && orderItems.length === 0) {
		res.status(400);
		throw new Error("No order items");
	} else {
		const order = new Order({
			orderItems,
			user: req.user ? req.user._id : null,
			shippingAddress,
			paymentMethod,
			totalPrice,
			couponCode,
			specialNote,
		});

		const createdOrder = await order.save();

		res.status(201).json(createdOrder);
	}
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({}).populate("user", "id name");
	res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
const getOrderById = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id).populate(
		"user",
		"name email",
	);

	if (order) {
		res.json(order);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);

	if (order) {
		order.status = req.body.status || order.status;
		if (req.body.isPaid !== undefined) {
			order.isPaid = req.body.isPaid;
		}
		if (req.body.status === "Delivered") {
			order.isDelivered = true;
			order.deliveredAt = Date.now();
			order.isPaid = true; // Auto-mark as paid on delivery for COD
		}

		const updatedOrder = await order.save();
		res.json(updatedOrder);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);

	if (order) {
		await order.deleteOne();
		res.json({ message: "Order removed" });
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

module.exports = {
	addOrderItems,
	getOrders,
	getOrderById,
	updateOrderStatus,
	deleteOrder,
};

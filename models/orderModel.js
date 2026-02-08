const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: false,
			ref: "User",
		},
		orderItems: [
			{
				name: { type: String, required: true },
				qty: { type: Number, required: true },
				image: { type: String, required: true },
				price: { type: Number, required: true },
				product: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: "Product",
				},
			},
		],
		shippingAddress: {
			name: { type: String, required: true },
			address: { type: String, required: true },
			city: { type: String, required: true },
			postalCode: { type: String, required: true },
			country: { type: String, required: true },
		},
		paymentMethod: {
			type: String,
			required: true,
			default: "Cash on Delivery",
		},
		totalPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		status: {
			type: String,
			required: true,
			enum: ["Pending", "Processed", "Dispatched", "Delivered", "Canceled", "Refunded"],
			default: "Pending",
		},
		isPaid: {
			type: Boolean,
			required: true,
			default: false,
		},
		isDelivered: {
			type: Boolean,
			required: true,
			default: false,
		},
		deliveredAt: {
			type: Date,
		},
		couponCode: {
			type: String,
		},
		specialNote: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
		},
		discountType: {
			type: String,
			required: true,
			enum: ["Percentage", "Amount"],
			default: "Percentage",
		},
		discountValue: {
			type: Number,
			required: true,
			default: 0,
		},
		expiryDate: {
			type: Date,
			required: true,
		},
		isActive: {
			type: Boolean,
			required: true,
			default: true,
		},
	},
	{
		timestamps: true,
	},
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;

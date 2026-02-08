const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
	{
		name: { type: String, required: true },
		image: { type: String },
		description: { type: String },
		brand: { type: String },
		category: { type: String },
		price: { type: Number, required: true, default: 0 },
		countInStock: { type: Number, required: true, default: 0 },
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);

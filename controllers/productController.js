const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

// @desc    Get products (category + keyword filter)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: "i",
				},
			}
		: {};

	const category = req.query.category
		? {
				category: {
					$regex: `^${req.query.category}$`,
					$options: "i",
				},
			}
		: {};

	const products = await Product.find({
		...keyword,
		...category,
	});

	res.json(products);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (!product) {
		res.status(404);
		throw new Error("Product not found");
	}

	res.json(product);
});

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
	const { name, price, description, image, brand, category, countInStock } =
		req.body;

	const product = new Product({
		name,
		price,
		description,
		image,
		brand,
		category,
		countInStock,
	});

	const createdProduct = await product.save();
	res.status(201).json(createdProduct);
});

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (!product) {
		res.status(404);
		throw new Error("Product not found");
	}

	product.name = req.body.name ?? product.name;
	product.price = req.body.price ?? product.price;
	product.description = req.body.description ?? product.description;
	product.image = req.body.image ?? product.image;
	product.brand = req.body.brand ?? product.brand;
	product.category = req.body.category ?? product.category;
	product.countInStock = req.body.countInStock ?? product.countInStock;

	const updatedProduct = await product.save();
	res.json(updatedProduct);
});

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (!product) {
		res.status(404);
		throw new Error("Product not found");
	}

	await product.deleteOne();
	res.json({ message: "Product removed" });
});

module.exports = {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
};

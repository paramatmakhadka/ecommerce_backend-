const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const startServer = async () => {
	const isConnected = await connectDB();
	if (!isConnected) {
		console.error("Stopping server due to DB connection failure.");
		process.exit(1);
	}

	const app = express();

	const allowedOrigins = [
		process.env.FRONTEND_URL,
		"http://localhost:3000",
		"http://localhost:5173",
		"https://ecommerce-kappa-blue-10.vercel.app",
		"https://ecommerce-kappa-blue-10.vercel.app/",
	].filter(Boolean);

	app.use(
		cors({
			origin: function (origin, callback) {
				// Allow requests with no origin (like mobile apps or curl requests)
				if (!origin) return callback(null, true);

				// Check if origin is in the allowed list
				const isAllowed = allowedOrigins.some((allowedOrigin) => {
					// Remove trailing slash for comparison
					const normalizedAllowed = allowedOrigin.replace(/\/$/, "");
					const normalizedOrigin = origin.replace(/\/$/, "");
					return normalizedAllowed === normalizedOrigin;
				});

				if (isAllowed) {
					callback(null, true);
				} else {
					console.log("Origin rejected by CORS:", origin);
					callback(new Error("Not allowed by CORS"));
				}
			},
			credentials: true,
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	);
	app.use(express.json());
	app.use(cookieParser());

	// Serve uploaded files
	app.use("/uploads", express.static(path.join(__dirname, "uploads")));

	const productRoutes = require("./routes/productRoutes");
	app.use("/api/products", productRoutes);

	const userRoutes = require("./routes/userRoutes");
	app.use("/api/users", userRoutes);

	const uploadRoutes = require("./routes/uploadRoutes");
	app.use("/api/upload", uploadRoutes);

	const adminRoutes = require("./routes/adminRoutes");
	app.use("/api/admin", adminRoutes);

	const categoryRoutes = require("./routes/categoryRoutes");
	app.use("/api/categories", categoryRoutes);

	const orderRoutes = require("./routes/orderRoutes");
	app.use("/api/orders", orderRoutes);

	const couponRoutes = require("./routes/couponRoutes");
	app.use("/api/coupons", couponRoutes);

	app.get("/", (req, res) => res.send("API is running"));

	// Error handling middleware
	app.use((err, req, res, next) => {
		console.error(err.stack);
		res.status(500).json({
			message: err.message,
			stack: process.env.NODE_ENV === "production" ? null : err.stack,
		});
	});

	const PORT = process.env.PORT || 5000;
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();

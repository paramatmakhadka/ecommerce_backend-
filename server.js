const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config({ path: path.join(__dirname, ".env") });

const startServer = async () => {
	// Connect DB first
	const isConnected = await connectDB();
	if (!isConnected) {
		console.error("Stopping server due to DB connection failure.");
		process.exit(1);
	}

	const app = express();

	// Required for Render / proxies
	app.set("trust proxy", 1);


	   //CORS CONFIGURATION (ORB SAFE)


	const allowedOrigins = [
		process.env.FRONTEND_URL,
		"http://localhost:3000",
		"http://localhost:5173",
		"https://ecommerce-kappa-blue-10.vercel.app",
	].filter(Boolean);

	app.use(
		cors({
			origin: (origin, callback) => {
				// Allow Postman, server-to-server, health checks
				if (!origin) return callback(null, true);

				if (allowedOrigins.includes(origin)) {
					return callback(null, true);
				}

				console.log("CORS blocked:", origin);
				return callback(new Error("Not allowed by CORS"));
			},
			credentials: true,
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
		})
	);

	// CRITICAL: handle preflight requests
	app.options("*", cors());

//middleware

	app.use(express.json());
	app.use(cookieParser());

	//uploads

	app.use("/uploads", express.static(path.join(__dirname, "uploads")));
	app.use("/images", express.static(path.join(__dirname, "uploads")));

//routes

	app.use("/api/products", require("./routes/productRoutes"));
	app.use("/api/users", require("./routes/userRoutes"));
	app.use("/api/upload", require("./routes/uploadRoutes"));
	app.use("/api/admin", require("./routes/adminRoutes"));
	app.use("/api/categories", require("./routes/categoryRoutes"));
	app.use("/api/orders", require("./routes/orderRoutes"));
	app.use("/api/coupons", require("./routes/couponRoutes"));

//health check
	app.get("/", (req, res) => {
		res.send("API is running");
	});

	app.get("/api/health", (req, res) => {
		res.json({ status: "ok", time: new Date() });
	});

//error handeling
	app.use((err, req, res, next) => {
		console.error(err.stack);
		res.status(500).json({
			message: err.message,
			stack: process.env.NODE_ENV === "production" ? null : err.stack,
		});
	});

	//run server

	const PORT = process.env.PORT || 5000;
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
};

startServer();

const jwt = require("jsonwebtoken");

// Protect routes middleware
const protect = (req, res, next) => {
	try {
		const token = req.cookies.jwt; // read from cookie

		if (!token) {
			return res.status(401).json({ message: "Not authorized, token missing" });
		}

		// Verify JWT
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // attach user info to request
		next();
	} catch (err) {
		console.error("JWT Error:", err.message);
		res.status(401).json({ message: "Not authorized, token invalid" });
	}
};

// For admin-only routes
const admin = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		res.status(403).json({ message: "Admin access only" });
	}
};

// Function to set JWT cookie (login route)
const setTokenCookie = (res, token) => {
	const isProd = process.env.NODE_ENV === "production";

	res.cookie("jwt", token, {
		httpOnly: true,             // JS cannot access
		secure: isProd,             // HTTPS only
		sameSite: isProd ? "none" : "lax", // cross-site safe
		partitioned: isProd,        // Chrome future-proof
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
};

module.exports = { protect, admin, setTokenCookie };

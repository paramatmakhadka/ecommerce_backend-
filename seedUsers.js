const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");

dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
};

const seedAdminUser = async () => {
	await connectDB();

	try {
		const email = "admin@example.com";
		const password = "admin123";

		const userExists = await User.findOne({ email });

		if (userExists) {
			console.log("Admin user already exists");
			process.exit();
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const adminUser = await User.create({
			name: "Admin User",
			email: email,
			password: hashedPassword,
			isAdmin: true,
		});

		if (adminUser) {
			console.log("Admin user created successfully!");
			console.log("Email: admin@example.com");
			console.log("Password: admin123");
		}

		process.exit();
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
};

seedAdminUser();

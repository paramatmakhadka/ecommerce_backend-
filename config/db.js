const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		console.log('Attempting to connect to MongoDB Atlas...');
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000, // Timeout after 5s
		});
		console.log(`MongoDB Connected: ${conn.connection.host}`);
		return true;
	} catch (error) {
		console.error(`MongoDB Connection Error: ${error.message}`);
		if (process.env.MONGO_URI) {
			const maskedURI = process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@');
			console.error(`Attempted URI: ${maskedURI}`);
		}
		// Log specific error codes for debugging
		if (error.name === 'MongooseServerSelectionError') {
			console.error('Possible causes: Network issue, IP not whitelisted, or MongoDB Atlas cluster is down.');
		}
		return false;
	}
};

module.exports = connectDB;

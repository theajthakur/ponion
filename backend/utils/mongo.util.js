const mongoose = require("mongoose");
const dns = require("dns");

// Set DNS servers to public resolvers to fix SRV lookup failures on Windows/Node.js
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
  }
};

module.exports = connectDB;

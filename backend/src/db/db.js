import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectDB = await mongoose.connect(process.env.MONGO_URL);

    console.log(`MongoDB Connected: ${connectDB.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection FAILED !!", error);
    process.exit(1);
  }
};

export default connectDB;

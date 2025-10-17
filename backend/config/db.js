import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is not defined");
      return;
    }

    console.log("🔄 Connecting to MongoDB...");
    console.log("🔗 URI:", process.env.MONGO_URI.substring(0, 20) + "...");
    
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("✅ MongoDB Connected:", mongoose.connection.host);
    console.log("📊 Database:", mongoose.connection.name);
    
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    // DON'T exit process in production - let server continue running
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

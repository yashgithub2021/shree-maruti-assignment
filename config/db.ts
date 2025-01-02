
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.set("strictPopulate", false);
        mongoose.set("strictQuery", false);
        const { connection } = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB Connected: ${connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
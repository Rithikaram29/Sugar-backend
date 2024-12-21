import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config({path: "../.env"})

const mongoUri = process.env.MONGO_URI


const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri);

        console.log("Connected to MongoDB!")
    } catch (error) {
        console.log(`Error connecting to MongoDb: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;
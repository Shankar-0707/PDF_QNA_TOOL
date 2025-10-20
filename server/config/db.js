import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB is Connected : ${conn.connection.host}`);
    }
    catch(error){
        console.error(`Error in MongoDB Connection : ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;
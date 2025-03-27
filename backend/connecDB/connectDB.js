import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);

        console.log(`Database connected successfully ${connectionInstance.connection.host}`)
    }
    catch (error) {
        console.log(`Error there was some issue while connecting to database ${error}`)
        process.exit(1)
    }
}

export default connectDB;
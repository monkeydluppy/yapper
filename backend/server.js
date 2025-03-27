// imports
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./connecDB/connectDB.js";
import userRouter from "./routes/user.routes.js";
import postRoute from "./routes/post.routes.js";
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';

// configs
dotenv.config();



connectDB();

// constants
const app = express();
const PORT = process.env.PORT || 3000;



// cloudnary config 
cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET,
})


// body parsers middleware


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// other middlewares
// cors
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Your frontend origin
    credentials: true, // Allow cookies to be sent and received
}));




// routes 

app.use("/api/users", userRouter)
app.use("/api/posts", postRoute)

// server
app.listen((PORT), () => {
    console.log(`server is running on port ${PORT}`)
})


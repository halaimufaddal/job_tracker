import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import jobRoutes from "./Routes/job.routes.js"
import cors from "cors";



dotenv.config();

const app=express();
const port= process.env.PORT || 5200;
const DB_URI=process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.use(express.json());

// Connecting to MongoDB using an async wrapper
const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("MongoDB Connected successfully");
    } catch (err) {
        console.log("MongoDB Connection Error:", err);
    }
};
connectDB();


// Job Routes 
app.use("/api/routes",jobRoutes);

app.listen(port,()=>{
    console.log(`App is running on ${port}`)
});
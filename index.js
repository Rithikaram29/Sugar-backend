import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./utils/connectDb.js";
import { generateOTP, verifyOtp } from "./authController.js";
import authenticateToken from "./authMiddleware.js";
import { getUserDetail, updateUser } from "./userController.js";
import cors from 'cors'


const port = process.env.PORT || 6000;

console.log(port)
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",  // Allow requests from this origin (your frontend)
  methods: ["GET", "POST", "PUT", "DELETE"],  // Allow these HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"],  // Allow these headers in requests
  credentials: true,  // Allow cookies or credentials if needed
};

app.use(cors(corsOptions)); 

connectDB();

app.post("/api/user/otp", generateOTP);
app.post("/api/user/verifyotp", verifyOtp);
app.get("/api/user/details",authenticateToken, getUserDetail);
app.put("/api/user/update",authenticateToken, updateUser )

app.listen(port, () => {
  console.log(`connected to ${port}`);
});


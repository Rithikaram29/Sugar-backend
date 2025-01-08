import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./utils/connectDb.js";
import { generateOTP, verifyOtp } from "./authController.js";
import authenticateToken from "./authMiddleware.js";
import { getUserDetail, updateUser } from "./userController.js";
import cors from 'cors'


const port = process.env.PORT

console.log(port)
app.use(express.json());

const corsOptions = {
  origin:(origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://sugar-cosmetics-replica.vercel.app",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },  // Allow requests from this origin (your frontend)
  methods: ["GET", "POST", "PUT", "DELETE"],  // Allow these HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"],  // Allow these headers in requests
  credentials: true,  // Allow cookies or credentials if needed
};

app.use(cors(corsOptions)); 

connectDB();

app.get("/health",(req,res)=>{
  res.send("Server OK!")
})
app.post("/api/user/otp", generateOTP);
app.post("/api/user/verifyotp", verifyOtp);
app.get("/api/user/details",authenticateToken, getUserDetail);
app.put("/api/user/update",authenticateToken, updateUser )

app.listen(port, () => {
  console.log(`connected to ${port}`);
});


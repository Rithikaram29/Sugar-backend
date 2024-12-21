import User from "./UserModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "./utils/jwtToken.js";

const generateOTP = async (req, res) => {
  try {
    const phoneNo = req.body.phoneNo;
    console.log(req.body)
    if (!phoneNo) {
      res.status(400).json({ error: "Phone number is required." });
      return;
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    //hashing otp
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    const payloadUser = {phoneNo: phoneNo, userName: "Sugar Fan"}
    const user = await User.findOne({ phoneNo });
    if (!user) {
      const newUser = await User.create(payloadUser);
      console.log(`new user created with phoneno: ${phoneNo}`);
    }

    const currentUser = await User.findOneAndUpdate(
      { phoneNo },
      { otp: hashedOTP }
    );
    if (!currentUser) {
      res.status(401).json({ error: "error while creating or updating user!" });
      return;
    }

    console.log(currentUser.userName)
    res.status(200).json({ currentUser, otp });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phoneNo, otp } = req.body;

    const user = await User.findOne({ phoneNo });
    if (!user) {
      res.status(404).json("User not found or created!");
      return;
    }

    const userOTP = user.otp;
    if (!userOTP) {
      res.status(400).json("Error while verifying OTP.");
      return;
    }

    const isCorrect = bcrypt.compare(otp, userOTP);
    if (!isCorrect) {
      res.status(401).json("OTP does not match!!");
      return;
    }

    const token = generateToken(user);

    res.status(201).json(token);
  } catch (error) {
    res.status(500).json(error.message);
  }
};



export {verifyOtp, generateOTP}

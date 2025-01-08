import dotenv from "dotenv";
dotenv.config({path: "./.env"});
import jwt from "jsonwebtoken";
// import secretkey from "./utils/secretKey.js";

const secretkey = process.env.SECRET_KEY
if (!secretkey) {
  throw new Error("Secret key is not set!");
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.header("authorization");
console.log(authHeader)
  if (!authHeader) {
    res
      .status(401)
      .json({ message: "Unauthorized: Missing or invalid token!" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if(!token){
    return res.status(401).json({ message: "Unauthorized: Missing token!" });
  }
  try {
    const user = jwt.verify(token, secretkey);

    if (!user || !user._id || !user.phone) {
      console.log("Invalid Token Payload:", user);
      res.status(403).json({ message: "Forbidden: Invalid payload structure" });
      return;
    }

    const useToken = jwt.verify(token, secretkey);
    console.log("Decoded Token:", useToken);

    req.user = useToken;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    if (err.name === "TokenExpiredError") {
      res.status(403).json({ message: "Forbidden: Token expired" });
      return
    } else {
      res.status(403).json({ message: "Forbidden: Invalid Token" });
      return
    }
  }
};

export default authenticateToken;

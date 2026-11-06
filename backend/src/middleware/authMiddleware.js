import jtw from "jsonwebtoken";
import User from "../models/userModels.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jtw;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }
    const decoded = jtw.verify(token, proceess.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unathorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protecrRoute middleware", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

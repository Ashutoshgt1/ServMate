import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// Import all 3 models
import Customer from "../models/customer.model.js";
import Provider from "../models/provider.model.js";
import Admin from "../models/admin.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    console.log(req.header("Authorization"))
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request: Token missing");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const { _id, role } = decodedToken;
    console.log(_id+""+role)

    if (!_id || !role) {
      throw new ApiError(401, "Invalid token payload");
    }

    let user;

    // Dynamically check correct model
    if (role === "customer") {
      user = await Customer.findById(_id).select("-password");
    } else if (role === "provider") {
      user = await Provider.findById(_id).select("-password");
    } else if (role === "admin") {
      user = await Admin.findById(_id).select("-password");
    } else {
      throw new ApiError(403, "Unknown role in token");
    }

    if (!user) {
      throw new ApiError(401, "User not found or unauthorized");
    }

    req.user = user;
    req.user.role = role; // Attach role for downstream use

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

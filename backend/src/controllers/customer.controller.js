import bcrypt from "bcryptjs";
import Customer from "../models/customer.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";


const generateAccessAndRefreshToken = async (customerId) => {
  try {
    const customer = await Customer.findById(customerId);
    
    if (!customer) {
      throw new ApiError(404, "Customer not found");
    }

    const accessToken = customer.generateAccessToken();
    const refreshToken = customer.generateRefreshToken();

    customer.refreshToken = refreshToken;
    await customer.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};  



const registerCustomer = asyncHandler(async (req, res) => {
  const { name, phone, email, password, addresses } = req.body;

  // Validation
  if (!name || !phone || !password) {
    throw new ApiError(400, "Name, phone, and password are required");
  }

  // Check if customer already exists
  const existingCustomer = await Customer.findOne({ phone });
  if (existingCustomer) {
    throw new ApiError(409, "Customer with this phone number already exists");
  }

  // Hash password
  
  // Create new customer
  const customer = await Customer.create({
    name,
    phone,
    email,
    password: password,
    addresses,
  });

  return res.status(201).json(
    new ApiResponse(201, {
      id: customer._id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      addresses:customer.addresses
    }, "Customer registered successfully")
  );
});


const loginCustomer = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  // 1. Validate input
  if (!phone || !password) {
    throw new ApiError(400, "Phone and password are required");
  }

  // 2. Find customer
  const customer = await Customer.findOne({ phone });

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  // 3. Validate password
  const isPasswordValid = await customer.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // 4. Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(customer._id);

  // 5. Set refresh token in HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // 6. Send response
  res.status(200).json(
    new ApiResponse(200, {
      accessToken,
      user: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        addresses:customer.addresses,
        role: "customer"
      }
    }, "Login successful")
  );
});


// ✅ CUSTOMER LOGOUT CONTROLLER
const logoutCustomer = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new ApiError(400, "No refresh token found");
  }

  const customer = await Customer.findOne({ refreshToken });
  if (!customer) {
    res.clearCookie("refreshToken");
    return res.status(200).json(new ApiResponse(200, {}, "Logged out"));
  }

  customer.refreshToken = "";
  await customer.save({ validateBeforeSave: false });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict"
  });

  res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});

export { registerCustomer , loginCustomer , logoutCustomer };

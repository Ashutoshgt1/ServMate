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
    addresses:addresses || null,
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


const getCustomerProfile = asyncHandler(async (req, res) => {
  const customer = req.user; // populated by verifyJWT middleware
  res.status(200).json(new ApiResponse(200, customer, "Customer profile fetched"));
});



const updateCustomerProfile = asyncHandler(async (req, res) => {
  const customer = req.user;

  const { name, phone, email } = req.body;

  if (name) customer.name = name;
  if (phone) customer.phone = phone;
  if (email) customer.email = email;

  await customer.save();

  res.status(200).json(
    new ApiResponse(200, {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    }, "Customer profile updated")
  );
});





const changeCustomerPassword = asyncHandler(async (req, res) => {
  const customer = req.user;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new passwords are required");
  }

  const isMatch = await customer.isPasswordCorrect(oldPassword);
  if (!isMatch) {
    throw new ApiError(401, "Old password is incorrect");
  }

  customer.password = newPassword;
  await customer.save();

  res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
});



const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find().select("-password -refreshToken");

  res.status(200).json(
    new ApiResponse(200, customers, "All customers fetched")
  );
});



const getCustomerById = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  const customer = await Customer.findById(customerId).select("-password -refreshToken");
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  res.status(200).json(new ApiResponse(200, customer, "Customer details fetched"));
});



const deleteCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  const customer = await Customer.findByIdAndDelete(customerId);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  res.status(200).json(new ApiResponse(200, {}, "Customer account deleted successfully"));
});


const updateCustomerAddress = asyncHandler(async (req, res) => {
  const { address } = req.body;

  if (!address) {
    throw new ApiError(400, "Address is required");
  }

  const customer = await Customer.findById(req.user._id);
  if (!customer) throw new ApiError(404, "Customer not found");

  customer.address = address;
  await customer.save();

  res.status(200).json(new ApiResponse(200, customer, "Address updated successfully"));
});


import Booking from "../models/booking.model.js";

const getCustomerBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ customer: req.user._id })
    .populate("provider", "name phone service")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, bookings, "Fetched customer bookings"));
});



export { registerCustomer ,
     loginCustomer , 
     logoutCustomer , 
     getCustomerProfile,
     updateCustomerProfile,
     changeCustomerPassword,
     getAllCustomers,
    getCustomerById,
    deleteCustomer,
    updateCustomerAddress };

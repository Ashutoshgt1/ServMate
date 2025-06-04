import Provider from "../models/provider.model.js";
import Service from "../models/service.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Generate tokens (reuse your existing logic)
const generateAccessAndRefreshToken = async (providerId) => {
  const provider = await Provider.findById(providerId);
  if (!provider) {
    throw new ApiError(404, "Provider not found");
  }

  const accessToken = provider.generateAccessToken();
  const refreshToken = provider.generateRefreshToken();

  provider.refreshToken = refreshToken;
  await provider.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerProvider = asyncHandler(async (req, res) => {
  const { name, phone, email, password, service: serviceId, location } = req.body;

  // Validation
  if (!name || !phone || !password || !serviceId) {
    throw new ApiError(400, "Name, phone, password, and service ID are required");
  }

  // Check if provider already exists
  const existingProvider = await Provider.findOne({ phone });
  if (existingProvider) {
    throw new ApiError(409, "Provider with this phone number already exists");
  }

  // Get the service to autofill baseSalary
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new ApiError(404, "Selected service not found");
  }

  const provider = await Provider.create({
    name,
    phone,
    email,
    password,
    service: serviceId,
    location,
    salaryDetails: {
      baseSalary: service.baseSalary,
      currentSalary: service.baseSalary
    }
  });

  res.status(201).json(
    new ApiResponse(201, {
      id: provider._id,
      name: provider.name,
      phone: provider.phone,
      email: provider.email,
      service: service.name,
      baseSalary: service.baseSalary
    }, "Provider registered successfully")
  );
});



// ✅ LOGIN CONTROLLER
const loginProvider = asyncHandler(async (req, res) => {
    console.log(req.body)
    console.log(req.headers)
  const {phone, password} = req.body;
  if (!phone || !password) {
    throw new ApiError(400, "Phone and password are required");
  }

  const provider = await Provider.findOne({ phone });
  if (!provider) throw new ApiError(404, "Provider not found");

  const isPasswordValid = await provider.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(provider._id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json(new ApiResponse(200, {
    accessToken,
    user: {
      _id: provider._id,
      name: provider.name,
      phone: provider.phone,
      email: provider.email,
      service: provider.service,
      role: "provider"
    }
  }, "Login successful"));
});

// ✅ LOGOUT CONTROLLER
const logoutProvider = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new ApiError(400, "No refresh token found");
  }

  const provider = await Provider.findOne({ refreshToken });
  if (!provider) {
    res.clearCookie("refreshToken");
    return res.status(200).json(new ApiResponse(200, {}, "Logged out"));
  }

  provider.refreshToken = "";
  await provider.save({ validateBeforeSave: false });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict"
  });

  res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});



export { registerProvider , loginProvider , logoutProvider};

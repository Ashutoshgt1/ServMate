import Service from "../models/service.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addService = asyncHandler(async (req, res) => {
  const { name, description, basePrice, baseSalary } = req.body;

  // Validation
  if (!name || !baseSalary) {
    throw new ApiError(400, "Service name and base salary are required");
  }

  // Check if service already exists (by name)
  const existingService = await Service.findOne({ name });
  if (existingService) {
    throw new ApiError(409, "Service with this name already exists");
  }

  const service = await Service.create({
    name,
    description,
    basePrice,
    baseSalary
  });

  return res.status(201).json(
    new ApiResponse(201, service, "Service added successfully")
  );
});

const getAllServices = asyncHandler(async (req, res) => {
  try {
    const services = await Service.find({}); // {} to get all documents
    // console.log(services)

    return res.status(200).json(
      new ApiResponse(200, services, "Services retrieved successfully")
    );
  } catch (error) {
    // asyncHandler will handle this, but explicit catch adds clarity
    throw error; 
  }
});

export { addService ,getAllServices };

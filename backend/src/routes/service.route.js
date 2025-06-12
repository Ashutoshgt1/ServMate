import express from "express";
import { addService, getAllServices } from "../controllers/service.controller.js";

const router = express.Router();

router.post("/add", addService); 

router.post("/get-services",getAllServices)// POST /api/v1/services/add

export default router;

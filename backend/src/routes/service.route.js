import express from "express";
import { addService } from "../controllers/service.controller.js";

const router = express.Router();

router.post("/add", addService);  // POST /api/v1/services/add

export default router;

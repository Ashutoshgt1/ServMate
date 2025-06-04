import express from "express";
import { loginProvider, logoutProvider, registerProvider } from "../controllers/provider.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/register").post(registerProvider) // POST /api/v1/services/add

router.route("/login").post(loginProvider)

router.route("/logout").post(verifyJWT,logoutProvider)

export default router;

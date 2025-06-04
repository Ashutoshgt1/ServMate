import express from "express";
import { loginCustomer, logoutCustomer, registerCustomer } from "../controllers/customer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerCustomer);


router.route('/login').post(loginCustomer)

router.route("/logout").post(verifyJWT,logoutCustomer)

export default router;

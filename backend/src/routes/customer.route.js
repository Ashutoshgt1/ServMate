import express from "express";
import { getCurrentCustomer, loginCustomer, logoutCustomer, registerCustomer } from "../controllers/customer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/register").post(registerCustomer);


router.route('/login').post(loginCustomer)

router.route("/logout").post(verifyJWT,logoutCustomer)

router.route("/get-customer").post(verifyJWT,getCurrentCustomer)

export default router;

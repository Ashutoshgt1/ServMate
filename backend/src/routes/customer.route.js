import express from "express";
import { loginCustomer, registerCustomer } from "../controllers/customer.controller.js";

const router = express.Router();

router.route("/register").post(registerCustomer);


router.route('/login').post(loginCustomer)

export default router;

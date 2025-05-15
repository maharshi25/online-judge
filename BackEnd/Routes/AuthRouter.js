import { Router } from "express";
import { signup, login } from "../Controllers/AuthController.js";
import {
  signupValidation,
  loginValidation,
} from "../Middlewares/AuthValidation.js";

const router = Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);

export default router;

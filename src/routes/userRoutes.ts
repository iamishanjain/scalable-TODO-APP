import express from "express";
import type { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/userController.js";
import { validateRequest, ValidationSource } from "../helpers/validator.js";
import { userLoginSchema, userRegisterSchema } from "../schema/userSchema.js";

const router: Router = express.Router();

router.post(
  "/login",
  validateRequest(userLoginSchema, ValidationSource.BODY),
  loginUser,
);
router.post(
  "/register",
  validateRequest(userRegisterSchema, ValidationSource.BODY),
  registerUser,
);
router.post("/logout", logoutUser);

export default router;

import express from "express";
import type { Router } from "express";
import {
  createTodo,
  getTodos,
  editTodo,
  deleteTodo,
} from "../controllers/todoContoller.js";
import { protect } from "../middlewares/authMiddleware.js";
const router: Router = express.Router();

router.route("/").post(protect, createTodo).get(protect, getTodos);
router.route("/:id").put(protect, editTodo).delete(protect, deleteTodo);

export default router;

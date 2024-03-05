import express from "express";
import { getUsersForSidebar } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(authenticate, getUsersForSidebar);

export default router;

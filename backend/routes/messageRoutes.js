import express from "express";
import { getMessage, sendMessage } from "../controllers/messageController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/:id").get(authenticate, getMessage);
router.route("/send/:id").post(authenticate, sendMessage);

export default router;

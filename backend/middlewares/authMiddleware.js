import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const authenticate = asyncHandler(async (req, res, next) => {
	const token = req.cookies.jwt;

	if (!token) {
		return res
			.status(401)
			.json({ error: "Unauthorized - No Token Provided." });
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	if (!decoded) {
		return res.status(401).json({ error: "Unauthorized - Invalid Token." });
	}

	const user = await User.findById(decoded.userId).select("-password");

	if (!user) {
		return res.status(404).json({ error: "User not found." });
	}

	req.user = user;

	next();
});

export { authenticate };

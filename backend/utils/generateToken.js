import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});

	res.cookie("jwt", token, {
		maxAge: 30 * 24 * 60 * 60 * 1000, // Millisecond
		httpOnly: true, // Prevent XSS attacks or cross-site scripting attacks
		sameSite: "strict", // Prevent CSRF attacks or cross-site request forgery attacks
		secure: process.env.NODE_ENV !== "development",
	});
};

export default generateTokenAndSetCookie;

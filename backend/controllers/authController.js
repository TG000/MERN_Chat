import asyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

const signup = asyncHandler(async (req, res) => {
	const {
		firstName,
		lastName,
		username,
		password,
		confirmPassword,
		phoneNumber,
		gender,
	} = req.body;

	if (password !== confirmPassword) {
		return res
			.status(400)
			.json({ error: "Password and confirm password don't match." });
	}

	const user = await User.findOne({ username });

	if (user) {
		return res.status(400).json({ error: "Username already exists." });
	}

	// Hashed password
	const salt = await bcryptjs.genSalt(10);
	const hashedPassword = await bcryptjs.hash(password, salt);

	const profilePic = `https://ui-avatars.com/api/?background=random&rounded=true&size=500&name=${firstName}+${lastName}`;

	const newUser = new User({
		name: { firstName, lastName },
		username,
		password: hashedPassword,
		phoneNumber,
		gender,
		profilePic,
	});

	if (newUser) {
		// Generate JWT token
		generateTokenAndSetCookie(newUser._id, res);
		await newUser.save();

		res.status(201).json({
			_id: newUser._id,
			fullName: newUser.fullName,
			username: newUser.username,
			profilePic: newUser.profilePic,
		});
	} else {
		res.status(400).json({ error: "Invalid user data." });
	}
});

const login = asyncHandler(async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });
	const isPasswordCorrect = await bcryptjs.compare(
		password,
		user?.password || ""
	);

	if (!user || !isPasswordCorrect) {
		return res.status(400).json({ error: "Invalid username or password." });
	}

	generateTokenAndSetCookie(user._id, res);

	res.status(201).json({
		_id: user._id,
		fullName: user.fullName,
		username: user.username,
		profilePic: user.profilePic,
	});
});

const logout = asyncHandler(async (req, res) => {
	res.cookie("jwt", "", { maxAge: 0 });
	res.status(200).json({ message: "Logged out successfully!" });
});

export { signup, login, logout };

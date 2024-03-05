import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			firstName: {
				type: String,
				required: true,
			},
			lastName: {
				type: String,
				required: true,
			},
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 6,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
			required: true,
			enum: ["male", "female"],
		},
		profilePic: {
			type: String,
			default: "",
		},
	},
	{
		virtuals: {
			fullName: {
				get() {
					return this.name.firstName + " " + this.name.lastName;
				},
			},
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

import asyncHandler from "express-async-handler";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

const getMessage = asyncHandler(async (req, res) => {
	const { id: userToChatId } = req.params;
	const senderId = req.user._id;

	const conversation = await Conversation.findOne({
		participants: { $all: [senderId, userToChatId] },
	}).populate("messages");

	if (!conversation) {
		return res.status(200).json([]);
	}

	const messages = conversation.messages;

	res.status(200).json(messages);
});

const sendMessage = asyncHandler(async (req, res) => {
	const { message } = req.body;
	const { id: receiverId } = req.params;
	const senderId = req.user._id;

	let conversation = await Conversation.findOne({
		participants: { $all: [senderId, receiverId] },
	});

	if (!conversation) {
		conversation = await Conversation.create({
			participants: [senderId, receiverId],
		});
	}

	const newMessage = new Message({
		senderId,
		receiverId,
		message,
	});

	if (newMessage) {
		conversation.messages.push(newMessage._id);
	}

	// await conversation.save();
	// await newMessage.save();

	await Promise.all([conversation.save(), newMessage.save()]);

	res.status(201).json(newMessage);
});

export { getMessage, sendMessage };

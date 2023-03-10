const express = require('express');
const Chat = require('../models/Chat');

const chatRouter = express.Router();

chatRouter.post('/', async (req, res) => {
    const { message } = req.body;

    const msg = new Chat({ message, date: new Date() });
    await msg.save();
    return res.status(201).json({ msg })
})


chatRouter.get('/', async (req, res) => {
    const chats = await Chat.find();
    return res.status(200).json({ chats });
})

module.exports = {
    chatRouter
}
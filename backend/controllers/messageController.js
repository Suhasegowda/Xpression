const Message = require('../models/Message');

// @desc    Create new message (Contact Us)
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
    const { name, email, message } = req.body;

    const newMessage = await Message.create({
        name,
        email,
        message
    });

    res.status(201).json(newMessage);
};

// @desc    Get all messages (Admin)
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
};

// @desc    Mark message as resolved
// @route   PUT /api/messages/:id/resolve
// @access  Private/Admin
const resolveMessage = async (req, res) => {
    const message = await Message.findById(req.params.id);

    if (message) {
        message.status = 'Resolved';
        await message.save();
        res.json(message);
    } else {
        res.status(404).json({ message: 'Message not found' });
    }
};

module.exports = {
    createMessage,
    getMessages,
    resolveMessage
};

const express = require('express');
const router = express.Router();
const {
    createMessage,
    getMessages,
    resolveMessage
} = require('../controllers/messageController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(createMessage)
    .get(protect, admin, getMessages);

router.route('/:id/resolve').put(protect, admin, resolveMessage);

module.exports = router;

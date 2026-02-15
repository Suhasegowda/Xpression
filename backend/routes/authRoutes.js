const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUsers,
    toggleBlockUser,
    deleteUser,
    getUserOrders
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id')
    .delete(protect, admin, deleteUser);
router.route('/users/:id/block')
    .put(protect, admin, toggleBlockUser);
router.route('/users/:id/orders').get(protect, admin, getUserOrders);

module.exports = router;

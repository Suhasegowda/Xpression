const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    updateOrderPaymentStatus,
    getOrderByTrackId,
    getMyOrders,
    getOrders
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id/payment-status').put(protect, admin, updateOrderPaymentStatus);
router.route('/track/:id').get(getOrderByTrackId);

module.exports = router;

const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// Helper for SMS (Future Implementation)
// const sendSMS = async (phone, message) => { ... }

const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    console.log("Received Order Request:", JSON.stringify(req.body, null, 2));

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        // 1. Validate Stock
        const Product = require('../models/Product');
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                console.error(`Product not found for ID: ${item.product}`);
                res.status(404);
                throw new Error(`Product not found: ${item.name}`);
            }

            // Find specific size variant
            const sizeVariant = product.sizes.find(s => s.size === item.size);
            if (!sizeVariant) {
                console.error(`Size ${item.size} not found for product ${product.name}. Available: ${JSON.stringify(product.sizes)}`);
                res.status(400);
                throw new Error(`Size ${item.size} not available for ${item.name}`);
            }

            if (sizeVariant.stock < item.quantity) {
                console.error(`Insufficient stock. Req: ${item.quantity}, Avail: ${sizeVariant.stock}`);
                res.status(400);
                throw new Error(`Insufficient stock for ${item.name} (Size: ${item.size})`);
            }
        }

        // 2. Create Order
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            totalPrice
        });

        const createdOrder = await order.save();

        // 3. Decrement Stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            const sizeVariant = product.sizes.find(s => s.size === item.size);

            if (sizeVariant) {
                sizeVariant.stock -= item.quantity;
                product.totalSold = (product.totalSold || 0) + item.quantity;
                await product.save();
            }
        }

        res.status(201).json(createdOrder);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status || order.status;

        if (req.body.status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    console.log("Admin getOrders called by:", req.user._id, req.user.role);
    try {
        const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 }); // Sort by newest
        console.log(`Found ${orders.length} orders`);
        res.json(orders);
    } catch (error) {
        console.error("getOrders Error:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// @desc    Update order payment status (Admin)
// @route   PUT /api/orders/:id/payment-status
// @access  Private/Admin
const updateOrderPaymentStatus = async (req, res) => {
    console.log(`[UpdatePayment] ID: ${req.params.id}, Body:`, req.body);
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = req.body.isPaid;
        order.paymentMethod = req.body.paymentMethod || order.paymentMethod;
        if (order.isPaid) {
            order.paidAt = Date.now();
        } else {
            order.paidAt = null;
        }

        const updatedOrder = await order.save();
        console.log(`[UpdatePayment] Success. New Status: isPaid=${updatedOrder.isPaid}`);
        res.json(updatedOrder);
    } else {
        console.log(`[UpdatePayment] Order not found`);
        res.status(404);
        throw new Error('Order not found');
    }
};


// @desc    Get order by ID for Tracking (Public)
// @route   GET /api/orders/track/:id
// @access  Public
const getOrderByTrackId = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.json({
                _id: order._id,
                status: order.status, // Ensure this matches schema field
                createdAt: order.createdAt,
                isDelivered: order.isDelivered,
                deliveredAt: order.deliveredAt,
                orderItems: order.orderItems, // Include items
                totalPrice: order.totalPrice, // Include price
                paymentMethod: order.paymentMethod
            });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Invalid Order ID' });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    updateOrderPaymentStatus,
    getOrderByTrackId,
    getMyOrders,
    getOrders
};

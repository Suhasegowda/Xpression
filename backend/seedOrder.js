const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');
const User = require('./models/User');

dotenv.config();

const seedOrder = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const user = await User.findOne({ email: 'admin@xpression.com' });
        if (!user) {
            console.log("Admin user not found, cannot seed order attached to admin.");
            process.exit(1);
        }

        const order = new Order({
            user: user._id,
            orderItems: [{
                name: "Test Item",
                quantity: 1,
                image: "http://example.com/img.jpg",
                price: 100,
                product: new mongoose.Types.ObjectId(), // Fake product ID
                size: "M"
            }],
            shippingAddress: {
                name: "Test User",
                address: "123 Test St",
                city: "Test City",
                postalCode: "12345",
                country: "India",
                phone: "1234567890",
                houseNo: "123",
                street: "Main St",
                state: "Test State"
            },
            paymentMethod: "COD",
            totalPrice: 100,
            isPaid: true,
            paidAt: Date.now(),
            isDelivered: false
        });

        const createdOrder = await order.save();
        console.log("Order Created:", createdOrder._id);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedOrder();

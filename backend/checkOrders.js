const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

const checkOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");
        const orders = await Order.find({});
        console.log(`Total Orders in DB: ${orders.length}`);
        if (orders.length > 0) {
            console.log("Last Order:", JSON.stringify(orders[orders.length - 1], null, 2));
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkOrders();

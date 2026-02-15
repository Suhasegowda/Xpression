const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    const totalSales = await Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Check low stock (stock < 5)
    // Checking all sizes in all products
    const lowStockProducts = await Product.find({
        'sizes.stock': { $lt: 5 }
    }).select('name sizes');

    // Monthly Sales Graph Data (Last 6 months)
    const monthlySales = await Order.aggregate([
        {
            $match: { isPaid: true }
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                totalSales: { $sum: "$totalPrice" }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    res.json({
        totalSales: totalSales[0] ? totalSales[0].total : 0,
        totalOrders,
        totalUsers,
        totalProducts,
        lowStockProducts,
        monthlySales
    });
};

module.exports = { getDashboardStats };

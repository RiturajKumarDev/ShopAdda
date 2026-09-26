const Order = require("../modules/Order");
const Product = require("../modules/Product");

const getDashboardStats = async (req, res) => {
    try {
        const vendorId = req.user._id;

        const orders = await Order.find({ vendorId }).populate('userId', 'fullName email');
        
        let totalRevenue = 0;
        let uniqueCustomers = new Set();
        orders.forEach(order => {
            totalRevenue += (order.price * (order.quantity || 1));
            
            if (order.userId && order.userId._id) {
                uniqueCustomers.add(order.userId._id.toString());
            } else if (order.userId) {
                uniqueCustomers.add(order.userId.toString());
            }
        });

        // 2. Total Products
        const totalProducts = await Product.countDocuments({ vendorId });

        // 3. Recent Orders
        const recentOrders = await Order.find({ vendorId })
            .populate('userId', 'fullName email')
            .sort({ orderDate: -1 })
            .limit(4);

        const stats = {
            totalRevenue,
            totalOrders: orders.length,
            totalProducts,
            totalCustomers: uniqueCustomers.size,
            recentOrders
        };

        res.status(200).json(stats);
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
};

module.exports = {
    getDashboardStats
};

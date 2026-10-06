const Order = require("../modules/Order");
const User = require("../modules/User");

exports.getAnalytics = async (req, res, next) => {
    try {
        // 1. Total Revenue (sum of all orders that are not cancelled)
        const revenueResult = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: { $multiply: ["$price", "$quantity"] } } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // 2. Active Users (Customers)
        const activeUsers = await User.countDocuments({ role: 'Customer' });

        // 3. Total Vendors
        const totalVendors = await User.countDocuments({ role: 'Vendor' });

        // 4. Pending Orders
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });

        // 5. Recent Vendors
        const recentVendors = await User.find({ role: 'Vendor' })
                                        .sort({ joinDate: -1 })
                                        .limit(5)
                                        .select('businessName fullName email approved joinDate')
                                        .lean();

        // 6. Monthly Revenue (for chart) - last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const monthlyRevenue = await Order.aggregate([
            { 
                $match: { 
                    status: { $ne: 'Cancelled' },
                    orderDate: { $gte: sixMonthsAgo } 
                } 
            },
            {
                $group: {
                    _id: { $month: "$orderDate" },
                    revenue: { $sum: { $multiply: ["$price", "$quantity"] } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Format for frontend
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const chartData = monthlyRevenue.map(item => ({
            label: monthNames[item._id - 1],
            value: item.revenue
        }));

        res.status(200).json({
            totalRevenue,
            activeUsers,
            totalVendors,
            pendingOrders,
            recentVendors,
            chartData
        });

    } catch (err) {
        console.error("Analytics Error:", err);
        res.status(500).json({ errors: "Failed to fetch analytics" });
    }
};

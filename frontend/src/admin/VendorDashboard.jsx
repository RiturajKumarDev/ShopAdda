import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { getUserFromServer } from '../services/authService';
import {
  FiHome, FiBox, FiShoppingBag, FiUsers, FiSettings,
  FiSearch, FiBell, FiMenu, FiTrendingUp, FiDollarSign, FiLogOut
} from 'react-icons/fi';
import './VendorDashboard.css';
import VendorProducts from './VendorProducts';
import VendorCustomers from './VendorCustomers';
import VendorOrders from './VendorOrders';
import { getVendorDashboardStats } from '../services/vendorService';

const VendorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [userData, setUserData] = useState({ fullName: '' });
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndStats = async () => {
      const userCookie = Cookies.get("userData");
      if (!userCookie) {
        navigate("/login");
        return;
      }
      try {
        const response = await getUserFromServer();
        if (response.ok) {
          const data = await response.json();
          setUserData(data);

          // Fetch stats if in Dashboard tab
          if (activeTab === 'Dashboard') {
            const statsRes = await getVendorDashboardStats();
            if (statsRes.ok) {
              const statsData = await statsRes.json();
              setDashboardStats(statsData);
            }
          }
        } else {
          Cookies.remove("userData");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user or stats data", error);
      }
    };
    fetchUserAndStats();
  }, [navigate, activeTab]);

  const handleLogout = () => {
    Cookies.remove("userData");
    Cookies.remove("accessToken");
    navigate("/login");
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="vendor-dashboard">
      {/* Sidebar */}
      <aside className={`vd-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="vd-sidebar-header">
          <h2>Vendor<span>Hub</span></h2>
        </div>
        <ul className="vd-sidebar-menu">
          <li className={activeTab === 'Dashboard' ? 'active' : ''} onClick={() => setActiveTab('Dashboard')} style={{ cursor: 'pointer' }}><FiHome /> <span>Dashboard</span></li>
          <li className={activeTab === 'Products' ? 'active' : ''} onClick={() => setActiveTab('Products')} style={{ cursor: 'pointer' }}><FiBox /> <span>Products</span></li>
          <li className={activeTab === 'Orders' ? 'active' : ''} onClick={() => setActiveTab('Orders')} style={{ cursor: 'pointer' }}><FiShoppingBag /> <span>Orders</span></li>
          <li className={activeTab === 'Customers' ? 'active' : ''} onClick={() => setActiveTab('Customers')} style={{ cursor: 'pointer' }}><FiUsers /> <span>Customers</span></li>
          <li onClick={handleLogout} className="vd-logout-btn"><FiLogOut /> <span>Logout</span></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="vd-main-content">
        {/* Topbar */}
        <header className="vd-topbar">
          <div className="vd-topbar-left">
            <button className="vd-menu-btn" onClick={toggleSidebar}>
              <FiMenu />
            </button>
            <div className="vd-search-bar">
              <FiSearch />
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          <div className="vd-topbar-right">
            <button className="vd-icon-btn">
              <FiBell />
              <span className="vd-badge">3</span>
            </button>
            <Link to="/vendor-profile" className="vd-profile" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 }}>
                {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'V'}
              </div>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>{userData.fullName || 'Vendor'}</span>
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="vd-dashboard-content">
          {activeTab === 'Dashboard' && (
            <>
              <div className="vd-welcome">
                <h1>Welcome back, {userData.fullName ? userData.fullName.split(' ')[0] : 'Vendor'}! 👋</h1>
                <p>Here's what's happening with your store today.</p>
              </div>

              {/* Stats Cards */}
              <div className="vd-stats-grid">
                <div className="vd-stat-card">
                  <div className="vd-stat-icon blue">
                    <FiDollarSign />
                  </div>
                  <div className="vd-stat-details">
                    <p>Total Revenue</p>
                    <h3>₹{dashboardStats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                    <span className="vd-trend positive"><FiTrendingUp /> +12.5%</span>
                  </div>
                </div>
                <div className="vd-stat-card">
                  <div className="vd-stat-icon purple">
                    <FiShoppingBag />
                  </div>
                  <div className="vd-stat-details">
                    <p>Total Orders</p>
                    <h3>{dashboardStats.totalOrders}</h3>
                    <span className="vd-trend positive"><FiTrendingUp /> +5.2%</span>
                  </div>
                </div>
                <div className="vd-stat-card">
                  <div className="vd-stat-icon orange">
                    <FiBox />
                  </div>
                  <div className="vd-stat-details">
                    <p>Total Products</p>
                    <h3>{dashboardStats.totalProducts}</h3>
                    <span className="vd-trend neutral">-</span>
                  </div>
                </div>
                <div className="vd-stat-card">
                  <div className="vd-stat-icon green">
                    <FiUsers />
                  </div>
                  <div className="vd-stat-details">
                    <p>Total Customers</p>
                    <h3>{dashboardStats.totalCustomers}</h3>
                    <span className="vd-trend positive"><FiTrendingUp /> +18.7%</span>
                  </div>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="vd-recent-orders">
                <div className="vd-section-header">
                  <h2>Recent Orders</h2>
                  <button className="vd-btn-outline">View All</button>
                </div>
                <div className="vd-table-responsive">
                  <table className="vd-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardStats.recentOrders.length > 0 ? (
                        dashboardStats.recentOrders.map(order => (
                          <tr key={order._id}>
                            <td>#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                            <td>{order.userId?.fullName || 'Guest User'}</td>
                            <td>{order.name}</td>
                            <td>{new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                            <td><span className={`vd-status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                            <td>₹{(order.price * (order.quantity || 1)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No recent orders found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'Products' && <VendorProducts />}
          {activeTab === 'Orders' && <VendorOrders />}
          {activeTab === 'Customers' && <VendorCustomers />}
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;

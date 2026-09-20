import React, { useState } from 'react';
import { 
  FiHome, FiBox, FiShoppingBag, FiUsers, FiSettings, 
  FiSearch, FiBell, FiMenu, FiTrendingUp, FiDollarSign 
} from 'react-icons/fi';
import './VendorDashboard.css';

const VendorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="vendor-dashboard">
      {/* Sidebar */}
      <aside className={`vd-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="vd-sidebar-header">
          <h2>Vendor<span>Hub</span></h2>
        </div>
        <ul className="vd-sidebar-menu">
          <li className="active"><FiHome /> <span>Dashboard</span></li>
          <li><FiBox /> <span>Products</span></li>
          <li><FiShoppingBag /> <span>Orders</span></li>
          <li><FiUsers /> <span>Customers</span></li>
          <li><FiSettings /> <span>Settings</span></li>
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
            <div className="vd-profile">
              <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
              <span>John Doe</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="vd-dashboard-content">
          <div className="vd-welcome">
            <h1>Welcome back, John! 👋</h1>
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
                <h3>$24,562</h3>
                <span className="vd-trend positive"><FiTrendingUp /> +12.5%</span>
              </div>
            </div>
            <div className="vd-stat-card">
              <div className="vd-stat-icon purple">
                <FiShoppingBag />
              </div>
              <div className="vd-stat-details">
                <p>Total Orders</p>
                <h3>1,245</h3>
                <span className="vd-trend positive"><FiTrendingUp /> +5.2%</span>
              </div>
            </div>
            <div className="vd-stat-card">
              <div className="vd-stat-icon orange">
                <FiBox />
              </div>
              <div className="vd-stat-details">
                <p>Total Products</p>
                <h3>342</h3>
                <span className="vd-trend neutral">-</span>
              </div>
            </div>
            <div className="vd-stat-card">
              <div className="vd-stat-icon green">
                <FiUsers />
              </div>
              <div className="vd-stat-details">
                <p>Total Customers</p>
                <h3>8,901</h3>
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
                  <tr>
                    <td>#ORD-7352</td>
                    <td>Alice Smith</td>
                    <td>Wireless Headphones</td>
                    <td>Oct 24, 2023</td>
                    <td><span className="vd-status completed">Completed</span></td>
                    <td>$129.00</td>
                  </tr>
                  <tr>
                    <td>#ORD-7351</td>
                    <td>Robert Johnson</td>
                    <td>Smart Watch Pro</td>
                    <td>Oct 24, 2023</td>
                    <td><span className="vd-status pending">Pending</span></td>
                    <td>$199.00</td>
                  </tr>
                  <tr>
                    <td>#ORD-7350</td>
                    <td>Emma Davis</td>
                    <td>Mechanical Keyboard</td>
                    <td>Oct 23, 2023</td>
                    <td><span className="vd-status processing">Processing</span></td>
                    <td>$89.50</td>
                  </tr>
                  <tr>
                    <td>#ORD-7349</td>
                    <td>Michael Wilson</td>
                    <td>Gaming Mouse</td>
                    <td>Oct 23, 2023</td>
                    <td><span className="vd-status completed">Completed</span></td>
                    <td>$59.99</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;

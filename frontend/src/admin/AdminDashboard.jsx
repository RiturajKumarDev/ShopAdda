import React, { useState, useEffect } from 'react';
import {
  FiHome, FiUsers, FiShoppingBag, FiBox,
  FiSettings, FiSearch, FiBell, FiMenu,
  FiTrendingUp, FiTrendingDown, FiDollarSign,
  FiActivity, FiChevronRight, FiUser
} from 'react-icons/fi';
import './AdminDashboard.css';
import AdminUsers from './AdminUsers';
import AdminVendors from './AdminVendors';
import AdminOrders from './AdminOrders';
import AdminProfile from './AdminProfile';
import { getDashboardAnalytics } from '../services/analyticsService';

const AdminDashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [activeTab, setActiveTab] = useState('Dashboard');

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const [analytics, setAnalytics] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const userDataStr = document.cookie.split('; ').find(row => row.startsWith('userData='));
    if (userDataStr) {
      try {
        const decodedStr = decodeURIComponent(userDataStr.split('=')[1]);
        const parsed = JSON.parse(decodedStr);
        if (parsed && parsed.user) {
          setAdminUser(parsed.user);
        }
      } catch (e) {
        console.error("Failed to parse user cookie", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getDashboardAnalytics();
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };
    fetchAnalytics();
  }, []);

  const chartData = analytics?.chartData || [];
  const maxRevenue = Math.max(...chartData.map(d => d.value), 1); // Avoid division by zero

  return (
    <div className="admin-layout">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${!isMobile && !sidebarOpen ? 'collapsed' : ''} ${isMobile && sidebarOpen ? 'mobile-open' : ''}`}>
        <div className="admin-logo">
          {sidebarOpen ? (
            <>Shop<span>Adda</span></>
          ) : (
            <span>SA</span>
          )}
        </div>
        <nav className="admin-nav">
          <a
            className={`admin-nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('Dashboard')}
          >
            <FiHome className="admin-nav-icon" />
            {(!isMobile && !sidebarOpen) ? null : <span>Dashboard</span>}
          </a>
          <a
            className={`admin-nav-item ${activeTab === 'Users' ? 'active' : ''}`}
            onClick={() => handleNavClick('Users')}
          >
            <FiUsers className="admin-nav-icon" />
            {(!isMobile && !sidebarOpen) ? null : <span>Users</span>}
          </a>
          <a
            className={`admin-nav-item ${activeTab === 'Vendors' ? 'active' : ''}`}
            onClick={() => handleNavClick('Vendors')}
          >
            <FiBox className="admin-nav-icon" />
            {(!isMobile && !sidebarOpen) ? null : <span>Vendors</span>}
          </a>
          <a
            className={`admin-nav-item ${activeTab === 'Orders' ? 'active' : ''}`}
            onClick={() => handleNavClick('Orders')}
          >
            <FiShoppingBag className="admin-nav-icon" />
            {(!isMobile && !sidebarOpen) ? null : <span>Orders</span>}
          </a>
          <a
            className={`admin-nav-item ${activeTab === 'Profile' ? 'active' : ''}`}
            onClick={() => handleNavClick('Profile')}
          >
            <FiUser className="admin-nav-icon" />
            {(!isMobile && !sidebarOpen) ? null : <span>Profile</span>}
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Background Glow Effects */}
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>

        {/* Topbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <FiMenu />
            </button>
            <div className="search-container">
              <FiSearch />
              <input type="text" placeholder="Search platform..." />
            </div>
          </div>
          <div className="topbar-right">
            <div className="admin-profile" onClick={() => handleNavClick('Profile')} title="Go to Profile">
              <div className="admin-avatar" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}>
                {adminUser?.fullName ? adminUser.fullName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="profile-info">
                <span className="profile-name" style={{ color: '#ffffff', fontWeight: 'bold' }}>
                  {adminUser?.fullName || 'Admin User'}
                </span>
                <span className="profile-role" style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
                  {adminUser?.role || 'Superadmin'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {activeTab === 'Dashboard' && (
            <>
              <div className="welcome-section">
                <h1 className="welcome-title">Platform <span>Overview</span></h1>
                <p className="welcome-subtitle">Real-time metrics and administration controls.</p>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrapper icon-purple">
                    <FiDollarSign />
                  </div>
                  <div className="stat-label">Total Revenue</div>
                  <div className="stat-value">₹{(analytics?.totalRevenue || 0).toLocaleString()}</div>
                  <div className="stat-trend trend-up">
                    <FiTrendingUp /> Real-time
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper icon-blue">
                    <FiUsers />
                  </div>
                  <div className="stat-label">Active Customers</div>
                  <div className="stat-value">{analytics?.activeUsers || 0}</div>
                  <div className="stat-trend trend-up">
                    <FiTrendingUp /> Platform wide
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper icon-emerald">
                    <FiBox />
                  </div>
                  <div className="stat-label">Total Vendors</div>
                  <div className="stat-value">{analytics?.totalVendors || 0}</div>
                  <div className="stat-trend trend-up">
                    <FiTrendingUp /> Sellers
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper icon-rose">
                    <FiShoppingBag />
                  </div>
                  <div className="stat-label">Pending Orders</div>
                  <div className="stat-value">{analytics?.pendingOrders || 0}</div>
                  <div className="stat-trend trend-down">
                    <FiTrendingDown /> Action Required
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="content-grid">
                {/* Revenue Chart Panel */}
                <div className="glass-panel">
                  <div className="panel-header">
                    <h2 className="panel-title">Revenue Analytics</h2>
                    <button className="panel-action">
                      <span className="action-text">View Full Report</span> <FiChevronRight />
                    </button>
                  </div>
                  <div className="mock-chart">
                    {chartData.map((data, index) => {
                      const heightPercent = Math.max((data.value / maxRevenue) * 100, 5); // min 5% height for visibility
                      return (
                        <div className="bar-wrapper" key={index} title={`₹${data.value.toLocaleString()}`}>
                          <div className="chart-bar" style={{ height: `${heightPercent}%` }}></div>
                          <span className="bar-label">{data.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Activity Panel */}
                <div className="glass-panel">
                  <div className="panel-header">
                    <h2 className="panel-title">Recent Vendors</h2>
                    <button className="panel-action">
                      <span className="action-text">See All</span> <FiChevronRight />
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="modern-table">
                    <thead>
                      <tr>
                        <th>Vendor</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics?.recentVendors?.map(vendor => (
                        <tr key={vendor._id}>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar" style={{ background: '#3b82f6' }}>
                                {vendor.businessName ? vendor.businessName.charAt(0).toUpperCase() : 'V'}
                              </div>
                              <div className="user-details">
                                <span className="user-name">{vendor.businessName || vendor.fullName || 'Unknown'}</span>
                                <span className="user-email">{vendor.email}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${vendor.approved ? 'status-success' : 'status-warning'}`}>
                              {vendor.approved ? 'Active' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {(!analytics?.recentVendors || analytics.recentVendors.length === 0) && (
                        <tr>
                          <td colSpan="2" style={{ textAlign: 'center', padding: '1rem', color: '#a1a1aa' }}>No recent vendors</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'Users' && <AdminUsers />}
          {activeTab === 'Vendors' && <AdminVendors />}
          {activeTab === 'Orders' && <AdminOrders />}
          {activeTab === 'Profile' && <AdminProfile initialUser={adminUser} />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

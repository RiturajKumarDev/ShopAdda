import React, { useState } from 'react';
import { 
  FiHome, FiUsers, FiShoppingBag, FiBox, 
  FiSettings, FiSearch, FiBell, FiMenu, 
  FiTrendingUp, FiTrendingDown, FiDollarSign,
  FiActivity, FiChevronRight
} from 'react-icons/fi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const mockChartData = [
    { label: 'Jan', height: '40%' },
    { label: 'Feb', height: '60%' },
    { label: 'Mar', height: '55%' },
    { label: 'Apr', height: '80%' },
    { label: 'May', height: '65%' },
    { label: 'Jun', height: '90%' },
    { label: 'Jul', height: '100%' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <div className="admin-logo">
          {sidebarOpen ? (
            <>Shop<span>Adda</span></>
          ) : (
            <span>SA</span>
          )}
        </div>
        <nav className="admin-nav">
          <a className="admin-nav-item active">
            <FiHome className="admin-nav-icon" />
            {sidebarOpen && <span>Dashboard</span>}
          </a>
          <a className="admin-nav-item">
            <FiUsers className="admin-nav-icon" />
            {sidebarOpen && <span>Users</span>}
          </a>
          <a className="admin-nav-item">
            <FiBox className="admin-nav-icon" />
            {sidebarOpen && <span>Vendors</span>}
          </a>
          <a className="admin-nav-item">
            <FiShoppingBag className="admin-nav-icon" />
            {sidebarOpen && <span>Orders</span>}
          </a>
          <a className="admin-nav-item">
            <FiActivity className="admin-nav-icon" />
            {sidebarOpen && <span>Analytics</span>}
          </a>
          <a className="admin-nav-item">
            <FiSettings className="admin-nav-icon" />
            {sidebarOpen && <span>Settings</span>}
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
            <div className="action-btn">
              <FiBell />
              <span className="badge"></span>
            </div>
            <div className="admin-profile">
              <img src="https://i.pravatar.cc/150?img=68" alt="Admin" />
              <div className="profile-info">
                <span className="profile-name">Admin User</span>
                <span className="profile-role">Superadmin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
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
              <div className="stat-value">$124,563.00</div>
              <div className="stat-trend trend-up">
                <FiTrendingUp /> +14.5%
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon-wrapper icon-blue">
                <FiUsers />
              </div>
              <div className="stat-label">Active Users</div>
              <div className="stat-value">45,231</div>
              <div className="stat-trend trend-up">
                <FiTrendingUp /> +8.2%
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon-wrapper icon-emerald">
                <FiBox />
              </div>
              <div className="stat-label">Total Vendors</div>
              <div className="stat-value">1,842</div>
              <div className="stat-trend trend-up">
                <FiTrendingUp /> +12.4%
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon-wrapper icon-rose">
                <FiShoppingBag />
              </div>
              <div className="stat-label">Pending Orders</div>
              <div className="stat-value">428</div>
              <div className="stat-trend trend-down">
                <FiTrendingDown /> -2.1%
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
                  View Full Report <FiChevronRight />
                </button>
              </div>
              <div className="mock-chart">
                {mockChartData.map((data, index) => (
                  <div className="bar-wrapper" key={index}>
                    <div className="chart-bar" style={{ height: data.height }}></div>
                    <span className="bar-label">{data.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Panel */}
            <div className="glass-panel">
              <div className="panel-header">
                <h2 className="panel-title">Recent Vendors</h2>
                <button className="panel-action">
                  See All <FiChevronRight />
                </button>
              </div>
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar" style={{ background: '#3b82f6' }}>TS</div>
                        <div className="user-details">
                          <span className="user-name">Tech Store</span>
                          <span className="user-email">tech@store.com</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge status-success">Active</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar" style={{ background: '#8b5cf6' }}>FA</div>
                        <div className="user-details">
                          <span className="user-name">Fashion Ave</span>
                          <span className="user-email">hello@fashion.com</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge status-warning">Pending</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar" style={{ background: '#10b981' }}>GO</div>
                        <div className="user-details">
                          <span className="user-name">Green Organics</span>
                          <span className="user-email">contact@green.org</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge status-success">Active</span>
                    </td>
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

export default AdminDashboard;

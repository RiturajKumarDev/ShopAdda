import React, { useState, useEffect } from 'react';
import { FiSearch, FiMoreVertical, FiEdit2, FiTrash2, FiUserCheck, FiUserX, FiMail, FiCalendar, FiDownload } from 'react-icons/fi';
import { getAllOrdersFromServer, updateOrderStatusToServer } from '../services/orderService';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrdersFromServer();
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (order._id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'status-active';
      case 'Pending': return 'status-pending';
      case 'Cancelled': return 'status-cancelled'; // Add this to CSS later if needed
      default: return 'status-pending';
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // NOTE: updateOrderStatusToServer currently uses verify_vendor, so this might fail 
      // if admin is not also a vendor. We will try it, but ideally backend needs a verify_admin equivalent for orders.
      const res = await updateOrderStatusToServer(orderId, newStatus);
      if (res.ok) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      } else {
        const data = await res.json();
        alert(data.errors || "Failed to update order status");
      }
    } catch (err) {
      alert("Error updating status");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Order ID", "Product", "Price", "Qty", "Status", "Date"];
    const rows = filteredOrders.map(o => [
      o._id,
      o.name || 'N/A',
      o.price || 0,
      o.quantity || 1,
      o.status || 'Pending',
      o.orderDate ? new Date(o.orderDate).toLocaleDateString() : 'N/A'
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-users-container">
      <div className="users-header-section">
        <div>
          <h2 className="users-title">Order Management</h2>
          <p className="users-subtitle">View and track all platform orders.</p>
        </div>
        <div className="users-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Product..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="role-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button className="export-btn" onClick={handleExportCSV}>
            <FiDownload />
            Export CSV
          </button>
        </div>
      </div>

      <div className="users-table-card glass-panel">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product Details</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Order Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <tr key={order._id}>
                      <td>
                        <div className="user-info-cell">
                          <div className="user-details">
                            <span className="user-name" style={{fontFamily: 'monospace'}}>{order._id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="user-details">
                          <span className="user-name">{order.name}</span>
                          <span className="user-email">Qty: {order.quantity}</span>
                        </div>
                      </td>
                      <td>
                        <span className="user-name" style={{fontWeight: 600}}>₹{order.price * order.quantity}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusColor(order.status)}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="date-cell">
                          <FiCalendar className="small-icon" />
                          {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <select 
                            className="role-filter" 
                            style={{padding: '4px 8px', fontSize: '11px'}}
                            value={order.status || 'Pending'} 
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <FiBox className="empty-icon" />
                      <p>No orders found matching your criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal is removed since status is directly editable from table dropdown */}
    </div>
  );
};

export default AdminOrders;

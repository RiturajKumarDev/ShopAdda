import React, { useState, useEffect } from 'react';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { getVendorOrdersFromServer, updateOrderStatusToServer } from '../services/orderService';
import './VendorOrders.css';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getVendorOrdersFromServer();
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatusToServer(orderId, newStatus);
      if (response.ok) {
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status", error);
      alert("Error updating status");
    }
  };

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.name && order.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <span className="vo-badge success"><FiCheckCircle /> {status}</span>;
      case 'processing':
        return <span className="vo-badge warning"><FiClock /> {status}</span>;
      case 'shipped':
        return <span className="vo-badge info"><FiTruck /> {status}</span>;
      default:
        return <span className="vo-badge default"><FiPackage /> {status || 'Pending'}</span>;
    }
  };

  return (
    <div className="vendor-orders">
      <div className="vo-header">
        <h2>Order Management</h2>
        <div className="vo-search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search orders by ID or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="vo-table-container">
        <table className="vo-table">
          <thead>
            <tr>
              <th>Order ID / Date</th>
              <th>Product Details</th>
              <th>Customer Address</th>
              <th>Amount / Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading orders...</td>
              </tr>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>
                    <div className="vo-id-date">
                      <strong>#{order._id.slice(-6).toUpperCase()}</strong>
                      <span>{new Date(order._id ? parseInt(order._id.substring(0, 8), 16) * 1000 : Date.now()).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>
                    <div className="vo-product-info">
                      <img src={order.images?.[0] || 'https://via.placeholder.com/40'} alt={order.name} />
                      <div>
                        <h4>{order.name}</h4>
                        <p>Qty: {order.quantity}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="vo-address">
                      <p><strong>{order.address?.fullName || 'Customer'}</strong></p>
                      <p>{order.address?.city || ''}, {order.address?.state || ''}</p>
                    </div>
                  </td>
                  <td>
                    <div className="vo-amount">
                      <strong>₹{order.price * (order.quantity || 1)}</strong>
                      <span>{order.paymentMethod || 'COD'}</span>
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(order.status)}
                  </td>
                  <td>
                    <select
                      className="vo-status-select"
                      value={order.status || 'Pending'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorOrders;

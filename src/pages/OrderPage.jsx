// OrderPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './OrderPage.css';
import { getOderListToServer } from '../services/orderService';

const OrderPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showTracking, setShowTracking] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Sample order data
    const [ordersData, setOrdersData] = useState([]);

    useEffect(() => {
        const user = JSON.parse(Cookies.get("userData") || null);
        if (user) {
            getOderListToServer(user._id)
                .then(async (response) => {
                    if (response.ok) {
                        const orderList = await response.json();
                        console.log(orderList);
                        setOrdersData(orderList);
                    }
                })
        } else
            navigate("/login");
    }, [])

    useEffect(() => {
        // Filter orders based on active tab and search
        let filtered = ordersData;

        if (activeTab !== 'all') {
            filtered = filtered.filter(order => order.status.toLowerCase() === activeTab.toLowerCase());
        }

        if (searchTerm) {
            filtered = filtered.filter(order =>
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setOrders(filtered);
    }, [activeTab, searchTerm, ordersData]);

    const handleCancelOrder = (orderId) => {
        if (!cancelReason) {
            alert('Please provide a reason for cancellation');
            return;
        }

        const updatedOrders = ordersData.map(order => {
            if (order.id === orderId) {
                return {
                    ...order,
                    orderStatus: 'Cancelled',
                    cancellationRequested: true,
                    cancelReason: cancelReason
                };
            }
            return order;
        });

        setOrdersData(updatedOrders);
        localStorage.setItem('shopadda_orders', JSON.stringify(updatedOrders));
        setShowCancelModal(false);
        setCancelReason('');
        alert('Order cancelled successfully! 🔄');
    };

    const handleReturnOrder = (orderId) => {
        if (!returnReason) {
            alert('Please provide a reason for return');
            return;
        }

        const updatedOrders = ordersData.map(order => {
            if (order.id === orderId) {
                return {
                    ...order,
                    orderStatus: 'Return Requested',
                    returnRequested: true,
                    returnReason: returnReason,
                    returnRequestDate: new Date().toISOString()
                };
            }
            return order;
        });

        setOrdersData(updatedOrders);
        localStorage.setItem('shopadda_orders', JSON.stringify(updatedOrders));
        setShowReturnModal(false);
        setReturnReason('');
        alert('Return request submitted successfully! 📦');
    };

    const handleReorder = (order) => {
        const newOrder = {
            ...order,
            id: `ORD${Date.now()}`,
            orderDate: new Date().toISOString().split('T')[0],
            orderStatus: 'Processing',
            trackingId: null,
            deliveredDate: null,
            cancellationRequested: false,
            returnRequested: false
        };

        const updatedOrders = [newOrder, ...ordersData];
        setOrdersData(updatedOrders);
        localStorage.setItem('shopadda_orders', JSON.stringify(updatedOrders));
        alert('Order placed again! 🎉');
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'Delivered': { class: 'delivered', icon: '✅' },
            'Shipped': { class: 'shipped', icon: '🚚' },
            'Processing': { class: 'processing', icon: '⚙️' },
            'Cancelled': { class: 'cancelled', icon: '❌' },
            'Return Requested': { class: 'return', icon: '🔄' }
        };
        const statusInfo = statusMap[status] || { class: 'processing', icon: '📦' };
        return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.icon} {status}</span>;
    };

    const getPaymentStatusBadge = (status) => {
        return status === 'Paid' ?
            <span className="payment-badge paid">✅ Paid</span> :
            <span className="payment-badge pending">⏳ Pending</span>;
    };

    const getOrderProgress = (status) => {
        const steps = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
        let currentStep = 0;

        switch (status) {
            case 'Processing': currentStep = 1; break;
            case 'Shipped': currentStep = 2; break;
            case 'Out for Delivery': currentStep = 3; break;
            case 'Delivered': currentStep = 4; break;
            default: currentStep = 0;
        }

        return (
            <div className="order-progress">
                {steps.map((step, index) => (
                    <div key={index} className={`progress-step ${index <= currentStep ? 'completed' : ''}`}>
                        <div className="progress-dot"></div>
                        <div className="progress-label">{step}</div>
                    </div>
                ))}
            </div>
        );
    };

    const getStats = () => {
        const totalOrders = ordersData.length;
        const deliveredOrders = ordersData.filter(o => o.orderStatus === 'Delivered').length;
        const cancelledOrders = ordersData.filter(o => o.orderStatus === 'Cancelled').length;
        const totalSpent = ordersData
            .filter(o => o.orderStatus !== 'Cancelled')
            .reduce((sum, o) => sum + o.totalAmount, 0);

        return { totalOrders, deliveredOrders, cancelledOrders, totalSpent };
    };

    const stats = getStats();

    return (
        <div className="order-page-container">
            <div className="order-page-wrapper">
                {/* Header */}
                <div className="order-header">
                    <div className="header-content">
                        <h1>
                            <span className="header-icon">📦</span>
                            My Orders
                        </h1>
                        <p>Track and manage all your orders</p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="order-filters">
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by order ID or product name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All Orders
                        </button>
                        <button
                            className={`filter-tab ${activeTab === 'processing' ? 'active' : ''}`}
                            onClick={() => setActiveTab('processing')}
                        >
                            Processing
                        </button>
                        <button
                            className={`filter-tab ${activeTab === 'shipped' ? 'active' : ''}`}
                            onClick={() => setActiveTab('shipped')}
                        >
                            Shipped
                        </button>
                        <button
                            className={`filter-tab ${activeTab === 'delivered' ? 'active' : ''}`}
                            onClick={() => setActiveTab('delivered')}
                        >
                            Delivered
                        </button>
                        <button
                            className={`filter-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
                            onClick={() => setActiveTab('cancelled')}
                        >
                            Cancelled
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                <div className="orders-list">
                    {orders.length === 0 ? (
                        <div className="no-orders">
                            <div className="empty-state">
                                <span className="empty-icon">📦</span>
                                <h3>No Orders Found</h3>
                                <p>You haven't placed any orders yet</p>
                                <button className="shop-now-btn">Start Shopping</button>
                            </div>
                        </div>
                    ) : (
                        orders.map((order, index) => (
                            <div className="order-card" key={order._id} style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="order-header-section">
                                    <div className="order-info">
                                        <div className="order-id">Order #{order._id}</div>
                                        <div className="order-date">Placed on {new Date(order.orderDate).toLocaleDateString()}</div>
                                    </div>
                                    <div className="order-amount">${order.price * order.quantity}</div>
                                </div>

                                <div className="order-items">
                                    <div className="order-item" key={order._id}>
                                        <img className="item-image" src={order.images[0]} alt="order.images" />
                                        <div className="item-details">
                                            <div className="item-name">{order.name}</div>
                                            <div className="item-price">${order.price} x {order.quantity}</div>
                                        </div>
                                        <div className="item-status">{getStatusBadge(order.status)}</div>
                                    </div>
                                </div>

                                <div className="order-footer">
                                    <div className="order-meta">
                                        <div className="meta-item">
                                            <span className="meta-label">Payment:</span>
                                            <span className="meta-value">{order.paymentMethod}</span>
                                            {getPaymentStatusBadge(order.paymentStatus)}
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Estimated Delivery:</span>
                                            <span className="meta-value">{
                                                new Date(
                                                    new Date(order.orderDate).setDate(
                                                        new Date(order.orderDate).getDate() + 7
                                                    )
                                                ).toLocaleDateString("en-IN")
                                            }</span>
                                        </div>
                                        {order.trackingId && (
                                            <div className="meta-item">
                                                <span className="meta-label">Tracking ID:</span>
                                                <span className="meta-value tracking-id">{order._id}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="order-actions">
                                        {order.orderStatus === 'Processing' && (
                                            <>
                                                <button
                                                    className="action-btn cancel-btn"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowCancelModal(true);
                                                    }}
                                                >
                                                    ❌ Cancel Order
                                                </button>
                                                <button className="action-btn track-btn">🚚 Track Order</button>
                                            </>
                                        )}

                                        {order.orderStatus === 'Shipped' && (
                                            <>
                                                <button className="action-btn track-btn">🚚 Track Order</button>
                                            </>
                                        )}

                                        {order.orderStatus === 'Delivered' && (
                                            <>
                                                <button
                                                    className="action-btn return-btn"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowReturnModal(true);
                                                    }}
                                                >
                                                    🔄 Return Order
                                                </button>
                                                <button
                                                    className="action-btn reorder-btn"
                                                    onClick={() => handleReorder(order)}
                                                >
                                                    🔁 Reorder
                                                </button>
                                                <button className="action-btn review-btn">⭐ Write Review</button>
                                            </>
                                        )}

                                        {order.orderStatus === 'Cancelled' && (
                                            <button className="action-btn reorder-btn" onClick={() => handleReorder(order)}>
                                                🔁 Reorder
                                            </button>
                                        )}

                                        <button
                                            className="action-btn details-btn"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>

                                {/* Order Progress for Active Orders */}
                                {(order.orderStatus === 'Processing' || order.orderStatus === 'Shipped') && (
                                    <div className="order-progress-section">
                                        {getOrderProgress(order.orderStatus)}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Order Details Modal */}
                {selectedOrder && !showCancelModal && !showReturnModal && (
                    <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Order Details #{selectedOrder.id}</h2>
                                <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
                            </div>

                            <div className="modal-body">
                                <div className="details-section">
                                    <h3>Order Information</h3>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Order Date:</span>
                                            <span>{new Date(selectedOrder.orderDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Order Status:</span>
                                            <span>{getStatusBadge(selectedOrder.orderStatus)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Payment Method:</span>
                                            <span>{selectedOrder.paymentMethod}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Payment Status:</span>
                                            <span>{getPaymentStatusBadge(selectedOrder.paymentStatus)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Total Amount:</span>
                                            <span className="total-amount">${selectedOrder.price * selectedOrder.quantity}</span>
                                        </div>
                                        {selectedOrder.trackingId && (
                                            <div className="detail-item">
                                                <span className="detail-label">Tracking ID:</span>
                                                <span>{selectedOrder.trackingId}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="details-section">
                                    <h3>Items Ordered</h3>
                                    <div className="items-list">
                                        <div className="detail-item-card" key={selectedOrder._id}>
                                            <img className="item-image" src={selectedOrder.images[0]} alt="selectedOrder.images" />
                                            <div className="item-info">
                                                <div className="item-name">{selectedOrder.name}</div>
                                                <div className="item-price">${selectedOrder.price} x {selectedOrder.quantity}</div>
                                                <div className="item-subtotal">Subtotal: ${selectedOrder.price * selectedOrder.quantity}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="details-section">
                                    <h3>Shipping Address</h3>
                                    <div className="address-details">
                                        <p><strong>{selectedOrder.address.fullName}</strong></p>
                                        <p>{selectedOrder.address.address}</p>
                                        <p>Phone: {selectedOrder.address.phone}</p>
                                    </div>
                                </div>

                                {selectedOrder.cancelReason && (
                                    <div className="details-section">
                                        <h3>Cancellation Reason</h3>
                                        <p className="cancel-reason">{selectedOrder.cancelReason}</p>
                                    </div>
                                )}

                                {selectedOrder.returnReason && (
                                    <div className="details-section">
                                        <h3>Return Reason</h3>
                                        <p className="return-reason">{selectedOrder.returnReason}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Cancel Order Modal */}
                {showCancelModal && selectedOrder && (
                    <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
                        <div className="modal-content cancel-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Cancel Order</h2>
                                <button className="modal-close" onClick={() => setShowCancelModal(false)}>✕</button>
                            </div>

                            <div className="modal-body">
                                <div className="warning-message">
                                    <span className="warning-icon">⚠️</span>
                                    <p>Are you sure you want to cancel this order?</p>
                                </div>

                                <div className="form-group">
                                    <label>Reason for cancellation *</label>
                                    <select
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a reason</option>
                                        <option value="Changed mind">Changed my mind</option>
                                        <option value="Found better price">Found better price elsewhere</option>
                                        <option value="Wrong product ordered">Wrong product ordered</option>
                                        <option value="Delivery time too long">Delivery time too long</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {cancelReason === 'Other' && (
                                    <div className="form-group">
                                        <label>Please specify</label>
                                        <textarea
                                            placeholder="Tell us why you want to cancel..."
                                            onChange={(e) => setCancelReason(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="modal-actions">
                                    <button className="cancel-btn" onClick={() => setShowCancelModal(false)}>No, Keep Order</button>
                                    <button className="confirm-cancel-btn" onClick={() => handleCancelOrder(selectedOrder.id)}>Yes, Cancel Order</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Return Order Modal */}
                {showReturnModal && selectedOrder && (
                    <div className="modal-overlay" onClick={() => setShowReturnModal(false)}>
                        <div className="modal-content return-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Return Order</h2>
                                <button className="modal-close" onClick={() => setShowReturnModal(false)}>✕</button>
                            </div>

                            <div className="modal-body">
                                <div className="info-message">
                                    <span className="info-icon">ℹ️</span>
                                    <p>You have 7 days from delivery to return this item.</p>
                                </div>

                                <div className="form-group">
                                    <label>Reason for return *</label>
                                    <select
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a reason</option>
                                        <option value="Defective product">Defective product</option>
                                        <option value="Wrong item sent">Wrong item sent</option>
                                        <option value="Size/ fit issue">Size/ fit issue</option>
                                        <option value="Quality issues">Quality issues</option>
                                        <option value="Not as described">Not as described</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Additional comments (Optional)</label>
                                    <textarea
                                        placeholder="Please provide more details..."
                                        rows="3"
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button className="cancel-btn" onClick={() => setShowReturnModal(false)}>Cancel</button>
                                    <button className="confirm-return-btn" onClick={() => handleReturnOrder(selectedOrder.id)}>Submit Return Request</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderPage;

// ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import './ProfilePage.css';
import { getUserFromServer } from '../services/authService';
import { getCartListToServer, remeveFromCartServer } from '../services/cartService';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: 'Alex Johnson',
        email: 'alex.johnson@shopadda.com',
        phone: '+91 98765 43210',
        dob: '1995-06-15',
        gender: 'Male',
        address: '123, Shopping Street, MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India',
        bio: 'Passionate shopper and tech enthusiast. Love finding great deals on ShopAdda!'
    });

    const [orders, setOrders] = useState([
        { id: 'ORD001', date: '2024-01-15', total: '$299', status: 'Delivered', items: 3, image: '📱' },
        { id: 'ORD002', date: '2024-01-20', total: '$149', status: 'Shipped', items: 2, image: '👕' },
        { id: 'ORD003', date: '2024-01-25', total: '$89', status: 'Processing', items: 1, image: '🎧' },
        { id: 'ORD004', date: '2024-01-28', total: '$599', status: 'Delivered', items: 4, image: '📺' }
    ]);

    const [cartlist, setCartlist] = useState([
        { _id: 1, name: 'iPhone 15 Pro', quantity: 1, price: '$999', discount: '23%', images: ['📱', '📱'], inStock: true },
        { _id: 2, name: 'Nike Air Max', quantity: 1, price: '$149', discount: '40%', images: ['👟', '👟'], inStock: true },
        { _id: 3, name: 'Smart Watch Ultra', quantity: 1, price: '$399', discount: '15%', images: ['⌚', '⌚'], inStock: false },
        { _id: 4, name: 'Designer Handbag', quantity: 1, price: '$299', discount: '50%', images: ['👜', '👜'], inStock: true }
    ]);

    const [addresses, setAddresses] = useState([
        { id: 1, type: 'Home', address: '123, Shopping Street, MG Road, Mumbai - 400001', isDefault: true },
        { id: 2, type: 'Office', address: 'Tech Park, 5th Floor, Andheri East, Mumbai - 400093', isDefault: false }
    ]);

    useEffect(() => {
        const user = JSON.parse(Cookies.get("userData") || null);
        if (user) {
            setProfileData(user);
            getCartListToServer(user._id)
                .then(async (response) => {
                    const carts = await response.json();
                    if (response.ok) {
                        const cartList = carts.map(cart => { return { ...cart.productId, quantity: cart.quantity, userId: user._id } });
                        setCartlist(cartList);
                    }
                });
        } else {
            navigate("/login");
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setIsEditing(false);
        alert('Profile updated successfully! 🎉');
    };

    const removeFromCartlist = async (_id) => {
        const response = remeveFromCartServer(profileData._id, _id);
        if (!response.ok)
            alert("Error! Item not remove form cart!!");
    };

    const moveToCart = (id) => {
        alert('Item moved to cart! 🛒');
    };

    return (
        <div className="profile-container">
            <div className="profile-wrapper">
                {/* Profile Header with Cover Image */}
                <div className="profile-header">
                    <div className="cover-image">
                        <div className="cover-overlay"></div>
                        <button className="change-cover-btn">Change Cover</button>
                    </div>

                    <div className="profile-info-wrapper">
                        <div className="avatar-section">
                            <div className="avatar">
                                <span className="avatar-emoji">👤</span>
                                <button className="edit-avatar-btn">📷</button>
                            </div>
                            <h2 className="profile-name">{profileData.fullName}</h2>
                            <p className="profile-email">{profileData.email}</p>
                            <div className="member-badge">
                                <span className="badge-icon">⭐</span>
                                Gold Member
                            </div>
                            <Link className="tab-btn" to="../AddressManagement">
                                <span className="tab-icon">📍</span>
                                Addresses
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('personal')}
                    >
                        <span className="tab-icon">👤</span>
                        Personal Info
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'cartlist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cartlist')}
                    >
                        <span className="tab-icon">❤️</span>
                        Cart
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <span className="tab-icon">⚙️</span>
                        Settings
                    </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {/* Personal Info Tab */}
                    {activeTab === 'personal' && (
                        <div className="personal-info-tab fade-in">
                            <div className="info-header">
                                <h3>Personal Information</h3>
                                {!isEditing ? (
                                    <button className="edit-btn" onClick={() => setIsEditing(true)}>
                                        ✏️ Edit Profile
                                    </button>
                                ) : (
                                    <div className="edit-actions">
                                        <button className="save-btn" onClick={handleSave}>💾 Save</button>
                                        <button className="cancel-btn" onClick={() => setIsEditing(false)}>❌ Cancel</button>
                                    </div>
                                )}
                            </div>

                            <div className="info-grid">
                                <div className="info-field">
                                    <label>Full Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={profileData.fullName}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        <p>{profileData.fullName}</p>
                                    )}
                                </div>

                                <div className="info-field">
                                    <label>Email Address</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        <p>{profileData.email}</p>
                                    )}
                                </div>

                                <div className="info-field">
                                    <label>Phone Number</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        <p>{profileData.phone}</p>
                                    )}
                                </div>

                                <div className="info-field">
                                    <label>Date of Birth</label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            name="dob"
                                            value={profileData.dob}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        <p>{profileData.dob}</p>
                                    )}
                                </div>

                                <div className="info-field">
                                    <label>Gender</label>
                                    {isEditing ? (
                                        <select
                                            name="gender"
                                            value={profileData.gender}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    ) : (
                                        <p>{profileData.gender}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Wishlist Tab */}
                    {activeTab === 'cartlist' && (
                        <div className="wishlist-tab fade-in">
                            <div className="wishlist-header">
                                <h3>My Cart ({cartlist.length})</h3>
                                <Link to='../OrderProductPage' state={{ products: cartlist }}>
                                    <button className="move-all-btn">Order All</button>
                                </Link>
                            </div>

                            <div className="wishlist-grid">
                                {cartlist.map(item => item._id ? (
                                    <div className="wishlist-item" key={item._id}>
                                        <img className="item-image" src={item.images.at(0)} alt="item-image" />
                                        <div className="item-details">
                                            <h4>{item.name}</h4>
                                            <div className="item-price">
                                                <span className="current-price">{item.price}</span>
                                                <span className="discount">{item.discount} OFF</span>
                                            </div>
                                            <div className="stock-status">
                                                {item.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                                            </div>
                                        </div>
                                        <div className="item-actions">
                                            <Link to='../productPage' className="move-to-cart" state={{ product: item }} >View Details</Link>
                                            <Link to='../OrderProductPage' state={{ products: [item] }}>
                                                <button className="move-to-cart" >Order Now</button>
                                            </Link>
                                            <button
                                                className="remove-item"
                                                onClick={() => removeFromCartlist(item._id)}
                                            >
                                                ❌ Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : "")}
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="settings-tab fade-in">
                            <div className="settings-section">
                                <h3>Account Settings</h3>
                                <div className="setting-item">
                                    <div className="setting-info">
                                        <span className="setting-icon">🔔</span>
                                        <div>
                                            <h4>Email Notifications</h4>
                                            <p>Receive order updates and promotional emails</p>
                                        </div>
                                    </div>
                                    <label className="toggle-switch">
                                        <input type="checkbox" defaultChecked />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="setting-item">
                                    <div className="setting-info">
                                        <span className="setting-icon">📱</span>
                                        <div>
                                            <h4>SMS Alerts</h4>
                                            <p>Get SMS notifications for order status</p>
                                        </div>
                                    </div>
                                    <label className="toggle-switch">
                                        <input type="checkbox" defaultChecked />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="setting-item">
                                    <div className="setting-info">
                                        <span className="setting-icon">🔒</span>
                                        <div>
                                            <h4>Two-Factor Authentication</h4>
                                            <p>Add an extra layer of security</p>
                                        </div>
                                    </div>
                                    <label className="toggle-switch">
                                        <input type="checkbox" />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="settings-section">
                                <h3>Privacy & Security</h3>
                                <button className="settings-btn">Change Password</button>
                                <button className="settings-btn danger">Delete Account</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
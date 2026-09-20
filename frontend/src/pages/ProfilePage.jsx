// ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import './ProfilePage.css';
import { getUserFromServer, updateUserToServer, changePasswordToServer } from '../services/authService';
import { getCartListToServer, remeveFromCartServer } from '../services/cartService';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiCamera, FiStar, FiMapPin, FiHeart, FiSettings, FiEdit2, FiSave, FiX, FiCheckCircle, FiXCircle, FiBell, FiSmartphone, FiLock } from 'react-icons/fi';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [profileData, setProfileData] = useState({
        fullName: 'Alex Johnson',
        email: 'alex.johnson@shopadda.com',
        mobile: '+91 98765 43210',
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
        { id: 'ORD001', date: '2024-01-15', total: '₹299', status: 'Delivered', items: 3, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80' },
        { id: 'ORD002', date: '2024-01-20', total: '₹149', status: 'Shipped', items: 2, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
        { id: 'ORD003', date: '2024-01-25', total: '₹89', status: 'Processing', items: 1, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80' },
        { id: 'ORD004', date: '2024-01-28', total: '₹599', status: 'Delivered', items: 4, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80' }
    ]);

    const [cartlist, setCartlist] = useState([
        { _id: 1, name: 'iPhone 15 Pro', quantity: 1, price: '₹999', discount: '23%', images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80'], inStock: true },
        { _id: 2, name: 'Nike Air Max', quantity: 1, price: '₹149', discount: '40%', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80'], inStock: true },
        { _id: 3, name: 'Smart Watch Ultra', quantity: 1, price: '₹399', discount: '15%', images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80'], inStock: false },
        { _id: 4, name: 'Designer Handbag', quantity: 1, price: '₹299', discount: '50%', images: ['https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&q=80'], inStock: true }
    ]);

    const [addresses, setAddresses] = useState([
        { id: 1, type: 'Home', address: '123, Shopping Street, MG Road, Mumbai - 400001', isDefault: true },
        { id: 2, type: 'Office', address: 'Tech Park, 5th Floor, Andheri East, Mumbai - 400093', isDefault: false }
    ]);

    useEffect(() => {
        const userCookie = JSON.parse(Cookies.get("userData") || null);
        if (userCookie && userCookie.access_token) {
            getUserFromServer()
                .then(async (response) => {
                    if (response.ok) {
                        const userData = await response.json();
                        if (userData.dob) userData.dob = userData.dob.split('T')[0]; // Format Date if needed
                        setProfileData(userData);
                    } else {
                        Cookies.remove("userData");
                        navigate("/login");
                    }
                })
                .catch(() => navigate("/login"));

            getCartListToServer()
                .then(async (response) => {
                    const carts = await response.json();
                    if (response.ok) {
                        const cartList = carts.map(cart => { return { ...(cart.productId || {}), quantity: cart.quantity || 1 } });
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

    const handleSave = async () => {
        setIsEditing(false);
        try {
            const response = await updateUserToServer(profileData);
            if (response.ok) {
                const result = await response.json();
                setProfileData(result.user);
                alert('Profile updated successfully! 🎉');
            } else {
                const errorData = await response.json();
                const errorMsg = errorData.errors ? errorData.errors.join(", ") : 'Please try again.';
                alert(`Update failed: ${errorMsg}`);
            }
        } catch (error) {
            alert('An error occurred while updating the profile.');
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setPasswordError("New passwords do not match");
        }

        try {
            const response = await changePasswordToServer(passwordData);
            const data = await response.json();

            if (response.ok) {
                alert("Password changed successfully! 🎉");
                setShowPasswordModal(false);
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setPasswordError(data.errors ? data.errors[0] : "Failed to change password");
            }
        } catch (error) {
            setPasswordError("An error occurred. Please try again.");
        }
    };

    const removeFromCartlist = async (_id) => {
        try {
            const response = await remeveFromCartServer(_id);
            if (!response.ok) {
                let errorMessage = "Error! Item not remove form cart!!";
                try {
                    const data = await response.json();
                    errorMessage = data.errors || errorMessage;
                } catch (e) {}
                alert(errorMessage);
            } else {
                setCartlist(prev => prev.filter(item => item._id !== _id));
            }
        } catch (error) {
            alert("Error! Item not remove form cart!!");
        }
    };

    const moveToCart = (id) => {
        alert('Item moved to cart! 🛒');
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            Cookies.remove("userData");
            navigate("/login");
        }
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
                            <div className="profile-avatar-circle">
                                <span className="avatar-emoji"><FiUser /></span>
                                <button className="edit-avatar-btn"><FiCamera /></button>
                            </div>
                            <h2 className="profile-name">{profileData.fullName}</h2>
                            <p className="profile-email">{profileData.email}</p>
                            <div className="member-badge">
                                <span className="badge-icon"><FiStar /></span>
                                {profileData.role || 'Member'}
                            </div>
                            <Link className="profile-tab-btn" to="../AddressManagement">
                                <span className="tab-icon"><FiMapPin /></span>
                                Addresses
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="profile-tabs">
                    <button
                        className={`profile-tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('personal')}
                    >
                        <span className="tab-icon"><FiUser /></span>
                        Personal Info
                    </button>
                    <button
                        className={`profile-tab-btn ${activeTab === 'cartlist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cartlist')}
                    >
                        <span className="tab-icon"><FiHeart /></span>
                        Cart
                    </button>
                    <button
                        className={`profile-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <span className="tab-icon"><FiSettings /></span>
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
                                        <FiEdit2 style={{marginRight: '5px'}}/> Edit Profile
                                    </button>
                                ) : (
                                    <div className="edit-actions">
                                        <button className="save-btn" onClick={handleSave}><FiSave style={{marginRight: '5px'}}/> Save</button>
                                        <button className="cancel-btn" onClick={() => setIsEditing(false)}><FiX style={{marginRight: '5px'}}/> Cancel</button>
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
                                    <label>Mobile Number</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={profileData.mobile}
                                            onChange={handleInputChange}
                                            className="edit-input"
                                        />
                                    ) : (
                                        <p>{profileData.mobile}</p>
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

                                <div className="info-field">
                                    <label>Role</label>
                                    <p>{profileData.role}</p>
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
                                                {item.inStock ? <><FiCheckCircle style={{marginRight: '4px'}}/> In Stock</> : <><FiXCircle style={{marginRight: '4px'}}/> Out of Stock</>}
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
                                                <FiX style={{marginRight: '4px'}}/> Remove
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
                                        <span className="setting-icon"><FiBell /></span>
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
                                        <span className="setting-icon"><FiSmartphone /></span>
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
                                        <span className="setting-icon"><FiLock /></span>
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
                                <button className="settings-btn" onClick={() => setShowPasswordModal(true)}>Change Password</button>
                                <button className="settings-btn danger" onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="modal-overlay">
                    <div className="modal-content fade-in">
                        <div className="modal-header">
                            <h3>Change Password</h3>
                            <button className="close-modal-btn" onClick={() => setShowPasswordModal(false)}><FiX /></button>
                        </div>
                        <form onSubmit={handleChangePasswordSubmit} className="modal-form">
                            {passwordError && <div className="modal-error">{passwordError}</div>}
                            
                            <div className="form-group">
                                <label>Old Password</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                                <button type="submit" className="save-btn">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
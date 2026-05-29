// AddressPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './AddressManagement.css';
import { deleteAddresFromServer, getAddressListFromServer, updateAddress, uploadAddress } from '../services/addressService';

const AddressPage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(Cookies.get("userData") || null);
    const [userId, serUserId] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        userId: null,
        alternatePhone: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        addressType: 'home', // home, work, other
        isDefault: false
    });

    // Load addresses from localStorage on component mount
    useEffect(() => {
        const user = JSON.parse(Cookies.get("userData") || null);
        if (!user)
            navigate("/login");
        serUserId(user._id);
        getAddressListFromServer(user._id)
            .then(async (result) => {
                const addresses = await result.json();
                setAddresses(addresses);
            })
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = await JSON.parse(Cookies.get("userData") || null);

        if (isEditing) {
            // Update existing address
            const updatedAddresses = addresses.map(addr =>
                addr._id === currentAddress._id ? { ...formData, _id: currentAddress._id } : addr
            );

            // Handle default address logic
            if (formData.isDefault) {
                updatedAddresses.forEach(addr => {
                    if (addr.id !== currentAddress.id) {
                        addr.isDefault = false;
                    }
                });
            }

            const response = await updateAddress(formData);
            if (response.ok) {
                setAddresses(updatedAddresses);
                alert('Address updated successfully! ✅');
            }
        } else {
            // Add new address
            const updatedFormData = { ...formData, userId: user._id };
            const response = await uploadAddress(updatedFormData);
            const address = await response.json();
            if (response.ok) {
                alert('Address added successfully! 🎉');
                const newAddress = [...addresses, address];
                setAddresses(newAddress);
            }
        }

        resetForm();
        setShowForm(false);
    };

    const handleEdit = (address) => {
        setCurrentAddress(address);
        setFormData(address);
        setIsEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (_id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            const response = await deleteAddresFromServer(userId, _id);
            if (response.ok) {
                const updatedAddresses = addresses.filter(addr => addr._id !== _id);
                setAddresses(updatedAddresses);
                alert('Address deleted successfully! 🗑️');
            }
        }
    };

    const handleSetDefault = (id) => {
        const updatedAddresses = addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        }));
        setAddresses(updatedAddresses);
        alert('Default address updated! ⭐');
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            phone: '',
            alternatePhone: '',
            addressLine1: '',
            addressLine2: '',
            landmark: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India',
            addressType: 'home',
            isDefault: false
        });
        setIsEditing(false);
        setCurrentAddress(null);
    };

    const getAddressTypeIcon = (type) => {
        switch (type) {
            case 'home': return '🏠';
            case 'work': return '🏢';
            case 'other': return '📍';
            default: return '🏠';
        }
    };

    return (
        <div className="address-page-container">
            <div className="address-page-wrapper">
                {/* Header */}
                <div className="address-header">
                    <div className="header-content">
                        <h1>
                            <span className="header-icon">📍</span>
                            My Addresses
                        </h1>
                        <p>Manage your delivery addresses</p>
                    </div>
                    <button
                        className="add-address-btn"
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                    >
                        <span className="plus-icon">+</span>
                        Add New Address
                    </button>
                </div>

                {/* Address Form Modal/Section */}
                {showForm && (
                    <div className="address-form-overlay">
                        <div className="address-form-container slide-down">
                            <div className="form-header">
                                <h2>{isEditing ? 'Edit Address' : 'Add New Address'}</h2>
                                <button className="close-btn" onClick={() => {
                                    setShowForm(false);
                                    resetForm();
                                }}>✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="address-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Full Name *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter full name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="10-digit mobile number"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Alternate Phone</label>
                                        <input
                                            type="tel"
                                            name="alternatePhone"
                                            value={formData.alternatePhone}
                                            onChange={handleInputChange}
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Address Line 1 *</label>
                                    <input
                                        type="text"
                                        name="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="House number, building name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Address Line 2</label>
                                    <input
                                        type="text"
                                        name="addressLine2"
                                        value={formData.addressLine2}
                                        onChange={handleInputChange}
                                        placeholder="Street, area (Optional)"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Landmark</label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={formData.landmark}
                                        onChange={handleInputChange}
                                        placeholder="Nearby landmark"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="City name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>State *</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="State name"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Pincode *</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="6-digit pincode"
                                            pattern="[0-9]{6}"
                                            title="Please enter a valid 6-digit pincode"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            placeholder="Country"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Address Type *</label>
                                    <div className="address-type-options">
                                        <label className={`type-option ${formData.addressType === 'home' ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="addressType"
                                                value="home"
                                                checked={formData.addressType === 'home'}
                                                onChange={handleInputChange}
                                            />
                                            <span className="type-icon">🏠</span>
                                            Home
                                        </label>
                                        <label className={`type-option ${formData.addressType === 'work' ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="addressType"
                                                value="work"
                                                checked={formData.addressType === 'work'}
                                                onChange={handleInputChange}
                                            />
                                            <span className="type-icon">🏢</span>
                                            Work
                                        </label>
                                        <label className={`type-option ${formData.addressType === 'other' ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="addressType"
                                                value="other"
                                                checked={formData.addressType === 'other'}
                                                onChange={handleInputChange}
                                            />
                                            <span className="type-icon">📍</span>
                                            Other
                                        </label>
                                    </div>
                                </div>

                                <div className="form-group checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="isDefault"
                                            checked={formData.isDefault}
                                            onChange={handleInputChange}
                                        />
                                        <span className="checkbox-text">
                                            Set as default address
                                        </span>
                                    </label>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="cancel-btn" onClick={() => {
                                        setShowForm(false);
                                        resetForm();
                                    }}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn">
                                        {isEditing ? 'Update Address' : 'Save Address'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Addresses List */}
                <div className="addresses-list">
                    {addresses.length === 0 ? (
                        <div className="no-addresses">
                            <div className="empty-state">
                                <span className="empty-icon">📍</span>
                                <h3>No Addresses Found</h3>
                                <p>Add your first delivery address to get started</p>
                                <button
                                    className="add-first-btn"
                                    onClick={() => {
                                        resetForm();
                                        setShowForm(true);
                                    }}
                                >
                                    + Add New Address
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="addresses-grid">
                            {addresses.map((address, index) => (
                                <div
                                    className={`address-card ${address.isDefault ? 'default' : ''}`}
                                    key={address._id}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {address.isDefault && (
                                        <div className="default-badge">
                                            <span className="star">⭐</span>
                                            Default Address
                                        </div>
                                    )}

                                    <div className="address-type-badge">
                                        <span>{getAddressTypeIcon(address.addressType)}</span>
                                        <span>{address.addressType.charAt(0).toUpperCase() + address.addressType.slice(1)}</span>
                                    </div>

                                    <div className="address-content">
                                        <h3 className="address-name">{address.fullName}</h3>
                                        <p className="address-phone">
                                            📞 {address.phone}
                                            {address.alternatePhone && ` | ${address.alternatePhone}`}
                                        </p>
                                        <p className="address-detail">
                                            {address.addressLine1}
                                            {address.addressLine2 && `, ${address.addressLine2}`}
                                            {address.landmark && <br />}
                                            {address.landmark && <span className="landmark">📍 {address.landmark}</span>}
                                            <br />
                                            {address.city}, {address.state} - {address.pincode}
                                            <br />
                                            {address.country}
                                        </p>
                                    </div>

                                    <div className="address-actions">
                                        <button
                                            className="action-btn edit-btn"
                                            onClick={() => handleEdit(address)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => handleDelete(address._id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                        {!address.isDefault && (
                                            <button
                                                className="action-btn default-btn"
                                                onClick={() => handleSetDefault(address._id)}
                                            >
                                                ⭐ Set as Default
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Delivery Tips */}
                {addresses.length > 0 && (
                    <div className="delivery-tips">
                        <div className="tips-header">
                            <span className="tips-icon">💡</span>
                            <h3>Delivery Tips</h3>
                        </div>
                        <div className="tips-grid">
                            <div className="tip-card">
                                <span className="tip-icon">✓</span>
                                <p>Add landmark for faster delivery</p>
                            </div>
                            <div className="tip-card">
                                <span className="tip-icon">✓</span>
                                <p>Keep your contact number updated</p>
                            </div>
                            <div className="tip-card">
                                <span className="tip-icon">✓</span>
                                <p>Set default address for quicker checkout</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressPage;
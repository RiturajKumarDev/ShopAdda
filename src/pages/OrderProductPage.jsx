// OrderProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './OrderProductPage.css';
import { getAddressListFromServer } from '../services/addressService';
import { makePayment } from '../services/paymentService';

const OrderProductPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1); // 1: Cart, 2: Address, 3: Payment, 4: Confirm
    const [cartItems, setCartItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const products = location.state?.products;

    useEffect(() => {
        const user = JSON.parse(Cookies.get("userData") || null);
        if (user) {
            setCartItems(products);
            setUser(user);
            getAddressListFromServer(user._id)
                .then(async (result) => {
                    const addresses = await result.json();
                    setAddresses(addresses);
                    try {
                        setSelectedAddress(addresses[addresses.length - 1]);
                    } catch (e) {
                    }
                })
        }
        else
            navigate("/login");
    }, []);

    const handleAddToCart = async () => {
        if (user)
            setUser(user);
        else
            navigate("/login");
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity ? item.quantity : 1)), 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        let total;
        if (subtotal >= 500)
            total = subtotal;
        else
            total = subtotal + 0;
        return total > 0 ? total : 0;
    };

    const handleQuantityChange = (itemId, change) => {
        setCartItems(items => items.map(item => {
            if (item._id === itemId) {
                const newQuantity = (item.quantity ? item.quantity : 1) + change;
                if (newQuantity >= 1 && newQuantity <= 10) {
                    return { ...item, quantity: newQuantity };
                }
            }
            return item;
        }));
    };

    const handleRemoveItem = (itemId) => {
        if (window.confirm('Remove this item from cart?')) {
            setCartItems(items => items.filter(item => item.id !== itemId));
        }
    };

    const handlePlaceOrder = () => {
        if (!selectedAddress) {
            alert('Please select a delivery address');
            return;
        }

        const newOrderId = `ORD${Date.now()}`;
        setOrderId(newOrderId);

        const orderData = {
            id: newOrderId,
            orderDate: new Date().toISOString(),
            items: cartItems,
            subtotal: calculateSubtotal(),
            total: calculateTotal(),
            paymentMethod: paymentMethod,
            shippingAddress: selectedAddress,
            orderStatus: 'Processing',
            paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid'
        };

        // Save order to localStorage
        const existingOrders = localStorage.getItem('shopadda_orders');
        const orders = existingOrders ? JSON.parse(existingOrders) : [];
        orders.unshift(orderData);
        localStorage.setItem('shopadda_orders', JSON.stringify(orders));

        // Clear cart
        setCartItems([]);
        setOrderPlaced(true);
        setStep(4);
    };

    const handleContinueShopping = () => {
        window.location.href = '/';
    };

    const loadRazorpay = async () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const loaded = await loadRazorpay();

        if (!loaded) {
            alert("Razorpay SDK failed to load");
            return;
        }

        const options = await makePayment(cartItems, selectedAddress);
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    const renderCartStep = () => (
        <div className="cart-step fade-in">
            <div className="cart-header">
                <h2>Shopping Cart ({cartItems.length} items)</h2>
                {cartItems.length > 0 && <button className="clear-cart">Clear Cart</button>}
            </div>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <span className="empty-icon">🛒</span>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to your cart</p>
                    <button className="shop-now-btn" onClick={handleContinueShopping}>Continue Shopping</button>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item, index) => (
                            <div className="cart-item" key={item._id} style={{ animationDelay: `${index * 0.1}s` }}>
                                <img className="item-image" src={item.images[0]} alt="{item.image}" />
                                <div className="item-details">
                                    <h4>{item.name}</h4>
                                    <div className="item-price">${item.price}</div>
                                </div>
                                <div className="item-quantity">
                                    <button onClick={() => handleQuantityChange(item._id, -1)} disabled={(item.quantity ? item.quantity : 1) <= 1}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item._id, 1)} disabled={(item.quantity ? item.quantity : 1) >= 10}>+</button>
                                </div>
                                <div className="item-total">${(item.price * (item.quantity ? item.quantity : 1)).toFixed(2)}</div>
                                <button className="remove-item" onClick={() => handleRemoveItem(item._id)}>🗑️</button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Subtotal:</span>
                                <span>${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Delivery Charge:</span>
                                <span>${calculateSubtotal().toFixed(2) - 40 < 500 ? 40 : 0}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <button className="proceed-btn" onClick={() => setStep(2)}>
                            Proceed to Checkout →
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    const renderAddressStep = () => (
        <div className="address-step fade-in">
            <h2>Select Delivery Address</h2>

            <div className="addresses-list">
                {addresses.map((address, index) => (
                    <div
                        key={address._id}
                        className={`address-card ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                        onClick={() => setSelectedAddress(address)}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="address-radio">
                            <input
                                type="radio"
                                name="address"
                                checked={selectedAddress?.id === address.id}
                                readOnly
                            />
                        </div>
                        <div className="address-content">
                            <div className="address-name">{address.fullName}</div>
                            <div className="address-phone">📞 {address.phone}</div>
                            <div className="address-text">
                                {address.addressLine1}
                                {address.addressLine2 && `, ${address.addressLine2}`}
                                <br />
                                {address.city}, {address.state} - {address.pincode}
                            </div>
                            {address.isDefault && <span className="default-badge">Default</span>}
                        </div>
                    </div>
                ))}
            </div>

            <button className="add-address-btn" onClick={() => { navigate("../AddressManagement") }}>
                + Add New Address
            </button>

            <div className="step-actions">
                <button className="back-btn" onClick={() => setStep(1)}>← Back to Cart</button>
                <button
                    className="next-btn"
                    onClick={() => { handlePayment(); setStep(3) }}
                    disabled={!selectedAddress}
                >
                    Proceed to Payment →
                </button>
            </div>
        </div>
    );

    const renderPaymentStep = () => (
        <div className="payment-step fade-in">
            <div className="order-summary-preview">
                <h3>Order Summary</h3>
                <div className="preview-items">
                    {cartItems.map(item => (
                        <div key={item._id} className="preview-item">
                            <img className="item-image" src={item.images[0]} alt="{item.image}" />
                            <span>{item.name} x {(item.quantity ? item.quantity : 1)}</span>
                            <span>${(item.price * (item.quantity ? item.quantity : 1)).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="preview-total">
                    <div className="preview-row">
                        <span>Subtotal:</span>
                        <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="preview-row">
                        <span>Delivery:</span>
                        <span>${calculateSubtotal().toFixed(2) - 40 < 500 ? 40 : 0}</span>
                    </div>
                    <div className="preview-row total">
                        <span>Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="step-actions">
                <button className="back-btn" onClick={() => setStep(2)}>← Back to Address</button>
                <button className="place-order-btn" onClick={handlePlaceOrder}>
                    Place Order →
                </button>
            </div>
        </div>
    );

    const renderConfirmationStep = () => (
        <div className="confirmation-step fade-in">
            <div className="success-animation">
                <div className="checkmark-circle">
                    <div className="checkmark">✓</div>
                </div>
            </div>

            <h2>Order Placed Successfully!</h2>
            <p className="thankyou-text">Thank you for shopping with ShopAdda!</p>

            <div className="order-confirmation-details">
                <div className="confirmation-card">
                    <h3>Order Summary</h3>
                    <div className="confirmation-items">
                        {cartItems.map(item => (
                            <div key={item._id} className="confirmation-item">
                                <span>{item.name} x {(item.quantity ? item.quantity : 1)}</span>
                                <span>${(item.price * (item.quantity ? item.quantity : 1)).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="confirmation-total">
                        <div className="confirmation-row">
                            <span>Estimated Delivery:</span>
                            <span>{new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="confirmation-card">
                    <h3>Shipping Address</h3>
                    <p><strong>{selectedAddress?.fullName}</strong></p>
                    <p>{selectedAddress?.addressLine1}</p>
                    {selectedAddress?.addressLine2 && <p>{selectedAddress.addressLine2}</p>}
                    <p>{selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}</p>
                    <p>📞 {selectedAddress?.phone}</p>
                </div>
            </div>

            <div className="action-buttons">
                <button className="track-order-btn" onClick={() => window.location.href = '../OrderPage'}>
                    Track Order
                </button>
                <button className="continue-shopping-btn" onClick={handleContinueShopping}>
                    Continue Shopping
                </button>
            </div>
        </div>
    );

    return (
        <div className="order-product-container">
            <div className="order-product-wrapper">
                {/* Progress Steps */}
                <div className="progress-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <div className="step-number">1</div>
                        <div className="step-label">Cart</div>
                    </div>
                    <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <div className="step-number">2</div>
                        <div className="step-label">Address</div>
                    </div>
                    <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
                    <div className={`step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
                        <div className="step-number">3</div>
                        <div className="step-label">Payment</div>
                    </div>
                    <div className={`step-line ${step >= 4 ? 'active' : ''}`}></div>
                    <div className={`step ${step >= 4 ? 'active' : ''}`}>
                        <div className="step-number">4</div>
                        <div className="step-label">Confirm</div>
                    </div>
                </div>

                {/* Step Content */}
                {step === 1 && renderCartStep()}
                {step === 2 && renderAddressStep()}
                {step === 3 && renderPaymentStep()}
                {step === 4 && renderConfirmationStep()}
            </div>
        </div>
    );
};

export default OrderProductPage;
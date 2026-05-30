// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './Dashboard.css';
import { addToCartServer } from '../services/cartService';
import { getProductsToserver } from '../services/productService';

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [cartCount, setCartCount] = useState(3);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const categories = [
        { id: 'all', name: 'All Deals', icon: '🔥' },
        { id: 'electronics', name: 'Electronics', icon: '📱' },
        { id: 'fashion', name: 'Fashion', icon: '👕' },
        { id: 'home', name: 'Home & Living', icon: '🏠' },
        { id: 'beauty', name: 'Beauty', icon: '💄' },
        { id: 'sports', name: 'Sports', icon: '⚽' }
    ];

    const productData = [
        { _id: 1, name: 'iPhone 15 Pro', price: 999, originalPrice: 1299, discount: 23, rating: 4.8, sold: '2.5k', images: ['📱', '📱'], category: 'electronics' },
        { _id: 2, name: 'Nike Air Max', price: 89, originalPrice: 149, discount: 40, rating: 4.6, sold: '1.2k', images: ['👟', '👟'], category: 'fashion' },
    ];

    const [products, setProductData] = useState(productData);

    useEffect(() => {
        getProductsToserver()
            .then((response) => {
                if (response.ok)
                    response.json().then((products) => {
                        setProductData(products);
                    });
            });
    }, []);

    const handleAddToCart = async () => {
        const user = JSON.parse(Cookies.get("userData") || null);
        if (user) {
            const response = await addToCartServer(user._id, product._id);
            const data = await response.json();
            if (response.ok)
                alert(`Added ${quantity} item(s) to cart! 🛒`);
            else
                alert("Already added!!");
        }
        else
            navigate("/login");
    };

    const handleLogout = () => {
        Cookies.remove("userData");
        navigate("/login");
    }

    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

    return (
        <div className="dashboard">
            {/* Premium Navbar - Flipkart/Amazon Style */}
            <nav className="premium-navbar">
                <div className="nav-container">
                    {/* Logo Section */}
                    <div className="logo-section">
                        <a href="https://shop-adda-pi.vercel.app/" target='_blank'>
                            <div className="logo">
                                {/* <span className="shop-icon">🛍️</span> */}
                                <span className="shop-icon"><img src="shopAdda.png" alt="" /></span>
                                <span className="brand">Shop<span className="brand-accent">Adda</span></span>
                            </div>
                        </a>
                        <div className="deal-tag">
                            <span className="lightning">⚡</span>
                            <span>HAR DEAL KAA ADDA</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="search-section">
                        <div className="search-bar">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search for products, brands and more..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <button className="search-btn">Search</button>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="nav-links">
                        <div className="nav-dropdown">
                            <button className="nav-link">
                                <span>👤</span> Account
                                <span className="dropdown-arrow">▼</span>
                            </button>
                            <div className="dropdown-menu">
                                <a href="profilePage" target='_main'>My Profile</a>
                                <a href="OrderPage">Orders</a>
                                <a href="profilePage">Settings</a>
                                <hr />
                                <a href="#" role='button' onClick={handleLogout}>Logout</a>
                            </div>
                        </div>

                        <div className="cart-icon">
                            <button className="nav-link" onClick={() => navigate("profilePage")} >
                                <span>🛒</span> Cart
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </button>
                        </div>

                        <div className="seller-center">
                            <a href="/uploadProduct" target='_main'>
                                <button className="nav-link">
                                    <span>🏪</span> Seller Center
                                </button>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Category Bar */}
                <div className="category-bar">
                    <div className="category-container">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                <span className="category-icon" >{cat.icon}</span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Hero Banner */}
            <div className="hero-banner">
                <div className="banner-content">
                    <div className="banner-text">
                        <h1 className="animated-text">HAR DEAL KAA<span className="highlight"> ADDA</span></h1>
                        <p className="banner-subtitle">Biggest Sale of the Year! Up to 80% Off</p>
                        <button className="shop-now-btn">Shop Now →</button>
                    </div>
                    <div className="banner-stats">
                        <div className="stat-item">
                            <span className="stat-value">24/7</span>
                            <span className="stat-label">Customer Support</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">100%</span>
                            <span className="stat-label">Secure Payment</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">7 Days</span>
                            <span className="stat-label">Easy Returns</span>
                        </div>
                    </div>
                </div>
                <div className="banner-offer">
                    <div className="offer-tag">FLAT ₹500 OFF</div>
                    <div className="offer-code">Use Code: SHOPADDA500</div>
                </div>
            </div>

            {/* Flash Deals Section */}
            <div className="flash-deals">
                <div className="section-header">
                    <h2>
                        <span className="flash-icon">⚡</span>
                        Flash Deals
                    </h2>
                    <div className="timer">
                        <span>Ends in: </span>
                        <div className="timer-box">02</div>:<div className="timer-box">15</div>:<div className="timer-box">34</div>
                    </div>
                    <button className="view-all-btn">View All →</button>
                </div>
                <div className="products-grid">
                    {filteredProducts.slice(0, 4).map(product => (
                        <Link to='productPage' state={{ product }} key={product._id} >
                            <div className="product-card" key={product._id}>
                                <img className="product-image" src={`${product.images.at(0)}`} alt="product.images" />
                                <div className="discount-badge">-{product.discount}%</div>
                                <h3 className="product-name">{product.name}</h3>
                                <div className="product-price">
                                    <span className="current-price">${product.price}</span>
                                    <span className="original-price">${product.originalPrice}</span>
                                </div>
                                <div className="product-rating">
                                    <span className="rating-stars">⭐ {product.rating}</span>
                                    <span className="sold-count">({product.sold} sold)</span>
                                </div>
                                <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recommended For You */}
            <div className="recommended-section">
                <div className="section-header">
                    <h2>Recommended For You</h2>
                    <button className="view-all-btn">See All →</button>
                </div>
                <div className="products-grid">
                    {filteredProducts.map(product => (
                        <Link to='productPage' state={{ product }} key={product._id}>
                            <div className="product-card fade-in" key={product._id}>
                                <img className="product-image" src={`${product.images.at(0)}`} alt="product.images" />
                                <div className="discount-badge">-{product.discount}%</div>
                                <h3 className="product-name">{product.name}</h3>
                                <div className="product-price">
                                    <span className="current-price">${product.price}</span>
                                    <span className="original-price">${product.originalPrice}</span>
                                </div>
                                <div className="product-rating">
                                    <span className="rating-stars">⭐ {product.rating}</span>
                                    <span className="sold-count">({product.sold} sold)</span>
                                </div>
                                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                    Add to Cart
                                    <span className="cart-icon-small">🛒</span>
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="premium-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>ShopAdda</h4>
                        <p>Your one-stop destination for amazing deals and discounts.</p>
                        <div className="social-links">
                            <a href="#">📘</a>
                            <a href="#">📷</a>
                            <a href="#">🐦</a>
                            <a href="#">🎵</a>
                        </div>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <a href="#">About Us</a>
                        <a href="#">Contact Us</a>
                        <a href="#">Careers</a>
                        <a href="#">Blog</a>
                    </div>
                    <div className="footer-section">
                        <h4>Policy</h4>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Return Policy</a>
                        <a href="#">Shipping Info</a>
                    </div>
                    <div className="footer-section">
                        <h4>Download App</h4>
                        <div className="app-buttons">
                            <button>📱 Google Play</button>
                            <button>🍎 App Store</button>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 ShopAdda - HARDEALKAAEDDA. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
// ProductPage.jsx (Fully Responsive)
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './ProductPage.css';
import { addToCartServer } from '../services/cartService';
import { getProductsToserver } from '../services/productService';

const ProductPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const product = location.state?.product;
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('Red');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [activeTab, setActiveTab] = useState('description');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [relatedProducts, setRelatedProducts] = useState([
        { _id: 1, name: 'Wireless Earbuds', price: 89, rating: 4.5, images: ['🎧'], discount: 20 },
        { _id: 2, name: 'Smart Watch', price: 249, rating: 4.7, images: ['⌚'], discount: 15 },
        { _id: 3, name: 'Bluetooth Speaker', price: 129, rating: 4.6, images: ['🔊'], discount: 25 },
        { _id: 4, name: 'Gaming Headset', price: 159, rating: 4.8, images: ['🎮'], discount: 30 }
    ]);

    useEffect(() => {
        getProductsToserver()
            .then((response) => {
                if (response.ok)
                    response.json().then((products) => {
                        setRelatedProducts(products);
                    });
            });
    }, []);

    const handleQuantityChange = (type) => {
        if (type === 'increase' && quantity < 10) {
            setQuantity(quantity + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

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

    const handleBuyNow = () => {
        alert('Proceeding to checkout... 💳');
    };

    const handleImageHover = (e) => {
        if (!isMobile) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomPosition({ x, y });
        }
    };

    return (
        <div className="product-page-container">
            <div className="product-page-wrapper">
                {/* Breadcrumb - Responsive */}
                <div className="breadcrumb">
                    <a href="#">Home</a>
                    <span>›</span>
                    <a href="#">Electronics</a>
                    <span>›</span>
                    <a href="#">Headphones</a>
                    <span>›</span>
                    <span className="current">{!isMobile && product.name}</span>
                </div>

                {/* Product Main - Responsive Grid */}
                <div className="product-main">
                    {/* Image Gallery - Responsive */}
                    <div className="product-gallery">
                        <div className="thumbnail-list">
                            {product.images.map((img, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img className="thumbnail-img" src={img} alt="img" />
                                </div>
                            ))}
                        </div>

                        <div
                            className="main-image"
                            onMouseEnter={() => !isMobile && setShowZoom(true)}
                            onMouseLeave={() => !isMobile && setShowZoom(false)}
                            onMouseMove={handleImageHover}
                        >
                            <img className="main-img" src={product.images[selectedImage]} alt="{product.images[selectedImage]}" />
                            {showZoom && !isMobile && (
                                <div
                                    className="image-zoom"
                                    style={{
                                        backgroundImage: `url(${product.images[selectedImage]})`,
                                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`
                                    }}
                                />
                            )}
                            {product.discount > 0 && (
                                <div className="discount-badge">-{product.discount}%</div>
                            )}
                        </div>
                    </div>

                    {/* Product Info - Responsive */}
                    <div className="product-info">
                        <div className="brand-name">{product.brand}</div>
                        <h1 className="product-title">{product.name}</h1>

                        <div className="rating-section">
                            <div className="rating">
                                <span className="stars">⭐ {product.rating}</span>
                                <span className="reviews">({product.reviews} reviews)</span>
                            </div>
                            <button className="review-btn">Write a review</button>
                        </div>

                        <div className="price-section">
                            <div className="current-price">${product.price}</div>
                            <div className="original-price">${product.originalPrice}</div>
                            <div className="savings">Save ${product.originalPrice - product.price}</div>
                        </div>

                        <div className="offers-section">
                            <h4>Available Offers</h4>
                            <ul>
                                <li>🎯 Bank Offer: 10% off on HDFC Bank Cards</li>
                                <li>🎯 Special Price: Get extra 5% off</li>
                                <li>🎯 No Cost EMI on select cards</li>
                            </ul>
                        </div>

                        {product.colors && (
                            <div className="variant-section">
                                <h4>Select Color</h4>
                                <div className="color-options">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                            style={{ backgroundColor: color.toLowerCase() }}
                                            title={color}
                                        >
                                            {!isMobile && color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.sizes && (
                            <div className="variant-section">
                                <h4>Select Size</h4>
                                <div className="size-options">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="quantity-section">
                            <h4>Quantity</h4>
                            <div className="quantity-selector">
                                <button onClick={() => handleQuantityChange('decrease')}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => handleQuantityChange('increase')}>+</button>
                            </div>
                            <div className="stock-status">
                                {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                🛒 Add to Cart
                            </button>
                            <button className="buy-now-btn" onClick={handleBuyNow}>
                                ⚡ Buy Now
                            </button>
                            <button
                                className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                                onClick={() => setIsWishlisted(!isWishlisted)}
                            >
                                {isWishlisted ? '❤️' : '🤍'}
                            </button>
                        </div>

                        <div className="delivery-section">
                            <div className="delivery-option">
                                <span>🚚</span>
                                <div>
                                    <strong>Free Delivery</strong>
                                    <p>Enter pincode for details</p>
                                </div>
                            </div>
                            <div className="delivery-option">
                                <span>🔄</span>
                                <div>
                                    <strong>7 Days Return</strong>
                                    <p>Easy returns & exchange</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs - Responsive */}
                <div className="product-details-tabs">
                    <div className="tabs-header">
                        <button
                            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
                            onClick={() => setActiveTab('features')}
                        >
                            Features
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('specifications')}
                        >
                            Specs
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews (234)
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'description' && (
                            <div className="description-content">
                                <h3>Product Description</h3>
                                <p>{product.description}</p>

                                <h3>Key Highlights</h3>
                                <ul className="highlights-list">
                                    <li>✓ Premium build quality with ergonomic design</li>
                                    <li>✓ Advanced noise cancellation technology</li>
                                    <li>✓ Long-lasting battery with fast charging</li>
                                    <li>✓ Multi-device connectivity</li>
                                    <li>✓ Touch controls for easy operation</li>
                                </ul>
                            </div>
                        )}
                        {activeTab === 'features' && (
                            <div className="features-content">
                                <h3>Features</h3>
                                <ul className="features-list">
                                    {product.features.map((feature, index) => (
                                        <li key={index}>✓ {feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {activeTab === 'specifications' && (
                            <div className="specifications-content">
                                <h3>Technical Specifications</h3>
                                <table className="specs-table">
                                    <tbody>
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <tr key={key}>
                                                <td className="spec-key">{key}</td>
                                                <td className="spec-value">{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="reviews-content">
                                <h3>Customer Reviews</h3>
                                <div className="review-summary">
                                    <div className="average-rating">
                                        <span className="big-rating">4.8</span>
                                        <span className="stars-display">★★★★★</span>
                                        <span>Based on 234 reviews</span>
                                    </div>
                                    <button className="write-review-btn">Write a Review</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products - Responsive Grid */}
                <div className="related-products">
                    <div className="section-header">
                        <h2>You May Also Like</h2>
                        <button className="view-all">View All →</button>
                    </div>

                    <div className="related-grid">
                        {relatedProducts.map(product => (
                            <div className="related-card" key={product._id}>
                                <img className="related-image" src={product.images[0]} alt="product-image" />
                                {product.discount > 0 && (
                                    <div className="related-discount">-{product.discount}%</div>
                                )}
                                <h4>{product.name}</h4>
                                <div className="related-rating">⭐ {product.rating}</div>
                                <div className="related-price">
                                    <span className="related-current">${product.price}</span>
                                </div>
                                <button className="related-btn">View Details</button>
                                <Link to='../productPage' className="related-btn" state={{ product }} >View Details</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
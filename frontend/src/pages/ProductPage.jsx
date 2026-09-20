// ProductPage.jsx (Fully Responsive)
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './ProductPage.css';
import { addToCartServer } from '../services/cartService';
import { getProductsToserver } from '../services/productService';
import { FiStar, FiTag, FiCheckCircle, FiXCircle, FiShoppingCart, FiZap, FiHeart, FiTruck, FiRefreshCw, FiCheck, FiArrowRight } from 'react-icons/fi';

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

    const scrolledTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    useEffect(() => {
        scrolledTop();
    }, []);

    const [relatedProducts, setRelatedProducts] = useState([
        { _id: 1, name: 'Wireless Earbuds', price: 89, rating: 4.5, images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80'], discount: 20 },
        { _id: 2, name: 'Smart Watch', price: 249, rating: 4.7, images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80'], discount: 15 },
        { _id: 3, name: 'Bluetooth Speaker', price: 129, rating: 4.6, images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80'], discount: 25 },
        { _id: 4, name: 'Gaming Headset', price: 159, rating: 4.8, images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80'], discount: 30 }
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
            const response = await addToCartServer(product._id);
            const data = await response.json();
            if (response.ok)
                alert(`Added ${quantity} item(s) to cart! 🛒`);
            else
                alert(data.errors || "Failed to add to cart!");
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
                {/* Product Main - Responsive Grid */}
                <div className="product-main" id='product-main'>
                    {/* Image Gallery & Quick Info - Responsive */}
                    <div className="left-column" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="product-gallery">
                            <div className="thumbnail-list">
                                {product.images.map((img, index) => {
                                    const isEmoji = !img.includes('/') && !img.includes('http') && img.length <= 5;
                                    return (
                                    <div
                                        key={index}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        {isEmoji ? (
                                            <span className="thumbnail-emoji">{img}</span>
                                        ) : (
                                            <img className="thumbnail-img" src={img} alt="img" />
                                        )}
                                    </div>
                                )})}
                            </div>

                            <div className="main-image">
                                {(() => {
                                    const mainImg = product.images[selectedImage];
                                    const isEmoji = !mainImg.includes('/') && !mainImg.includes('http') && mainImg.length <= 5;
                                    return isEmoji ? (
                                        <span className="main-emoji">{mainImg}</span>
                                    ) : (
                                        <img className="main-img" src={mainImg} alt="product" />
                                    );
                                })()}
                                {product.discount > 0 && (
                                    <div className="discount-badge">-{product.discount}%</div>
                                )}
                            </div>
                        </div>

                        <div className="quick-info" style={{ background: 'var(--color-surface-hover)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(0,0,0,0.03)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-text-dark)' }}>About this Product</h3>
                            <p style={{ color: 'var(--color-text-gray)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                                {product.description || "Experience premium quality and exceptional performance with this outstanding product. Designed for durability and style, it perfectly blends modern aesthetics with reliable functionality. A must-have addition to your collection."}
                            </p>
                            <ul style={{ listStyle: 'none', color: 'var(--color-text-gray)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiCheckCircle style={{color: 'var(--color-success)'}}/> Premium Quality Materials</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiCheckCircle style={{color: 'var(--color-success)'}}/> 1 Year Brand Warranty</li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FiCheckCircle style={{color: 'var(--color-success)'}}/> 100% Authentic Product</li>
                            </ul>
                        </div>
                    </div>

                    {/* Product Info - Responsive */}
                    <div className="product-info">
                        <div className="brand-name">{product.brand}</div>
                        <h1 className="product-title">{product.name}</h1>

                        <div className="rating-section">
                            <div className="rating">
                                <span className="stars"><FiStar style={{fill: 'currentColor', marginRight: '4px', color: '#ffc107'}}/> {product.rating}</span>
                                <span className="reviews">({product.reviews} reviews)</span>
                            </div>
                            <button className="review-btn">Write a review</button>
                        </div>

                        <div className="price-section">
                            <div className="current-price">₹{product.price}</div>
                            <div className="original-price">₹{product.originalPrice}</div>
                            <div className="savings">Save ₹{product.originalPrice - product.price}</div>
                        </div>

                        <div className="offers-section">
                            <h4>Available Offers</h4>
                            <ul>
                                <li><FiTag style={{marginRight: '8px'}}/> Bank Offer: 10% off on HDFC Bank Cards</li>
                                <li><FiTag style={{marginRight: '8px'}}/> Special Price: Get extra 5% off</li>
                                <li><FiTag style={{marginRight: '8px'}}/> No Cost EMI on select cards</li>
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
                                {product.inStock ? <><FiCheckCircle style={{marginRight: '4px', color: 'green'}}/> In Stock</> : <><FiXCircle style={{marginRight: '4px', color: 'red'}}/> Out of Stock</>}
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                <FiShoppingCart style={{marginRight: '8px'}}/> Add to Cart
                            </button>
                            <Link to='../OrderProductPage' state={{ products: [product] }}>
                                <button className="buy-now-btn" ><FiZap style={{marginRight: '8px'}}/> Buy Now</button>
                            </Link>
                            <button
                                className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                                onClick={() => setIsWishlisted(!isWishlisted)}
                            >
                                {isWishlisted ? <FiHeart style={{fill: 'currentColor', color: 'red'}} /> : <FiHeart />}
                            </button>
                        </div>

                        <div className="delivery-section">
                            <div className="delivery-option">
                                <span><FiTruck /></span>
                                <div>
                                    <strong>Free Delivery</strong>
                                    <p>Enter pincode for details</p>
                                </div>
                            </div>
                            <div className="delivery-option">
                                <span><FiRefreshCw /></span>
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
                                    <li><FiCheck style={{marginRight: '8px', color: 'green'}}/> Premium build quality with ergonomic design</li>
                                    <li><FiCheck style={{marginRight: '8px', color: 'green'}}/> Advanced noise cancellation technology</li>
                                    <li><FiCheck style={{marginRight: '8px', color: 'green'}}/> Long-lasting battery with fast charging</li>
                                    <li><FiCheck style={{marginRight: '8px', color: 'green'}}/> Multi-device connectivity</li>
                                    <li><FiCheck style={{marginRight: '8px', color: 'green'}}/> Touch controls for easy operation</li>
                                </ul>
                            </div>
                        )}
                        {activeTab === 'features' && (
                            <div className="features-content">
                                <h3>Features</h3>
                                <ul className="features-list">
                                    {product.features.map((feature, index) => (
                                        <li key={index}><FiCheck style={{marginRight: '8px', color: 'green'}}/> {feature}</li>
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
                                        <span className="stars-display" style={{color: '#ffc107', display: 'flex', gap: '2px', alignItems: 'center'}}><FiStar style={{fill: 'currentColor'}}/><FiStar style={{fill: 'currentColor'}}/><FiStar style={{fill: 'currentColor'}}/><FiStar style={{fill: 'currentColor'}}/><FiStar style={{fill: 'currentColor'}}/></span>
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
                        <button className="view-all">View All <FiArrowRight style={{marginLeft: '4px'}}/></button>
                    </div>

                    <div className="related-grid">
                        {relatedProducts.map(product => (
                            <div className="related-card" key={product._id}>
                                <img className="related-image" src={product.images[0]} alt="product-image" />
                                {product.discount > 0 && (
                                    <div className="related-discount">-{product.discount}%</div>
                                )}
                                <h4>{product.name}</h4>
                                <div className="related-rating"><FiStar style={{fill: 'currentColor', marginRight: '4px', color: '#ffc107'}}/> {product.rating}</div>
                                <div className="related-price">
                                    <span className="related-current">₹{product.price}</span>
                                </div>
                                <Link to='../productPage' className="related-btn" state={{ product }} onClick={scrolledTop} >View Details</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
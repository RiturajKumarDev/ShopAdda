// UploadProduct.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './UploadProduct.css';
import { initImageSever, uploadImageToSever } from '../services/imageService';
import { uploadProductToServer } from '../services/productService';

const UploadProduct = () => {
    const navigate = useNavigate();
    const [user, serUser] = useState(null);
    useEffect(() => {
        const user = JSON.parse(Cookies.get("userData") || null);
        if (user)
            serUser(user);
        else
            navigate("/login");
    }, []);
    const [productData, setProductData] = useState({
        name: '',
        userEmail: '',
        brand: '',
        rating: '',
        reviews: '',
        price: '',
        originalPrice: '',
        discount: '',
        description: '',
        features: [],
        specifications: {
            'Brand': '',
            'Model': '',
            'Color': '',
            'Connectivity': '',
            'Battery Life': '',
            'Charging Time': '',
            'Weight': '',
            'Warranty': ''
        },
        images: [],
        colors: [],
        sizes: [],
        inStock: true
    });

    useEffect(() => {
        initImageSever()
            .then((result) => {
                console.log(result.message);
            })
    }, []);

    const [featureInput, setFeatureInput] = useState('');
    const [colorInput, setColorInput] = useState('');
    const [sizeInput, setSizeInput] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [activeTab, setActiveTab] = useState('basic');
    const fileInputRef = useRef(null);

    const categories = [
        'Electronics', 'Fashion', 'Home & Living',
        'Beauty', 'Sports', 'Toys', 'Books', 'Automotive'
    ];

    const brandsList = [
        'Apple', 'Asus', 'Samsung', 'Nike', 'Adidas', 'Sony',
        'LG', 'Boat', 'Puma', 'Zara', 'H&M', 'OnePlus', 'Xiaomi'
    ];

    const connectivityOptions = ['Bluetooth 4.0', 'Bluetooth 5.0', 'Wi-Fi', 'USB-C', 'Lightning'];
    const colorsList = ['Red', 'Blue', 'Black', 'White', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Gray'];
    const sizesList = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('spec.')) {
            const specKey = name.split('.')[1];
            setProductData(prev => ({
                ...prev,
                specifications: {
                    ...prev.specifications,
                    [specKey]: value
                }
            }));
        } else {
            setProductData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Auto-calculate discount if both prices exist
        if (name === 'price' || name === 'originalPrice') {
            const price = name === 'price' ? parseFloat(value) : parseFloat(productData.price);
            const originalPrice = name === 'originalPrice' ? parseFloat(value) : parseFloat(productData.originalPrice);
            if (price && originalPrice && originalPrice > price) {
                const discountPercent = ((originalPrice - price) / originalPrice * 100).toFixed(0);
                setProductData(prev => ({ ...prev, discount: discountPercent }));
            }
        }
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setProductData(prev => ({
                ...prev,
                features: [...prev.features, featureInput.trim()]
            }));
            setFeatureInput('');
        }
    };

    const removeFeature = (index) => {
        setProductData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const addColor = () => {
        if (colorInput && !productData.colors.includes(colorInput)) {
            setProductData(prev => ({
                ...prev,
                colors: [...prev.colors, colorInput]
            }));
            setColorInput('');
        }
    };

    const removeColor = (color) => {
        setProductData(prev => ({
            ...prev,
            colors: prev.colors.filter(c => c !== color)
        }));
    };

    const addSize = () => {
        if (sizeInput && !productData.sizes.includes(sizeInput)) {
            setProductData(prev => ({
                ...prev,
                sizes: [...prev.sizes, sizeInput]
            }));
            setSizeInput('');
        }
    };

    const removeSize = (size) => {
        setProductData(prev => ({
            ...prev,
            sizes: prev.sizes.filter(s => s !== size)
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if (productData.images.length + files.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, reader.result]);
                    setProductData(prev => ({
                        ...prev,
                        images: [...prev.images, file]
                    }));
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please upload only image files');
            }
        });
    };

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setProductData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setUploadProgress(10);

            // Validation
            if (
                !productData.name ||
                !productData.brand ||
                !productData.price ||
                !productData.category
            ) {
                alert('Please fill all required fields');
                setIsSubmitting(false);
                return;
            }

            if (productData.images.length === 0) {
                alert('Please upload at least one product image');
                setIsSubmitting(false);
                return;
            }

            const uploadedImageUrls = [];
            for (let i = 0; i < productData.images.length; i++) {
                const img = productData.images[i];
                const result = await uploadImageToSever(img);
                if (result) {
                    uploadedImageUrls.push(result);
                    const progress = Math.floor(
                        ((i + 1) / productData.images.length) * 70
                    );
                    setUploadProgress(progress);
                } else
                    throw new Error('Image upload failed');
            }

            const finalProductData = {
                ...productData,
                images: uploadedImageUrls,
                userEmail: user.email
            };
            setUploadProgress(85);
            const response = await uploadProductToServer(finalProductData);
            const data = await response.json();
            setUploadProgress(100);
            if (response.ok) {
                alert('Product uploaded successfully! 🎉');
                resetForm();
            } else
                alert("Upload Error: " + data.errors);
        } catch (error) {
            console.error(error);
            alert(error.message || "Something went wrong!");
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    const resetForm = () => {
        setProductData({
            id: Date.now(),
            name: '',
            brand: '',
            rating: '',
            reviews: '',
            price: '',
            originalPrice: '',
            discount: '',
            description: '',
            features: [],
            specifications: {
                'Brand': '',
                'Model': '',
                'Color': '',
                'Connectivity': '',
                'Battery Life': '',
                'Charging Time': '',
                'Weight': '',
                'Warranty': ''
            },
            images: [],
            colors: [],
            sizes: [],
            inStock: true
        });
        setImagePreviews([]);
        setFeatureInput('');
        setColorInput('');
        setSizeInput('');
        setActiveTab('basic');
    };

    const getPreviewData = () => {
        return {
            name: productData.name || 'Product Name',
            brand: productData.brand || 'Brand',
            price: productData.price || '0',
            originalPrice: productData.originalPrice || '0',
            discount: productData.discount || '0',
            rating: productData.rating || '0',
            reviews: productData.reviews || '0',
            image: imagePreviews[0] || '🛍️'
        };
    };

    const preview = getPreviewData();

    return (
        <div className="upload-container">
            <div className="upload-wrapper">
                {/* Header */}
                <div className="upload-header">
                    <div className="header-icon">📤</div>
                    <h1>Upload Product to ShopAdda</h1>
                    <p>List your product and start selling to millions of customers</p>
                </div>

                {/* Live Preview */}
                <div className="live-preview">
                    <h3>Live Preview</h3>
                    <div className="preview-card">
                        <div className="preview-image">
                            {typeof preview.image === 'string' && preview.image.startsWith('data:') ? (
                                <img src={preview.image} alt="Preview" />
                            ) : (
                                <span className="preview-emoji">{preview.image}</span>
                            )}
                            {preview.discount > 0 && (
                                <div className="preview-discount">-{preview.discount}%</div>
                            )}
                        </div>
                        <div className="preview-info">
                            <div className="preview-brand">{preview.brand}</div>
                            <div className="preview-name">{preview.name}</div>
                            <div className="preview-rating">⭐ {preview.rating} ({preview.reviews} reviews)</div>
                            <div className="preview-price">
                                <span className="preview-current">${preview.price}</span>
                                {preview.originalPrice > preview.price && (
                                    <span className="preview-original">${preview.originalPrice}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="progress-steps">
                    <div className={`step ${activeTab === 'basic' ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <div className="step-label">Basic Info</div>
                    </div>
                    <div className={`step ${activeTab === 'media' ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <div className="step-label">Images</div>
                    </div>
                    <div className={`step ${activeTab === 'pricing' ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <div className="step-label">Pricing</div>
                    </div>
                    <div className={`step ${activeTab === 'features' ? 'active' : ''}`}>
                        <div className="step-number">4</div>
                        <div className="step-label">Features</div>
                    </div>
                    <div className={`step ${activeTab === 'specs' ? 'active' : ''}`}>
                        <div className="step-number">5</div>
                        <div className="step-label">Specifications</div>
                    </div>
                    <div className={`step ${activeTab === 'variants' ? 'active' : ''}`}>
                        <div className="step-number">6</div>
                        <div className="step-label">Variants</div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="upload-form">
                    {/* Basic Information Tab */}
                    {activeTab === 'basic' && (
                        <div className="form-tab fade-in">
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Product Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={productData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Premium Wireless Headphones"
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Brand *</label>
                                    <select
                                        name="brand"
                                        value={productData.brand}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select brand</option>
                                        {brandsList.map(brand => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label>Category *</label>
                                    <select
                                        name="category"
                                        value={productData.category}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label>Rating (0-5)</label>
                                    <input
                                        type="number"
                                        name="rating"
                                        value={productData.rating}
                                        onChange={handleInputChange}
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        placeholder="e.g., 4.8"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Number of Reviews</label>
                                    <input
                                        type="number"
                                        name="reviews"
                                        value={productData.reviews}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 2341"
                                    />
                                </div>

                                <div className="input-group full-width">
                                    <label>Description *</label>
                                    <textarea
                                        name="description"
                                        value={productData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe your product in detail..."
                                        rows="5"
                                        required
                                    />
                                </div>

                                <div className="input-group full-width">
                                    <label>Stock Status</label>
                                    <div className="stock-toggle">
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={productData.inStock}
                                                onChange={(e) => setProductData(prev => ({ ...prev, inStock: e.target.checked }))}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                        <span>{productData.inStock ? '✅ In Stock' : '❌ Out of Stock'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Images Tab - FIXED WORKING IMAGE UPLOAD */}
                    {activeTab === 'media' && (
                        <div className="form-tab fade-in">
                            <div className="image-upload-section"
                                onClick={() => fileInputRef.current.click()}>
                                <div
                                    className="upload-area"
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        multiple
                                        style={{ display: 'none' }}
                                    />
                                    <div className="upload-icon">📸</div>
                                    <h3>Upload Product Images</h3>
                                    <p>Click or drag images here (Max 5 images)</p>
                                    <div className="upload-hint">
                                        Recommended: 800x800px, JPG or PNG
                                    </div>
                                </div>

                                {imagePreviews.length > 0 && (
                                    <div className="image-preview-grid">
                                        {imagePreviews.map((url, index) => (
                                            <div key={index} className="preview-item">
                                                <img src={url} alt={`Preview ${index + 1}`} />
                                                <button
                                                    type="button"
                                                    className="remove-image"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    ✕
                                                </button>
                                                <div className="preview-number">{index + 1}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {imagePreviews.length === 0 && (
                                    <div className="no-images">
                                        <span>📷</span>
                                        <p>No images uploaded yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Pricing Tab */}
                    {activeTab === 'pricing' && (
                        <div className="form-tab fade-in">
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Selling Price (₹) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={productData.price}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 199"
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Original Price (₹)</label>
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={productData.originalPrice}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 299"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Discount (%)</label>
                                    <input
                                        type="number"
                                        name="discount"
                                        value={productData.discount}
                                        onChange={handleInputChange}
                                        placeholder="Auto-calculated"
                                        readOnly
                                        style={{ background: '#f5f5f5' }}
                                    />
                                </div>
                            </div>

                            {productData.discount > 0 && (
                                <div className="discount-badge animate-pulse">
                                    🎉 {productData.discount}% OFF - Customers will save ₹{productData.originalPrice - productData.price}!
                                </div>
                            )}
                        </div>
                    )}

                    {/* Features Tab */}
                    {activeTab === 'features' && (
                        <div className="form-tab fade-in">
                            <div className="features-section">
                                <div className="add-feature">
                                    <input
                                        type="text"
                                        value={featureInput}
                                        onChange={(e) => setFeatureInput(e.target.value)}
                                        placeholder="Enter a feature (e.g., Active Noise Cancellation)"
                                        onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                                    />
                                    <button type="button" onClick={addFeature}>Add Feature</button>
                                </div>

                                <div className="features-list">
                                    {productData.features.map((feature, index) => (
                                        <div key={index} className="feature-tag">
                                            <span>✓ {feature}</span>
                                            <button type="button" onClick={() => removeFeature(index)}>✕</button>
                                        </div>
                                    ))}
                                </div>

                                {productData.features.length === 0 && (
                                    <div className="no-features">
                                        <span>✨</span>
                                        <p>Add features to highlight your product</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Specifications Tab */}
                    {activeTab === 'specs' && (
                        <div className="form-tab fade-in">
                            <div className="specs-section">
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label>Model</label>
                                        <input
                                            type="text"
                                            name="spec.Model"
                                            value={productData.specifications['Model']}
                                            onChange={handleInputChange}
                                            placeholder="e.g., WH-1000XM4"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Color Options</label>
                                        <input
                                            type="text"
                                            name="spec.Color"
                                            value={productData.specifications['Color']}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Black/Silver/Blue"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Connectivity</label>
                                        <select
                                            name="spec.Connectivity"
                                            value={productData.specifications['Connectivity']}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select connectivity</option>
                                            {connectivityOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label>Battery Life</label>
                                        <input
                                            type="text"
                                            name="spec.Battery Life"
                                            value={productData.specifications['Battery Life']}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 30 hours"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Charging Time</label>
                                        <input
                                            type="text"
                                            name="spec.Charging Time"
                                            value={productData.specifications['Charging Time']}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 3 hours"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Weight</label>
                                        <input
                                            type="text"
                                            name="spec.Weight"
                                            value={productData.specifications['Weight']}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 254 grams"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Warranty</label>
                                        <input
                                            type="text"
                                            name="spec.Warranty"
                                            value={productData.specifications['Warranty']}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 1 year"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Variants Tab (Colors & Sizes) */}
                    {activeTab === 'variants' && (
                        <div className="form-tab fade-in">
                            <div className="variants-section">
                                {/* Colors */}
                                <div className="variant-group">
                                    <h3>Colors</h3>
                                    <div className="add-variant">
                                        <select
                                            value={colorInput}
                                            onChange={(e) => setColorInput(e.target.value)}
                                        >
                                            <option value="">Select color</option>
                                            {colorsList.map(color => (
                                                <option key={color} value={color}>{color}</option>
                                            ))}
                                        </select>
                                        <button type="button" onClick={addColor}>Add Color</button>
                                    </div>
                                    <div className="variant-tags">
                                        {productData.colors.map(color => (
                                            <div key={color} className="color-tag" style={{ backgroundColor: color.toLowerCase() }}>
                                                <span>{color}</span>
                                                <button type="button" onClick={() => removeColor(color)}>✕</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Sizes */}
                                <div className="variant-group">
                                    <h3>Sizes</h3>
                                    <div className="add-variant">
                                        <select
                                            value={sizeInput}
                                            onChange={(e) => setSizeInput(e.target.value)}
                                        >
                                            <option value="">Select size</option>
                                            {sizesList.map(size => (
                                                <option key={size} value={size}>{size}</option>
                                            ))}
                                        </select>
                                        <button type="button" onClick={addSize}>Add Size</button>
                                    </div>
                                    <div className="variant-tags">
                                        {productData.sizes.map(size => (
                                            <div key={size} className="size-tag">
                                                <span>{size}</span>
                                                <button type="button" onClick={() => removeSize(size)}>✕</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="form-actions">
                        <div className="action-buttons">
                            {activeTab !== 'basic' && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => {
                                        const tabs = ['basic', 'media', 'pricing', 'features', 'specs', 'variants'];
                                        const currentIndex = tabs.indexOf(activeTab);
                                        setActiveTab(tabs[currentIndex - 1]);
                                    }}
                                >
                                    ← Previous
                                </button>
                            )}

                            {activeTab !== 'variants' ? (
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const tabs = ['basic', 'media', 'pricing', 'features', 'specs', 'variants'];
                                        const currentIndex = tabs.indexOf(activeTab);
                                        if (currentIndex < tabs.length - 1)
                                            setActiveTab(tabs[currentIndex + 1]);
                                    }}
                                >
                                    Next →
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="btn-success"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="spinner-small"></div>
                                            Uploading {uploadProgress}%
                                        </>
                                    ) : (
                                        'Upload Product 🚀'
                                    )}
                                </button>
                            )}
                        </div>

                        {isSubmitting && (
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                </form>

                {/* Quick Stats */}
                <div className="quick-stats">
                    <div className="stat-card">
                        <div className="stat-value">{productData.images.length}/5</div>
                        <div className="stat-label">Images</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{productData.features.length}</div>
                        <div className="stat-label">Features</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{productData.colors.length}</div>
                        <div className="stat-label">Colors</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{productData.sizes.length}</div>
                        <div className="stat-label">Sizes</div>
                    </div>
                </div>

                {/* JSON Output Preview */}
                <div className="json-preview">
                    <h3>Product Data Preview (JSON Format)</h3>
                    <pre>
                        {JSON.stringify({
                            id: productData.id,
                            name: productData.name || 'Product Name',
                            brand: productData.brand || 'Brand',
                            rating: productData.rating || '0',
                            reviews: productData.reviews || '0',
                            price: productData.price || '0',
                            originalPrice: productData.originalPrice || '0',
                            discount: productData.discount || '0',
                            description: productData.description || 'Description',
                            features: productData.features,
                            specifications: productData.specifications,
                            images: productData.images.map(() => 'image_file'),
                            colors: productData.colors,
                            sizes: productData.sizes,
                            inStock: productData.inStock
                        }, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default UploadProduct;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiMoreVertical, FiX } from 'react-icons/fi';
import { getVendorProductsFromServer, deleteProductFromServer } from '../services/productService';
import UploadProduct from './UploadProduct';
import './VendorProducts.css';

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getVendorProductsFromServer();
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await deleteProductFromServer(productId);
        if (response.ok) {
           setProducts(products.filter(p => p._id !== productId));
        } else {
           alert("Failed to delete product");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  
  const handleEdit = (product) => {
     setEditingProduct(product);
     setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
      setEditingProduct(null);
      setIsUploadModalOpen(false);
  };

  return (
    <div className="vendor-products">
      <div className="vp-products-header">
        <h2>My Products</h2>
        <div className="vp-products-actions">
          <div className="vp-search-box">
            <FiSearch />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => { setEditingProduct(null); setIsUploadModalOpen(true); }} className="vp-btn-primary">
            <FiPlus /> Add New Product
          </button>
        </div>
      </div>

      <div className="vp-products-table-container">
        <table className="vp-table">
          <thead>
            <tr>
              <th>Product Details</th>
              <th>Price</th>
              <th>Stock Status</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" style={{textAlign: 'center', padding: '40px'}}>Loading products...</td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>
                    <div className="vp-product-cell">
                      <img 
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/48'} 
                        alt={product.name} 
                        className="vp-product-img" 
                      />
                      <div className="vp-product-info">
                        <h4>{product.name}</h4>
                        <p>{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong>₹{product.price}</strong>
                    <br/>
                    <span style={{textDecoration: 'line-through', fontSize: '12px', color: '#94a3b8'}}>₹{product.originalPrice}</span>
                  </td>
                  <td>
                    {product.inStock ? (
                      <span className="vp-status-badge instock">In Stock</span>
                    ) : (
                      <span className="vp-status-badge outstock">Out of Stock</span>
                    )}
                  </td>
                  <td>⭐ {product.rating} ({product.reviews} reviews)</td>
                  <td>
                    <div className="vp-action-btns">
                      <button className="vp-icon-btn" title="Edit" onClick={() => handleEdit(product)}>
                        <FiEdit2 />
                      </button>
                      <button className="vp-icon-btn delete" title="Delete" onClick={() => handleDelete(product._id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{textAlign: 'center', padding: '40px'}}>No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isUploadModalOpen && (
        <div className="vp-modal-overlay">
          <div className="vp-modal-content">
            <button className="vp-modal-close" onClick={closeUploadModal}>
              <FiX />
            </button>
            <div className="vp-modal-scrollable">
              <UploadProduct editingProduct={editingProduct} onUploadComplete={() => { closeUploadModal(); fetchProducts(); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;

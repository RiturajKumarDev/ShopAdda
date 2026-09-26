import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { 
  FiUser, FiBriefcase, FiCreditCard, FiCamera, 
  FiCheckCircle, FiEdit2, FiSave, FiStar, FiMapPin 
} from 'react-icons/fi';
import { getUserFromServer, updateUserToServer } from '../services/authService';
import './VendorProfile.css';

const VendorProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    dob: '',
    gender: '',
    role: 'Vendor',
    approved: false,
    joinDate: ''
  });

  const [businessData, setBusinessData] = useState({
    businessName: '',
    gstNumber: '',
    panNumber: '',
    aadharNumber: '',
    storeAddress: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userCookie = Cookies.get("userData");
      if (!userCookie) {
        navigate("/login");
        return;
      }
      
      try {
        const response = await getUserFromServer();
        if (response.ok) {
          const data = await response.json();
          if (data.dob) data.dob = data.dob.split('T')[0];
          if (data.joinDate) data.joinDate = data.joinDate.split('T')[0];
          setProfileData(data);
          
          setBusinessData({
            businessName: data.businessName || '',
            gstNumber: data.gstNumber || '',
            panNumber: data.panNumber || '',
            aadharNumber: data.aadharNumber || '',
            storeAddress: data.storeAddress || ''
          });
        } else {
          Cookies.remove("userData");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setBusinessData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = { ...profileData, ...businessData };
      const response = await updateUserToServer(payload);
      if (response.ok) {
        const result = await response.json();
        setProfileData(result.user);
        setBusinessData({
          businessName: result.user.businessName || '',
          gstNumber: result.user.gstNumber || '',
          panNumber: result.user.panNumber || '',
          aadharNumber: result.user.aadharNumber || '',
          storeAddress: result.user.storeAddress || ''
        });
        alert('Profile updated successfully! 🎉');
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        alert(`Update failed: ${errorData.errors ? errorData.errors.join(", ") : 'Please try again.'}`);
      }
    } catch (error) {
      alert('An error occurred while updating the profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vendor-profile-layout">
      {/* Header & Cover */}
      <div className="vp-header">
        <div className="vp-cover-actions">
          <button className="vp-btn-glass"><FiCamera /> Change Cover</button>
        </div>
      </div>

      <div className="vp-container">
        {/* Top Profile Card */}
        <div className="vp-top-card">
          <div className="vp-avatar-wrapper">
            <div className="vp-avatar-initial">
              {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : 'V'}
            </div>
            <div className="vp-avatar-edit">
              <FiCamera />
            </div>
          </div>
          
          <div className="vp-top-info">
            <h1>{profileData.fullName || 'Vendor Name'}</h1>
            <div className="vp-badges">
              {profileData.approved ? (
                <span className="vp-badge verified"><FiCheckCircle /> Verified Vendor</span>
              ) : (
                <span className="vp-badge" style={{background: '#fee2e2', color: '#991b1b'}}>Pending Approval</span>
              )}
              <span className="vp-badge rating"><FiStar /> 4.8 / 5.0 Rating</span>
            </div>
            
            <div className="vp-stats">
              <div className="vp-stat-item">
                <FiMapPin /> {businessData.storeAddress || 'N/A'}
              </div>
              <div className="vp-stat-item">
                <FiBriefcase /> Joined {profileData.joinDate || 'N/A'}
              </div>
            </div>
          </div>
          
          <div className="vp-top-actions">
            {!isEditing ? (
              <button className="vp-btn-primary" onClick={() => setIsEditing(true)}>
                <FiEdit2 /> Edit Profile
              </button>
            ) : (
              <button className="vp-btn-primary" onClick={handleSave} disabled={isLoading}>
                <FiSave /> {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>

        {/* Content Layout */}
        <div className="vp-content-grid">
          {/* Sidebar */}
          <div className="vp-sidebar-nav">
            <button 
              className={`vp-nav-btn ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <FiUser /> Personal Information
            </button>
            <button 
              className={`vp-nav-btn ${activeTab === 'business' ? 'active' : ''}`}
              onClick={() => setActiveTab('business')}
            >
              <FiBriefcase /> Business Details
            </button>
            <button 
              className={`vp-nav-btn ${activeTab === 'payout' ? 'active' : ''}`}
              onClick={() => setActiveTab('payout')}
            >
              <FiCreditCard /> Bank & Payouts
            </button>
          </div>

          {/* Main Forms */}
          <div className="vp-main-content">
            {activeTab === 'personal' && (
              <div className="vp-panel">
                <div className="vp-panel-header">
                  <h2 className="vp-panel-title">Personal Information</h2>
                </div>
                
                <div className="vp-form-grid">
                  <div className="vp-input-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`vp-input ${!isEditing ? 'readonly' : ''}`} 
                    />
                  </div>
                  <div className="vp-input-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`vp-input ${!isEditing ? 'readonly' : ''}`} 
                    />
                  </div>
                  <div className="vp-input-group">
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      name="mobile"
                      value={profileData.mobile}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`vp-input ${!isEditing ? 'readonly' : ''}`} 
                    />
                  </div>
                  <div className="vp-input-group">
                    <label>Date of Birth</label>
                    <input 
                      type="date" 
                      name="dob"
                      value={profileData.dob}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`vp-input ${!isEditing ? 'readonly' : ''}`} 
                    />
                  </div>
                  <div className="vp-input-group">
                    <label>Gender</label>
                    <select 
                      name="gender"
                      value={profileData.gender}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`vp-input ${!isEditing ? 'readonly' : ''}`}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="vp-input-group">
                    <label>Account Role</label>
                    <input 
                      type="text" 
                      value={profileData.role}
                      disabled
                      className="vp-input readonly" 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'business' && (
              <div className="vp-panel">
                <div className="vp-panel-header">
                  <h2 className="vp-panel-title">Business Details</h2>
                  <span style={{fontSize: '13px', color: '#64748b'}}>* Visible to customers</span>
                </div>
                
                <div className="vp-form-grid full">
                  <div className="vp-input-group">
                    <label>Business Name</label>
                    <input 
                      type="text" 
                      name="businessName"
                      value={businessData.businessName}
                      onChange={handleBusinessChange}
                      disabled={!isEditing}
                      className={`vp-input ${!isEditing ? 'readonly' : ''}`} 
                    />
                  </div>
                  <div className="vp-input-group">
                    <label>Store Address</label>
                    <textarea 
                      name="storeAddress"
                      value={businessData.storeAddress}
                      onChange={handleBusinessChange}
                      disabled={!isEditing}
                      className={`vp-input ${!isEditing ? 'readonly' : ''}`} 
                    />
                  </div>
                </div>

                <div className="vp-form-grid" style={{marginTop: '24px'}}>
                  <div className="vp-input-group">
                    <label>GST Identification Number</label>
                    <input 
                      type="text" 
                      name="gstNumber"
                      value={businessData.gstNumber}
                      onChange={handleBusinessChange}
                      disabled={!isEditing}
                      className={`vp-input ${!isEditing ? 'readonly' : ''}`} 
                    />
                  </div>
                  <div className="vp-input-group">
                    <label>PAN Number</label>
                    <input 
                      type="text" 
                      name="panNumber"
                      value={businessData.panNumber}
                      onChange={handleBusinessChange}
                      disabled={!isEditing}
                      className={`vp-input ${!isEditing ? 'readonly' : ''}`} 
                    />
                  </div>
                  <div className="vp-input-group">
                    <label>Aadhar Number</label>
                    <input 
                      type="text" 
                      name="aadharNumber"
                      value={businessData.aadharNumber}
                      onChange={handleBusinessChange}
                      disabled={!isEditing}
                      className={`vp-input ${!isEditing ? 'readonly' : ''}`} 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payout' && (
              <div className="vp-panel">
                <div className="vp-panel-header">
                  <h2 className="vp-panel-title">Bank & Payout Information</h2>
                </div>
                
                <div className="vp-form-grid">
                  <div className="vp-input-group">
                    <label>Bank Name</label>
                    <input 
                      type="text" 
                      value="HDFC Bank"
                      disabled={!isEditing}
                      className={`vp-input ${!isEditing ? 'readonly' : ''}`} 
                    />
                  </div>
                  <div className="vp-input-group">
                    <label>Account Holder Name</label>
                    <input 
                      type="text" 
                      value={profileData.fullName}
                      disabled={!isEditing}
                      className={`vp-input ${!isEditing ? 'readonly' : ''}`} 
                    />
                  </div>
                  <div className="vp-input-group">
                    <label>Account Number</label>
                    <input 
                      type="password" 
                      value="123456789012"
                      disabled={!isEditing}
                      className={`vp-input ${!isEditing ? 'readonly' : ''}`} 
                    />
                  </div>
                  <div className="vp-input-group">
                    <label>IFSC Code</label>
                    <input 
                      type="text" 
                      value="HDFC0001234"
                      disabled={!isEditing}
                      className={`vp-input ${!isEditing ? 'readonly' : ''}`} 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;

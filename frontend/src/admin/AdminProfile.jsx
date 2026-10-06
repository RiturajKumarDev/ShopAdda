import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiShield } from 'react-icons/fi';
import { updateUserToServer, changePasswordToServer, getUserFromServer } from '../services/authService';
import './AdminProfile.css';

const AdminProfile = ({ initialUser }) => {
  const [user, setUser] = useState(initialUser || { fullName: '', email: '', mobile: '', role: 'Admin' });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [pwdStatus, setPwdStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    // Fetch latest user details on mount just to be sure
    const fetchUser = async () => {
      try {
        const res = await getUserFromServer();
        if (res.ok) {
          const data = await res.json();
          setUser(prev => ({ ...prev, ...data }));
        }
      } catch (err) {}
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      const res = await updateUserToServer({
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile
      });
      if (res.ok) {
        setStatus({ type: 'success', message: 'Profile updated successfully!' });
      } else {
        const data = await res.json();
        setStatus({ type: 'error', message: data.errors?.[0] || 'Update failed' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Server error occurred' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdStatus({ type: '', message: '' });
    if (!passwords.oldPassword || !passwords.newPassword) {
      return setPwdStatus({ type: 'error', message: 'Please fill all fields' });
    }
    try {
      const res = await changePasswordToServer(passwords);
      if (res.ok) {
        setPwdStatus({ type: 'success', message: 'Password changed successfully!' });
        setPasswords({ oldPassword: '', newPassword: '' });
      } else {
        const data = await res.json();
        setPwdStatus({ type: 'error', message: data.errors?.[0] || 'Password change failed' });
      }
    } catch (err) {
      setPwdStatus({ type: 'error', message: 'Server error occurred' });
    }
  };

  return (
    <div className="admin-profile-container">
      <div className="admin-prof-header">
        <h1 className="admin-prof-title">Admin Profile</h1>
        <p className="admin-prof-subtitle">Manage your personal information and security settings.</p>
      </div>

      <div className="admin-prof-grid">
        {/* Left Column - Card */}
        <div className="admin-prof-card">
          <div className="admin-prof-avatar-large">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
          </div>
          <h3>{user?.fullName || 'Admin User'}</h3>
          <p>{user?.role || 'Superadmin'}</p>
          <div style={{width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)', margin: '16px 0'}}></div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', textAlign: 'left'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', color: '#a1a1aa', fontSize: '14px'}}>
              <FiMail /> <span>{user?.email || 'No email set'}</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', color: '#a1a1aa', fontSize: '14px'}}>
              <FiPhone /> <span>{user?.mobile || 'No mobile set'}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="admin-prof-details">
          
          {/* Update Info Form */}
          <div className="admin-prof-section">
            <h2 className="admin-prof-section-title"><FiUser /> Personal Information</h2>
            {status.message && (
              <div className={status.type === 'success' ? 'admin-prof-success-msg' : 'admin-prof-error-msg'}>
                {status.message}
              </div>
            )}
            <form onSubmit={handleUpdateProfile}>
              <div className="admin-prof-form-grid">
                <div className="admin-prof-form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={user.fullName || ''} 
                    onChange={e => setUser({...user, fullName: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="admin-prof-form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={user.email || ''} 
                    onChange={e => setUser({...user, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="admin-prof-form-group">
                  <label>Mobile Number</label>
                  <input 
                    type="text" 
                    value={user.mobile || ''} 
                    onChange={e => setUser({...user, mobile: e.target.value})}
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '16px'}}>
                <button type="submit" className="admin-prof-btn-update" style={{width: 'auto'}}>Save Changes</button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="admin-prof-section">
            <h2 className="admin-prof-section-title"><FiShield /> Security Settings</h2>
            {pwdStatus.message && (
              <div className={pwdStatus.type === 'success' ? 'admin-prof-success-msg' : 'admin-prof-error-msg'}>
                {pwdStatus.message}
              </div>
            )}
            <form onSubmit={handleChangePassword}>
              <div className="admin-prof-form-grid">
                <div className="admin-prof-form-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    value={passwords.oldPassword}
                    onChange={e => setPasswords({...passwords, oldPassword: e.target.value})}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="admin-prof-form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    value={passwords.newPassword}
                    onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '16px'}}>
                <button type="submit" className="admin-prof-btn-update" style={{width: 'auto', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)'}}>Update Password</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

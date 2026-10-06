import React, { useState, useEffect } from 'react';
import { FiSearch, FiMoreVertical, FiEdit2, FiTrash2, FiUserCheck, FiUserX, FiMail, FiCalendar, FiDownload } from 'react-icons/fi';
import { getAllUsersFromServer, deleteUserFromServer, updateUserByAdminToServer } from '../services/authService';
import './AdminVendors.css';

const AdminVendors = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: '', email: '', approved: false, businessName: '', gstNumber: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsersFromServer();
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = users.filter(user => {
    if (user.role !== 'Vendor') return false;
    const matchesSearch = (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (user.businessName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      businessName: user.businessName || '',
      gstNumber: user.gstNumber || '',
      approved: user.approved !== false
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUserByAdminToServer(editingUser, editForm);
      if (res.ok) {
        alert("User updated successfully");
        setEditingUser(null);
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.errors?.[0] || "Failed to update user");
      }
    } catch (err) {
      alert("Error updating user");
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'Admin': return 'role-admin';
      case 'Vendor': return 'role-vendor';
      default: return 'role-customer';
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await deleteUserFromServer(userId);
        if (res.ok) {
          setUsers(users.filter(u => u._id !== userId));
          alert("User deleted successfully.");
        } else {
          const data = await res.json();
          alert(data.errors?.[0] || "Failed to delete user.");
        }
      } catch (err) {
        alert("An error occurred while deleting the user.");
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Business Name", "GST Number", "Status", "Joined"];
    const rows = filteredVendors.map(u => [
      u._id,
      u.fullName || 'N/A',
      u.email || 'N/A',
      u.businessName || 'N/A',
      u.gstNumber || 'N/A',
      u.approved !== false ? 'Active' : 'Pending',
      u.joinDate ? new Date(u.joinDate).toLocaleDateString() : 'N/A'
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vendors_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-users-container">
      <div className="users-header-section">
        <div>
          <h2 className="users-title">Vendor Management</h2>
          <p className="users-subtitle">Review, approve, and manage seller accounts.</p>
        </div>
        <div className="users-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="export-btn" onClick={handleExportCSV}>
            <FiDownload />
            Export CSV
          </button>
        </div>
      </div>

      <div className="users-table-card glass-panel">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading vendors...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Vendor Info</th>
                  <th>Business Details</th>
                  <th>GST Number</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.length > 0 ? (
                  filteredVendors.map(user => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-info-cell">
                          <div className="admin-user-avatar">
                            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="user-details">
                            <span className="user-name">{user.fullName || 'Unknown User'}</span>
                            <span className="user-email">
                              <FiMail className="small-icon" /> {user.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="vendor-business-name">
                          {user.businessName || <span style={{color: '#71717a'}}>N/A</span>}
                        </span>
                      </td>
                      <td>
                        <span className="vendor-gst">
                          {user.gstNumber || <span style={{color: '#71717a'}}>N/A</span>}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.approved !== false ? 'status-active' : 'status-pending'}`}>
                          {user.approved !== false ? 'Active' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="date-cell">
                          <FiCalendar className="small-icon" />
                          {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="admin-icon-btn admin-edit-btn" title="Edit User" onClick={() => handleEditClick(user)}>
                            <FiEdit2 />
                          </button>
                          <button className="admin-icon-btn admin-delete-btn" title="Delete User" onClick={() => handleDeleteUser(user._id)}>
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <FiUserX className="empty-icon" />
                      <p>No vendors found matching your criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingUser && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3 className="admin-modal-title">Edit Vendor</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="admin-form-group">
                <label>Full Name</label>
                <input type="text" value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} required />
              </div>
              <div className="admin-form-group">
                <label>Email</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} required />
              </div>
              <div className="admin-form-group">
                <label>Business Name</label>
                <input type="text" value={editForm.businessName} onChange={e => setEditForm({...editForm, businessName: e.target.value})} />
              </div>
              <div className="admin-form-group">
                <label>GST Number</label>
                <input type="text" value={editForm.gstNumber} onChange={e => setEditForm({...editForm, gstNumber: e.target.value})} />
              </div>
              <div className="admin-form-group">
                <label>Status</label>
                <select value={editForm.approved} onChange={e => setEditForm({...editForm, approved: e.target.value === 'true'})}>
                  <option value="true">Active (Approved)</option>
                  <option value="false">Pending (Not Approved)</option>
                </select>
              </div>
              
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn admin-btn-cancel" onClick={() => setEditingUser(null)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-save">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVendors;

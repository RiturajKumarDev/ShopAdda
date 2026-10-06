import React, { useState, useEffect } from 'react';
import { FiSearch, FiMail, FiPhone, FiCalendar, FiUser } from 'react-icons/fi';
import { getAllUsersFromServer } from '../services/authService';
import './VendorCustomers.css';

const VendorCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsersFromServer();
      if (response.ok) {
        const data = await response.json();
        // Exclude admins and vendors if desired, or show all. The prompt said "show list of all users".
        setCustomers(data);
      }
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    (customer.fullName && customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="vendor-customers">
      <div className="vc-header">
        <h2>Customers</h2>
        <div className="vc-search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="vc-table-container">
        <table className="vc-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact Info</th>
              <th>Role</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Loading customers...</td>
              </tr>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map(customer => (
                <tr key={customer._id}>
                  <td>
                    <div className="vc-user-cell">
                      <div className="vc-avatar">
                        {customer.fullName ? customer.fullName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="vc-user-info">
                        <h4>{customer.fullName}</h4>
                        <p>{customer.gender || 'Not specified'}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="vc-contact-info">
                      <span><FiMail /> {customer.email}</span>
                      <span><FiPhone /> {customer.mobile || 'No phone'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`vc-role-badge ${customer.role?.toLowerCase() || 'user'}`}>
                      {customer.role || 'User'}
                    </span>
                  </td>
                  <td>
                    <div className="vc-date-info">
                      <FiCalendar /> {customer.joinDate ? new Date(customer.joinDate).toLocaleDateString() : 'Unknown'}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorCustomers;

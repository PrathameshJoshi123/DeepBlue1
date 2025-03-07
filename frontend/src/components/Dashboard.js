import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/Dashboard.css";
import { useLanguage } from '../context/LanguageContext';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaBox, FaUtensils } from 'react-icons/fa';

const Dashboard = () => {
  const [donations, setDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { language } = useLanguage();

  const messages = {
    titles: {
      availableDonations: {
        'en': 'Available Donations Near You',
        'hi': 'आपके पास उपलब्ध दान'
      },
      acceptedDonations: {
        'en': 'Accepted Donations',
        'hi': 'स्वीकृत दान'
      },
      donationDetails: {
        'en': 'Donation Details',
        'hi': 'दान विवरण'
      }
    },
    loading: {
      'en': 'Loading...',
      'hi': 'लोड हो रहा है...'
    },
    noDonations: {
      available: {
        'en': 'No available donations within 5KM.',
        'hi': '5 किमी के भीतर कोई दान उपलब्ध नहीं है।'
      },
      accepted: {
        'en': 'No accepted donations.',
        'hi': 'कोई स्वीकृत दान नहीं।'
      }
    },
    tableHeaders: {
      foodType: {
        'en': 'Food Type',
        'hi': 'भोजन का प्रकार'
      },
      quantity: {
        'en': 'Quantity',
        'hi': 'मात्रा'
      },
      expiryDate: {
        'en': 'Expiry Date',
        'hi': 'समाप्ति तिथि'
      },
      status: {
        'en': 'Status',
        'hi': 'स्थिति'
      },
      donorName: {
        'en': 'Donor',
        'hi': 'दाता'
      },
      receiverName: {
        'en': 'Receiver',
        'hi': 'प्राप्तकर्ता'
      },
      deliveryPartner: {
        'en': 'Delivery Partner',
        'hi': 'डिलीवरी पार्टनर'
      },
      actions: {
        'en': 'Actions',
        'hi': 'कार्रवाई'
      }
    },
    buttons: {
      accept: {
        'en': 'Accept',
        'hi': 'स्वीकार करें'
      },
      view: {
        'en': 'View Details',
        'hi': 'विवरण देखें'
      },
      close: {
        'en': 'Close',
        'hi': 'बंद करें'
      },
      confirm: {
        'en': 'Confirm Acceptance',
        'hi': 'स्वीकृति की पुष्टि करें'
      },
      cancel: {
        'en': 'Cancel',
        'hi': 'रद्द करें'
      }
    },
    status: {
      Pending: {
        'en': 'Pending',
        'hi': 'लंबित'
      },
      Accepted: {
        'en': 'Accepted',
        'hi': 'स्वीकृत'
      },
      'Picked Up': {
        'en': 'Picked Up',
        'hi': 'उठाया गया'
      },
      Delivered: {
        'en': 'Delivered',
        'hi': 'वितरित'
      },
      Canceled: {
        'en': 'Canceled',
        'hi': 'रद्द'
      }
    },
    details: {
      donor: {
        'en': 'Donor',
        'hi': 'दाता'
      },
      receiver: {
        'en': 'Receiver',
        'hi': 'प्राप्तकर्ता'
      },
      deliveryPartner: {
        'en': 'Delivery Partner',
        'hi': 'डिलीवरी पार्टनर'
      },
      address: {
        'en': 'Address',
        'hi': 'पता'
      },
      contact: {
        'en': 'Contact',
        'hi': 'संपर्क'
      },
      foodDetails: {
        'en': 'Food Details',
        'hi': 'भोजन विवरण'
      },
      acceptConfirmation: {
        'en': 'Are you sure you want to accept this donation?',
        'hi': 'क्या आप वाकई इस दान को स्वीकार करना चाहते हैं?'
      }
    },
    error: {
      'en': 'An error occurred. Please try again.',
      'hi': 'एक त्रुटि हुई। कृपया पुन: प्रयास करें।'
    },
    success: {
      'en': 'Donation accepted successfully!',
      'hi': 'दान सफलतापूर्वक स्वीकार किया गया!'
    }
  };

  useEffect(() => {
    // Get user role from session storage
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.role) {
      setUserRole(user.role);
      console.log("User role:", user.role);
    } else {
      console.log("No user role found in session storage");
    }
    
    fetchDonations();
    fetchAcceptedDonations();
  }, []);

  const getMessage = (path) => {
    const langCode = language.split('-')[0];
    
    // Handle nested paths like 'status.completed'
    if (typeof path === 'string' && path.includes('.')) {
      const parts = path.split('.');
      let current = messages;
      
      for (const part of parts) {
        if (current[part]) {
          current = current[part];
        } else {
          return path; // Return the path if any part is missing
        }
      }
      
      return current[langCode] || current['en'] || path;
    }
    
    // Direct access for simple paths
    return path && messages[path] ? 
      (messages[path][langCode] || messages[path]['en']) : path;
  };

  const getImageUrl = (absolutePath) => {
    if (!absolutePath) return '';
    
    // Check if it's already a URL
    if (absolutePath.startsWith('http')) {
      return absolutePath;
    }
    
    // Extract the filename from the absolute path
    const parts = absolutePath.split(/[\/\\]/); // Split by both forward and backward slashes
    const filename = parts[parts.length - 1];
    return `http://localhost:5000/static/uploads/donations/${filename}`;
  };

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      // Add test mode parameter to bypass distance check
      const response = await axios.get("http://localhost:5000/donation/nearby?bypass_distance=true", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Nearby donations response:", response.data);
      setDonations(response.data.nearby_donations || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching donations:", error);
      setError(getMessage('error'));
      setLoading(false);
    }
  };

  const fetchAcceptedDonations = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      // Add test mode parameter to get all donations with status "Accepted"
      const response = await axios.get("http://localhost:5000/donation/accepted?test_mode=true", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Accepted donations response:", response.data);
      setAcceptedDonations(response.data.accepted_donations || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching accepted donations:", error);
      setError(getMessage('error'));
      setLoading(false);
    }
  };

  const handleAcceptDonation = async (donationId) => {
    try {
      setAcceptLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/donation/accept/${donationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Refresh the donations lists
        fetchDonations();
        fetchAcceptedDonations();
        setShowModal(false);
        
        // Show success message (you can implement a toast notification here)
        alert(getMessage('success'));
      }
    } catch (error) {
      console.error("Error accepting donation:", error);
      setError(getMessage('error'));
    } finally {
      setAcceptLoading(false);
    }
  };

  const openDonationModal = (donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(language, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Accepted':
        return 'status-accepted';
      case 'Pending':
        return 'status-pending';
      case 'Picked Up':
        return 'status-picked-up';
      case 'Delivered':
        return 'status-delivered';
      case 'Canceled':
        return 'status-canceled';
      default:
        return '';
    }
  };

  return (
    <div className="dashboard-container">
      {error && <div className="error-message">{error}</div>}
      
      {/* Debug information */}
      <div className="debug-info" style={{ marginBottom: '10px', padding: '5px', background: '#f0f0f0', borderRadius: '4px' }}>
        <p>User Role: {userRole || 'Not set'}</p>
        <p>Available Donations: {donations.length}</p>
        <p>Accepted Donations: {acceptedDonations.length}</p>
        <a href="/test" style={{ 
          display: 'inline-block',
          padding: '5px 10px',
          backgroundColor: '#2196F3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          marginTop: '5px'
        }}>
          Go to Test Page
        </a>
      </div>
      
      {/* Available Donations Section */}
      <div className="dashboard-section">
        <h2>{getMessage('titles.availableDonations')}</h2>
        {loading ? (
          <p className="loading-message">{getMessage('loading')}</p>
        ) : donations.length === 0 ? (
          <p className="no-data-message">{getMessage('noDonations.available')}</p>
        ) : (
          <div className="donations-grid">
            {donations.map((donation) => (
              <div key={donation.id || donation._id} className="donation-card">
                <div className="donation-header">
                  <div className="food-type">
                    <FaUtensils />
                    <span>{donation.food_type}</span>
                  </div>
                  <div className={`donation-status ${getStatusClass(donation.status)}`}>
                    {getMessage(`status.${donation.status}`) || donation.status}
                  </div>
                </div>
                
                {donation.image_url && (
                  <div className="donation-image">
                    <img src={getImageUrl(donation.image_url)} alt={donation.food_type} />
                  </div>
                )}
                
                <div className="donation-details">
                  <div className="detail-item">
                    <FaBox />
                    <span><strong>{getMessage('tableHeaders.quantity')}:</strong> {donation.quantity} {donation.unit}</span>
                  </div>
                  
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <span><strong>{getMessage('tableHeaders.expiryDate')}:</strong> {formatDate(donation.expiry_date)}</span>
                  </div>
                  
                  {donation.donor_name && (
                    <div className="detail-item">
                      <FaInfoCircle />
                      <span><strong>{getMessage('tableHeaders.donorName')}:</strong> {donation.donor_name}</span>
                    </div>
                  )}
                  
                  {donation.donor_address && (
                    <div className="detail-item">
                      <FaMapMarkerAlt />
                      <span><strong>{getMessage('details.address')}:</strong> {donation.donor_address}</span>
                    </div>
                  )}
                </div>
                
                <div className="donation-actions">
                  <button 
                    className="view-button"
                    onClick={() => openDonationModal(donation)}
                  >
                    {getMessage('buttons.view')}
                  </button>
                  {userRole === 'receiver' && (
                    <button 
                      className="accept-button"
                      onClick={() => openDonationModal(donation)}
                    >
                      {getMessage('buttons.accept')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Accepted Donations Section */}
      <div className="dashboard-section">
        <h2>{getMessage('titles.acceptedDonations')}</h2>
        {loading ? (
          <p className="loading-message">{getMessage('loading')}</p>
        ) : acceptedDonations.length === 0 ? (
          <p className="no-data-message">{getMessage('noDonations.accepted')}</p>
        ) : (
          <div className="donations-grid">
            {acceptedDonations.map((donation) => (
              <div key={donation.id || donation._id} className="donation-card">
                <div className="donation-header">
                  <div className="food-type">
                    <FaUtensils />
                    <span>{donation.food_type}</span>
                  </div>
                  <div className={`donation-status ${getStatusClass(donation.status)}`}>
                    {getMessage(`status.${donation.status}`) || donation.status}
                  </div>
                </div>
                
                {donation.image_url && (
                  <div className="donation-image">
                    <img src={getImageUrl(donation.image_url)} alt={donation.food_type} />
                  </div>
                )}
                
                <div className="donation-details">
                  <div className="detail-item">
                    <FaBox />
                    <span><strong>{getMessage('tableHeaders.quantity')}:</strong> {donation.quantity} {donation.unit}</span>
                  </div>
                  
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <span><strong>{getMessage('tableHeaders.expiryDate')}:</strong> {formatDate(donation.expiry_date)}</span>
                  </div>
                  
                  {/* Show donor info for receivers */}
                  {userRole === 'receiver' && donation.donor_name && (
                    <div className="detail-item">
                      <FaInfoCircle />
                      <span><strong>{getMessage('tableHeaders.donorName')}:</strong> {donation.donor_name}</span>
                    </div>
                  )}
                  
                  {/* Show receiver info for donors */}
                  {userRole === 'donor' && donation.receiver_name && (
                    <div className="detail-item">
                      <FaInfoCircle />
                      <span><strong>{getMessage('tableHeaders.receiverName')}:</strong> {donation.receiver_name}</span>
                    </div>
                  )}
                  
                  {/* Show delivery partner info for both donors and receivers */}
                  {(userRole === 'donor' || userRole === 'receiver') && donation.delivery_partner_name && (
                    <div className="detail-item">
                      <FaInfoCircle />
                      <span><strong>{getMessage('tableHeaders.deliveryPartner')}:</strong> {donation.delivery_partner_name}</span>
                    </div>
                  )}
                </div>
                
                <div className="donation-actions">
                  <button 
                    className="view-button"
                    onClick={() => openDonationModal(donation)}
                  >
                    {getMessage('buttons.view')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Donation Details Modal */}
      {showModal && selectedDonation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{getMessage('titles.donationDetails')}</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="donation-detail-section">
                <h4>{getMessage('details.foodDetails')}</h4>
                <p><strong>{getMessage('tableHeaders.foodType')}:</strong> {selectedDonation.food_type}</p>
                <p><strong>{getMessage('tableHeaders.quantity')}:</strong> {selectedDonation.quantity} {selectedDonation.unit}</p>
                <p><strong>{getMessage('tableHeaders.expiryDate')}:</strong> {formatDate(selectedDonation.expiry_date)}</p>
                <p><strong>{getMessage('tableHeaders.status')}:</strong> {getMessage(`status.${selectedDonation.status}`) || selectedDonation.status}</p>
              </div>
              
              {/* Donor details */}
              {selectedDonation.donor_name && (
                <div className="donation-detail-section">
                  <h4>{getMessage('details.donor')}</h4>
                  <p><strong>{getMessage('tableHeaders.donorName')}:</strong> {selectedDonation.donor_name}</p>
                  {selectedDonation.donor_address && (
                    <p><strong>{getMessage('details.address')}:</strong> {selectedDonation.donor_address}</p>
                  )}
                  {selectedDonation.donor_contact && (
                    <p><strong>{getMessage('details.contact')}:</strong> {selectedDonation.donor_contact}</p>
                  )}
                </div>
              )}
              
              {/* Receiver details */}
              {selectedDonation.receiver_name && (
                <div className="donation-detail-section">
                  <h4>{getMessage('details.receiver')}</h4>
                  <p><strong>{getMessage('tableHeaders.receiverName')}:</strong> {selectedDonation.receiver_name}</p>
                  {selectedDonation.receiver_address && (
                    <p><strong>{getMessage('details.address')}:</strong> {selectedDonation.receiver_address}</p>
                  )}
                  {selectedDonation.receiver_contact && (
                    <p><strong>{getMessage('details.contact')}:</strong> {selectedDonation.receiver_contact}</p>
                  )}
                </div>
              )}
              
              {/* Delivery Partner details */}
              {selectedDonation.delivery_partner_name && (
                <div className="donation-detail-section">
                  <h4>{getMessage('details.deliveryPartner')}</h4>
                  <p><strong>{getMessage('tableHeaders.deliveryPartner')}:</strong> {selectedDonation.delivery_partner_name}</p>
                  {selectedDonation.delivery_partner_contact && (
                    <p><strong>{getMessage('details.contact')}:</strong> {selectedDonation.delivery_partner_contact}</p>
                  )}
                </div>
              )}
              
              {/* Accept confirmation for available donations */}
              {userRole === 'receiver' && selectedDonation.status === 'Pending' && (
                <div className="donation-detail-section accept-confirmation">
                  <p>{getMessage('details.acceptConfirmation')}</p>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                {getMessage('buttons.close')}
              </button>
              
              {userRole === 'receiver' && selectedDonation.status === 'Pending' && (
                <button 
                  className="confirm-button"
                  onClick={() => handleAcceptDonation(selectedDonation.id || selectedDonation._id)}
                  disabled={acceptLoading}
                >
                  {acceptLoading ? getMessage('loading') : getMessage('buttons.confirm')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

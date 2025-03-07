import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/Dashboard.css";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaBox, FaUtensils, FaTruck, FaRoute } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const DeliveryDashboard = () => {
  const [deliveries, setDeliveries] = useState([]); // Pending deliveries
  const [acceptedDeliveries, setAcceptedDeliveries] = useState([]); // Accepted deliveries
  const [loading, setLoading] = useState(true);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { language } = useLanguage();

  const messages = {
    titles: {
      availableDeliveries: {
        'en': 'Available Deliveries',
        'hi': 'उपलब्ध डिलीवरी'
      },
      acceptedDeliveries: {
        'en': 'My Accepted Deliveries',
        'hi': 'मेरी स्वीकृत डिलीवरी'
      },
      deliveryDetails: {
        'en': 'Delivery Details',
        'hi': 'डिलीवरी विवरण'
      }
    },
    loading: {
      'en': 'Loading...',
      'hi': 'लोड हो रहा है...'
    },
    noDeliveries: {
      available: {
        'en': 'No available deliveries.',
        'hi': 'कोई उपलब्ध डिलीवरी नहीं है।'
      },
      accepted: {
        'en': 'No accepted deliveries.',
        'hi': 'कोई स्वीकृत डिलीवरी नहीं है।'
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
      pickupAddress: {
        'en': 'Pickup Address',
        'hi': 'पिकअप पता'
      },
      deliveryAddress: {
        'en': 'Delivery Address',
        'hi': 'डिलीवरी पता'
      },
      distance: {
        'en': 'Distance',
        'hi': 'दूरी'
      },
      actions: {
        'en': 'Actions',
        'hi': 'कार्रवाई'
      }
    },
    buttons: {
      accept: {
        'en': 'Accept Delivery',
        'hi': 'डिलीवरी स्वीकार करें'
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
      },
      markPickedUp: {
        'en': 'Mark as Picked Up',
        'hi': 'पिक अप के रूप में चिह्नित करें'
      },
      markDelivered: {
        'en': 'Mark as Delivered',
        'hi': 'वितरित के रूप में चिह्नित करें'
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
      },
      'Ready for Delivery': {
        'en': 'Ready for Delivery',
        'hi': 'डिलीवरी के लिए तैयार'
      }
    },
    details: {
      donor: {
        'en': 'Donor Information',
        'hi': 'दाता जानकारी'
      },
      receiver: {
        'en': 'Receiver Information',
        'hi': 'प्राप्तकर्ता जानकारी'
      },
      pickup: {
        'en': 'Pickup Details',
        'hi': 'पिकअप विवरण'
      },
      delivery: {
        'en': 'Delivery Details',
        'hi': 'डिलीवरी विवरण'
      },
      food: {
        'en': 'Food Details',
        'hi': 'भोजन विवरण'
      },
      address: {
        'en': 'Address',
        'hi': 'पता'
      },
      contact: {
        'en': 'Contact',
        'hi': 'संपर्क'
      },
      acceptConfirmation: {
        'en': 'Are you sure you want to accept this delivery?',
        'hi': 'क्या आप वाकई इस डिलीवरी को स्वीकार करना चाहते हैं?'
      }
    },
    error: {
      'en': 'An error occurred. Please try again.',
      'hi': 'एक त्रुटि हुई। कृपया पुन: प्रयास करें।'
    },
    success: {
      'en': 'Delivery accepted successfully!',
      'hi': 'डिलीवरी सफलतापूर्वक स्वीकार की गई!'
    }
  };

  useEffect(() => {
    console.log("DeliveryDashboard component mounted");
    fetchDeliveries();
    fetchAcceptedDeliveries();
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

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      // Add test mode parameter for testing
      const response = await axios.get(
        "http://localhost:5000/donation/ready_for_delivery?test_mode=true",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Available deliveries response:", response.data);
      setDeliveries(response.data.donations || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setError(getMessage('error'));
      setLoading(false);
    }
  };

  const fetchAcceptedDeliveries = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      // Add test mode parameter for testing
      const response = await axios.get(
        "http://localhost:5000/donation/accepted?test_mode=true&status=Accepted",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Accepted deliveries response:", response.data);
      setAcceptedDeliveries(response.data.accepted_donations || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching accepted deliveries:", error);
      setError(getMessage('error'));
      setLoading(false);
    }
  };

  const handleAcceptDelivery = async (donationId) => {
    try {
      console.log("Accepting delivery with ID:", donationId);
      setAcceptLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/donation/delivery/accept/${donationId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Accept delivery response:", response.data);

      if (response.status === 200) {
        // Refresh the deliveries lists
        fetchDeliveries();
        fetchAcceptedDeliveries();
        setShowModal(false);
        
        // Show success message
        alert(getMessage('success'));
      }
    } catch (error) {
      console.error("Error accepting delivery:", error.response?.data || error.message);
      setError(getMessage('error'));
    } finally {
      setAcceptLoading(false);
    }
  };

  const openDeliveryModal = (delivery) => {
    setSelectedDelivery(delivery);
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
      case 'Ready for Delivery':
        return 'status-ready-for-delivery';
      default:
        return '';
    }
  };

  const calculateDistance = (pickup, delivery) => {
    // This is a simplified calculation - in a real app, you'd use a mapping API
    if (!pickup || !delivery || !pickup.coordinates || !delivery.coordinates) {
      return 'Unknown';
    }
    
    const [pickupLon, pickupLat] = pickup.coordinates;
    const [deliveryLon, deliveryLat] = delivery.coordinates;
    
    // Simple Haversine formula for distance calculation
    const R = 6371; // Radius of the Earth in km
    const dLat = (deliveryLat - pickupLat) * Math.PI / 180;
    const dLon = (deliveryLon - pickupLon) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pickupLat * Math.PI / 180) * Math.cos(deliveryLat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    
    return `${distance.toFixed(1)} km`;
  };

  return (
    <div className="dashboard-container">
      {error && <div className="error-message">{error}</div>}
      
      {/* Debug information */}
      <div className="debug-info" style={{ marginBottom: '10px', padding: '5px', background: '#f0f0f0', borderRadius: '4px' }}>
        <p>Available Deliveries: {deliveries.length}</p>
        <p>Accepted Deliveries: {acceptedDeliveries.length}</p>
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
      
      {/* Available Deliveries Section */}
      <div className="dashboard-section">
        <h2>{getMessage('titles.availableDeliveries')}</h2>
        {loading ? (
          <p className="loading-message">{getMessage('loading')}</p>
        ) : deliveries.length === 0 ? (
          <p className="no-data-message">{getMessage('noDeliveries.available')}</p>
        ) : (
          <div className="donations-grid">
            {deliveries.map((delivery) => (
              <div key={delivery.id || delivery._id} className="donation-card">
                <div className="donation-header">
                  <div className="food-type">
                    <FaUtensils />
                    <span>{delivery.food_type}</span>
                  </div>
                  <div className={`donation-status ${getStatusClass(delivery.status)}`}>
                    {getMessage(`status.${delivery.status}`) || delivery.status}
                  </div>
                </div>
                
                {delivery.image_url && (
                  <div className="donation-image">
                    <img src={getImageUrl(delivery.image_url)} alt={delivery.food_type} />
                  </div>
                )}
                
                <div className="donation-details">
                  <div className="detail-item">
                    <FaBox />
                    <span><strong>{getMessage('tableHeaders.quantity')}:</strong> {delivery.quantity} {delivery.unit}</span>
                  </div>
                  
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <span><strong>{getMessage('tableHeaders.expiryDate')}:</strong> {formatDate(delivery.expiry_date)}</span>
                  </div>
                  
                  {delivery.donor_name && (
                    <div className="detail-item">
                      <FaInfoCircle />
                      <span><strong>{getMessage('tableHeaders.donorName')}:</strong> {delivery.donor_name}</span>
                    </div>
                  )}
                  
                  {delivery.receiver_name && (
                    <div className="detail-item">
                      <FaInfoCircle />
                      <span><strong>{getMessage('tableHeaders.receiverName')}:</strong> {delivery.receiver_name}</span>
                    </div>
                  )}
                  
                  {delivery.pickup_location && delivery.delivery_location && (
                    <div className="detail-item">
                      <FaRoute />
                      <span><strong>{getMessage('tableHeaders.distance')}:</strong> {calculateDistance(delivery.pickup_location, delivery.delivery_location)}</span>
                    </div>
                  )}
                </div>
                
                <div className="donation-actions">
                  <button 
                    className="view-button"
                    onClick={() => openDeliveryModal(delivery)}
                  >
                    {getMessage('buttons.view')}
                  </button>
                  <button 
                    className="accept-button"
                    onClick={() => openDeliveryModal(delivery)}
                  >
                    {getMessage('buttons.accept')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Accepted Deliveries Section */}
      <div className="dashboard-section">
        <h2>{getMessage('titles.acceptedDeliveries')}</h2>
        {loading ? (
          <p className="loading-message">{getMessage('loading')}</p>
        ) : acceptedDeliveries.length === 0 ? (
          <p className="no-data-message">{getMessage('noDeliveries.accepted')}</p>
        ) : (
          <div className="donations-grid">
            {acceptedDeliveries.map((delivery) => (
              <div key={delivery.id || delivery._id} className="donation-card">
                <div className="donation-header">
                  <div className="food-type">
                    <FaUtensils />
                    <span>{delivery.food_type}</span>
                  </div>
                  <div className={`donation-status ${getStatusClass(delivery.status)}`}>
                    {getMessage(`status.${delivery.status}`) || delivery.status}
                  </div>
                </div>
                
                {delivery.image_url && (
                  <div className="donation-image">
                    <img src={getImageUrl(delivery.image_url)} alt={delivery.food_type} />
                  </div>
                )}
                
                <div className="donation-details">
                  <div className="detail-item">
                    <FaBox />
                    <span><strong>{getMessage('tableHeaders.quantity')}:</strong> {delivery.quantity} {delivery.unit}</span>
                  </div>
                  
                  {delivery.donor_name && (
                    <div className="detail-item">
                      <FaInfoCircle />
                      <span><strong>{getMessage('tableHeaders.donorName')}:</strong> {delivery.donor_name}</span>
                    </div>
                  )}
                  
                  {delivery.receiver_name && (
                    <div className="detail-item">
                      <FaInfoCircle />
                      <span><strong>{getMessage('tableHeaders.receiverName')}:</strong> {delivery.receiver_name}</span>
                    </div>
                  )}
                  
                  {delivery.donor_address && (
                    <div className="detail-item">
                      <FaMapMarkerAlt />
                      <span><strong>{getMessage('tableHeaders.pickupAddress')}:</strong> {delivery.donor_address}</span>
                    </div>
                  )}
                  
                  {delivery.receiver_address && (
                    <div className="detail-item">
                      <FaMapMarkerAlt />
                      <span><strong>{getMessage('tableHeaders.deliveryAddress')}:</strong> {delivery.receiver_address}</span>
                    </div>
                  )}
                </div>
                
                <div className="donation-actions">
                  <button 
                    className="view-button"
                    onClick={() => openDeliveryModal(delivery)}
                  >
                    {getMessage('buttons.view')}
                  </button>
                  
                  {delivery.status === 'Accepted' && (
                    <button className="accept-button">
                      {getMessage('buttons.markPickedUp')}
                    </button>
                  )}
                  
                  {delivery.status === 'Picked Up' && (
                    <button className="accept-button">
                      {getMessage('buttons.markDelivered')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Delivery Details Modal */}
      {showModal && selectedDelivery && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{getMessage('titles.deliveryDetails')}</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="donation-detail-section">
                <h4>{getMessage('details.food')}</h4>
                <p><strong>{getMessage('tableHeaders.foodType')}:</strong> {selectedDelivery.food_type}</p>
                <p><strong>{getMessage('tableHeaders.quantity')}:</strong> {selectedDelivery.quantity} {selectedDelivery.unit}</p>
                <p><strong>{getMessage('tableHeaders.expiryDate')}:</strong> {formatDate(selectedDelivery.expiry_date)}</p>
                <p><strong>{getMessage('tableHeaders.status')}:</strong> {getMessage(`status.${selectedDelivery.status}`) || selectedDelivery.status}</p>
              </div>
              
              {/* Donor details */}
              {selectedDelivery.donor_name && (
                <div className="donation-detail-section">
                  <h4>{getMessage('details.donor')}</h4>
                  <p><strong>{getMessage('tableHeaders.donorName')}:</strong> {selectedDelivery.donor_name}</p>
                  {selectedDelivery.donor_address && (
                    <p><strong>{getMessage('details.address')}:</strong> {selectedDelivery.donor_address}</p>
                  )}
                  {selectedDelivery.donor_contact && (
                    <p><strong>{getMessage('details.contact')}:</strong> {selectedDelivery.donor_contact}</p>
                  )}
                </div>
              )}
              
              {/* Receiver details */}
              {selectedDelivery.receiver_name && (
                <div className="donation-detail-section">
                  <h4>{getMessage('details.receiver')}</h4>
                  <p><strong>{getMessage('tableHeaders.receiverName')}:</strong> {selectedDelivery.receiver_name}</p>
                  {selectedDelivery.receiver_address && (
                    <p><strong>{getMessage('details.address')}:</strong> {selectedDelivery.receiver_address}</p>
                  )}
                  {selectedDelivery.receiver_contact && (
                    <p><strong>{getMessage('details.contact')}:</strong> {selectedDelivery.receiver_contact}</p>
                  )}
                </div>
              )}
              
              {/* Accept confirmation for available deliveries */}
              {selectedDelivery.status === 'Ready for Delivery' && (
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
              
              {selectedDelivery.status === 'Ready for Delivery' && (
                <button 
                  className="confirm-button"
                  onClick={() => handleAcceptDelivery(selectedDelivery.id || selectedDelivery._id)}
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

export default DeliveryDashboard;

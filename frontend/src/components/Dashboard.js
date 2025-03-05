import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/Dashboard.css";
import { useLanguage } from '../context/LanguageContext';

const Dashboard = () => {
  const [donations, setDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptedDonation, setAcceptedDonation] = useState(null);
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
      images: {
        'en': 'Images',
        'hi': 'छवियां'
      },
      distance: {
        'en': 'Distance',
        'hi': 'दूरी'
      },
      action: {
        'en': 'Action',
        'hi': 'कार्रवाई'
      }
    },
    buttons: {
      accept: {
        'en': 'Accept',
        'hi': 'स्वीकार करें'
      },
      accepted: {
        'en': 'Accepted',
        'hi': 'स्वीकृत'
      }
    },
    noImage: {
      'en': 'No Image',
      'hi': 'कोई छवि नहीं'
    },
    messages: {
      success: {
        'en': 'Donation accepted successfully!',
        'hi': 'दान सफलतापूर्वक स्वीकार किया गया!'
      },
      error: {
        'en': 'Failed to accept donation. Please try again.',
        'hi': 'दान स्वीकार करने में विफल। कृपया पुनः प्रयास करें।'
      }
    }
  };

  const getMessage = (path) => {
    const langCode = language.split('-')[0];
    return path[langCode] || path['en'];
  };

  useEffect(() => {
    fetchDonations();
    fetchAcceptedDonations();
  }, []);

  const getImageUrl = (absolutePath) => {
    if (!absolutePath) return "";
    const filename = absolutePath.split("\\").pop();
    return `http://127.0.0.1:5000/static/uploads/donations/${filename}`;
  };

  const fetchDonations = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        "http://127.0.0.1:5000/donation/nearby",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDonations(response.data.donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAcceptedDonations = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        "http://127.0.0.1:5000/donation/accepted",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAcceptedDonations(response.data.accepted_donations);
    } catch (error) {
      console.error("Error fetching accepted donations:", error);
    }
  };

  const handleAcceptDonation = async (donationId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://127.0.0.1:5000/donation/accept/${donationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert(getMessage(messages.messages.success));
        setAcceptedDonation(donationId);
        fetchDonations();
        fetchAcceptedDonations();
      }
    } catch (error) {
      console.error("Error accepting donation:", error);
      alert(getMessage(messages.messages.error));
    }
  };

  return (
    <div className="dashboard">
      <h2>{getMessage(messages.titles.availableDonations)}</h2>
      {loading ? (
        <p>{getMessage(messages.loading)}</p>
      ) : donations.length === 0 ? (
        <p>{getMessage(messages.noDonations.available)}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{getMessage(messages.tableHeaders.foodType)}</th>
              <th>{getMessage(messages.tableHeaders.quantity)}</th>
              <th>{getMessage(messages.tableHeaders.expiryDate)}</th>
              <th>{getMessage(messages.tableHeaders.images)}</th>
              <th>{getMessage(messages.tableHeaders.distance)}</th>
              <th>{getMessage(messages.tableHeaders.action)}</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation._id}>
                <td>{donation.food_type}</td>
                <td>{donation.quantity} kg</td>
                <td>{donation.expiry_date}</td>
                <td>
                  {donation.image_urls?.length > 0 ? (
                    <img
                      src={getImageUrl(donation.image_urls[0])}
                      alt="Food"
                      width="50"
                    />
                  ) : (
                    getMessage(messages.noImage)
                  )}
                </td>
                <td>~5KM</td>
                <td>
                  <button
                    className="accept-btn"
                    onClick={() => handleAcceptDonation(donation._id)}
                    disabled={acceptedDonation === donation._id}
                  >
                    {acceptedDonation === donation._id ? 
                      getMessage(messages.buttons.accepted) : 
                      getMessage(messages.buttons.accept)}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>{getMessage(messages.titles.acceptedDonations)}</h2>
      {acceptedDonations.length === 0 ? (
        <p>{getMessage(messages.noDonations.accepted)}</p>
      ) : (
        <div className="donation-grid">
          {acceptedDonations.map((donation) => (
            <div className="donation-card" key={donation._id}>
              <div className="donation-image">
                {donation.image_urls?.length > 0 ? (
                  <img src={donation.image_urls[0]} alt="Food" />
                ) : (
                  <p>{getMessage(messages.noImage)}</p>
                )}
              </div>
              <div className="donation-details">
                {Object.entries(donation).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                    {typeof value === "string" ? value : JSON.stringify(value)}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

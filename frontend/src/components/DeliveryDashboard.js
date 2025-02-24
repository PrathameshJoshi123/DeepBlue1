import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/Dashboard.css";

const DeliveryDashboard = () => {
  const [deliveries, setDeliveries] = useState([]); // Pending deliveries
  const [acceptedDeliveries, setAcceptedDeliveries] = useState([]); // Accepted deliveries
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
    fetchAcceptedDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        "http://127.0.0.1:5000/donation/ready_for_delivery",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDeliveries(response.data.donations);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAcceptedDeliveries = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        "http://127.0.0.1:5000/donation/accepted",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAcceptedDeliveries(response.data.accepted_donations);
    } catch (error) {
      console.error("Error fetching accepted deliveries:", error);
    }
  };

  const handleAcceptDelivery = async (donationId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://127.0.0.1:5000/donation/delivery/accept/${donationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Delivery accepted successfully!");
        fetchDeliveries();
        fetchAcceptedDeliveries();
      }
    } catch (error) {
      console.error("Error accepting delivery:", error);
      alert("Failed to accept delivery. Please try again.");
    }
  };

  return (
    <div className="dashboard">
      <h2>Deliveries Ready for Pickup</h2>
      {loading ? (
        <p>Loading...</p>
      ) : deliveries.length === 0 ? (
        <p>No available deliveries.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Food Type</th>
              <th>Quantity</th>
              <th>Sender Address</th>
              <th>Receiver Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((donation) => (
              <tr key={donation._id}>
                <td>{donation.food_type}</td>
                <td>{donation.quantity} kg</td>
                <td>{donation.sender_address}</td>
                <td>{donation.receiver_address}</td>
                <td>
                  <button
                    className="accept-btn"
                    onClick={() => handleAcceptDelivery(donation._id)}
                  >
                    Accept Delivery
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Display Accepted Deliveries Below */}
      <h2>Accepted Deliveries</h2>
      {acceptedDeliveries.length === 0 ? (
        <p>No accepted deliveries.</p>
      ) : (
        <div className="donation-grid">
          {acceptedDeliveries.map((donation) => (
            <div className="donation-card" key={donation._id}>
              <div className="donation-image">
                {donation.image_urls?.length > 0 ? (
                  <img src={donation.image_urls[0]} alt="Food" />
                ) : (
                  <p>No Image</p>
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

export default DeliveryDashboard;

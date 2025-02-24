import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/Dashboard.css";

const Dashboard = () => {
  const [donations, setDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]); // For accepted donations
  const [loading, setLoading] = useState(true);
  const [acceptedDonation, setAcceptedDonation] = useState(null); // Track accepted donation

  useEffect(() => {
    fetchDonations();
    fetchAcceptedDonations();
  }, []);

  // Convert image paths to full URLs
  const getImageUrl = (absolutePath) => {
    if (!absolutePath) return "";
    const filename = absolutePath.split("\\").pop();
    return `http://127.0.0.1:5000/static/uploads/donations/${filename}`;
  };

  // Fetch available donations
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

  // Fetch accepted donations
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

  // Handle donation acceptance
  const handleAcceptDonation = async (donationId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://127.0.0.1:5000/donation/accept/${donationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Donation accepted successfully!");
        setAcceptedDonation(donationId);
        fetchDonations(); // Refresh available donations
        fetchAcceptedDonations(); // Refresh accepted donations
      }
    } catch (error) {
      console.error("Error accepting donation:", error);
      alert("Failed to accept donation. Please try again.");
    }
  };

  return (
    <div className="dashboard">
      <h2>Available Donations Near You</h2>
      {loading ? (
        <p>Loading...</p>
      ) : donations.length === 0 ? (
        <p>No available donations within 5KM.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Food Type</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
              <th>Images</th>
              <th>Distance</th>
              <th>Action</th>
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
                    "No Image"
                  )}
                </td>
                <td>~5KM</td>
                <td>
                  <button
                    className="accept-btn"
                    onClick={() => handleAcceptDonation(donation._id)}
                    disabled={acceptedDonation === donation._id}
                  >
                    {acceptedDonation === donation._id ? "Accepted" : "Accept"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Display Accepted Donations as Cards */}
      <h2>Accepted Donations</h2>
      {acceptedDonations.length === 0 ? (
        <p>No accepted donations.</p>
      ) : (
        <div className="donation-grid">
          {acceptedDonations.map((donation) => (
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

export default Dashboard;

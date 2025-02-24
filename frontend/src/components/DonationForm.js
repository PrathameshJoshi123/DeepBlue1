import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../CSS/DonationForm.css'

const DonationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    food_type: "Vegetarian",
    quantity: "",
    unit: "kg",
    expiry_date: "",
    perishable_ingredients: "",
    quality_status: "Good",
    quality_score: 0.9,
    images: [],
  });

  const [error, setError] = useState(null);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!user || user.role !== "donor") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "perishable_ingredients"
          ? value.split(",").map((item) => item.trim())
          : value,
    }));
  };



  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        Array.from(formData.images).forEach((file) => {
          formDataToSend.append("images", file);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/donation/register",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Donation registered successfully!");
        navigate("/");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="donation-container">
      <h2>Register a Food Donation</h2>
      {error && <p className="error">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="donation-form"
        encType="multipart/form-data"
      >
        <h3>Food Details</h3>

        <div className="form-group">
          <label>Food Type:</label>
          <input
            type="text"
            name="food_type"
            value={formData.food_type}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Unit:</label>
          <select name="unit" value={formData.unit} onChange={handleChange}>
            <option value="kg">kg</option>
            <option value="liters">liters</option>
            <option value="pieces">pieces</option>
          </select>
        </div>

        <div className="form-group">
          <label>Expiry Date:</label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Perishable Ingredients:</label>
          <input
            type="text"
            name="perishable_ingredients"
            value={formData.perishable_ingredients}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Quality Status:</label>
          <select
            name="quality_status"
            value={formData.quality_status}
            onChange={handleChange}
          >
            <option value="Good">Good</option>
            <option value="Medium">Medium</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        <div className="form-group">
          <label>Quality Score (0-1):</label>
          <input
            type="number"
            step="0.1"
            name="quality_score"
            value={formData.quality_score}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Images:</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="donation-button">
          Submit Donation
        </button>
      </form>
    </div>
  );
};

export default DonationForm;

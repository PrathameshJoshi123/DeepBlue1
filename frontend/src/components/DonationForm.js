import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../CSS/DonationForm.css'
import { useLanguage } from '../context/LanguageContext';

const DonationForm = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const messages = {
    title: {
      'en': 'Register a Food Donation',
      'hi': 'भोजन दान पंजीकृत करें'
    },
    sections: {
      foodDetails: {
        'en': 'Food Details',
        'hi': 'भोजन विवरण'
      }
    },
    fields: {
      foodType: {
        label: {
          'en': 'Food Type:',
          'hi': 'भोजन का प्रकार:'
        }
      },
      quantity: {
        label: {
          'en': 'Quantity:',
          'hi': 'मात्रा:'
        }
      },
      unit: {
        label: {
          'en': 'Unit:',
          'hi': 'इकाई:'
        },
        options: {
          kg: {
            'en': 'kg',
            'hi': 'किलोग्राम'
          },
          liters: {
            'en': 'liters',
            'hi': 'लीटर'
          },
          pieces: {
            'en': 'pieces',
            'hi': 'टुकड़े'
          }
        }
      },
      expiryDate: {
        label: {
          'en': 'Expiry Date:',
          'hi': 'समाप्ति तिथि:'
        }
      },
      perishableIngredients: {
        label: {
          'en': 'Perishable Ingredients:',
          'hi': 'नाशवान सामग्री:'
        }
      },
      qualityStatus: {
        label: {
          'en': 'Quality Status:',
          'hi': 'गुणवत्ता स्थिति:'
        },
        options: {
          good: {
            'en': 'Good',
            'hi': 'अच्छा'
          },
          medium: {
            'en': 'Medium',
            'hi': 'मध्यम'
          },
          expired: {
            'en': 'Expired',
            'hi': 'समाप्त'
          }
        }
      },
      qualityScore: {
        label: {
          'en': 'Quality Score (0-1):',
          'hi': 'गुणवत्ता स्कोर (0-1):'
        }
      },
      images: {
        label: {
          'en': 'Upload Images:',
          'hi': 'छवियां अपलोड करें:'
        }
      }
    },
    buttons: {
      submit: {
        'en': 'Submit Donation',
        'hi': 'दान जमा करें'
      }
    },
    messages: {
      success: {
        'en': 'Donation registered successfully!',
        'hi': 'दान सफलतापूर्वक पंजीकृत किया गया!'
      },
      error: {
        'en': 'Something went wrong.',
        'hi': 'कुछ गलत हो गया।'
      }
    }
  };

  const getMessage = (path) => {
    const langCode = language.split('-')[0];
    return path[langCode] || path['en'];
  };

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
        alert(getMessage(messages.messages.success));
        navigate("/");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.error || getMessage(messages.messages.error));
    }
  };

  return (
    <div className="donation-container">
      <h2>{getMessage(messages.title)}</h2>
      {error && <p className="error">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="donation-form"
        encType="multipart/form-data"
      >
        <h3>{getMessage(messages.sections.foodDetails)}</h3>

        <div className="form-group">
          <label>{getMessage(messages.fields.foodType.label)}</label>
          <input
            type="text"
            name="food_type"
            value={formData.food_type}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{getMessage(messages.fields.quantity.label)}</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{getMessage(messages.fields.unit.label)}</label>
          <select name="unit" value={formData.unit} onChange={handleChange}>
            <option value="kg">{getMessage(messages.fields.unit.options.kg)}</option>
            <option value="liters">{getMessage(messages.fields.unit.options.liters)}</option>
            <option value="pieces">{getMessage(messages.fields.unit.options.pieces)}</option>
          </select>
        </div>

        <div className="form-group">
          <label>{getMessage(messages.fields.expiryDate.label)}</label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{getMessage(messages.fields.perishableIngredients.label)}</label>
          <input
            type="text"
            name="perishable_ingredients"
            value={formData.perishable_ingredients}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>{getMessage(messages.fields.qualityStatus.label)}</label>
          <select
            name="quality_status"
            value={formData.quality_status}
            onChange={handleChange}
          >
            <option value="Good">{getMessage(messages.fields.qualityStatus.options.good)}</option>
            <option value="Medium">{getMessage(messages.fields.qualityStatus.options.medium)}</option>
            <option value="Expired">{getMessage(messages.fields.qualityStatus.options.expired)}</option>
          </select>
        </div>

        <div className="form-group">
          <label>{getMessage(messages.fields.qualityScore.label)}</label>
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
          <label>{getMessage(messages.fields.images.label)}</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="donation-button">
          {getMessage(messages.buttons.submit)}
        </button>
      </form>
    </div>
  );
};

export default DonationForm;

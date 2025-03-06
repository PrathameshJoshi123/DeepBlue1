import React, { useState } from "react";
import axios from "axios";
import {
  FaInfoCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaMapSigns,
  FaMailBulk,
  FaIdCard,
  FaCertificate,
  FaFileAlt,
  FaPaperPlane,
  FaBuilding,
  FaCalendarAlt,
  FaUpload
} from "react-icons/fa";
import "../CSS/Forms.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../context/LanguageContext';

const Donor = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    restaurant_name: "",
    contact_number: "",
    building_name: "",
    street_name: "",
    shop_number: "",
    city: "",
    state: "",
    zip_code: "",
    donation_frequency: "",
    id_proof: null,
    fssai_id: "",
    terms_agreed: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { language } = useLanguage();

  const messages = {
    title: {
      'en': 'Become a Food Donor',
      'hi': 'भोजन दाता बनें'
    },
    subtitle: {
      'en': 'Join us in reducing food waste and helping those in need',
      'hi': 'भोजन की बर्बादी को कम करने और जरूरतमंदों की मदद करने में हमारा साथ दें'
    },
    sections: {
      basicInfo: {
        'en': 'Basic Information',
        'hi': 'मूल जानकारी'
      },
      addressDetails: {
        'en': 'Address Details',
        'hi': 'पता विवरण'
      },
      donationDetails: {
        'en': 'Donation Details',
        'hi': 'दान विवरण'
      },
      verification: {
        'en': 'Verification',
        'hi': 'सत्यापन'
      }
    },
    fields: {
      fullName: {
        label: {
          'en': 'Full Name',
          'hi': 'पूरा नाम'
        },
        placeholder: {
          'en': 'Enter your full name',
          'hi': 'अपना पूरा नाम दर्ज करें'
        }
      },
      email: {
        label: {
          'en': 'Email',
          'hi': 'ईमेल'
        },
        placeholder: {
          'en': 'Enter your email',
          'hi': 'अपना ईमेल दर्ज करें'
        }
      },
      restaurantName: {
        label: {
          'en': 'Restaurant Name (Optional)',
          'hi': 'रेस्तरां का नाम (वैकल्पिक)'
        },
        placeholder: {
          'en': 'Enter restaurant name if applicable',
          'hi': 'यदि लागू हो तो रेस्तरां का नाम दर्ज करें'
        }
      },
      contactNumber: {
        label: {
          'en': 'Contact Number',
          'hi': 'संपर्क नंबर'
        },
        placeholder: {
          'en': 'Enter your contact number',
          'hi': 'अपना संपर्क नंबर दर्ज करें'
        }
      },
      buildingName: {
        label: {
          'en': 'Building Name',
          'hi': 'इमारत का नाम'
        },
        placeholder: {
          'en': 'Enter building name',
          'hi': 'इमारत का नाम दर्ज करें'
        }
      },
      streetName: {
        label: {
          'en': 'Street Name',
          'hi': 'सड़क का नाम'
        },
        placeholder: {
          'en': 'Enter street name',
          'hi': 'सड़क का नाम दर्ज करें'
        }
      },
      shopNumber: {
        label: {
          'en': 'Shop Number (Optional)',
          'hi': 'दुकान नंबर (वैकल्पिक)'
        },
        placeholder: {
          'en': 'Enter shop number if applicable',
          'hi': 'यदि लागू हो तो दुकान नंबर दर्ज करें'
        }
      },
      city: {
        label: {
          'en': 'City',
          'hi': 'शहर'
        },
        placeholder: {
          'en': 'Enter city',
          'hi': 'शहर दर्ज करें'
        }
      },
      state: {
        label: {
          'en': 'State',
          'hi': 'राज्य'
        },
        placeholder: {
          'en': 'Enter state',
          'hi': 'राज्य दर्ज करें'
        }
      },
      zipCode: {
        label: {
          'en': 'ZIP Code',
          'hi': 'पिन कोड'
        },
        placeholder: {
          'en': 'Enter ZIP code',
          'hi': 'पिन कोड दर्ज करें'
        }
      },
      donationFrequency: {
        label: {
          'en': 'Donation Frequency',
          'hi': 'दान की आवृत्ति'
        },
        options: {
          select: {
            'en': 'Select Frequency',
            'hi': 'आवृत्ति चुनें'
          },
          oneTime: {
            'en': 'One-time',
            'hi': 'एक बार'
          },
          daily: {
            'en': 'Daily',
            'hi': 'दैनिक'
          },
          weekly: {
            'en': 'Weekly',
            'hi': 'साप्ताहिक'
          },
          biWeekly: {
            'en': 'Bi-Weekly',
            'hi': 'द्वि-साप्ताहिक'
          },
          monthly: {
            'en': 'Monthly',
            'hi': 'मासिक'
          }
        }
      },
      idProof: {
        label: {
          'en': 'ID Proof',
          'hi': 'पहचान प्रमाण'
        },
        uploadText: {
          'en': 'Click to upload or drag and drop',
          'hi': 'अपलोड करने के लिए क्लिक करें या खींचें और छोड़ें'
        },
        supportedFormats: {
          'en': 'Supported formats: JPEG, PNG, PDF',
          'hi': 'समर्थित प्रारूप: JPEG, PNG, PDF'
        }
      },
      fssaiId: {
        label: {
          'en': 'FSSAI ID',
          'hi': 'FSSAI आईडी'
        },
        placeholder: {
          'en': 'Enter FSSAI ID',
          'hi': 'FSSAI आईडी दर्ज करें'
        }
      },
      termsAgreed: {
        label: {
          'en': 'I agree to the',
          'hi': 'मैं सहमत हूं'
        },
        terms: {
          'en': 'Terms and Conditions',
          'hi': 'नियम और शर्तें'
        }
      }
    },
    buttons: {
      register: {
        'en': 'Register as Donor',
        'hi': 'दाता के रूप में पंजीकरण करें'
      }
    },
    messages: {
      success: {
        'en': 'Registration successful!',
        'hi': 'पंजीकरण सफल!'
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

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        "http://localhost:5000/donor/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      if(response.status === 201){
        navigate('/');
        const user = response.data.user;
        sessionStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to register. Please try again.");
    }
  };

  return (
    <div className="form-container donor-form">
      <div className="form-header">
        <h2>{getMessage(messages.title)}</h2>
        <p>{getMessage(messages.subtitle)}</p>
      </div>

      {errorMessage && <div className="message error-message">{errorMessage}</div>}
      {successMessage && <div className="message success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-section">
          <h3><FaInfoCircle /> {getMessage(messages.sections.basicInfo)}</h3>
          
          <div className="form-group">
            <label><FaUser /> {getMessage(messages.fields.fullName.label)}</label>
            <input
              type="text"
              name="full_name"
              className="form-input"
              value={formData.full_name}
              placeholder={getMessage(messages.fields.fullName.placeholder)}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaEnvelope /> {getMessage(messages.fields.email.label)}</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              placeholder={getMessage(messages.fields.email.placeholder)}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaBuilding /> {getMessage(messages.fields.restaurantName.label)}</label>
            <input
              type="text"
              name="restaurant_name"
              className="form-input"
              value={formData.restaurant_name}
              placeholder={getMessage(messages.fields.restaurantName.placeholder)}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label><FaPhone /> {getMessage(messages.fields.contactNumber.label)}</label>
            <input
              type="tel"
              name="contact_number"
              className="form-input"
              value={formData.contact_number}
              placeholder={getMessage(messages.fields.contactNumber.placeholder)}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3><FaMapMarkerAlt /> {getMessage(messages.sections.addressDetails)}</h3>
          
          <div className="form-group">
            <label><FaBuilding /> {getMessage(messages.fields.buildingName.label)}</label>
            <input
              type="text"
              name="building_name"
              className="form-input"
              value={formData.building_name}
              placeholder={getMessage(messages.fields.buildingName.placeholder)}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaMapSigns /> {getMessage(messages.fields.streetName.label)}</label>
            <input
              type="text"
              name="street_name"
              className="form-input"
              value={formData.street_name}
              placeholder={getMessage(messages.fields.streetName.placeholder)}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaBuilding /> {getMessage(messages.fields.shopNumber.label)}</label>
            <input
              type="text"
              name="shop_number"
              className="form-input"
              value={formData.shop_number}
              placeholder={getMessage(messages.fields.shopNumber.placeholder)}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label><FaCity /> {getMessage(messages.fields.city.label)}</label>
            <input
              type="text"
              name="city"
              className="form-input"
              value={formData.city}
              placeholder={getMessage(messages.fields.city.placeholder)}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaMapSigns /> {getMessage(messages.fields.state.label)}</label>
            <input
              type="text"
              name="state"
              className="form-input"
              value={formData.state}
              placeholder={getMessage(messages.fields.state.placeholder)}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaMailBulk /> {getMessage(messages.fields.zipCode.label)}</label>
            <input
              type="text"
              name="zip_code"
              className="form-input"
              value={formData.zip_code}
              placeholder={getMessage(messages.fields.zipCode.placeholder)}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3><FaCalendarAlt /> {getMessage(messages.sections.donationDetails)}</h3>
          
          <div className="form-group">
            <label><FaCalendarAlt /> {getMessage(messages.fields.donationFrequency.label)}</label>
            <select
              name="donation_frequency"
              className="form-input"
              value={formData.donation_frequency}
              onChange={handleChange}
              required
            >
              <option value="">{getMessage(messages.fields.donationFrequency.options.select)}</option>
              <option value="One-time">{getMessage(messages.fields.donationFrequency.options.oneTime)}</option>
              <option value="Daily">{getMessage(messages.fields.donationFrequency.options.daily)}</option>
              <option value="Weekly">{getMessage(messages.fields.donationFrequency.options.weekly)}</option>
              <option value="Bi-Weekly">{getMessage(messages.fields.donationFrequency.options.biWeekly)}</option>
              <option value="Monthly">{getMessage(messages.fields.donationFrequency.options.monthly)}</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3><FaIdCard /> {getMessage(messages.sections.verification)}</h3>
          
          <div className="form-group">
            <label><FaUpload /> {getMessage(messages.fields.idProof.label)}</label>
            <div className="file-upload">
              <div className="file-upload-text">
                <FaUpload />
                <span>{getMessage(messages.fields.idProof.uploadText)}</span>
                <span>{getMessage(messages.fields.idProof.supportedFormats)}</span>
              </div>
              <input
                type="file"
                name="id_proof"
                accept="image/png, image/jpeg, application/pdf"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label><FaCertificate /> {getMessage(messages.fields.fssaiId.label)}</label>
            <input
              type="text"
              name="fssai_id"
              className="form-input"
              value={formData.fssai_id}
              placeholder={getMessage(messages.fields.fssaiId.placeholder)}
              onChange={handleChange}
              required
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="terms_agreed"
              name="terms_agreed"
              checked={formData.terms_agreed}
              onChange={handleChange}
              required
            />
            <label htmlFor="terms_agreed">
              {getMessage(messages.fields.termsAgreed.label)} <a href="#">{getMessage(messages.fields.termsAgreed.terms)}</a>
            </label>
          </div>
        </div>

        <button type="submit" className="submit-button">
          <FaPaperPlane /> {getMessage(messages.buttons.register)}
        </button>
      </form>
    </div>
  );
};

export default Donor;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaIdCard,
  FaCar,
  FaBus,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaFileAlt,
  FaUpload,
  FaHome,
  FaCity,
  FaMapSigns,
  FaMailBulk,
  FaTruck,
  FaCalendarAlt,
  FaUsers,
  FaCarrot,
  FaLeaf,
  FaBox,
  FaTruckPickup,
  FaClock,
  FaWarehouse,
  FaCheckCircle,
  FaHeart
} from "react-icons/fa";
import "../CSS/Forms.css";
import { useLanguage } from '../context/LanguageContext';

const DeliveryPage = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const { language } = useLanguage();

  const messages = {
    title: {
      'en': 'Delivery Partner Registration',
      'hi': 'डिलीवरी पार्टनर पंजीकरण'
    },
    subtitle: {
      'en': 'Join our network of delivery partners and help connect donors with receivers',
      'hi': 'हमारे डिलीवरी पार्टनर नेटवर्क से जुड़ें और दाताओं को प्राप्तकर्ताओं से जोड़ने में मदद करें'
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
      vehicleDetails: {
        'en': 'Vehicle Details',
        'hi': 'वाहन विवरण'
      },
      verification: {
        'en': 'Verification',
        'hi': 'सत्यापन'
      }
    },
    fields: {
      companyName: {
        label: {
          'en': 'Company/Individual Name',
          'hi': 'कंपनी/व्यक्तिगत नाम'
        },
        placeholder: {
          'en': 'Enter company or individual name',
          'hi': 'कंपनी या व्यक्तिगत नाम दर्ज करें'
        }
      },
      contactPerson: {
        label: {
          'en': 'Contact Person Name',
          'hi': 'संपर्क व्यक्ति का नाम'
        },
        placeholder: {
          'en': 'Enter contact person name',
          'hi': 'संपर्क व्यक्ति का नाम दर्ज करें'
        }
      },
      email: {
        label: {
          'en': 'Email Address',
          'hi': 'ईमेल पता'
        },
        placeholder: {
          'en': 'Enter email address',
          'hi': 'ईमेल पता दर्ज करें'
        }
      },
      phone: {
        label: {
          'en': 'Contact Number',
          'hi': 'संपर्क नंबर'
        },
        placeholder: {
          'en': 'Enter contact number',
          'hi': 'संपर्क नंबर दर्ज करें'
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
      vehicleType: {
        label: {
          'en': 'Vehicle Type',
          'hi': 'वाहन का प्रकार'
        },
        options: {
          select: {
            'en': 'Select Vehicle Type',
            'hi': 'वाहन का प्रकार चुनें'
          },
          bike: {
            'en': 'Bike',
            'hi': 'बाइक'
          },
          car: {
            'en': 'Car',
            'hi': 'कार'
          },
          van: {
            'en': 'Van',
            'hi': 'वैन'
          },
          truck: {
            'en': 'Truck',
            'hi': 'ट्रक'
          }
        }
      },
      vehicleNumber: {
        label: {
          'en': 'Vehicle Number',
          'hi': 'वाहन संख्या'
        },
        placeholder: {
          'en': 'Enter vehicle registration number',
          'hi': 'वाहन पंजीकरण संख्या दर्ज करें'
        }
      },
      licenseNumber: {
        label: {
          'en': 'License Number',
          'hi': 'लाइसेंस नंबर'
        },
        placeholder: {
          'en': 'Enter driving license number',
          'hi': 'ड्राइविंग लाइसेंस नंबर दर्ज करें'
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
      }
    },
    buttons: {
      register: {
        'en': 'Register as Delivery Partner',
        'hi': 'डिलीवरी पार्टनर के रूप में पंजीकरण करें'
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

  const [formData, setFormData] = useState({
    company_name: "",
    person_name: "",
    email: "",
    number: "",
    website: "",
    registration_number: "",
    vehicle_types: "",
    fleet_size: "",
    building_name: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    terms_agreed: false,
    id_proof: null,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        id_proof: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        "http://localhost:5000/delivery/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      if (response.status === 201) {
        navigate('/');
        const user = response.data.user;
        sessionStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to register. Please try again.");
    }
  };

  return (
    <div className="form-container delivery-form">
      <div className="form-header">
        <h2>{getMessage(messages.title)}</h2>
        <p>{getMessage(messages.subtitle)}</p>
      </div>

      {errorMessage && <div className="message error-message">{errorMessage}</div>}
      {successMessage && <div className="message success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-section">
          <h3><FaUser /> {getMessage(messages.sections.basicInfo)}</h3>
          
          <div className="form-group">
            <label><FaBuilding /> {getMessage(messages.fields.companyName.label)}</label>
            <input
              type="text"
              name="company_name"
              className="form-input"
              value={formData.company_name}
              placeholder={getMessage(messages.fields.companyName.placeholder)}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaUser /> {getMessage(messages.fields.contactPerson.label)}</label>
            <input
              type="text"
              name="person_name"
              className="form-input"
              value={formData.person_name}
              placeholder={getMessage(messages.fields.contactPerson.placeholder)}
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
            <label><FaPhone /> {getMessage(messages.fields.phone.label)}</label>
            <input
              type="tel"
              name="number"
              className="form-input"
              value={formData.number}
              placeholder={getMessage(messages.fields.phone.placeholder)}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaGlobe /> Website (Optional)</label>
            <input
              type="url"
              name="website"
              className="form-input"
              value={formData.website}
              placeholder="Enter website URL"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3><FaTruck /> {getMessage(messages.sections.vehicleDetails)}</h3>
          
          <div className="form-group">
            <label><FaTruck /> {getMessage(messages.fields.vehicleType.label)}</label>
            <select
              name="vehicle_type"
              className="form-input"
              value={formData.vehicle_type}
              onChange={handleChange}
              required
            >
              <option value="">{getMessage(messages.fields.vehicleType.options.select)}</option>
              <option value="bike">{getMessage(messages.fields.vehicleType.options.bike)}</option>
              <option value="car">{getMessage(messages.fields.vehicleType.options.car)}</option>
              <option value="van">{getMessage(messages.fields.vehicleType.options.van)}</option>
              <option value="truck">{getMessage(messages.fields.vehicleType.options.truck)}</option>
            </select>
          </div>

          <div className="form-group">
            <label><FaIdCard /> {getMessage(messages.fields.vehicleNumber.label)}</label>
            <input
              type="text"
              name="registration_number"
              className="form-input"
              value={formData.registration_number}
              placeholder={getMessage(messages.fields.vehicleNumber.placeholder)}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaIdCard /> {getMessage(messages.fields.licenseNumber.label)}</label>
            <input
              type="text"
              name="license_number"
              className="form-input"
              value={formData.license_number}
              placeholder={getMessage(messages.fields.licenseNumber.placeholder)}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3><FaMapMarkerAlt /> {getMessage(messages.sections.addressDetails)}</h3>
          
          <div className="form-group">
            <label><FaHome /> {getMessage(messages.fields.buildingName.label)}</label>
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
              name="street_address"
              className="form-input"
              value={formData.street_address}
              placeholder={getMessage(messages.fields.streetName.placeholder)}
              onChange={handleChange}
              required
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
              name="postal_code"
              className="form-input"
              value={formData.postal_code}
              placeholder={getMessage(messages.fields.zipCode.placeholder)}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaGlobe /> Country</label>
            <input
              type="text"
              name="country"
              className="form-input"
              value={formData.country}
              placeholder="Enter country"
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3><FaFileAlt /> {getMessage(messages.sections.verification)}</h3>
          
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
                onChange={handleFileChange}
                required
              />
            </div>
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
              I agree to the <a href="#">Terms and Conditions</a>
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

export default DeliveryPage;

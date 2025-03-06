import React, { useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaBuilding,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaMailBulk,
  FaGlobe,
  FaIdCard,
  FaFileAlt,
  FaCalendarAlt,
  FaUsers,
  FaCarrot,
  FaLeaf,
  FaBox,
  FaTruck,
  FaTruckPickup,
  FaClock,
  FaWarehouse,
  FaCheckCircle,
  FaHeart,
  FaPaperPlane,
  FaEnvelope,
  FaUpload
} from "react-icons/fa";
import "../CSS/Forms.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../context/LanguageContext';

const Receiver = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const { language } = useLanguage();

  const messages = {
    title: {
      'en': 'NGO/Receiver Registration',
      'hi': 'एनजीओ/प्राप्तकर्ता पंजीकरण'
    },
    subtitle: {
      'en': 'Help us distribute food to those who need it most',
      'hi': 'जरूरतमंदों तक भोजन पहुंचाने में हमारी मदद करें'
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
      organizationDetails: {
        'en': 'Organization Details',
        'hi': 'संगठन विवरण'
      },
      verification: {
        'en': 'Verification',
        'hi': 'सत्यापन'
      }
    },
    fields: {
      ngoName: {
        label: {
          'en': 'NGO Name',
          'hi': 'एनजीओ का नाम'
        },
        placeholder: {
          'en': 'Enter NGO name',
          'hi': 'एनजीओ का नाम दर्ज करें'
        }
      },
      contactPerson: {
        label: {
          'en': 'Contact Person',
          'hi': 'संपर्क व्यक्ति'
        },
        placeholder: {
          'en': 'Enter contact person name',
          'hi': 'संपर्क व्यक्ति का नाम दर्ज करें'
        }
      },
      contactNumber: {
        label: {
          'en': 'Contact Number',
          'hi': 'संपर्क नंबर'
        },
        placeholder: {
          'en': 'Enter contact number',
          'hi': 'संपर्क नंबर दर्ज करें'
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
      website: {
        label: {
          'en': 'Website (Optional)',
          'hi': 'वेबसाइट (वैकल्पिक)'
        },
        placeholder: {
          'en': 'Enter website URL',
          'hi': 'वेबसाइट URL दर्ज करें'
        }
      },
      registrationNumber: {
        label: {
          'en': 'Registration Number',
          'hi': 'पंजीकरण संख्या'
        },
        placeholder: {
          'en': 'Enter registration number',
          'hi': 'पंजीकरण संख्या दर्ज करें'
        }
      },
      ngoGovNo: {
        label: {
          'en': 'NGO Government Number',
          'hi': 'एनजीओ सरकारी संख्या'
        },
        placeholder: {
          'en': 'Enter NGO government number',
          'hi': 'एनजीओ सरकारी संख्या दर्ज करें'
        }
      },
      dateOfEstablishment: {
        label: {
          'en': 'Date of Establishment',
          'hi': 'स्थापना की तिथि'
        }
      },
      supportLevel: {
        label: {
          'en': 'Support Level',
          'hi': 'सहायता स्तर'
        },
        options: {
          state: {
            'en': 'State',
            'hi': 'राज्य'
          },
          national: {
            'en': 'National',
            'hi': 'राष्ट्रीय'
          },
          international: {
            'en': 'International',
            'hi': 'अंतर्राष्ट्रीय'
          }
        }
      },
      fundingType: {
        label: {
          'en': 'Funding Type',
          'hi': 'वित्त पोषण का प्रकार'
        },
        options: {
          government: {
            'en': 'Government',
            'hi': 'सरकारी'
          },
          private: {
            'en': 'Private',
            'hi': 'निजी'
          },
          mixed: {
            'en': 'Mixed',
            'hi': 'मिश्रित'
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
      }
    },
    buttons: {
      register: {
        'en': 'Register as Receiver',
        'hi': 'प्राप्तकर्ता के रूप में पंजीकरण करें'
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
    ngo_name: "",
    contact_person: "",
    contact_number: "",
    email: "",
    building_name: "",
    street_name: "",
    shop_number: "",
    city: "",
    state: "",
    zip_code: "",
    website: "",
    registration_number: "",
    ngo_gov_no: "",
    date_of_establishment: "",
    support_level: "state",
    funding_type: "government",
    benefits_to_receiver: "",
    items_received: "",
    delivery_details: "",
    delivery_method: "direct",
    preferred_delivery_time: "",
    warehouse_details: "",
    id_proof: null,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
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
        "http://localhost:5000/receiver/register",
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
    <div className="form-container receiver-form">
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
            <label><FaBuilding /> {getMessage(messages.fields.ngoName.label)}</label>
              <input
                type="text"
                name="ngo_name"
              className="form-input"
                value={formData.ngo_name}
              placeholder={getMessage(messages.fields.ngoName.placeholder)}
                onChange={handleChange}
                required
              />
            </div>

          <div className="form-group">
            <label><FaUser /> {getMessage(messages.fields.contactPerson.label)}</label>
              <input
                type="text"
                name="contact_person"
              className="form-input"
                value={formData.contact_person}
              placeholder={getMessage(messages.fields.contactPerson.placeholder)}
                onChange={handleChange}
                required
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
            <label><FaMapMarkerAlt /> {getMessage(messages.fields.streetName.label)}</label>
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
            <label><FaCity /> {getMessage(messages.fields.state.label)}</label>
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
          <h3><FaBuilding /> {getMessage(messages.sections.organizationDetails)}</h3>
          
          <div className="form-group">
            <label><FaGlobe /> {getMessage(messages.fields.website.label)}</label>
              <input
                type="url"
                name="website"
              className="form-input"
                value={formData.website}
              placeholder={getMessage(messages.fields.website.placeholder)}
                onChange={handleChange}
              />
            </div>

          <div className="form-group">
            <label><FaIdCard /> {getMessage(messages.fields.registrationNumber.label)}</label>
              <input
                type="text"
                name="registration_number"
              className="form-input"
                value={formData.registration_number}
              placeholder={getMessage(messages.fields.registrationNumber.placeholder)}
                onChange={handleChange}
                required
              />
            </div>

          <div className="form-group">
            <label><FaIdCard /> {getMessage(messages.fields.ngoGovNo.label)}</label>
              <input
                type="text"
                name="ngo_gov_no"
              className="form-input"
                value={formData.ngo_gov_no}
              placeholder={getMessage(messages.fields.ngoGovNo.placeholder)}
                onChange={handleChange}
                required
              />
            </div>

          <div className="form-group">
            <label><FaCalendarAlt /> {getMessage(messages.fields.dateOfEstablishment.label)}</label>
              <input
                type="date"
                name="date_of_establishment"
              className="form-input"
                value={formData.date_of_establishment}
                onChange={handleChange}
                required
              />
            </div>

          <div className="form-group">
            <label><FaUsers /> {getMessage(messages.fields.supportLevel.label)}</label>
              <select
              name="support_level"
              className="form-input"
              value={formData.support_level}
                onChange={handleChange}
                required
              >
              <option value="state">{getMessage(messages.fields.supportLevel.options.state)}</option>
              <option value="national">{getMessage(messages.fields.supportLevel.options.national)}</option>
              <option value="international">{getMessage(messages.fields.supportLevel.options.international)}</option>
              </select>
            </div>

          <div className="form-group">
            <label><FaUsers /> {getMessage(messages.fields.fundingType.label)}</label>
            <select
              name="funding_type"
              className="form-input"
              value={formData.funding_type}
                onChange={handleChange}
                required
            >
              <option value="government">{getMessage(messages.fields.fundingType.options.government)}</option>
              <option value="private">{getMessage(messages.fields.fundingType.options.private)}</option>
              <option value="mixed">{getMessage(messages.fields.fundingType.options.mixed)}</option>
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
            </div>

        <button type="submit" className="submit-button">
          <FaPaperPlane /> {getMessage(messages.buttons.register)}
            </button>
          </form>
    </div>
  );
};

export default Receiver;

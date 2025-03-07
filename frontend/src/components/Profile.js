import React, { useState, useEffect } from 'react';
import {
    FaStar,
    FaUser,
    FaTruck,
    FaHandHoldingHeart,
    FaCheckCircle,
    FaClock,
    FaTimes,
    FaUtensils,
    FaBuilding,
    FaCalendarAlt,
    FaBox
} from 'react-icons/fa';
import axios from 'axios';
import '../CSS/Profile.css';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { language } = useLanguage();

    const messages = {
        loading: {
            'en': 'Loading...',
            'hi': 'लोड हो रहा है...'
        },
        stats: {
            transactions: {
                'en': 'Transactions',
                'hi': 'लेन-देन'
            },
            reviews: {
                'en': 'Reviews',
                'hi': 'समीक्षाएं'
            },
            rating: {
                'en': 'Rating',
                'hi': 'रेटिंग'
            },
            completed: {
                'en': 'Completed',
                'hi': 'पूर्ण'
            },
            pending: {
                'en': 'Pending',
                'hi': 'लंबित'
            }
        },
        sections: {
            transactionHistory: {
                'en': 'Transaction History',
                'hi': 'लेन-देन इतिहास'
            },
            reviewsRatings: {
                'en': 'Reviews & Ratings',
                'hi': 'समीक्षाएं और रेटिंग'
            }
        },
        status: {
            completed: {
                'en': 'Completed',
                'hi': 'पूर्ण'
            },
            pending: {
                'en': 'Pending',
                'hi': 'लंबित'
            },
            cancelled: {
                'en': 'Cancelled',
                'hi': 'रद्द'
            },
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
        noTransactions: {
            'en': 'No transactions found',
            'hi': 'कोई लेनदेन नहीं मिला'
        },
        error: {
            'en': 'Error loading data',
            'hi': 'डेटा लोड करने में त्रुटि'
        },
        transactionDetails: {
            foodType: {
                'en': 'Food Type',
                'hi': 'खाद्य प्रकार'
            },
            quantity: {
                'en': 'Quantity',
                'hi': 'मात्रा'
            },
            date: {
                'en': 'Date',
                'hi': 'तारीख'
            },
            status: {
                'en': 'Status',
                'hi': 'स्थिति'
            },
            expiry: {
                'en': 'Expiry',
                'hi': 'समाप्ति'
            },
            from: {
                'en': 'From',
                'hi': 'से'
            },
            to: {
                'en': 'To',
                'hi': 'को'
            }
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const token = sessionStorage.getItem("token");
                if (!token) {
                    setError("You must be logged in to view your profile");
                    setLoading(false);
                    return;
                }
                
                // Fetch profile data from the backend
                const profileResponse = await axios.get("http://localhost:5000/profile/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (profileResponse.status === 200) {
                    const profileData = profileResponse.data.profile;
                    console.log("Profile data:", profileData);
                    
                    // Set user data from profile response
                    setUserData({
                        name: profileData.name || profileData.ngo_name || profileData.company_name || "Unknown",
                        role: profileData.role,
                        email: profileData.email,
                        phone: profileData.phone,
                        address: profileData.address,
                        joinDate: profileData.join_date,
                        // Role-specific fields
                        restaurant_name: profileData.restaurant_name,
                        ngo_name: profileData.ngo_name,
                        company_name: profileData.company_name,
                        registration_number: profileData.registration_number,
                        website: profileData.website,
                        // Stats
                        total_transactions: profileData.stats?.total_transactions || 0,
                        completed_transactions: profileData.stats?.completed_transactions || 0,
                        pending_transactions: profileData.stats?.pending_transactions || 0
                    });
                }
                
                // Fetch transactions
                await fetchTransactions();
                
                // Mock reviews data for now
                setReviews([
                    { id: 1, rating: 5, comment: "Great service!", date: "2023-05-10" },
                    { id: 2, rating: 4, comment: "Good quality food", date: "2023-04-22" }
                ]);
                
                setLoading(false);
            } catch (err) {
                console.error("Error fetching profile data:", err);
                setError("Failed to load profile data");
                setLoading(false);
            }
        };
        
        fetchUserData();
    }, []);
    
    const fetchTransactions = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }
            
            const response = await axios.get("http://localhost:5000/donation/transactions", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.status === 200) {
                setTransactions(response.data.transactions);
            }
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError("Failed to load transaction history");
        }
    };

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

    // Get CSS class based on user role
    const getRoleClass = () => {
        if (!userData) return '';
        
        switch (userData.role) {
            case 'donor':
                return 'donor-profile';
            case 'receiver':
                return 'receiver-profile';
            case 'delivery_partner':
                return 'delivery-profile';
            default:
                return '';
        }
    };

    // Get color based on status
    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
            case 'Delivered':
                return 'status-completed';
            case 'Pending':
            case 'Accepted':
            case 'Picked Up':
                return 'status-pending';
            case 'Cancelled':
            case 'Canceled':
                return 'status-cancelled';
            default:
                return '';
        }
    };

    // Render star rating
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FaStar 
                    key={i} 
                    className={i <= rating ? 'star-filled' : 'star-empty'} 
                />
            );
        }
        return stars;
    };
    
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(language, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };
    
    // Get icon based on food type
    const getFoodTypeIcon = (foodType) => {
        if (!foodType) return <FaBox />;
        
        const type = foodType.toLowerCase();
        if (type.includes('vegetarian')) return <FaUtensils style={{ color: 'green' }} />;
        if (type.includes('non-vegetarian')) return <FaUtensils style={{ color: 'red' }} />;
        return <FaUtensils />;
    };

    if (loading) {
        return <div className="loading-container">{getMessage('loading')}</div>;
    }

    if (error) {
        return <div className="error-container">{getMessage('error')}</div>;
    }

    return (
        <div className={`profile-container ${getRoleClass()}`}>
            {userData && (
                <>
            <div className="profile-header">
                        <div className="profile-avatar">
                            <FaUser />
                        </div>
                <div className="profile-info">
                            <h1>{userData.name}</h1>
                            <p className="role-badge">
                                {userData.role === 'donor' && <FaHandHoldingHeart />}
                                {userData.role === 'receiver' && <FaBuilding />}
                                {userData.role === 'delivery_partner' && <FaTruck />}
                                {userData.role === 'donor' ? 'Food Donor' : 
                                 userData.role === 'receiver' ? 'Food Receiver' : 
                                 userData.role === 'delivery_partner' ? 'Delivery Partner' : 
                                 userData.role}
                            </p>
                            
                            {/* Role-specific information */}
                            {userData.role === 'donor' && userData.restaurant_name && (
                                <p><strong>Restaurant/Business:</strong> {userData.restaurant_name}</p>
                            )}
                            
                            {userData.role === 'receiver' && userData.ngo_name && (
                                <p><strong>NGO Name:</strong> {userData.ngo_name}</p>
                            )}
                            
                            {userData.role === 'delivery_partner' && userData.company_name && (
                                <p><strong>Company Name:</strong> {userData.company_name}</p>
                            )}
                            
                            {userData.registration_number && (
                                <p><strong>Registration Number:</strong> {userData.registration_number}</p>
                            )}
                            
                            {userData.website && (
                                <p><strong>Website:</strong> <a href={userData.website} target="_blank" rel="noopener noreferrer">{userData.website}</a></p>
                            )}
                            
                            <p><strong>Email:</strong> {userData.email}</p>
                            {userData.phone && <p><strong>Phone:</strong> {userData.phone}</p>}
                            {userData.address && <p><strong>Address:</strong> {userData.address}</p>}
                            <p><strong>Member since:</strong> {formatDate(userData.joinDate)}</p>
                        </div>
                    </div>

                    <div className="profile-stats">
                        <div className="stat-card">
                            <h3>{getMessage('stats.transactions')}</h3>
                            <p>{userData.total_transactions || transactions.length}</p>
                        </div>
                        <div className="stat-card">
                            <h3>{getMessage('stats.completed')}</h3>
                            <p>{userData.completed_transactions || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h3>{getMessage('stats.pending')}</h3>
                            <p>{userData.pending_transactions || 0}</p>
                        </div>
                    </div>

                    <div className="profile-grid">
                        <div className="profile-section">
                            <h2>{getMessage('sections.transactionHistory')}</h2>
                            {transactions.length > 0 ? (
                                <div className="transactions-list">
                                    {transactions.map((transaction) => (
                                        <div key={transaction._id} className="transaction-card">
                                            <div className="transaction-header">
                                                <div className="food-type">
                                                    {getFoodTypeIcon(transaction.food_type)}
                                                    <span>{transaction.food_type}</span>
                                                </div>
                                                <div className={`transaction-status ${getStatusColor(transaction.status)}`}>
                                                    {getMessage(`status.${transaction.status}`) || transaction.status}
                </div>
            </div>

                                            <div className="transaction-details">
                                                <div className="detail-item">
                                                    <FaBox />
                                                    <span><strong>{getMessage('transactionDetails.quantity')}:</strong> {transaction.quantity} {transaction.unit}</span>
                                                </div>
                                                
                                                <div className="detail-item">
                                                    <FaCalendarAlt />
                                                    <span><strong>{getMessage('transactionDetails.date')}:</strong> {formatDate(transaction.created_at)}</span>
                                                </div>
                                                
                                                {transaction.expiry_date && (
                                                    <div className="detail-item">
                                                        <FaClock />
                                                        <span><strong>{getMessage('transactionDetails.expiry')}:</strong> {formatDate(transaction.expiry_date)}</span>
                                                    </div>
                                                )}
                                                
                                                {userData.role === 'donor' && transaction.receiver_name && (
                                                    <div className="detail-item">
                                                        <FaBuilding />
                                                        <span><strong>{getMessage('transactionDetails.to')}:</strong> {transaction.receiver_name}</span>
                                </div>
                                                )}
                                                
                                                {userData.role === 'receiver' && transaction.donor_name && (
                                                    <div className="detail-item">
                                                        <FaHandHoldingHeart />
                                                        <span><strong>{getMessage('transactionDetails.from')}:</strong> {transaction.donor_name}</span>
                                </div>
                                                )}
                                </div>
                            </div>
                        ))}
                    </div>
                            ) : (
                                <p className="no-data-message">{getMessage('noTransactions')}</p>
                            )}
                </div>

                        <div className="profile-section">
                            <h2>{getMessage('sections.reviewsRatings')}</h2>
                            <div className="reviews-list">
                                {reviews.map((review) => (
                                    <div key={review.id} className="review-card">
                                <div className="review-header">
                                            <div className="rating-stars">
                                        {renderStars(review.rating)}
                                            </div>
                                            <div className="review-date">
                                                {formatDate(review.date)}
                                            </div>
                                        </div>
                                        <p className="review-comment">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Profile; 
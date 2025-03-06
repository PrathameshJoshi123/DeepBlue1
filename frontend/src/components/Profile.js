import React, { useState, useEffect } from 'react';
import {
    FaStar,
    FaUser,
    FaTruck,
    FaHandHoldingHeart,
    FaCheckCircle,
    FaClock,
    FaTimes
} from 'react-icons/fa';
import '../CSS/Profile.css';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [reviews, setReviews] = useState([]);
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
            inProgress: {
                'en': 'In Progress',
                'hi': 'प्रगति में'
            }
        },
        transactionTypes: {
            donation: {
                'en': 'Donation',
                'hi': 'दान'
            },
            delivery: {
                'en': 'Delivery',
                'hi': 'वितरण'
            }
        }
    };

    const getMessage = (path) => {
        const langCode = language.split('-')[0];
        return path[langCode] || path['en'];
    };

    useEffect(() => {
        // Get user data from session storage
        const user = JSON.parse(sessionStorage.getItem('user'));
        setUserData(user);

        // Mock data for demonstration
        setTransactions([
            {
                id: 1,
                type: getMessage(messages.transactionTypes.donation),
                title: 'Food Donation to Local NGO',
                date: '2024-03-15',
                status: getMessage(messages.status.completed),
                icon: <FaHandHoldingHeart />
            },
            {
                id: 2,
                type: getMessage(messages.transactionTypes.delivery),
                title: 'Food Delivery to Shelter',
                date: '2024-03-10',
                status: getMessage(messages.status.inProgress),
                icon: <FaTruck />
            }
        ]);

        setReviews([
            {
                id: 1,
                name: 'John Doe',
                avatar: 'https://i.pravatar.cc/150?img=1',
                rating: 5,
                content: 'Great donor! Very reliable and consistent with their donations.',
                date: '2024-03-12'
            },
            {
                id: 2,
                name: 'Jane Smith',
                avatar: 'https://i.pravatar.cc/150?img=2',
                rating: 4,
                content: 'Always on time with deliveries. Very professional service.',
                date: '2024-03-08'
            }
        ]);
    }, [language]);

    const getRoleClass = () => {
        if (!userData) return '';
        switch (userData.role) {
            case 'donor':
                return 'donor-profile';
            case 'receiver':
                return 'receiver-profile';
            case 'delivery':
                return 'delivery-profile';
            default:
                return '';
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case getMessage(messages.status.completed).toLowerCase():
                return { background: '#dcfce7', color: '#166534' };
            case getMessage(messages.status.inProgress).toLowerCase():
                return { background: '#fff7ed', color: '#9a3412' };
            default:
                return { background: '#f3f4f6', color: '#374151' };
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar key={index} color={index < rating ? '#f59e0b' : '#e2e8f0'} />
        ));
    };

    if (!userData) {
        return <div>{getMessage(messages.loading)}</div>;
    }

    return (
        <div className={`profile-container ${getRoleClass()}`}>
            <div className="profile-header">
                <img
                    src={userData.avatar || 'https://i.pravatar.cc/300'}
                    alt="Profile"
                    className="profile-avatar"
                />
                <div className="profile-info">
                    <h1 className="profile-name">{userData.name || 'User Name'}</h1>
                    <p className="profile-role">{userData.role || 'Role'}</p>
                    <div className="profile-stats">
                        <div className="stat-item">
                            <div className="stat-value">{transactions.length}</div>
                            <div className="stat-label">{getMessage(messages.stats.transactions)}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">{reviews.length}</div>
                            <div className="stat-label">{getMessage(messages.stats.reviews)}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">4.5</div>
                            <div className="stat-label">{getMessage(messages.stats.rating)}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-grid">
                <div className="transactions-section">
                    <h2 className="section-title">{getMessage(messages.sections.transactionHistory)}</h2>
                    <div className="transaction-list">
                        {transactions.map(transaction => (
                            <div key={transaction.id} className="transaction-item">
                                <div className="transaction-icon" style={getStatusColor(transaction.status)}>
                                    {transaction.icon}
                                </div>
                                <div className="transaction-info">
                                    <div className="transaction-title">{transaction.title}</div>
                                    <div className="transaction-date">{transaction.date}</div>
                                </div>
                                <div className="transaction-status" style={getStatusColor(transaction.status)}>
                                    {transaction.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="reviews-section">
                    <h2 className="section-title">{getMessage(messages.sections.reviewsRatings)}</h2>
                    <div className="review-list">
                        {reviews.map(review => (
                            <div key={review.id} className="review-item">
                                <div className="review-header">
                                    <img
                                        src={review.avatar}
                                        alt={review.name}
                                        className="reviewer-avatar"
                                    />
                                    <span className="reviewer-name">{review.name}</span>
                                    <div className="review-rating">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                                <p className="review-content">{review.content}</p>
                                <div className="review-date">{review.date}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 
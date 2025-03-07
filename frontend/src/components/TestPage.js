import React, { useState } from 'react';
import axios from 'axios';

const TestPage = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const createTestDonation = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/donation/create_test_donation');
      setMessage(`Success: ${response.data.message} (ID: ${response.data.donation_id})`);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestAcceptedDonation = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/donation/create_test_accepted_donation');
      setMessage(`Success: ${response.data.message} (ID: ${response.data.donation_id})`);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestDeliveryDonation = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/donation/create_test_delivery_donation');
      setMessage(`Success: ${response.data.message} (ID: ${response.data.donation_id})`);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test Page</h1>
      <p>Use this page to create test data for development purposes.</p>
      
      <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <button 
          onClick={createTestDonation}
          disabled={loading}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Create Test Pending Donation
        </button>
        
        <button 
          onClick={createTestAcceptedDonation}
          disabled={loading}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#2196F3', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Create Test Accepted Donation
        </button>
        
        <button 
          onClick={createTestDeliveryDonation}
          disabled={loading}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#FF9800', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Create Test Delivery-Ready Donation
        </button>
      </div>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e9',
          border: `1px solid ${message.includes('Error') ? '#ffcdd2' : '#c8e6c9'}`,
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h2>Instructions</h2>
        <ol>
          <li>Click "Create Test Pending Donation" to create a donation with "Pending" status</li>
          <li>Click "Create Test Accepted Donation" to create a donation with "Accepted" status</li>
          <li>Click "Create Test Delivery-Ready Donation" to create a donation with "Ready for Delivery" status</li>
          <li>Go to the Dashboard or Delivery Dashboard to see these donations</li>
        </ol>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Navigation</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="/dashboard" style={{ 
              padding: '8px 12px', 
              backgroundColor: '#2196F3', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '4px'
            }}>
              Go to Dashboard
            </a>
            <a href="/delivery-dashboard" style={{ 
              padding: '8px 12px', 
              backgroundColor: '#FF9800', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '4px'
            }}>
              Go to Delivery Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 
import React from 'react';
import './LoadingSpinner.css'; // Import the CSS styles for the spinner

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-spinner-container">
      <section className="spacing"></section>
      <h2>{message}</h2>
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
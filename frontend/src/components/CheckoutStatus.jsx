import React, { useEffect, useState } from 'react';
import './CheckoutStatus.css';

const CheckoutStatus = () => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(timer);
          window.close(); // Close the window when countdown reaches 0
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    // Clean up timer on unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="checkout-status-container">
      <section className="spacing"></section>
      <div className="status-card">
        <div className="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"></path>
          </svg>
        </div>
        <h1>Payment Successful!</h1>
        <p>Your transaction has been completed successfully.</p>
        <p>This window will close automatically in <span className="countdown">{countdown}</span> seconds.</p>
        <button onClick={() => window.close()}>Close Now</button>
      </div>
    </div>
  );
};

export default CheckoutStatus;
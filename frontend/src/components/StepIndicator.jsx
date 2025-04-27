import React from 'react';
import './StepIndicator.css';

const StepIndicator = ({ currentStep }) => {
  return (
    <div className="step-indicator">
      <div className="indicator-spacing"> </div>
      <div className="other-elements">
      <div className="step-container">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="circle">1</div>
            <span>Shopping Cart</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="circle">2</div>
            <span>Reservation</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="circle">3</div>
            <span>Checkout Finish</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;

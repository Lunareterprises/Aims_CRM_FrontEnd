import React from 'react';
import '../Sales/Customers.css';

const Paymentsmade = () => {
  return (
    <div className="banking-container">
      <h2>You haven’t made any payments yet.
      </h2>
      <p>
      Receipts of your bill payments will show up here.
      </p>
      <div className="button-group">
        <button className="connect-button">GO TO UN PAID INVOICES</button>
        {/* <button className="add-manually-button">Add Manually</button> */}
      </div>
      <p className="skip-link">
      Import Payments
      </p>
      {/* <div className="watch-video">
        <i className="fas fa-play-circle"></i>
        <span>Watch how to connect your bank account to Zoho Books</span>
      </div> */}
    </div>
  );
};

export default Paymentsmade;

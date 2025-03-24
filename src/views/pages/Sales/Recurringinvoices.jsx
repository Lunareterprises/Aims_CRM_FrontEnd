import React from 'react';
import '../Sales/Customers.css';

const Recurringinvoices = () => {
  return (
    <div className="banking-container">
      <h2>Create. Set. Repeat.</h2>
      <p>
      Set up a profile to periodically create and send invoices to your customers.
      </p>
      <div className="button-group">
        <button className="connect-button"> CREATE NEW RECURRING INVOICE</button>
        {/* <button className="add-manually-button">Add Manually</button> */}
      </div>
      <p className="skip-link">
      Import Recurring Invoices
      </p>
      {/* <div className="watch-video">
        <i className="fas fa-play-circle"></i>
        <span>Watch how to connect your bank account to Zoho Books</span>
      </div> */}
    </div>
  );
};

export default Recurringinvoices;

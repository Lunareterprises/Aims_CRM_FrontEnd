import React from 'react';
import '../Sales/Customers.css';

const Vendorcredit = () => {
  return (
    <div className="banking-container">
      <h2>You deserve some credit too.</h2>
      <p>
      Create vendor credits and apply them to multiple bills when buying stuff from your vendor.
      </p>
      <div className="button-group">
        <button className="connect-button"> CREATE  VENDOR CREDITS</button>
        {/* <button className="add-manually-button">Add Manually</button> */}
      </div>
      <p className="skip-link">
       Import Vendor Credit
      </p>
      {/* <div className="watch-video">
        <i className="fas fa-play-circle"></i>
        <span>Watch how to connect your bank account to Zoho Books</span>
      </div> */}
    </div>
  );
};

export default Vendorcredit;

import React from 'react';
import '../Sales/Customers.css';

const Timesheet = () => {
  return (
    <div className="banking-container">
      <h2>Create your first time entry
     </h2>
      <p>
      Log the time spent on project tasks and charge your customers accordingly.
      </p>
      <div className="button-group">
        <button className="connect-button">LOG TIME</button>
        {/* <button className="add-manually-button">NEW RECURRING INVOICES</button> */}
      </div>
      {/* <p className="skip-link">
      Import Bills
      </p> */}
      {/* <div className="watch-video">
        <i className="fas fa-play-circle"></i>
        <span>Watch how to connect your bank account to Zoho Books</span>
      </div> */}
    </div>
  );
};

export default Timesheet;

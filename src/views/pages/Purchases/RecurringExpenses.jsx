import React from 'react';
import '../Sales/Customers.css';

const RecurringExpenses = () => {
  return (
    <div className="banking-container">
      <h2>Create. Set. Repeat.</h2>
      <p>
      Create recurring expenses to handle and pay for stuff you spend on periodically.
      </p>
      <div className="button-group">
        <button className="connect-button">NEW RECURRING EXPENSE</button>
        {/* <button className="add-manually-button">Add Manually</button> */}
      </div>
      <p className="skip-link">
      Import Recurring Expenses 
      </p>
      {/* <div className="watch-video">
        <i className="fas fa-play-circle"></i>
        <span>Watch how to connect your bank account to Zoho Books</span>
      </div> */}
    </div>
  );
};

export default RecurringExpenses;

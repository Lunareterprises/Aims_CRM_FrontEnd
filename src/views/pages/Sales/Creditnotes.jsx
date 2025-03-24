import React from 'react'
import '../Sales/Customers.css'

const Creditnotes = () => {
  return (
    <div className="banking-container">
      {/* <h2>Bussiness is no fun without people</h2>
      <p>
        Create and manage your contacts,all in one place
      </p> */}
      <div className="button-group">
        <button className="connect-button"> CREATE NEW CREDIT NOTES</button>
        {/* <button className="add-manually-button">Add Manually</button> */}
      </div>
      <p className="skip-link">Import Credit Notes</p>
      {/* <div className="watch-video">
        <i className="fas fa-play-circle"></i>
        <span>Watch how to connect your bank account to Zoho Books</span>
      </div> */}
    </div>
  )
}

export default Creditnotes

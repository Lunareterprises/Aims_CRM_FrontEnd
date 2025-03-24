import React from 'react';
import '../Sales/Customers.css';

const Projects = () => {
  return (
    <div className="banking-container">
      <h2>Create your first project.</h2>
      <p>
      Keep track of time you spend on various projects.
      </p>
      <div className="button-group">
        <button className="connect-button">
          <a href='/dashboard/AddProjects' className='text-white'>
          CREATE NEW PROJECT
          </a>
          </button>
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

export default Projects;

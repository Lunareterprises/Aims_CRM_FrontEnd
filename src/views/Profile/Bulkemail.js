import React, { useState } from 'react';
import '../Profile/BulkEmailSender.css'
const initialEmailList = [
  'john.doe@example.com',
  'jane.smith@example.com',
  'bob.jones@example.com',
  'alice.brown@example.com',
  'charlie.white@example.com',
  'david.black@example.com',
];

function BulkEmailSender() {
  const [emailList, setEmailList] = useState(initialEmailList);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleEmailSelect = (event) => {
    const selectedEmail = event.target.value;
    setSelectedEmails((prev) =>
      prev.includes(selectedEmail)
        ? prev.filter((email) => email !== selectedEmail)
        : [...prev, selectedEmail]
    );
  };

  const removeSelectedEmails = () => {
    setEmailList((prev) => prev.filter((email) => !selectedEmails.includes(email)));
    setSelectedEmails([]);
  };

  const handleSendEmails = () => {
    if (selectedEmails.length === 0) {
      alert('Please select at least one email.');
      return;
    }
    console.log('Sending emails to:', selectedEmails);
    // Simulate sending emails
    setTimeout(() => {
      alert(`Emails sent to: ${selectedEmails.join(', ')}`);
      setSelectedEmails([]);
      setSubject('');
      setBody('');
    }, 1000);
  };

  return (
    <div className="bulk-email-sender">
      <h2>Bulk Email Sender</h2>
      <div className="email-list-section">
        <select onChange={handleEmailSelect}>
          <option value="">Select an email</option>
          {emailList.map((email) => (
            <option key={email} value={email}>
              {email}
            </option>
          ))}
        </select>
        <ul className='ulstyle hightadjust'>
          {selectedEmails.map((email) => (
            <li  key={email} className=''>
              {email}
              <button onClick={() => handleEmailSelect({ target: { value: email } })}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button onClick={removeSelectedEmails}>Remove All Selected</button>
      </div>
      <div className="email-content-section">
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          placeholder="Email body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
      </div>
      <div className="action-buttons">
      <button
          onClick={() => {
            setSelectedEmails([]);
            setSubject('');
            setBody('');
          }}
        >
          Cancel
        </button>
        <button onClick={handleSendEmails}>Send</button>
       
      </div>
    </div>
  );
}

export default BulkEmailSender;

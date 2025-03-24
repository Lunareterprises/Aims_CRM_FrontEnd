import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import PaymentAll from './PaymentAll';

function Payment() {
  return (
    <Tabs defaultActiveKey="paymentAll" id="uncontrolled-tab-example" className="mb-3">
      <Tab eventKey="paymentAll" title="Payment All">
        <div className="p-3">
         <PaymentAll/>
        </div>
      </Tab>
      <Tab eventKey="profile" title="Profile">
        <div className="p-3">
          <h3>Profile</h3>
          <p>This is the Profile tab content.</p>
        </div>
      </Tab>
      <Tab eventKey="contact" title="Contact" >
        <div className="p-3">
          <h3>Contact</h3>
          <p>This is the Contact tab content.</p>
        </div>
      </Tab>
    </Tabs>
  );
}

export default Payment;

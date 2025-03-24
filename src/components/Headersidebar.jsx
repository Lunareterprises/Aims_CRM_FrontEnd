import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, Modal } from 'react-bootstrap';
import '../components/AppHeader.css';

function Headersidebar() {

  const apps = [
    { name: 'AIMS Expense', description: 'Expense Reporting Software', icon: 'fa-file-alt' },
    { name: 'AIMS Billing', description: 'End-to-end Billing Solution', icon: 'fa-file-invoice-dollar' },
    { name: 'AIMS Inventory', description: 'Order & Inventory Management Software', icon: 'fa-boxes' },
    { name: 'AIMS Checkout', description: 'One-time and recurring payments software', icon: 'fa-credit-card' },
    { name: 'AIMS Commerce', description: 'Ecommerce software.', icon: 'fa-store' },
    { name: 'AIMS Payroll', description: 'Simplified Payroll Management Software', icon: 'fa-money-check' },
  ];

  

  return (
    <>
     
          <Container fluid className="bg-light ">
            <Row>
              <Col  className="bg-white ">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>All AIMS Apps</h5>
                 
                </div>
                <Form.Control type="text" placeholder="Search" className="mb-3" />
                <h6 className="text-muted">FINANCE APPS</h6>
                <ListGroup variant="flush">
                  {apps.map((app, index) => (
                    <ListGroup.Item key={index} className="d-flex align-items-center py-3">
                      <i className={`fas ${app.icon} fa-2x me-3 text-primary`}></i>
                      <div>
                        <strong>{app.name}</strong>
                        <div className="text-muted">{app.description}</div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Row>
          </Container>
      
    </>
  );
}

export default Headersidebar;

import React, { useState } from 'react';
import { Container, Row, Col, Table, Dropdown, Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaInfoCircle } from "react-icons/fa"; // Import the info icon
import '../Accountants/Accountants.css';

const Accountants = () => {
  const [selectedAccount, setSelectedAccount] = useState("Active Accounts");
  const [showModal, setShowModal] = useState(false);
  const [accountType, setAccountType] = useState("Asset");
  const [hover, setHover] = useState(false);
  const accounts = [
    { name: 'Cash', code: '-', type: 'Other Current Asset', documents: '-', parent: '-' },
    { name: 'Accounts Receivable', code: '-', type: 'Accounts Receivable', documents: '-', parent: '-' },
    { name: 'Furniture and Equipment', code: '-', type: 'Fixed Asset', documents: '-', parent: '-' },
    { name: 'Employee Reimbursements', code: '-', type: 'Other Current Liability', documents: '-', parent: '-' },
    { name: 'Opening Balance Adjustments', code: '-', type: 'Other Current Liability', documents: '-', parent: '-' },
    { name: 'Unearned Revenue', code: '-', type: 'Other Current Liability', documents: '-', parent: '-' },
  ];

  return (
    <Container fluid className="py-3">
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6} className="d-flex align-items-center">
          <h5 className="mb-0 me-2">Active Accounts</h5>
          <Dropdown onSelect={(eventKey) => setSelectedAccount(eventKey)}>
            <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
              {selectedAccount}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="Active Accounts">Active Accounts</Dropdown.Item>
              <Dropdown.Item eventKey="Inactive Accounts">Inactive Accounts</Dropdown.Item>
              <Dropdown.Item eventKey="Asset Accounts">Asset Accounts</Dropdown.Item>
              <Dropdown.Item eventKey="Liability Accounts">Liability Accounts</Dropdown.Item>
              <Dropdown.Item eventKey="Equity Accounts">Equity Accounts</Dropdown.Item>
              <Dropdown.Item eventKey="Income Accounts">Income Accounts</Dropdown.Item>
              <Dropdown.Item eventKey="Expense Accounts">Expense Accounts</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="New Custom View">New Custom View</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={12} md={6} className="text-md-end mt-3 mt-md-0">
          <Button variant="primary" className="me-2" onClick={() => setShowModal(true)}>
            + New Account
          </Button>
          <Button
            variant="outline-secondary"
            style={{
              fontSize: "18px",
              width: "auto",
              padding: "2px 8px",
              minWidth: "unset",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: hover ? "#acacac" : "transparent",
              
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            ⋮
          </Button>
          {/* <Button variant="outline-secondary">Find Accountants</Button> */}
        </Col>
      </Row>

      <Table bordered hover responsive>
        <thead className="table-light text-center">
          <tr>
            <th>
              <Form.Check type="checkbox" />
            </th>
            <th>Account Name</th>
            <th>Account Code</th>
            <th>Account Type</th>
            <th>Documents</th>
            <th>Parent Account Name</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr key={index}>
              <td>
                <Form.Check type="checkbox" />
              </td>
              <td>{account.name}</td>
              <td>{account.code}</td>
              <td>{account.type}</td>
              <td>{account.documents}</td>
              <td>{account.parent}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Creating a New Account */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Account Type with Tooltip */}
            <Row className="mb-3 align-items-center">
              <Col xs={4} md={2} className="d-flex align-items-center">
                <Form.Label className="text-danger fw-medium me-2">Account Type*</Form.Label>
                                
              </Col>
              
              <Col xs={8} md={7}>
                <Form.Select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                  <option value="Asset">Asset</option>
                  <option value="Liability">Liability</option>
                  <option value="Equity">Equity</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </Form.Select>
              </Col>

              <Col xs={4} md={3} className="position-relative">
              <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="tooltip-account-type">
                      Asset <br />
                      Track special assets like goodwill and other intangible assets
                    </Tooltip>
                  }
                >
                  <span className="text-muted">
                    <FaInfoCircle />
                  </span>
                </OverlayTrigger>
              </Col>
            </Row>

            {/* Account Name */}
            <Row className="mb-3 align-items-center">
              <Col xs={4} md={2}>
                <Form.Label className="text-danger fw-medium">Account Name*</Form.Label>
              </Col>
              <Col xs={8} md={7}>
                <Form.Control type="text" placeholder="Enter account name" />
              </Col>
            </Row>

            {/* Account Code */}
            <Row className="mb-3 align-items-center">
              <Col xs={4} md={2}>
                <Form.Label>Account Code</Form.Label>
              </Col>
              <Col xs={8} md={7}>
                <Form.Control type="text" placeholder="Enter account code" />
              </Col>
            </Row>

            {/* Description */}
            <Row className="mb-3">
              <Col xs={4} md={2}>
                <Form.Label>Description</Form.Label>
              </Col>
              <Col xs={8} md={7}>
                <Form.Control as="textarea" rows={3} maxLength={500} placeholder="Max. 500 characters" />
              </Col>
            </Row>

            {/* Watchlist Checkbox */}
            <Row className="mb-3">
              <Col xs={4} md={2}></Col>
              <Col xs={8} md={7}>
                <Form.Group>
                  <Form.Check type="checkbox" label="Add to the watchlist on my dashboard" />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary">Save</Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Accountants;

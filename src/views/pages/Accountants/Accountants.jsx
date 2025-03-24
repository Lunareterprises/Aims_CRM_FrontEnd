import React from 'react';
import { Container, Row, Col, Table, Dropdown, Button, Form } from 'react-bootstrap';
import '../Accountants/Accountants.css'
const Accountants = () => {
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
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
              All Accounts
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Active Accounts</Dropdown.Item>
              <Dropdown.Item>Inactive Accounts</Dropdown.Item>
              <Dropdown.Item>Asset Accounts</Dropdown.Item>
              <Dropdown.Item>Liability Accounts</Dropdown.Item>
              <Dropdown.Item>Equity Accounts</Dropdown.Item>
              <Dropdown.Item>Income Accounts</Dropdown.Item>
              <Dropdown.Item>Expense Accounts</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>New Custom View</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={12} md={6} className="text-md-end mt-3 mt-md-0">
          <Button variant="primary" className="me-2">
            + New Account
          </Button>
          <Button variant="outline-secondary">Find Accountants</Button>
        </Col>
      </Row>

      <Table bordered hover responsive>
        <thead className="table-light">
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
    </Container>
  );
};

export default Accountants;

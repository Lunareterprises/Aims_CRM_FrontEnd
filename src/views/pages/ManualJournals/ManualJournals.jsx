import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import "../Accountants/Accountants.css";

// Default data
const defaultAccounts = [
  {
    code: "JNL001",
    date: "2024-03-25",
    journal: "Sales Journal",
    reference: "REF12345",
    status: "Published",
    notes: "Sales entry for March",
    amount: "₹10,000",
    createdBy: "Admin",
  },
  {
    code: "JNL002",
    date: "2024-03-20",
    journal: "Expense Journal",
    reference: "REF67890",
    status: "Draft",
    notes: "Office rent payment",
    amount: "₹5,000",
    createdBy: "John Doe",
  },
];

const ManualJournals = ({ accounts = defaultAccounts }) => {  // Fixed the issue here
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedItems(newSelectAll ? accounts.map((account) => account.code) : []);
  };

  const handleSelectItem = (code) => {
    setSelectedItems((prev) =>
      prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]
    );
  };

  return (
    <Container fluid className="py-3">
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6} className="d-flex align-items-center">
          <h5 className="mb-0 me-2">Manual Journals</h5>
        </Col>
        <Col xs={12} md={6} className="text-md-end mt-3 mt-md-0">
          <Button variant="primary" className="me-2" onClick={() => navigate("/dashboard/AddNewManualJournals")}>
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
              color: hover ? "black" : "white",
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            ⋮
          </Button>
        </Col>
      </Row>
      <hr />

      {/* Filters */}
      <Row className="align-items-center mb-3">
        <Col xs={12} md={1}>
          <h6 className="mb-0">View By</h6>
        </Col>
        <Col xs={12} md={2}>
          <h6 className="mb-0 me-2">Status:</h6>
          <Form.Select size="sm">
            <option>All</option>
            <option>Publish Journal</option>
            <option>Draft</option>
          </Form.Select>
        </Col>
        <Col xs={12} md={2}>
          <h6 className="mb-0 me-2">Period:</h6>
          <Form.Select size="sm">
            <option>All</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Table */}
      <Table bordered hover responsive>
      <thead className="table-light text-center">

          <tr>
            <th>
              <Form.Check type="checkbox" checked={selectAll} onChange={handleSelectAll} />
            </th>
            <th>Date</th>
            <th>Journal</th>
            <th>Reference Number</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Amount</th>
            <th>Created By</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <tr key={account.code}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedItems.includes(account.code)}
                    onChange={() => handleSelectItem(account.code)}
                  />
                </td>
                <td>{account.date || "-"}</td>
                <td>{account.journal || "-"}</td>
                <td>{account.reference || "-"}</td>
                <td>{account.status || "-"}</td>
                <td>{account.notes || "-"}</td>
                <td>{account.amount || "-"}</td>
                <td>{account.createdBy || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No accounts available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManualJournals;

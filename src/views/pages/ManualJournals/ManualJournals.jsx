import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { FaFilePdf } from "react-icons/fa"; 
import JournalModal from "./JournalModal"; // Import the modal component
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

const ManualJournals = ({ accounts = defaultAccounts }) => {
  const navigate = useNavigate();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedItems(selectAll ? [] : accounts.map((account) => account.code));
  };

  const handleSelectItem = (code) => {
    setSelectedItems((prev) =>
      prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]
    );
  };

  const handleShowModal = (account) => {
    setSelectedNote(account);  
    setShowModal(true);
  };

  return (
    <Container fluid className="py-3">
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6}>
          <h5 className="mb-0">Manual Journals</h5>
        </Col>
        <Col xs={12} md={6} className="text-md-end mt-3 mt-md-0">
          <Button variant="primary" onClick={() => navigate("/dashboard/AddNewManualJournals")}>
            + New Account
          </Button>
        </Col>
      </Row>
      <hr />
{/* Filters */}
      <Row className="d-flex align-items-center mb-3">
        <Col xs="auto">
          <h6 className="mb-0">View By</h6>
        </Col>
        <Col xs="auto" className="d-flex align-items-center">
          <h6 className="mb-0 me-2">Status:</h6>
          <Form.Select size="sm">
            <option>All</option>
            <option>Publish Journal</option>
            <option>Draft</option>
          </Form.Select>
        </Col>
        <Col xs="auto" className="d-flex align-items-center">
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
                <td 
                  style={{ cursor: "pointer", color: "blue" }} 
                  onClick={() => handleShowModal(account)} 
                >
                  <FaFilePdf size={18} style={{ marginRight: "5px", color: "red" }} />
                  
                </td>
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

      <JournalModal showModal={showModal} setShowModal={setShowModal} selectedNote={selectedNote} />
    </Container>
  );
};

export default ManualJournals;

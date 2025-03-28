import React, { useState } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { FaFilePdf } from "react-icons/fa"; 
import AdjustmentModal from "./AdjustmentModal"; 
import "./CurrencyAdjestments.css";



const defaultAccounts = [
  {
    code: "JNL001",
    date: "2024-03-25",
  },
  {
    code: "JNL002",
    date: "2024-03-20",
  },
];

const CurrencyAdjestmentIndex = ({ accounts = defaultAccounts }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
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

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container fluid className="py-3">
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6}>
          <h5 className="mb-0">Base Currency Adjustments</h5>
        </Col>
        <Col xs={12} md={6} className="text-md-end mt-3 mt-md-0">
          <Button variant="primary" onClick={handleShowModal}>
            + Make an Adjustment
          </Button>
        </Col>
      </Row>
      <hr />

      {/* Filters */}
            <Row className="d-flex align-items-center mb-3">
              <Col xs="auto" className="d-flex align-items-center">
                <h6 className="mb-0 me-2" style={{ whiteSpace:"nowrap"}}>Filter By:</h6>
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
            <th>Currency</th>
            <th>Exchange Date</th>
            <th>Gain/Loss</th>
            <th>Notes</th>
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
                <td style={{ cursor: "pointer", color: "blue" }} >{account.status || "-"}
                  {/* <FaFilePdf size={18} style={{ marginRight: "5px", color: "red" }} /> */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No accounts available
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal Component */}
      <AdjustmentModal show={showModal} handleClose={handleCloseModal} />
    </Container>
  );
};

export default CurrencyAdjestmentIndex;

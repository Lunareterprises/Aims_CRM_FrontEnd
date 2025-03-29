
import React, { useState } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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

const BudgetsIndex = ({ accounts = defaultAccounts }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const handleShowModal = () => {
    setShowModal(true);
  };



  return (
    <Container fluid className="py-3">
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6}>
          <h5 className="mb-0">Budgets</h5>
        </Col>
        <Col xs={12} md={6} className="text-md-end mt-3 mt-md-0">
          <Button variant="primary" onClick={() => navigate("/dashboard/NewBudget")}>
            + New Budget
          </Button>
        </Col>
      </Row>
      
      {/* Table */}
      <Table bordered hover responsive>
        <thead className="table-light text-center">
          <tr>
            
            <th>Name</th>
            <th>Fiscal</th>
            <th>Budjet Period</th>
           
          </tr>
        </thead>
        <tbody>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <tr key={account.code}>
                
                <td>{account.name || "-"}</td>
                <td>{account.journal || "-"}</td>
                <td>{account.reference || "-"}</td>
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

    </Container>
  );
};

export default BudgetsIndex;

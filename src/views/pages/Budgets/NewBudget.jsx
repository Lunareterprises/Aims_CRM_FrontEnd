import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import IncomeAccountModal from "./IncomeAccountModal";
import ExpenseAccountModal from "./ExpenseAccountModal";
import AssetAccountModal from "./AssetAccountModal";
import LiabilityAccountModal from "./LiabilityAccountModal";
import EquityAccountModal from "./EquityAccountModal";

function NewBudget() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showAccounts, setShowAccounts] = useState(false);
  const [selectedModal, setSelectedModal] = useState("");
  const [showModal, setShowModal] = useState(false);

  // State for each account type
  const [incomeAccounts, setIncomeAccounts] = useState([]);
  const [expenseAccounts, setExpenseAccounts] = useState([]);
  const [assetAccounts, setAssetAccounts] = useState([]);
  const [liabilityAccounts, setLiabilityAccounts] = useState([]);
  const [equityAccounts, setEquityAccounts] = useState([]);
  const navigate = useNavigate();

  const handleOpenModal = (type) => {
    setSelectedModal(type);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // Function to update selected accounts dynamically
  const handleAccountsUpdate = (type, accounts) => {
    switch (type) {
      case "Income Account":
        setIncomeAccounts(accounts);
        break;
      case "Expense Account":
        setExpenseAccounts(accounts);
        break;
      case "Asset Accounts":
        setAssetAccounts(accounts);
        break;
      case "Liability Accounts":
        setLiabilityAccounts(accounts);
        break;
      case "Equity Accounts":
        setEquityAccounts(accounts);
        break;
      default:
        break;
    }
    handleCloseModal();
  };

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

 
  
  const fiscalYears = [
    "April 2023 - March 2024",
    "April 2024 - March 2025",
    "April 2025 - March 2026",
    "April 2026 - March 2027",
    "April 2027 - March 2028"
  ];

  const budgetPeriods = ["Monthly", "Quarterly", "Half-Yearly", "Yearly"];


  return (
    <Container>
      <h3 className="my-4">New Budget</h3>

      <Form onSubmit={handleSubmit(onSubmit)}>

      <Row className="mb-3 fs-6">
          <Col md={2}>
            <Form.Label className="text-danger fw-medium">Date*</Form.Label>
          </Col>
          <Col md={4}>
            <Form.Control type="date" {...register("date", { required: "Date is required" })} />
            {errors.date && <small className="text-danger">{errors.date.message}</small>}
          </Col>
        </Row>

        {/* Fiscal Year Dropdown */}
        <Row className="mb-3 fs-6">
          <Col md={2}>
            <Form.Label className="text-danger fw-medium">Fiscal Year*</Form.Label>
          </Col>
          <Col md={4}>
            <Form.Select {...register("fiscalYear", { required: "Fiscal Year is required" })}>
              <option value="">Select Fiscal Year</option>
              {fiscalYears.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </Form.Select>
            {errors.fiscalYear && <small className="text-danger">{errors.fiscalYear.message}</small>}
          </Col>
        </Row>

        {/* Budget Period Dropdown */}
        <Row className="mb-3 fs-6">
          <Col md={2}>
            <Form.Label className="text-danger fw-medium">Budget Period*</Form.Label>
          </Col>
          <Col md={4}>
            <Form.Select {...register("budgetPeriod", { required: "Budget Period is required" })}>
              <option value="">Select Budget Period</option>
              {budgetPeriods.map((period, index) => (
                <option key={index} value={period}>{period}</option>
              ))}
            </Form.Select>
            {errors.budgetPeriod && <small className="text-danger">{errors.budgetPeriod.message}</small>}
          </Col>
        </Row>
        {/* Income and Expense Accounts */}
        <h4 className="fs-5 text-secondary mt-5 mb-5">Income and Expense Accounts</h4>

        {/* Income Accounts */}
        <Row className="mb-3 fs-6">
          <Col md={2}>
            <Form.Label>Income Accounts</Form.Label>
          </Col>
          <Col md={4}>
            {incomeAccounts.length > 0 && (
              <div className="bg-white p-3 d-flex flex-wrap gap-2">
                {incomeAccounts.map((account, index) => (
                  <span key={index} className="bg-light text-dark p-2 rounded">{account}</span>
                ))}
              </div>
            )}
            <Form.Control
              className="text-primary"
              type="button"
              value={incomeAccounts.length > 0 ? "Add or Remove Account" : "Add Account"}
              onClick={() => handleOpenModal("Income Account")}
            />
          </Col>
        </Row>

        {/* Expense Accounts */}
        <Row className="mb-3 fs-6">
          <Col md={2}>
            <Form.Label>Expense Accounts</Form.Label>
          </Col>
          <Col md={4}>
            {expenseAccounts.length > 0 && (
              <div className="bg-white p-3 d-flex flex-wrap gap-2">
                {expenseAccounts.map((account, index) => (
                  <span key={index} className="bg-light text-dark p-2 rounded">{account}</span>
                ))}
              </div>
            )}
            <Form.Control
              className="text-primary"
              type="button"
              value={expenseAccounts.length > 0 ? "Add or Remove Account" : "Add Account"}
              onClick={() => handleOpenModal("Expense Account")}
            />
          </Col>
        </Row>

        {/* Asset, Liability, and Equity Accounts Section */}
        {!showAccounts ? (
          <Row className="mb-3 fs-6">
            <Col md={6}>
              <p className="d-flex gap-3">
                <Button 
                  variant="primary" 
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "10px", height: "25px", fontSize: "15px", lineHeight: "1" }}
                  onClick={() => setShowAccounts(true)}
                >
                  +
                </Button>
                Include Asset, Liability, and Equity accounts in Budget
              </p>
            </Col>
          </Row>
        ) : (
          <>
            <h5 className="text-secondary mb-5">Asset, Liability, and Equity Accounts</h5>

            {/* Asset Accounts */}
            <Row className="mb-3 fs-6">
              <Col md={2}><Form.Label>Asset Accounts</Form.Label></Col>
              <Col md={4}>
                {assetAccounts.length > 0 && (
                  <div className="bg-white p-3 d-flex flex-wrap gap-2">
                    {assetAccounts.map((account, index) => (
                      <span key={index} className="bg-light text-dark p-2 rounded">{account}</span>
                    ))}
                  </div>
                )}
                <Form.Control className="text-primary" type="button" value={assetAccounts.length > 0 ? "Add or Remove Account" : "Add Account"} onClick={() => handleOpenModal("Asset Accounts")} />
              </Col>
            </Row>


           

            {/* Liability Accounts */}
            <Row className="mb-3 fs-6">
              <Col md={2}><Form.Label>Liability Accounts</Form.Label></Col>
              <Col md={4}>
                {liabilityAccounts.length > 0 && (
                  <div className="bg-white p-3 d-flex flex-wrap gap-2">
                    {liabilityAccounts.map((account, index) => (
                      <span key={index} className="bg-light text-dark p-2 rounded">{account}</span>
                    ))}
                  </div>
                )}
                <Form.Control className="text-primary" type="button" value={liabilityAccounts.length > 0 ? "Add or Remove Account" : "Add Account"} onClick={() => handleOpenModal("Liability Accounts")} />
              </Col>
            </Row>

            {/* Equity Accounts */}
            <Row className="mb-3 fs-6">
              <Col md={2}><Form.Label>Equity Accounts</Form.Label></Col>
              <Col md={4}>
                {equityAccounts.length > 0 && (
                  <div className="bg-white p-3 d-flex flex-wrap gap-2">
                    {equityAccounts.map((account, index) => (
                      <span key={index} className="bg-light text-dark p-2 rounded">{account}</span>
                    ))}
                  </div>
                )}
                <Form.Control className="text-primary" type="button" value={equityAccounts.length > 0 ? "Add or Remove Account" : "Add Account"} onClick={() => handleOpenModal("Equity Accounts")} />
              </Col>
            </Row>
          </>
        )}

        {/* Submit Button */}
        <Row className="mt-5 mb-5 ">
          <Col md={{ span: 4, offset: 2 }}>
          <Button type="submit" className="btn btn-primary me-3">
            Create Budget
          </Button>
          <Button variant="secondary" className="me-3" onClick={() => navigate("/dashboard/Budgets")}>
            Cancel
          </Button>
          
          </Col>
        </Row>
      </Form>

      {selectedModal === "Income Account" && <IncomeAccountModal show={showModal} handleClose={handleCloseModal} onUpdate={(accounts) => handleAccountsUpdate("Income Account", accounts)} />}
      {selectedModal === "Expense Account" && <ExpenseAccountModal show={showModal} handleClose={handleCloseModal} onUpdate={(accounts) => handleAccountsUpdate("Expense Account", accounts)} />}
      {selectedModal === "Asset Accounts" && <AssetAccountModal show={showModal} handleClose={handleCloseModal} onUpdate={(accounts) => handleAccountsUpdate("Asset Accounts", accounts)} />}
      {selectedModal === "Liability Accounts" && <LiabilityAccountModal show={showModal} handleClose={handleCloseModal} onUpdate={(accounts) => handleAccountsUpdate("Liability Accounts", accounts)} />}
      {selectedModal === "Equity Accounts" && <EquityAccountModal show={showModal} handleClose={handleCloseModal} onUpdate={(accounts) => handleAccountsUpdate("Equity Accounts", accounts)} />}
    </Container>
  );
}

export default NewBudget;

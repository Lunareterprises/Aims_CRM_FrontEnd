import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaPlus, FaMinus } from "react-icons/fa";

function IncomeAccountModal({ show, handleClose, modalTitle, onUpdate }) {

  const [showMainIncome, setShowMainIncome] = useState(true);
  const [showNestedIncome, setShowNestedIncome] = useState(true);
  const [localSelected, setLocalSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const incomeAccounts = [
    "Discount",
    "General Income",
    "Interest Income",
    "Late Fee Income",
    "Other Charges",
    "Sales",
    "Service Income",
    "Shipping Charge",
  ];
  


  // Toggle individual account selection
  const toggleAccountSelection = (account) => {
    setLocalSelected((prev) =>
      prev.includes(account) ? prev.filter((item) => item !== account) : [...prev, account]
    );
  };

  // Select / Unselect all accounts
  const toggleAll = () => {
    if (localSelected.length === incomeAccounts.length) {
      setLocalSelected([]); // Unselect all
    } else {
      setLocalSelected([...incomeAccounts]); // Select all
    }
  };

  // Filtered accounts based on search term
  const filteredAccounts = incomeAccounts.filter((account) =>
    account.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Income Accounts</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-5">
        {/* Search Field */}
        <Form.Control
          type="text"
          placeholder="Search Accounts..."
          className="mb-3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Main Income Toggle */}
        <div
          style={{ cursor: "pointer" }}
          className="d-flex align-items-center text-primary gap-2 mt-3 mb-2 fs-6"
          onClick={() => {
            setShowMainIncome(!showMainIncome);
            if (!showMainIncome) setShowNestedIncome(true); // Ensure nested opens when main is opened
          }}
        >
          {showMainIncome ? <FaMinus /> : <FaPlus />} Income
        </div>

        {/* Nested Sections (only visible when expanded) */}
        {showMainIncome && (
          <div className="ms-4">
            {/* Nested Income Toggle with Select/Unselect */}
            <div
              style={{ cursor: "pointer" }}
              className="d-flex justify-content-between align-items-center text-primary fs-6 mb-3"
            >
              <div
                className="d-flex align-items-center gap-2"
                onClick={() => setShowNestedIncome(!showNestedIncome)}
              >
                {showNestedIncome ? "-" : "+"} Income
              </div>

              {/* Select/Unselect All Button */}
              {showNestedIncome && (
                <div
                  style={{ cursor: "pointer" }}
                  className={`text-${localSelected.length === incomeAccounts.length ? "danger" : "primary"}`}
                  onClick={toggleAll}
                >
                  {localSelected.length === incomeAccounts.length ? "Unselect All" : "Select All"}
                </div>
              )}
            </div>

            {/* Income Checkboxes (only visible when nested income is expanded) */}
            {showNestedIncome && (
              <div className="ms-4">
                {/* List of Checkboxes */}
                <div className="mb-3">
                  {filteredAccounts.map((account) => (
                    <Form.Check
                      className="ms-4 mb-2"
                      key={account}
                      type="checkbox"
                      label={account}
                      checked={localSelected.includes(account)}
                      onChange={() => toggleAccountSelection(account)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Income (Only under main toggle, not nested) */}
            <div className="d-flex align-items-center text-primary gap-2 fs-6">
              - Other Income
            </div>
          </div>
        )}
        
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={() => onUpdate(localSelected)}>
          Update
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default IncomeAccountModal;

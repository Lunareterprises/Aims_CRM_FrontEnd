import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { FaPlus, FaMinus } from "react-icons/fa";

function IncomeAccountModal({ show, handleClose, modalTitle, onUpdate }) {
  const [showMainIncome, setShowMainIncome] = useState(true);
  const [showNestedIncome, setShowNestedIncome] = useState(true);
  const [localSelected, setLocalSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [incomeAccounts, setIncomeAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch income accounts from a JSON file
  useEffect(() => {
    const fetchIncomeAccounts = async () => {
      try {
        const response = await fetch("/data/incomeAccounts.json"); // Adjust path as needed
        if (!response.ok) {
          throw new Error("Failed to fetch income accounts");
        }
        const data = await response.json();
        setIncomeAccounts(data.accounts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeAccounts();
  }, []);

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
        <Modal.Title>{modalTitle || "Select Income Accounts"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-5">
        {/* Error Handling */}
        {error && <Alert variant="danger">{error}</Alert>}
        
        {/* Loading State */}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
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
                if (!showMainIncome) setShowNestedIncome(true);
              }}
            >
              {showMainIncome ? <FaMinus /> : <FaPlus />} Income
            </div>

            {/* Nested Sections */}
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
                  {showNestedIncome && incomeAccounts.length > 0 && (
                    <div
                      style={{ cursor: "pointer" }}
                      className={`text-${localSelected.length === incomeAccounts.length ? "danger" : "primary"}`}
                      onClick={toggleAll}
                    >
                      {localSelected.length === incomeAccounts.length ? "Unselect All" : "Select All"}
                    </div>
                  )}
                </div>

                {/* Income Checkboxes */}
                {showNestedIncome && (
                  <div className="ms-4">
                    {filteredAccounts.length > 0 ? (
                      filteredAccounts.map((account) => (
                        <Form.Check
                          className="ms-4 mb-2"
                          key={account}
                          type="checkbox"
                          label={account}
                          checked={localSelected.includes(account)}
                          onChange={() => toggleAccountSelection(account)}
                        />
                      ))
                    ) : (
                      <p className="text-muted">No matching accounts found.</p>
                    )}
                  </div>
                )}

                {/* Other Income */}
                <div className="d-flex align-items-center text-primary gap-2 fs-6">
                  - Other Income
                </div>
              </div>
            )}
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={() => onUpdate(localSelected)} disabled={loading}>
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

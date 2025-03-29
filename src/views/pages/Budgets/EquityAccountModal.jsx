import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function EquityAccountModal({ show, handleClose, onUpdate }) {
  const [localSelected, setLocalSelected] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const AssetsAccounts = [
    {
      "Equities": [
        "Capital Stock",
        "Current Year Earnings",
        "Distributions",
        "Dividends Paid",
        "Drawings",
        "Investments",
        "Opening Balance Offset",
        "Owner's Equity",
        "Retained Earnings"
      ]
    }
  ];

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleAccountSelection = (account) => {
    setLocalSelected((prev) =>
      prev.includes(account)
        ? prev.filter((item) => item !== account)
        : [...prev, account]
    );
  };

  const filterAccounts = (accounts) => {
    return accounts.filter((account) =>
      account.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSelectAll = (category, filteredAccounts) => {
    const allSelected = filteredAccounts.every((acc) => localSelected.includes(acc));
    if (allSelected) {
      // Unselect all
      setLocalSelected((prev) => prev.filter((acc) => !filteredAccounts.includes(acc)));
    } else {
      // Select all
      setLocalSelected((prev) => [...new Set([...prev, ...filteredAccounts])]);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Equity Account</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-5">
        {/* Search Bar */}
        <Form.Control
          type="text"
          placeholder="Search Accounts..."
          className="mb-3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Equity Accounts Section */}
        <div className="text-primary fs-5 mb-2">Equity Accounts</div>
        <div className="ms-3">
          {AssetsAccounts.map((categoryObj, index) => {
            const category = Object.keys(categoryObj)[0];
            const accounts = categoryObj[category];
            const filteredAccounts = filterAccounts(accounts);
            const allSelected = filteredAccounts.every((acc) => localSelected.includes(acc));
            const someSelected = filteredAccounts.some((acc) => localSelected.includes(acc));

            return (
              <div key={index}>
                {/* Category Title with Expand/Collapse */}
                <div
                  className="d-flex align-items-center text-primary gap-2 fs-6"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleCategory(category)}
                >
                  {expandedCategories[category] ? "-" : "+"} {category}
                </div>

                {/* Select/Unselect All Checkbox */}
                {expandedCategories[category] && (
                  <div className="ms-4 mt-2">
                    <Form.Check
                      className="mb-2"
                      type="checkbox"
                      label="Select All"
                      checked={allSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = someSelected && !allSelected;
                      }}
                      onChange={() => handleSelectAll(category, filteredAccounts)}
                    />
                  </div>
                )}

                {/* Show Accounts when expanded */}
                {expandedCategories[category] && (
                  <div className="ms-4 mt-2">
                    {filteredAccounts.map((account, idx) => (
                      <Form.Check
                        className="ms-3 mb-2"
                        key={idx}
                        type="checkbox"
                        label={account}
                        checked={localSelected.includes(account)}
                        onChange={() => toggleAccountSelection(account)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
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

export default EquityAccountModal;

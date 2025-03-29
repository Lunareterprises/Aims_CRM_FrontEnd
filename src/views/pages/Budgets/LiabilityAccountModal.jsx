import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function LiabilityAccountModal({ show, handleClose, onUpdate }) {
  const [localSelected, setLocalSelected] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const AssetsAccounts = [
    {
      "Liabilities": {
        "Current Liabilities": ["Accounts Payable ", "Employee Reimbursements", "GEETHA KUMARI ","Opening Balance Adjustments ", "Tax Payable","TDS Payable ","Unearned Revenue"],
        "Long Term Liabilities": ["Construction Loans", "Mortgages "],
        "Other Liabilities": []
      }
    },
    
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

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Liability Accounts</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-5">
        <Form.Control
          type="text"
          placeholder="Search Accounts..."
          className="mb-3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="text-primary fs-5 mb-2">Liability Accounts</div>
        <div className="ms-3">
          {AssetsAccounts.map((categoryObj, index) => {
            const category = Object.keys(categoryObj)[0];
            const accounts = categoryObj[category];

            return (
              <div key={index}>
                <div
                  className="d-flex align-items-center text-primary gap-2 fs-6"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleCategory(category)}
                >
                  {expandedCategories[category] ? "-" : "+"} {category}
                </div>

                {expandedCategories[category] && (
                  <div className="ms-4">
                    {typeof accounts === "object" && !Array.isArray(accounts)
                      ? Object.entries(accounts).map(([subCategory, subAccounts], subIndex) => (
                          <div key={`${index}-${subIndex}`} className="ms-3">
                            <div
                              className="text-secondary fs-6"
                              style={{ cursor: "pointer" }}
                              onClick={() => toggleCategory(subCategory)}
                            >
                              {expandedCategories[subCategory] ? "-" : "+"} {subCategory}
                            </div>

                            {expandedCategories[subCategory] && (
                              <div className="ms-4">
                                {filterAccounts(subAccounts).map((account, idx) => (
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
                        ))
                      : filterAccounts(accounts).map((account, idx) => (
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

export default LiabilityAccountModal;


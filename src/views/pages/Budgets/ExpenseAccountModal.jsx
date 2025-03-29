import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function ExpenseAccountModal({ show, handleClose, onUpdate }) {
  const [localSelected, setLocalSelected] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const expenseAccounts = [
    {
      "Cost Of Goods Sold": [
        "Cost of Goods Sold",
        "Job Costing",
        "Labor",
        "Materials",
        "Subcontractor",
        "Tea",
      ],
    },
    {
      "Expense": [
        { name: "Advertising and Marketing" },
        "Automobile Expense",
        "Bad Debt",
        "Bank Fees and Charges",
        "Consultant Expense",
        "Depreciation Expense",
        "IT and Internet Expenses",
        "Meals and Entertainment",
        "Office Supplies",
        "Rent Expense",
        "Salaries and Employee Wages",
        "Travel Expense",
      ],
    },
    {
      "Other Expense": ["Exchange Gain or Loss"],
    },
  ];

  // Toggle category visibility
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Toggle selection of individual accounts
  const toggleAccountSelection = (account) => {
    setLocalSelected((prev) =>
      prev.includes(account)
        ? prev.filter((item) => item !== account)
        : [...prev, account]
    );
  };

  // Select/Unselect all items in a category
  const toggleSelectAll = (category, accounts) => {
    const allSelected = accounts.every((account) => {
      const accountName = typeof account === "object" ? account.name : account;
      return localSelected.includes(accountName);
    });

    if (allSelected) {
      // Unselect all
      setLocalSelected((prev) =>
        prev.filter(
          (item) =>
            !accounts.some(
              (account) =>
                (typeof account === "object" ? account.name : account) === item
            )
        )
      );
    } else {
      // Select all
      setLocalSelected((prev) => [
        ...prev,
        ...accounts
          .map((account) =>
            typeof account === "object" ? account.name : account
          )
          .filter((account) => !prev.includes(account)), // Avoid duplicates
      ]);
    }
  };

  // Filter accounts based on search term
  const filterAccounts = (accounts) => {
    return accounts.filter((account) => {
      const accountName = typeof account === "object" ? account.name : account;
      return accountName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Expense Account</Modal.Title>
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

        {/* Expense Accounts Section */}
        <div className="text-primary fs-5 mb-2">Expense Accounts</div>
        <div className="ms-3">
          {expenseAccounts.map((categoryObj, index) => {
            const category = Object.keys(categoryObj)[0];
            const accounts = filterAccounts(categoryObj[category]);

            if (accounts.length === 0) return null;

            const allSelected = accounts.every((account) =>
              localSelected.includes(
                typeof account === "object" ? account.name : account
              )
            );

            return (
              <div key={index}>
                {/* Category Title with Select All / Unselect All */}
                <div
                  className="d-flex align-items-center text-primary gap-2 fs-6"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleCategory(category)}
                >
                  {expandedCategories[category] ? "-" : "+"} {category}
                </div>

                {/* Select/Unselect All Button */}
                {expandedCategories[category] && (
                  <div className="ms-4 mb-2">
                    <Form.Check
                      type="checkbox"
                      label={allSelected ? "Unselect All" : "Select All"}
                      checked={allSelected}
                      onChange={() => toggleSelectAll(category, accounts)}
                    />
                  </div>
                )}

                {/* Show Accounts only when expanded */}
                {expandedCategories[category] && (
                  <div className="ms-4">
                    {accounts.map((account, idx) => {
                      const accountName =
                        typeof account === "object" ? account.name : account;

                      return (
                        <Form.Check
                          className="ms-4 mb-2"
                          key={idx}
                          type="checkbox"
                          label={accountName}
                          checked={localSelected.includes(accountName)}
                          onChange={() => toggleAccountSelection(accountName)}
                        />
                      );
                    })}
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

export default ExpenseAccountModal;

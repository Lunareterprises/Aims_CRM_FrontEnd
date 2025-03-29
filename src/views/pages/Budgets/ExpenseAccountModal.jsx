import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";

function ExpenseAccountModal({ show, handleClose, onUpdate }) {
  const [expenseAccounts, setExpenseAccounts] = useState([]);
  const [localSelected, setLocalSelected] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch expense accounts from a JSON file
  useEffect(() => {
    const fetchExpenseAccounts = async () => {
      try {
        const response = await fetch("/data/expenseAccounts.json"); // Update with correct path
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setExpenseAccounts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseAccounts();
  }, []);

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
    const allSelected = accounts.every((account) =>
      localSelected.includes(typeof account === "object" ? account.name : account)
    );

    setLocalSelected((prev) =>
      allSelected
        ? prev.filter(
            (item) => !accounts.some((account) => (typeof account === "object" ? account.name : account) === item)
          )
        : [...prev, ...accounts.map((account) => (typeof account === "object" ? account.name : account))]
    );
  };

  // Filtered accounts using useMemo for optimization
  const filteredExpenseAccounts = useMemo(() => {
    if (!searchTerm) return expenseAccounts;
    return expenseAccounts
      .map((categoryObj) => {
        const category = Object.keys(categoryObj)[0];
        const accounts = categoryObj[category].filter((account) => {
          const accountName = typeof account === "object" ? account.name : account;
          return accountName.toLowerCase().includes(searchTerm.toLowerCase());
        });

        return accounts.length > 0 ? { [category]: accounts } : null;
      })
      .filter(Boolean);
  }, [searchTerm, expenseAccounts]);

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Expense Account</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-5">
        {/* Error Message */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Loading State */}
        {loading ? (
          <div className="text-center my-3">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
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
              {filteredExpenseAccounts.length > 0 ? (
                filteredExpenseAccounts.map((categoryObj, index) => {
                  const category = Object.keys(categoryObj)[0];
                  const accounts = categoryObj[category];

                  const allSelected = accounts.every((account) =>
                    localSelected.includes(typeof account === "object" ? account.name : account)
                  );

                  return (
                    <div key={index}>
                      {/* Category Title */}
                      <div
                        className="d-flex align-items-center text-primary gap-2 fs-6"
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleCategory(category)}
                      >
                        {expandedCategories[category] ? "-" : "+"} {category}
                      </div>

                      {/* Select/Unselect All */}
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

                      {/* Account List */}
                      {expandedCategories[category] && (
                        <div className="ms-4">
                          {accounts.map((account, idx) => {
                            const accountName = typeof account === "object" ? account.name : account;
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
                })
              ) : (
                <p className="text-muted">No accounts found.</p>
              )}
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={() => onUpdate(localSelected)} disabled={loading || !!error}>
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

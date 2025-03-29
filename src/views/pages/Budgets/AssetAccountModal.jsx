import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";

function AssetAccountModal({ show, handleClose, onUpdate }) {
  const [assetsAccounts, setAssetsAccounts] = useState([]);
  const [localSelected, setLocalSelected] = useState(new Set());
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch asset accounts from a JSON file
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/assetsAccounts.json"); // Adjust the path
        if (!response.ok) throw new Error("Failed to fetch asset accounts");
        const data = await response.json();
        setAssetsAccounts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Toggle individual account selection
  const toggleAccountSelection = (account) => {
    setLocalSelected((prev) => {
      const newSelected = new Set(prev);
      newSelected.has(account) ? newSelected.delete(account) : newSelected.add(account);
      return newSelected;
    });
  };

  // Filter accounts based on search term
  const filterAccounts = (accounts) =>
    accounts.filter((account) => account.toLowerCase().includes(searchTerm.toLowerCase()));

  // Handle "Select All" and "Unselect All" for a group
  const handleSelectAll = (accounts) => {
    const filteredAccounts = filterAccounts(accounts);
    const allSelected = filteredAccounts.every((acc) => localSelected.has(acc));

    setLocalSelected((prev) => {
      const newSelected = new Set(prev);
      if (allSelected) {
        filteredAccounts.forEach((acc) => newSelected.delete(acc)); // Unselect all
      } else {
        filteredAccounts.forEach((acc) => newSelected.add(acc)); // Select all
      }
      return newSelected;
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Asset Account</Modal.Title>
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

        {loading ? (
          <div className="text-center my-3">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <div>
            <div className="text-primary fs-5 mb-2">Asset Accounts</div>
            <div className="ms-3">
              {assetsAccounts.map((categoryObj, index) => {
                const category = Object.keys(categoryObj)[0];
                const accounts = categoryObj[category];
                const filteredAccounts = Array.isArray(accounts) ? filterAccounts(accounts) : [];

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

                    {expandedCategories[category] && (
                      <div className="ms-4">
                        {/* Select All Checkbox for Category */}
                        {filteredAccounts.length > 0 && (
                          <Form.Check
                            className="mb-2"
                            type="checkbox"
                            label="Select All"
                            checked={filteredAccounts.every((acc) => localSelected.has(acc))}
                            ref={(input) => {
                              if (input)
                                input.indeterminate =
                                  filteredAccounts.some((acc) => localSelected.has(acc)) &&
                                  !filteredAccounts.every((acc) => localSelected.has(acc));
                            }}
                            onChange={() => handleSelectAll(accounts)}
                          />
                        )}

                        {/* Handle Nested Subcategories */}
                        {typeof accounts === "object" && !Array.isArray(accounts)
                          ? Object.entries(accounts).map(([subCategory, subAccounts], subIndex) => {
                              const filteredSubAccounts = filterAccounts(subAccounts);
                              return (
                                <div key={`${index}-${subIndex}`} className="ms-3">
                                  {/* Subcategory Title with Expand/Collapse */}
                                  <div
                                    className="text-secondary fs-6"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => toggleCategory(subCategory)}
                                  >
                                    {expandedCategories[subCategory] ? "-" : "+"} {subCategory}
                                  </div>

                                  {expandedCategories[subCategory] && (
                                    <div className="ms-4">
                                      {/* Select All Checkbox for Subcategory */}
                                      {filteredSubAccounts.length > 0 && (
                                        <Form.Check
                                          className="mb-2"
                                          type="checkbox"
                                          label="Select All"
                                          checked={filteredSubAccounts.every((acc) => localSelected.has(acc))}
                                          ref={(input) => {
                                            if (input)
                                              input.indeterminate =
                                                filteredSubAccounts.some((acc) => localSelected.has(acc)) &&
                                                !filteredSubAccounts.every((acc) => localSelected.has(acc));
                                          }}
                                          onChange={() => handleSelectAll(subAccounts)}
                                        />
                                      )}

                                      {/* List Accounts */}
                                      {filteredSubAccounts.map((account, idx) => (
                                        <Form.Check
                                          className="ms-3 mb-2"
                                          key={idx}
                                          type="checkbox"
                                          label={account}
                                          checked={localSelected.has(account)}
                                          onChange={() => toggleAccountSelection(account)}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          : filteredAccounts.map((account, idx) => (
                              <Form.Check
                                className="ms-3 mb-2"
                                key={idx}
                                type="checkbox"
                                label={account}
                                checked={localSelected.has(account)}
                                onChange={() => toggleAccountSelection(account)}
                              />
                            ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => onUpdate(Array.from(localSelected))} disabled={loading || error}>
          Update
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AssetAccountModal;

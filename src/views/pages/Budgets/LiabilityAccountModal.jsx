import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";

function LiabilityAccountModal({ show, handleClose, onUpdate }) {
  const [liabilities, setLiabilities] = useState({});
  const [localSelected, setLocalSelected] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch liability accounts from JSON file
  useEffect(() => {
    const fetchLiabilities = async () => {
      try {
        const response = await fetch("/data/liabilities.json"); // Adjust path if necessary
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setLiabilities(data.Liabilities || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLiabilities();
  }, []);

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Toggle selection of an account
  const toggleAccountSelection = (account) => {
    setLocalSelected((prev) =>
      prev.includes(account)
        ? prev.filter((item) => item !== account)
        : [...prev, account]
    );
  };

  // Select or unselect all accounts within a category
  const handleSelectAll = (accounts, isSelected) => {
    setLocalSelected((prev) =>
      isSelected
        ? prev.filter((item) => !accounts.includes(item)) // Unselect all
        : [...new Set([...prev, ...accounts])] // Select all
    );
  };

  // Filter accounts based on search term
  const filterAccounts = (accounts) =>
    accounts?.filter((account) =>
      account.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

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

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          <div className="text-primary fs-5 mb-2">Liability Accounts</div>
        )}

        <div className="ms-3">
          {!loading &&
            !error &&
            Object.entries(liabilities).map(([category, subCategories], index) => {
              const allMainAccounts = typeof subCategories === "object" && !Array.isArray(subCategories)
                ? Object.values(subCategories).flat()
                : subCategories;
              const filteredMainAccounts = filterAccounts(allMainAccounts);
              const allSelected = filteredMainAccounts.every((acc) => localSelected.includes(acc));
              const someSelected = filteredMainAccounts.some((acc) => localSelected.includes(acc));

              return (
                <div key={index}>
                  {/* Main Category Toggle */}
                  <div
                    className="d-flex align-items-center text-primary gap-2 fs-6"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleCategory(category)}
                  >
                    {expandedCategories[category] ? "−" : "+"} {category}
                  </div>

                  {/* Select/Unselect All Checkbox for Main Category */}
                  {expandedCategories[category] && filteredMainAccounts.length > 0 && (
                    <div className="ms-4 mt-2">
                      <Form.Check
                        className="mb-2"
                        type="checkbox"
                        label="Select All"
                        checked={allSelected}
                        ref={(input) => {
                          if (input) input.indeterminate = someSelected && !allSelected;
                        }}
                        onChange={() => handleSelectAll(filteredMainAccounts, allSelected)}
                      />
                    </div>
                  )}

                  {/* Subcategories or direct accounts */}
                  {expandedCategories[category] && (
                    <div className="ms-4">
                      {typeof subCategories === "object" && !Array.isArray(subCategories)
                        ? Object.entries(subCategories).map(([subCategory, accounts], subIndex) => {
                            const filteredAccounts = filterAccounts(accounts);
                            const allSubSelected = filteredAccounts.every((acc) => localSelected.includes(acc));
                            const someSubSelected = filteredAccounts.some((acc) => localSelected.includes(acc));

                            return (
                              <div key={subIndex} className="ms-3">
                                {/* Subcategory Toggle */}
                                <div
                                  className="text-secondary fs-6"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => toggleCategory(subCategory)}
                                >
                                  {expandedCategories[subCategory] ? "−" : "+"} {subCategory}
                                </div>

                                {/* Select/Unselect All Checkbox for Subcategory */}
                                {expandedCategories[subCategory] && filteredAccounts.length > 0 && (
                                  <div className="ms-4 mt-2">
                                    <Form.Check
                                      className="mb-2"
                                      type="checkbox"
                                      label="Select All"
                                      checked={allSubSelected}
                                      ref={(input) => {
                                        if (input) input.indeterminate = someSubSelected && !allSubSelected;
                                      }}
                                      onChange={() => handleSelectAll(filteredAccounts, allSubSelected)}
                                    />
                                  </div>
                                )}

                                {/* Accounts under Subcategory */}
                                {expandedCategories[subCategory] && (
                                  <div className="ms-4">
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
                          })
                        : filteredMainAccounts.map((account, idx) => (
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

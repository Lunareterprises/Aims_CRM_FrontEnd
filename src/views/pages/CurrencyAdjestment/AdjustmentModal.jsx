import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const CURRENCY_LIST = [
  { code: "AED", name: "United Arab Emirates Dirham" },
  { code: "USD", name: "United States Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "INR", name: "Indian Rupee" },
  { code: "GBP", name: "British Pound" },
];

const AdjustmentModal = ({ show, handleClose }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("AED");
  const [exchangeRate, setExchangeRate] = useState(23.326335);
  const [adjustmentDate, setAdjustmentDate] = useState("2025-03-26");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    fetchExchangeRate(selectedCurrency);
  }, [selectedCurrency]);

  // Fetch Exchange Rate
  const fetchExchangeRate = async (currency) => {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
      const data = await response.json();
      setExchangeRate(data.rates.INR);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      setError("Failed to fetch exchange rate. Please try again.");
    }
  };

  // Handle Save Changes
  const handleSave = async () => {
    // Validation
    if (!notes.trim()) {
      setError("Notes field cannot be left empty.");
      return;
    }

    setError(""); // Clear previous errors
    setBackendError(""); // Clear backend error

    const formData = {
      currency: selectedCurrency,
      adjustmentDate,
      exchangeRate,
      notes,
    };

    try {
      const response = await fetch("https://your-backend-api.com/save-adjustment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json(); // Parse JSON response

      if (!response.ok) {
        throw new Error(result.message || "Failed to save data.");
      }

      alert("Data saved successfully!");
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
      setBackendError(error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Base Currency Adjustment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {backendError && <Alert variant="danger">{backendError}</Alert>}

        <Form>
          {/* Currency Selection */}
          <Form.Group className="mb-3">
            <Form.Label>Currency</Form.Label>
            <Form.Select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
              {CURRENCY_LIST.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.code})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Date of Adjustment */}
          <Form.Group className="mb-3">
            <Form.Label>Date of Adjustment</Form.Label>
            <Form.Control type="date" value={adjustmentDate} onChange={(e) => setAdjustmentDate(e.target.value)} />
          </Form.Group>

          {/* Exchange Rate */}
          <Form.Group className="mb-3">
            <Form.Label>Exchange Rate</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control type="text" value={`1 ${selectedCurrency}`} readOnly className="me-2" />
              <span>=</span>
              <Form.Control type="text" value={`${exchangeRate.toFixed(6)} INR`} readOnly className="mx-2" />
            </div>
          </Form.Group>

          {/* Notes */}
          <Form.Group className="mb-3">
            <Form.Label>Notes (Max. 500 characters)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              maxLength={500}
              placeholder="Enter your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdjustmentModal;

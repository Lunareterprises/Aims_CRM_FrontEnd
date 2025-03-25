import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button, Table, Dropdown } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";

function AddNewManualJournals() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [accounts, setAccounts] = useState([]);
  const [contacts, setContacts] = useState({});
  const [rows, setRows] = useState([
    { id: 1, account: "", description: "", contact: "", debits: "", credits: "", showOptions: false }
  ]);
  const [isRecurring, setIsRecurring] = useState(false);

  // Fetch Accounts from API
  useEffect(() => {
    axios.get("/api/accounts")
      .then((response) => {
        console.log("API Response:", response);
        if (Array.isArray(response.data)) {
          setAccounts(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setAccounts([]); // Set empty array to prevent mapping error
        }
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error);
        setAccounts([]); // Ensure accounts is always an array
      });
  }, []);
  
  // Fetch Contacts based on selected account
  const handleAccountChange = (index, accountId) => {
    axios.get(`/api/contacts?accountId=${accountId}`).then((response) => {
      setContacts((prev) => ({ ...prev, [accountId]: response.data }));
    }).catch((error) => console.error("Error fetching contacts:", error));

    const updatedRows = [...rows];
    updatedRows[index].account = accountId;
    updatedRows[index].contact = ""; // Reset contact when account changes
    setRows(updatedRows);
  };

  // Handle row updates
  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  // Toggle additional options dropdown
  const toggleOptions = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].showOptions = !updatedRows[index].showOptions;
    setRows(updatedRows);
  };

  // Add new row
  const addRow = () => {
    setRows([...rows, { id: rows.length + 1, account: "", description: "", contact: "", debits: "", credits: "", showOptions: false }]);
  };

  // Remove a row
  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = (data) => {
    console.log("Form Data:", data, "Table Rows:", rows);
  };
console.log("accounts :==========>> ",accounts)
  return (
    <Container>
      <h3 className="my-4">Add New Manual Journal</h3>
      <Form onSubmit={handleSubmit(onSubmit)}>
        
        {/* Date & Journal# */}
        <Row className="mb-3">
          <Col md={2}><Form.Label className="fw-medium text-danger">Date*</Form.Label></Col>
          <Col md={4}>
            <Form.Control type="date" {...register("date", { required: true })} />
            {errors.date && <small className="text-danger">Date is required</small>}
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={2}><Form.Label className="fw-medium text-danger">Journal#*</Form.Label></Col>
          <Col md={4}>
            <Form.Control type="number" {...register("journalNumber", { required: true })} />
            {errors.journalNumber && <small className="text-danger">Journal# is required</small>}
          </Col>
        </Row>

        {/* Journal Table */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Account</th>
              <th>Description</th>
              <th>Contact</th>
              <th>Debits</th>
              <th>Credits</th>
              <th>Options</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                {/* Account Dropdown */}
                <td>
                <Form.Select
                    value={row.account}
                    onChange={(e) => handleAccountChange(index, e.target.value)}
                    >
                    <option value="">Select Account</option>
                    {Array.isArray(accounts) && accounts.length > 0 ? (
                        accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.name}
                        </option>
                        ))
                    ) : (
                        <option disabled>No Accounts Available</option>
                    )}
                </Form.Select>

                </td>

                {/* Description */}
                <td>
                  <Form.Control
                    type="text"
                    value={row.description}
                    onChange={(e) => handleInputChange(index, "description", e.target.value)}
                  />
                </td>

                {/* Contact Dropdown (Enabled based on Account) */}
                <td>
                  <Form.Select
                    disabled={!row.account}
                    value={row.contact}
                    onChange={(e) => handleInputChange(index, "contact", e.target.value)}
                  >
                    <option value="">Select Contact</option>
                    {(contacts[row.account] || []).map((contact) => (
                      <option key={contact.id} value={contact.id}>{contact.name}</option>
                    ))}
                  </Form.Select>
                </td>

                {/* Debits & Credits */}
                <td>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={row.debits}
                    onChange={(e) => handleInputChange(index, "debits", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={row.credits}
                    onChange={(e) => handleInputChange(index, "credits", e.target.value)}
                  />
                </td>

                {/* Three Dots Menu */}
                <td>
                  <Button variant="light" onClick={() => toggleOptions(index)}>⋮</Button>
                  {row.showOptions && (
                    <Dropdown.Menu show>
                      <Dropdown.Item>Option 1</Dropdown.Item>
                      <Dropdown.Item>Option 2</Dropdown.Item>
                    </Dropdown.Menu>
                  )}
                </td>

                {/* Remove Row */}
                <td>
                  {rows.length > 1 && (
                    <Button variant="danger" onClick={() => removeRow(index)}>X</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Add Row Button */}
        <Button variant="success" className="mb-3" onClick={addRow}>+ Add Row</Button>

        {/* File Attachments */}
        {!isRecurring && (
          <Row className="mb-3">
            <Col md={3}><Form.Label>Attachments</Form.Label></Col>
            <Col md={9}>
              <Form.Control type="file" multiple {...register("attachments")} />
              <small className="text-muted">Max 5 files, 10MB each</small>
            </Col>
          </Row>
        )}

        {/* Submit Buttons */}
        <Row>
          <Col>
            {!isRecurring ? (
              <>
                <Button type="submit" variant="primary">Save & Publish</Button>{" "}
                <Button variant="secondary">Save as Draft</Button>{" "}
                <Button variant="danger">Cancel</Button>
              </>
            ) : (
              <>
                <Button type="submit" variant="primary">Save</Button>{" "}
                <Button variant="danger">Cancel</Button>
              </>
            )}
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default AddNewManualJournals;

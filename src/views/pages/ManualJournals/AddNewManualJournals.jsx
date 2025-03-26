import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button, Table, Dropdown } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./ManualJournalCSS.css"
import { useNavigate, useLocation } from "react-router-dom";

function AddNewManualJournals() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const isEditing = state?.isEditing || false;
  const journalData = state?.journalData || null;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();
  const [totals, setTotals] = useState({ subtotalDebit: 0, subtotalCredit: 0, totalDebit: 0, totalCredit: 0, difference: 0 });

  const [accounts, setAccounts] = useState([]);
  const [contacts, setContacts] = useState({});
  const [rows, setRows] = useState([
    { id: 1, account: "", description: "", contact: "", debits: "", credits: "", showOptions: false }
  ]);
  const [isRecurring, setIsRecurring] = useState(false);


  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const calculateTotals = () => {
    let subtotalDebit = 0, subtotalCredit = 0;
  
    rows.forEach(row => {
      subtotalDebit += parseFloat(row.debits) || 0;
      subtotalCredit += parseFloat(row.credits) || 0;
    });
  
    setTotals({
      subtotalDebit,
      subtotalCredit,
      totalDebit: subtotalDebit,
      totalCredit: subtotalCredit,
      difference: Math.abs(subtotalDebit - subtotalCredit)
    });
  };

  
  const handleInputChange = (index, field, value) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index][field] = value;
      return updatedRows;
    });
  
    setTimeout(() => calculateTotals(), 0); // Ensure it updates after state change
  };
  

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    // Merge previous files with new ones, ensuring max 5
    const newFiles = [...files, ...selectedFiles].slice(0, 5);

    if (newFiles.length > 5) {
      setError("You can only upload a maximum of 5 files.");
      return;
    }

    setError(""); // Clear previous errors
    setFiles(newFiles);
  };


  

  // Fetch Accounts from API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("/api/accounts");
        console.log("API Response:", response);
        
        if (Array.isArray(response.data)) {
          setAccounts(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setAccounts([]); // Prevent mapping error
        }
      } catch (error) {
        console.error("Error fetching accounts:", error.message || error);
        setAccounts([]); // Ensure accounts is always an array
      }
    };

    fetchAccounts();
  }, []);

  // Fetch Contacts based on selected account
  const handleAccountChange = async (index, accountId) => {
    try {
      const response = await axios.get(`/api/contacts?accountId=${accountId}`);
      setContacts((prev) => ({ ...prev, [accountId]: response.data }));
    } catch (error) {
      console.error("Error fetching contacts:", error.message || error);
    }

    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index].account = accountId;
      updatedRows[index].contact = ""; // Reset contact when account changes
      return updatedRows;
    });
  };

 

  // Toggle additional options dropdown
  const toggleOptions = (index) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index].showOptions = !updatedRows[index].showOptions;
      return updatedRows;
    });
  };

  // Add new row
  const addRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      { id: prevRows.length + 1, account: "", description: "", contact: "", debits: "", credits: "", showOptions: false }
    ]);
  };

  // Remove a row
  const removeRow = (index) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (isEditing && journalData) {
      // Prefill the form with journalData
      Object.keys(journalData).forEach((key) => {
        setValue(key, journalData[key]);
      });
      setIsRecurring(journalData.isRecurring || false);
      setRows(journalData.rows || []);
    }
  }, [isEditing, journalData, setValue]);

  const onSubmit = (data) => {
    console.log("Form Data:", data, "Table Rows:", rows);
  };


  return (
        <Container>
          <h3 className="my-4">
        {isEditing ? "Edit Journal" : isRecurring ? "New Recurring Journal" : "New Journal"}
      </h3>
          <Form onSubmit={handleSubmit(onSubmit)} >

                  {/* Date & Journal# */}
                  {!isRecurring ? (
            <>
              {/* Regular Date & Journal# Fields */}
              <Row className="mb-3 fs-7">
                <Col md={2}><Form.Label className='text-danger fw-medium'>Date*</Form.Label></Col>
                <Col md={4}>
                  <Form.Control type="date" {...register('date', { required: true })} />
                  {errors.date && <small className="text-danger">Date is required</small>}
                </Col>
              </Row>
              <Row className="mb-3 fs-6">
                <Col md={2}><Form.Label className='text-danger fw-medium'>Journal#*</Form.Label></Col>
                <Col md={4}>
                  <Form.Control type="number" {...register('journalNumber', { required: true })} />
                  {errors.journalNumber && <small className="text-danger">Journal# is required</small>}
                </Col>
              </Row>
            </>
          ) : (
            <>
              {/* Recurring Fields */}
              <Row className="mb-3 fs-6">
                <Col md={2}><Form.Label className='text-danger fw-medium'>Profile Name*</Form.Label></Col>
                <Col md={4}><Form.Control type="text" {...register('profileName', { required: true })} />
                {errors.profileName && <small className="text-danger">Profile Name is required</small>}
                </Col>
              </Row>

              <Row className="mb-3 fs-6">
                <Col md={2}>
                  <Form.Label className='text-danger fw-medium'>Repeat Every*</Form.Label>
                </Col>
                <Col md={4}>
                  <Form.Select {...register('repeatEvery', { required: true })}>
                    <option value="">Select an option</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </Form.Select>
                  {errors.repeatEvery && <small className="text-danger">Select Any</small>}
                </Col>
                <Col md={4}>
                  <Form.Control type="text" {...register('repeatEveryText')} /> 
                </Col>
              </Row>


              <Row className="mb-3 fs-6 align-items-center ">
                <Col md={2}><Form.Label>Starts On</Form.Label></Col>
                <Col md={3}><Form.Control type="date" {...register('startDate')} /></Col>

                <Col md={1}><Form.Label>Ends On</Form.Label></Col>
                <Col md={3}><Form.Control type="date" {...register('endDate')} /></Col>

                <Col md={2} className="d-flex align-items-center gap-3">
                  <Form.Check type="checkbox" {...register('neverExpires')} />
                  <Form.Label className="mt-2">Never Expires</Form.Label>
                </Col>
            </Row>
            <hr />

            </>
          )}


        {/* Reference# & Notes */}
        <Row className="mb-3 fs-6">
          <Col md={2}><Form.Label >Reference#</Form.Label></Col>
          <Col md={4}>
            <Form.Control type="text" {...register('reference')} />
          </Col>
          </Row>
          <Row className="mb-3 fs-6">
          <Col md={2}><Form.Label >Notes*</Form.Label></Col>
          <Col md={4}>
            <Form.Control as="textarea" rows={3} maxLength={500} {...register('notes')} />
          </Col>
        </Row>

        {/* Journal Type & Currency */}
            {/* Journal Type (Checkboxes) */}
        <Row className="mb-3 fs-6">
            <Col md={2}><Form.Label >Journal Type</Form.Label></Col>
            <Col md={4}>
                <Form.Check 
                type="checkbox" 
                label="Cash Based Journal" 
                {...register('journalType.cash')} 
                />
                
                {errors.journalType && <small className="text-danger">Select at least one Journal Type</small>}
            </Col>
        </Row>

        <Row className="mb-3 fs-6">
            <Col md={2}>
                <Form.Label>Currency</Form.Label>
            </Col>
            <Col md={4}>
                <Form.Select {...register('currency', { required: true })}>
                {/* <option value="">Select Currency</option> */}
                <option value="INR">INR - Indian Rupee (₹)</option>
                <option value="USD">USD - US Dollar ($)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="GBP">GBP - British Pound (£)</option>
                <option value="AUD">AUD - Australian Dollar (A$)</option>
                <option value="CAD">CAD - Canadian Dollar (C$)</option>
                <option value="JPY">JPY - Japanese Yen (¥)</option>
                <option value="CNY">CNY - Chinese Yuan (¥)</option>
                <option value="SGD">SGD - Singapore Dollar (S$)</option>
                </Form.Select>
                {errors.currency && <small className="text-danger">Currency is required</small>}
            </Col>
        </Row>


        {/* Journal Table */}
        <div className="table-responsive">
          <Table striped bordered hover className="text-nowrap">
            <thead>
              <tr>
                <th style={{ minWidth: "150px" }}>Account</th>
                <th style={{ minWidth: "200px" }}>Description</th>
                <th style={{ minWidth: "150px" }}>Contact</th>
                <th style={{ minWidth: "120px" }}>Debits</th>
                <th style={{ minWidth: "120px" }}>Credits</th>
                <th style={{ minWidth: "50px" }}>Options</th>
                <th style={{ minWidth: "50px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className="align-middle">
                  {/* Account Dropdown */}
                  <td>
                    <Form.Select
                      className="p-2 fs-6"
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
                      className="p-2 fs-6"
                      type="text"
                      value={row.description}
                      onChange={(e) => handleInputChange(index, "description", e.target.value)}
                    />
                  </td>

                  {/* Contact Dropdown */}
                  <td>
                    <Form.Select
                      className="p-2 fs-6"
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
                      className="p-2 fs-6"
                      type="text"
                      step="0.01"
                      value={row.debits}
                      onChange={(e) => handleInputChange(index, "debits", e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      className="p-2 fs-6"
                      type="text"
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
                      <Button style={{ background: "transparent", border: "none", color: "red" }} onClick={() => removeRow(index)}>X</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

            
              <br />

              <Row >
                 {/* Add Row Button */}
                  <Col>
                  <Button md={3} className="mb-3 btn custom-btn " onClick={addRow}>+ Add New Row</Button>

                  </Col>
                  {/* Subtotal, Total, Difference */}
                  
               </Row>
            {/* Fixed Footer Row */}
            <tfoot className="custom-tfoot " >
              <tr>
                <td ></td>
                <td ></td>
                <td >Sub Total:</td>
                <td >₹{totals.subtotalDebit.toFixed(2)}</td>
                <td >₹{totals.subtotalCredit.toFixed(2)}</td> 
              </tr>
              <tr>
                <td ></td>
                <td ></td>
                <td className=' fs-5'>Total (₹):</td>
                <td className=' fs-5'>₹{totals.totalDebit.toFixed(2)}</td>
                <td className=' fs-5'> ₹{totals.totalCredit.toFixed(2)}</td>
                
              </tr>
              <tr>
                <td ></td>
                <td ></td>
                <td className='text-danger fw-medium'>Difference:</td>
                <td ></td>
                <td className='text-danger fw-medium'>₹{totals.difference.toFixed(2)}</td>
                
              </tr>
            </tfoot>
          </Table>
        </div>




               
        
                {/* File Attachments */}
                {!isRecurring && (
                  <Col className="mb-3">
                    <Col md={3}>
                      <Form.Label>Attachments</Form.Label>
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="file"
                        multiple
                        {...register("attachments")}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                      />
                      <small className="text-muted">Max 5 files, 10MB each</small>

                      {/* Error Message */}
                      {error && <div className="text-danger mt-2">{error}</div>}

                      {/* Display ALL Uploaded File Names */}
                      {files.length > 0 && (
                        <ul className="mt-2">
                          {files.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      )}
                    </Col>
                  </Col>
                )}


        
        
                {/* Submit Buttons */}
                <Row className="d-flex justify-content-end align-items-center sticky-footer">
                  <Col className="d-flex gap-2">
                    {!isRecurring ? (
                      <>
                        <Button type="submit" className="mt-3">{isEditing ? "Update Journal" : "Save & Publish"}</Button>

                        {/* <Button type="submit" className="btn-primary">Save & Publish</Button> */}
                        <Button type="submit"  className="btn-primary">Save as Draft</Button>
                        <Button className="cancel_custom_btn" onClick={() => navigate("/dashboard/ManualJournals")}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button type="submit" className="btn-primary" >Save</Button>
                        <Button className="cancel_custom_btn" onClick={() => navigate("/dashboard/ManualJournals")}>
                          Cancel
                        </Button>
                      </>
                    )}
                  </Col>

                  <Col xs="auto">
                    <Button
                      className="btn-primary"
                      onClick={() => setIsRecurring(!isRecurring)}
                    >
                      {isRecurring ? "Remove Recurring" : "Make Recurring"}
                    </Button>
                  </Col>
                </Row>


      </Form>
    </Container>
  );
}

export default AddNewManualJournals;

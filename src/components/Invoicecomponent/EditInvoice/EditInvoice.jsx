import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import axios from "axios";
import { Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaEdit } from "react-icons/fa";
import InvoiceItem from "../InvoiceItem";
import InvoiceModal from "../InvoiceModal";
import moment from "moment";

const paymentOptions = [
  { value: "advance", label: "💰 Advance" },
  { value: "pending", label: "⏳ Pending" },
  { value: "paid", label: "✅ Paid" },
  { value: "cancelled", label: "❌ Cancelled" }, // Additional option
];
const EditInvoice = () => {
  const Navi = useNavigate();

  const { id } = useParams();

  const [pdfUrl, setPdfUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState("$");
  const [invoiceNumber, setInvoiceNumber] = useState(1);

  const [terms, setTerms] = useState(null);
  const [salesPerson, setSalesPerson] = useState(null);

  const [billTo, setBillTo] = useState(null);
  const [billToEmail, setBillToEmail] = useState(null);
  const [billToAddress, setBillToAddress] = useState(null);
  const [billFrom, setBillFrom] = useState(null);
  const [billFromEmail, setBillFromEmail] = useState(null);
  const [billFromAddress, setBillFromAddress] = useState(null);
  const [notes, setNotes] = useState(
    "Thank you for doing business with us. Have a great day!"
  );
  const [documentType, setDocumentType] = useState();

  // New Quote Fields
  const [quoteProjectName, setQuoteProjectName] = useState(null);
  const [quoteDate, setQuoteDate] = useState(null);
  const [customerid, setcustomerid] = useState(null);
  const [quoteDescription, setQuoteDescription] = useState(null);
  const [termscont, setTermscont] = useState(null);

  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));
  const [dateOfIssue, setDateOfIssue] = useState(moment().format("YYYY-MM-DD"));

  const [subTotal, setSubTotal] = useState("0.00");
  const [taxRate, setTaxRate] = useState(null);
  const [taxAmount, setTaxAmount] = useState("0.00");
  const [discountRate, setDiscountRate] = useState(null);
  const [discountAmount, setDiscountAmount] = useState("0.00");
  const [adjustment, setAdjustment] = useState("0.00");
  const [total, setTotal] = useState("0.00");

  const [items, setItems] = useState([
    {
      id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
      name: null,
      description: null,
      price: "1.00",
      quantity: 1,
      discount: 0,
    },
  ]);

  // Function to Recalculate Totals
  // **Function to Recalculate Totals**
  const handleCalculateTotal = useCallback(() => {
    let newSubTotal = 0;
    let newTaxAmount = 0;
    let newDiscountAmount = 0;

    items.forEach((item) => {
      const itemPrice = parseFloat(item.price);
      const itemQuantity = parseInt(item.quantity);
      const itemDiscountRate = parseFloat(item.discount) || 0;

      // Apply discount per item
      const itemDiscountAmount =
        ((itemPrice * itemDiscountRate) / 100) * itemQuantity;
      const itemPriceAfterDiscount =
        itemPrice * itemQuantity - itemDiscountAmount;

      newSubTotal += itemPriceAfterDiscount;
      newDiscountAmount += itemDiscountAmount;
      newTaxAmount += itemPriceAfterDiscount * (taxRate / 100);
    });

    let newAdjustment = parseFloat(adjustment) || 0;
    let newTotal = (newSubTotal + newTaxAmount + newAdjustment).toFixed(2);

    setSubTotal(newSubTotal.toFixed(2));
    setTaxAmount(newTaxAmount.toFixed(2));
    setDiscountAmount(newDiscountAmount.toFixed(2));
    setTotal(newTotal);
  }, [items, taxRate, adjustment]);

  useEffect(() => {
    handleCalculateTotal();
  }, [handleCalculateTotal]);

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
    handleCalculateTotal();
  };

  const openModal = (event) => {
    event.preventDefault();
    handleCalculateTotal();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const [uploadedFiles, setUploadedFiles] = useState([]);

  // onDrop now accepts multiple files.
  const onDrop = useCallback((acceptedFiles) => {
    // Map acceptedFiles to an object that includes preview for images.
    const newFiles = acceptedFiles.map((file) => {
      // If file is an image, create a preview URL.
      let preview = "";
      if (file.type.startsWith("image/")) {
        preview = URL.createObjectURL(file);
      }
      return { file, preview };
    });

    // Update state with new files.
    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      // Also update the form value.
      // setValue(
      //   'files',
      //   updatedFiles.map((f) => f.file),
      // )
      return updatedFiles;
    });
  }, []);

  // Configure dropzone to accept images and PDFs.
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
      "application/pdf": [],
    },
    multiple: true,
    onDrop,
  });

  // Remove a file from the list.
  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      return updatedFiles;
    });
  };
  

  // Watch the form's file field (optional)
  // const files = watch('files')
  // -----------------------

  const [productsItem, setProductsItem] = useState([]); // Stores dropdown options
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [Customer, setCustomer] = useState(null);

  const user_id = sessionStorage.getItem("user_id");
  const token = sessionStorage.getItem("token");
  // Fetch customer list
  const fetchProducts = async () => {
    try {
      const response = await axios.post(
        "https://lunarsenterprises.com:5016/crm/list/customers",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        }
      );

      if (response.data.result === true) {
        const mappedProducts = response.data.list.map((customer) => ({
          value: customer.cu_id, // Store ID
          label:
            `${customer.cu_salutation} ${customer.cu_first_name} ${customer.cu_last_name}`.trim(),
        }));
        setProductsItem(mappedProducts);
        console.log(productsItem, "fdfdfdfe");
      } else {
        console.error(response.data.message);
        setProductsItem([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const [viewcustom, setviewcustom] = useState([]); // Stores dropdown options

  const fetchProductsview = async (cust_id) => {
    try {
      const response = await axios.post(
        "https://lunarsenterprises.com:5016/crm/list/customers",
        { cust_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        }
      );

      if (response.data.result === true) {
        const customerData = response.data.list[0];

        // Extracting address details
        const billingAddress = `${customerData.cu_b_addr_attention}, ${customerData.cu_b_addr_address}, ${customerData.cu_b_addr_city}, ${customerData.cu_b_addr_state}, ${customerData.cu_b_addr_pincode}, ${customerData.cu_b_addr_country}`;

        const shippingAddress = `${customerData.cu_s_addr_attention}, ${customerData.cu_s_addr_address}, ${customerData.cu_s_addr_city}, ${customerData.cu_s_addr_state}, ${customerData.cu_s_addr_pincode}, ${customerData.cu_s_addr_country}`;

        console.log("Billing Address:", billingAddress);
        console.log("Shipping Address:", shippingAddress);

        // Setting the state for view
        setviewcustom([customerData]);
      } else {
        console.error(response.data.message);
        setviewcustom([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const [selectedStatus, setSelectedStatus] = useState(paymentOptions[0]); // Default is "Advance"

  const handleStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption); // Update State
    console.log("Selected Payment Status:", selectedOption.value);
  };

  useEffect(() => {
    fetchProducts();
    fetchProductsview();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("invoice_id", id);
    formData.append("type", documentType);
    formData.append("invoiceDate", currentDate);
    formData.append("terms", terms);
    formData.append("salesPerson", salesPerson);
    formData.append("projectName", quoteProjectName);

    formData.append("subject", quoteDescription);
    formData.append("status", selectedStatus.value);

    formData.append("termsAndCondition", termscont);

    formData.append("customer_id", customerid);

    formData.append("dueDate", dateOfIssue);
    formData.append("invoiceNumber", invoiceNumber);
    formData.append("shippingCharge", 999);
    formData.append("taxType", "TDC");

    formData.append("subTotal", subTotal);
    formData.append("taxRate", taxAmount);
    formData.append("discountAmount", discountAmount);
    formData.append("adjustments", adjustment);
    formData.append("total", total);
    formData.append("notes", notes);

    const formattedItems = items.map((item) => ({
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      rate: parseFloat(item.price), // Rate is the price per item
      discount: parseFloat(item.discount) || 0,
      amount:
        parseFloat(item.price) * parseInt(item.quantity) -
        parseFloat(item.discount), // Calculate amount dynamically
    }));

    formData.append("items", JSON.stringify(formattedItems));

    uploadedFiles.forEach((fileObj, index) => {
      formData.append(`file`, fileObj.file);
    });
    console.log(uploadedFiles, "uploadedFilesuploadedFiles");
    setLoader(true);
    try {
      const response = await axios.put(
        "https://lunarsenterprises.com:5016/crm/invoice/edit",
        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        }
      );
      if (response.data.result && response.data.path) {
        console.log("Success:", response.data);
        alert("Invoice submitted successfully!");
        setPdfUrl(response.data.path); // Store PDF URL in state
        setShowModal(true); // Show modal
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      alert("Submission failed!");
    } finally {
      setLoader(false);
    }
  };

  const handleCustomerChange = async (selectedOption) => {
    const selectedCustomerId = selectedOption.value;
    if (selectedCustomerId === "add_new") {
      Navi("/dashboard/Customer/AddCustomers");
    } else {
      setSelectedCustomer(selectedCustomerId);
      await fetchProductsview(selectedCustomerId);
    }
  };

  const handleAddNewCustomer = () => {
    // You can open a modal or navigate to an Add Customer page
  };
  const handleEditCustomer = (cu_id) => {
    Navi(`/dashboard/Customer/customerview/${cu_id}`);
    // You can open a modal or navigate to an Add Customer page
  };

  const customOptions = [
    ...productsItem,
    { value: "add_new", label: "➕ Add New Customer" }, // Custom add option
  ];

  //------Single--invoice view-------
  useEffect(() => {
    Singleviewdata();
  }, []);
  const [singleview, setSingleview] = useState([]); // Stores dropdown options

  const Singleviewdata = async () => {
    try {
      const data = {
        invoice_id: id,
      };

      const response = await axios.post(
        "https://lunarsenterprises.com:5016/crm/invoice/singleInvoice",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        }
      );

      if (response.data.result === true && response.data.data.length > 0) {
        const invoiceData = response.data.data[0]; // Correct path

        // Map API items into required format
        const formattedItems = invoiceData.items.map((item, index) => ({
          id: index.toString(), // Ensure unique ID
          name: item.name,
          quantity: Number(item.quantity), // Ensure numeric value
          price: Number(item.rate),
          discount: Number(item.discount),
          amount: Number(item.amount),
        }));

        setItems(formattedItems);
        console.log("Updated Items:", formattedItems);
        setSingleview([invoiceData]);

        setDocumentType(invoiceData.type);
        setCurrentDate(moment(invoiceData.invoiceDate).format("YYYY-MM-DD"));
        setDateOfIssue(moment(invoiceData.dueDate).format("YYYY-MM-DD"));
        setQuoteProjectName(invoiceData.projectName);
        setQuoteDescription(invoiceData.subject);
        setTerms(invoiceData.terms);
        setTermscont(invoiceData.termsAndCondition);

        setSalesPerson(invoiceData.salesPerson);
        fetchProductsview(invoiceData.customer_id);
        setCustomer(invoiceData.customer_name);

        setNotes(invoiceData.notes);
        setSubTotal(invoiceData.subTotal);
        setcustomerid(invoiceData.customer_id);
        setTotal(invoiceData.total);
        setTaxRate(invoiceData.taxRate);
        setDiscountAmount(invoiceData.discountAmount);
        setAdjustment(invoiceData.adjustments);
        setInvoiceNumber(invoiceData.id);

        const matchedStatus = paymentOptions.find(
          (option) => option.value === invoiceData.status
        );
        setSelectedStatus(matchedStatus || paymentOptions[0]); // Default to "Advance" if no match
        const existingFile = invoiceData.file
          ? {
              file: invoiceData.file, // Store file path
              preview: `https://lunarsenterprises.com:5016/${invoiceData.file}`, // Full image URL
            }
          : null;

        setUploadedFiles(existingFile ? [existingFile] : []); // Set existing file
      } else {
        console.error(response.data.message);
        setItems([]); // Clear items if no data
      }
    } catch (error) {
      console.error("Error fetching invoice data:", error);
    }
  };

  return (
    <>
      {/* <Form onSubmit={(e) => { e.preventDefault(); handleCalculateTotal(); setIsOpen(true); }}> */}
      <Form onSubmit={handleSubmit}>
        <h4> Invoice & Quotes</h4>
        <Row>
          <Col md={12} lg={12}>
            <Card className="p-4 p-xl-5 my-3 my-xl-4">
              <Form.Group className="mb-3">
                <Form.Check
                  inline
                  label="Invoice"
                  type="radio"
                  readOnly
                  name="documentType"
                  checked={documentType === "invoice"}
                  onChange={() => setDocumentType("invoice")}
                />
                <Form.Check
                  inline
                  label="Quote"
                  type="radio"
                  readOnly
                  name="documentType"
                  checked={documentType === "Quote"}
                  onChange={() => setDocumentType("Quote")}
                />
              </Form.Group>
              <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                <div className="d-flex flex-column">
                  <div className="d-flex flex-row align-items-center">
                    <span className="fw-bold d-block me-2">
                      Current&nbsp;Date:&nbsp;
                    </span>
                    <Form.Control
                      type="date"
                      name="currentDate"
                      readOnly
                      value={currentDate} // Bind to state
                      //   onChange={(e) => setDateOfIssue(e.target.value)} // Update state on change
                      style={{ maxWidth: "150px" }}
                      required
                    />
                  </div>
                  <div className="d-flex flex-row align-items-center mt-2">
                    <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                    <Form.Control
                      type="date"
                      name="dateOfIssue"
                      readOnly
                      value={dateOfIssue} // Bind to state
                      onChange={(e) => setDateOfIssue(e.target.value)} // Update state on change
                      style={{ maxWidth: "150px" }}
                      required
                    />
                  </div>
                </div>
              </div>
              <hr className="my-4" />

              {documentType === "Quote" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Quote Project Name:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter project name"
                      value={quoteProjectName}
                      onChange={handleChange(setQuoteProjectName)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="my-3">
                    <Form.Label className="fw-bold">Description:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Enter project description"
                      value={quoteDescription}
                      onChange={handleChange(setQuoteDescription)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="my-3">
                    <Form.Label className="fw-bold">Terms</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Payment Terms"
                      value={terms}
                      onChange={handleChange(setTerms)}
                      required
                    />
                  </Form.Group>

                  <hr className="my-4" />
                </>
              )}

              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Sale Person</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Sale Person Name"
                  value={salesPerson}
                  onChange={handleChange(setSalesPerson)}
                  required
                  readOnly
                />
              </Form.Group>
              {/* <div>
                <label className="fw-bold mb-3">Select Customer</label>
                <Select
                  options={customOptions}
                  onChange={handleCustomerChange}
                  placeholder="Choose a customer..."
                />
              </div> */}

              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Sale Person Name"
                  value={Customer}
                  required
                />
              </Form.Group>

              <div className="mt-3">
                <h5>Select Payment Status:</h5>
                <Select
                  options={paymentOptions}
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  isSearchable={false} // Disable search if not needed
                  className="payment-dropdown"
                />
              </div>
              <Row className="mb-5 mt-3">
                <Col>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Form.Label className="fw-bold">Bill Address:</Form.Label>

                    <FaEdit
                      style={{
                        marginLeft: "8px",
                        cursor: "pointer",
                        color: "blue",
                      }}
                      onClick={() => handleEditCustomer(viewcustom[0]?.cu_id)}
                    />
                  </div>

                  <Form.Control
                    as="textarea"
                    rows={6}
                    placeholder="Billing address"
                    value={`Attention: ${
                      viewcustom[0]?.cu_b_addr_attention || ""
                    }   
                    Address: ${viewcustom[0]?.cu_b_addr_address || ""} 
City: ${viewcustom[0]?.cu_b_addr_city || ""} 
State: ${viewcustom[0]?.cu_b_addr_state || ""} 
Pincode: ${viewcustom[0]?.cu_b_addr_pincode || ""} 
Phone: ${viewcustom[0]?.cu_b_addr_phone || ""}`}
                    readOnly
                    type="text"
                    name="billFromAddress"
                    className="my-2"
                    autoComplete="address"
                    style={{ whiteSpace: "pre-line", fontWeight: "bold" }} // Ensures line breaks are respected
                    required
                  />
                </Col>
                <Col>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Form.Label className="fw-bold">
                      Shipping Address:
                    </Form.Label>

                    <FaEdit
                      style={{
                        marginLeft: "8px",
                        cursor: "pointer",
                        color: "blue",
                      }}
                      onClick={() => handleEditCustomer(viewcustom[0]?.cu_id)}
                    />
                  </div>
                  <Form.Control
                    placeholder="Billing address"
                    value={`Attention: ${
                      viewcustom[0]?.cu_s_addr_attention || ""
                    }  
                      Address: ${viewcustom[0]?.cu_s_addr_address || ""} 
                    City: ${viewcustom[0]?.cu_s_addr_city || ""} 
                    State: ${viewcustom[0]?.cu_s_addr_state || ""} 
                    Pincode: ${viewcustom[0]?.cu_s_addr_pincode || ""} 
                    Phone: ${viewcustom[0]?.cu_s_addr_phone || ""}`}
                    readOnly
                    as="textarea"
                    rows={6}
                    name="billToAddress"
                    className="my-2"
                    autoComplete="address"
                    onChange={handleChange(setBillToAddress)}
                    required
                    style={{ whiteSpace: "pre-line", fontWeight: "bold" }} // Ensures line breaks are respected
                  />
                </Col>
              </Row>

              <h5 className="mb-4">Invoice Details</h5>

              {/* Invoice Items Table */}
              <InvoiceItem
                onItemizedItemEdit={(evt) => {
                  const { id, name, value } = evt.target;
                  setItems(
                    items.map((item) =>
                      item.id === id ? { ...item, [name]: value } : item
                    )
                  );
                }}
                onRowAdd={() => {
                  setItems([
                    ...items,
                    {
                      id: (
                        +new Date() + Math.floor(Math.random() * 999999)
                      ).toString(36),
                      name: null,
                      price: "1.00",
                      description: null,
                      quantity: 1,
                      discount: 0,
                    },
                  ]);
                }}
                onRowDel={(item) => {
                  setItems(items.filter((i) => i.id !== item.id));
                }}
                currency={currency}
                items={items}
              />

              {/* Summary Calculation */}
              <Row className="mt-4 justify-content-end">
                <Col lg={6}>
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">Subtotal:</span>
                    <span>
                      {currency}
                      {subTotal}
                    </span>
                  </div>

                  <Form.Group className="mb-3 mt-3">
                    <Form.Label className="fw-bold">Tax Rate (%):</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        value={taxRate}
                        onChange={handleChange(setTaxRate)}
                        placeholder="0.0"
                        min="0"
                        max="100"
                      />
                      <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3 mt-3">
                    <Form.Label className="fw-bold">Adjustment:</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        value={adjustment}
                        onChange={handleChange(setAdjustment)}
                        placeholder="0.00"
                      />
                    </InputGroup>
                  </Form.Group>
                  <div className="d-flex justify-content-between mt-2">
                    <span className="fw-bold">
                      Discount ({discountRate || 0}%):
                    </span>
                    <span>
                      {currency}
                      {discountAmount}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <span className="fw-bold">Tax ({taxRate || 0}%):</span>
                    <span>
                      {currency}
                      {taxAmount}
                    </span>
                  </div>

                  {/* Adjustment Input */}

                  <div className="d-flex justify-content-between mt-2">
                    <span className="fw-bold">Adjustment:</span>
                    <span>
                      {currency}
                      {adjustment}
                    </span>
                  </div>
                  <hr />
                  <div
                    className="d-flex justify-content-between"
                    style={{ fontSize: "1.125rem" }}
                  >
                    <span className="fw-bold">Total:</span>
                    <span className="fw-bold">
                      {currency}
                      {total}
                    </span>
                  </div>
                </Col>
              </Row>

              {/* Notes Section */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mt-3">
                    <Form.Label className="fw-bold">Notes:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={notes}
                      placeholder="Thank you for doing business with us."
                      onChange={handleChange(setNotes)}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mt-3">
                    <Form.Label className="fw-bold">
                      Terms & Conditions:
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={termscont}
                      placeholder="Enter the Terms & Conditions of your business 
                      to be displayed in your transaction"
                      onChange={handleChange(setTermscont)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Label className="mt-4">Add Documents</Form.Label>
              <Col md={6}>
                <div
                  {...getRootProps()}
                  style={{
                    border: "2px dashed #d1d5db",
                    borderRadius: "12px",
                    marginTop: "25px",
                    height: "300px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6b7280",
                    cursor: "pointer",
                    transition: "border 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.border = "2px dashed #3b82f6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.border = "2px dashed #d1d5db")
                  }
                >
                  <div className=" imagescroll">
                    <input {...getInputProps()} />
                    {/* Hidden input to register the field */}
                    {/* <input type="hidden" {...register('files')} /> */}
                    {uploadedFiles.length > 0 ? (
                      <>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            justifyContent: "center",
                          }}
                        >
                          {uploadedFiles?.map((fileObj, index) => (
                            <div
                              key={index}
                              style={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "5px",
                                textAlign: "center",
                              }}
                            >
                              {fileObj.preview ? (
                                <img
                                  src={fileObj.preview}
                                  alt={`Uploaded ${index}`}
                                  style={{
                                    width: "150px",
                                    height: "150px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "#f0f0f0",
                                    borderRadius: "8px",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "150px",
                                    height: "150px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "#f0f0f0",
                                    borderRadius: "8px",
                                  }}
                                >
                                  <p>PDF File</p>
                                </div>
                              )}
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(index);
                                }}
                                style={{ marginTop: "5px" }}
                              >
                                Delete
                              </Button>
                            </div>
                          ))}
                        </div>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#3b82f6",
                            marginTop: "10px",
                            textAlign: "center",
                          }}
                        >
                          Click to Add
                        </p>
                      </>
                    ) : (
                      <>
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/1829/1829586.png"
                          alt="Upload"
                          style={{
                            width: "150px",
                            height: "150px",
                            opacity: "0.7",
                            marginBottom: "10px",
                          }}
                        />
                        <p style={{ fontSize: "14px", marginBottom: "4px" }}>
                          Drag files here or
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#3b82f6",
                          }}
                        >
                          Browse files
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {uploadedFiles?.length === 0 && (
                  <div
                    style={{
                      color: "red",
                      marginTop: "8px",
                      fontSize: "14px",
                    }}
                  >
                    ⚠ Please add an image or PDF before submitting!
                  </div>
                )}
              </Col>
              <Form.Group className="mb-3 mt-3">
                <Form.Label className="fw-bold">Currency:</Form.Label>
                <Form.Select
                  className="btn btn-light my-1"
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="$">AED (United Emirates Arab)</option>
                  <option value="₹">INR (Indian Rupee)</option>
                  <option value="£">GBP (British Pound Sterling)</option>
                  <option value="¥">JPY (Japanese Yen)</option>
                </Form.Select>
              </Form.Group>
            </Card>

            <div className="text-center mb-5 ">
              <Button
                disabled={loader}
                variant="success"
                type="submit"
                className="w-100 mt-3"
              >
                {loader ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Creating Invoice ...
                  </>
                ) : (
                  " Creating Invoice"
                )}
              </Button>
            </div>
          </Col>
          {/* 
          <Col md={4} lg={3}>
         
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Currency:</Form.Label>
              <Form.Select
                className="btn btn-light my-1"
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="$">USD (United States Dollar)</option>
                <option value="₹">INR (Indian Rupee)</option>
                <option value="£">GBP (British Pound Sterling)</option>
                <option value="¥">JPY (Japanese Yen)</option>
              </Form.Select>
            </Form.Group>

           

            <Button variant="primary" type="submit" className="w-100 mt-2">
              Review Invoice
            </Button>
          </Col> */}
        </Row>

        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <InvoiceModal
              showModal={isOpen}
              closeModal={closeModal}
              info={{
                dateOfIssue,
                invoiceNumber,
                billTo,
                billToEmail,
                billToAddress,
                billFrom,
                billFromEmail,
                billFromAddress,
                notes,
              }}
              items={items}
              currency={currency}
              subTotal={subTotal}
              taxAmount={taxAmount}
              discountAmount={discountAmount}
              total={total}
            />
          </div>
        </Col>
      </Form>

      {/* PDF Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Invoice PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Invoice PDF"
              width="100%"
              height="500px"
            ></iframe>
          ) : (
            <p>Loading PDF...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" href={pdfUrl} download target="_blank">
            Download PDF
          </Button>
          <Button variant="primary" href={pdfUrl} download target="_blank">
            Email
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditInvoice;

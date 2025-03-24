import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import Select from "react-select";
import { motion } from "framer-motion";
import Examclination from "../../../assets/images/exclamation.png";
import Tick from "../../../assets/images/Tick.png";

import {
  Modal,
  Button,
  Table,
  Spinner,
  Alert,
  InputGroup,
  FormControl,
  Pagination,
  Form,
  Dropdown,
  DropdownButton,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import "../Products/Products.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faDownload,
  faEye,
  faFilePdf,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import InvoiceForm from "../../../components/Invoicecomponent/InvoiceForm";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css"; // Import CSS
import { CHeaderDivider } from "@coreui/react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
const Invoices = () => {
  const Navi = useNavigate();

  const user_id = sessionStorage.getItem("user_id");
  const token = sessionStorage.getItem("token");
  const [pageloader, setPageloader] = useState("");
  const [filter, setFilter] = useState(""); // Default filter for API
  const [loader, setLoader] = useState(false);

  const [showModalerror, setShowModalerror] = useState(false);
  const handleCloseerror = () => setShowModalerror(false);
  const [modalMessage, setModalMessage] = useState("");

  const [imagebinary, setImagebinary] = useState(null);

  const [showModaladdunit, setShowModaladdunit] = useState(false); // Modal state

  /// item adding api ---------------------//////////////////
  const [showModal, setShowModal] = useState(false); // add Modal state

  const valuationMethodOptions = [
    { value: "FIFO", label: "FIFO (First-In-First-Out)" },
    { value: "LIFO", label: "LIFO (Last-In-First-Out)" },
    { value: "Weighted Average", label: "Weighted Average" },
  ];
  const [isTrackInventory, setIsTrackInventory] = useState(false);
  const [isSalesEnabled, setSalesEnabled] = useState(true);
  const [isPurchaseEnabled, setPurchaseEnabled] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const handleShow = () => {
    Navi("/dashboard/Createinvoice");
  };
  const handleClose = () => {
    reset();
    setShowModal(false);
  };

  const handleNewAccount = () => {
    Navi("/dashboard/Banking/Addbanking");
  };
  //------------------------------------------------------------------------------------------

  //------------------Delete Event

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteEvent = async () => {
    if (!showDeleteModal) return; // Check if a unit ID is selected
    try {
      await axios.post(
        "https://lunarsenterprises.com:5016/crm/unit-delete",
        { u_id: showDeleteModal },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        }
      );
      setShowDeleteModal(null); // Close the modal after deletion
      // fetchProducts();
      Unitapi();
      // Fetch the updated list of products/units
    } catch (error) {
      console.error("Error deleting unit:", error);
    }
  };

  useEffect(() => {
    Unitapi();
  }, []);

  // State for unit data
  const [unit, setUnit] = useState([]);

  const Unitapi = async () => {
    try {
      const response = await axios.post(
        "https://lunarsenterprises.com:5016/crm/unit-list",
        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        }
      );

      if (response.data.result == true) {
        setUnit(response.data.list);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching unit:", error);
    }
  };

  //add unit

  const handleShowunit = () => setShowModaladdunit(true);
  const handleCloseunit = () => {
    reset();
    setShowModaladdunit(false);
  };

  const {
    register: registerUnit,
    handleSubmit: handleSubmitunit,
    reset: resetunit,
    formState: { errors: errorsunit },
  } = useForm();

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(13); // Items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("invoice");
  // Fetch Products
  const fetchProducts = async (page = 1, search = "", selectedFilter = "") => {
    setLoading(true);
    if (!search) {
      setPageloader(true);
    }
    try {
      const response = await axios.post(
        "https://lunarsenterprises.com:5016/crm/invoice/list",

        {
          type: selectedType,
          page_no: page,
          limit: limit,
          search: search,
          filter: selectedFilter,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        }
      );

      if (response.data.result === true) {
        setProducts(response.data.data);
        setTotalItems(response.data.total_count);
        setTotalPages(Math.ceil(response.data.total_count / limit));
        setCurrentPage(page);
      } else {
        console.error(response.data.message); // Log API error messages
        setProducts([]); // Clear the product list if no data is found
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setPageloader(false);
    }
  };
  useEffect(() => {
    fetchProducts(1, "", filter);
  }, [filter, selectedType]);

  // Handle Page Change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      fetchProducts(page, searchTerm);
    }
  };

  // Handle Search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchProducts(1, e.target.value); // Reset to page 1 on search
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [selectedItem, setSelectedItem] = useState("");

  const handleSelect = (item) => {
    setSelectedItem(item.un_name); // Update selected item
    setValue("unit", item.un_name); // Update react-hook-form value for unit field
  };

  //  // Delete list product

  const [showDeleteModallist, setShowDeleteModallist] = useState(false);
  const [deleteEmpId, setDeleteEmpId] = useState(null);
  const handleDeleteConfirmation = (empId) => {
    setDeleteEmpId(empId); // Store the employee ID
    setShowDeleteModallist(true); // Show the delete confirmation modal
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModallist(false); // Close the modal
    setDeleteEmpId(null); // Reset the employee ID
  };

  const Excutivedelete = async () => {
    const user_id = sessionStorage.getItem("user_id");
    const token = sessionStorage.getItem("token");
  
    try {
      const response = await axios.delete(
        "https://lunarsenterprises.com:5016/crm/invoice/delete",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
          data: { invoice_id: deleteEmpId }, // ✅ Correct way to send data in DELETE request
        }
      );
  
      console.log(response);
      if (response.data.result === true) {
        setShowDeleteModallist(false);
        fetchProducts(); // Refresh the list after deletion
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice.");
    }
  };
  

  //-----------------imgupload
  const [image, setImage] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setImagebinary(file); // Store binary file

      const previewURL = URL.createObjectURL(file);
      setImage(previewURL); // Update preview image

      setValue("image", file); // Store file in useForm

      console.log("Uploaded Image:", file);
    },
    [setValue]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    onDrop,
  });

  // Remove the uploaded image
  const removeImage = () => {
    setImage(null);
    setImagebinary(null);
    setValue("image", null);
  };

  //-----------filter--------

  const [selected, setSelected] = useState("Active Items");
  const [selectedactive, setSelectedactive] = useState("Sort By");

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenactive, setIsOpenactive] = useState(false);

  const handleSelectFilter = (eventKey) => {
    setSelected(filterOptions[eventKey]); // Set Label
    setFilter(eventKey === "all" ? "" : eventKey); // Set API filter (empty string for "All")
  };
  const filterOptions = {
    all: "All",
    active: "Active",
    inactive: "Inactive",
    sales: "Sales",
    purchase: "Purchase",
  };
  const handleSelectFilteractive = (eventKey) => {
    setSelectedactive(eventKey);
    setIsOpenactive(false); // Close dropdown after selection
  };

  const Customerview = (item_id) => {
    Navi(`/dashboard/Createinvoice/${item_id}`);
  };

  const [accountsList, setAccountsList] = useState([]);

  const fetchAccounts = async () => {
    try {
      const response = await axios.post(
        "https://lunarsenterprises.com:5016/crm/list/bank-details",
        {},
        {
          headers: { Authorization: `Bearer ${token}`, user_id },
        }
      );

      if (response.data.result === true) {
        const mappedAccounts = response.data.list.map((account) => ({
          value: account.bd_id,
          label: account.bd_acc_bank_name,
        }));
        setAccountsList(mappedAccounts);
      } else {
        console.error(response.data.message);
        setAccountsList([]);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const [productsvendor, setProductsvendor] = useState([]);
  const fetchProductsvendor = async () => {
    try {
      const response = await axios.post(
        "https://lunarsenterprises.com:5016/crm/list/vendors",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        }
      );

      if (response.data.result === true) {
        // Map the customer list to an array of options with `value` and `label`
        const mappedProducts = response.data.list.map((customer) => ({
          value: customer.ve_id,
          // You can choose the label format you want
          label:
            `${customer.ve_salutation} ${customer.ve_first_name} ${customer.ve_last_name}`.trim(),
        }));
        setProductsvendor(mappedProducts);
      } else {
        console.error(response.data.message); // Log API error messages
        setProductsvendor([]); // Clear the product list if no data is found
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchProductsvendor();
  }, []);
  return (
    <div className="vh-100 ">
      {pageloader ? (
        <div
          style={{
            position: "relative",
            top: "25%",
            bottom: "50%",
            right: "50%",
            left: "50%",
          }}
        >
          <div className="lds-roller d-flex justify-content-center align-items-center">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <>
          {products?.length === 0 ? (
            searchTerm || filter ? (
              <>
                <div className="spacemanger">
                  <Dropdown
                    onToggle={(isOpen) => setIsOpen(isOpen)}
                    onSelect={handleSelectFilter}
                  >
                    <Dropdown.Toggle className="dropdownitem">
                      {selected}
                    </Dropdown.Toggle>
                    {isOpen && (
                      <>
                        <Dropdown.Menu show className="">
                          {Object.entries(filterOptions).map(([key, label]) => (
                            <Dropdown.Item key={key} eventKey={key}>
                              {label}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </>
                    )}
                  </Dropdown>

                  <div>
                    <Button className="mb-3 bgaditem" onClick={handleShow}>
                      <i className="fa fa-plus" aria-hidden="true"></i> Create
                      Invoice Or Quotes
                    </Button>

                    {/* <Button className="mb-3 ms-3 bgaditem" onClick={handleShowunit}>
                      Add unit
                    </Button> */}

                    <Dropdown
                      onToggle={(isOpen) => setIsOpenactive(isOpen)}
                      onSelect={handleSelectFilteractive}
                    >
                      <Dropdown.Toggle className="dropdownitem">
                        {selectedactive}
                      </Dropdown.Toggle>

                      {isOpenactive && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className=" show"
                        >
                          <Dropdown.Menu className="mt-5" show>
                            <Dropdown.Item eventKey="importitems">
                              Import Items
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="exportitems">
                              Export Items
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="Inactive">
                              Inactive
                            </Dropdown.Item>

                            {/* <Dropdown.Divider /> */}
                            {/* <Button
                          variant="success"
                          className=" mb-3 justify-Content d-flex align-item  ms-5"
                          onClick={() => alert('Add Item Clicked!')}
                        >
                          Add Item
                        </Button> */}
                          </Dropdown.Menu>
                        </motion.div>
                      )}
                    </Dropdown>
                  </div>
                </div>

                <div className="col-6 ">
                  {/* <InvoiceForm/> */}
                  <div className="row ">
                    <div className=" ">
                      <InputGroup className=" ">
                        <FormControl
                          className="searchcolor"
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={handleSearch}
                        />
                      </InputGroup>
                    </div>
                    <div className="col-6 ">
                      <div className="">
                        {/* <FontAwesomeIcon icon={faFilePdf} size="2x" color="red" className="me-4" /> */}
                        {/* <FontAwesomeIcon icon={faDownload} size="2x" color="blue" className="" /> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-center mb-4">
                    <Button
                      variant={
                        selectedType === "invoice"
                          ? "primary"
                          : "outline-primary"
                      }
                      className="mx-2"
                      onClick={() => setSelectedType("invoice")}
                    >
                      📄 Invoices
                    </Button>
                    <Button
                      variant={
                        selectedType === "quote" ? "primary" : "outline-primary"
                      }
                      className="mx-2"
                      onClick={() => setSelectedType("quote")}
                    >
                      📝 Quotes
                    </Button>
                  </div>
                  <Table
                    striped
                    bordered
                    responsive
                    hover
                    className="mt-4 table"
                  >
                    <thead>
                      <tr className="tablehead">
                        <th>SL</th>
                        <th>Date</th>

                        <th>Invoice ID</th>

                        <th>Customer Name</th>
                        <th> Status</th>
                        <th>Payment Terms</th>
                        <th>Due Date</th>

                        <th> Amount</th>
                        <th>Balance Due</th>

                        <th>Action</th>
                        <th>View</th>
                      </tr>
                    </thead>
                    <tbody className="tablehead">
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center">
                            Loading...
                          </td>
                        </tr>
                      ) : products?.length > 0 ? (
                        products.map((item, index) => (
                          <tr key={item.id}>
                            <td className="tablehead ">
                              {" "}
                              {(currentPage - 1) * limit + index + 1}
                            </td>

                            <td>
                              {moment(item.invoiceDate).format("DD-MM-YYYY")}
                            </td>

                            <td>{item.id}</td>

                            <td>{item.customer_name}</td>
                            <td>{item.status}</td>
                            <td>{item.terms}</td>

                            <td>{moment(item.dueDate).format("DD-MM-YYYY")}</td>
                            <td>{item.total}</td>

                            <td>{item.balanceDue}</td>

                            <td className="">
                              <Button
                                className=""
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteConfirmation(item.id);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  // color="red"
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent dropdown from closing
                                    handleDeleteConfirmation(item.id); // Show modal for deletion
                                  }}
                                />
                              </Button>
                            </td>

                            <td className="">
                              <Button
                                className="me-2"
                                onClick={() => {
                                  Customerview(item.id);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faEye}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    Customerview(item.id); // Show modal for deletion
                                  }}
                                />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <></>
                      )}
                    </tbody>
                  </Table>

                  {/* Pagination */}
                  <div className="centree">
                    <Pagination>
                      <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                      <div className="paginationaldes">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <Pagination.Item
                            key={i + 1}
                            active={i + 1 === currentPage}
                            onClick={() => handlePageChange(i + 1)}
                          >
                            {i + 1}
                          </Pagination.Item>
                        ))}
                      </div>
                      <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </div>
                </div>
                <Alert variant="warning" className="text-center">
                  No results found for {searchTerm || filter}
                </Alert>
              </>
            ) : (
              <>
                {loader ? (
                  <>
                    <div className="text-center">
                      <Spinner animation="border" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="banking-container">
                      <h2>It's time to get paid!</h2>
                      <p>
                        We don't want to boast too much, but sending amazing
                        invoices and getting paid is easier than ever. Go ahead!
                        Try it yourself.
                      </p>
                      <div className="button-group">
                        <button className="connect-button">
                          <a href="createinvoice " className="text-white">
                            NEW INVOICES
                          </a>
                        </button>
                      </div>

                      {/* <div className="watch-video">
        <i className="fas fa-play-circle"></i>
        <span>Watch how to connect your bank account to Zoho Books</span>
      </div> */}
                    </div>
                  </>
                )}
              </>
            )
          ) : (
            <>
              <div className="spacemanger">
                <Dropdown
                  onToggle={(isOpen) => setIsOpen(isOpen)}
                  onSelect={handleSelectFilter}
                >
                  <Dropdown.Toggle className="dropdownitem">
                    {selected}
                  </Dropdown.Toggle>
                  {isOpen && (
                    <>
                      <Dropdown.Menu show className="">
                        {Object.entries(filterOptions).map(([key, label]) => (
                          <Dropdown.Item key={key} eventKey={key}>
                            {label}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </>
                  )}
                </Dropdown>

                <div>
                  <Button className="mb-3 bgaditem" onClick={handleShow}>
                    <i className="fa fa-plus" aria-hidden="true"></i> Create
                    Invoice Or Quotes
                  </Button>

                  {/* <Button
                    className="mb-3 ms-3 bgaditem"
                    onClick={handleShowunit}
                  >
                    Add unit
                  </Button> */}

                  <Dropdown
                    onToggle={(isOpen) => setIsOpenactive(isOpen)}
                    onSelect={handleSelectFilteractive}
                  >
                    <Dropdown.Toggle className="dropdownitem">
                      {selectedactive}
                    </Dropdown.Toggle>

                    {isOpenactive && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className=" show"
                      >
                        <Dropdown.Menu className="mt-5" show>
                          <Dropdown.Item eventKey="importitems">
                            Import
                          </Dropdown.Item>
                          <Dropdown.Item eventKey="exportitems">
                            Export
                          </Dropdown.Item>
                          <Dropdown.Item eventKey="Inactive">
                            Inactive
                          </Dropdown.Item>

                          {/* <Dropdown.Divider /> */}
                          {/* <Button
                          variant="success"
                          className=" mb-3 justify-Content d-flex align-item  ms-5"
                          onClick={() => alert('Add Item Clicked!')}
                        >
                          Add Item
                        </Button> */}
                        </Dropdown.Menu>
                      </motion.div>
                    )}
                  </Dropdown>
                </div>
              </div>

              <div className="col-6 ">
                {/* <InvoiceForm/> */}
                <div className="row ">
                  <div className=" ">
                    <InputGroup className=" ">
                      <FormControl
                        className="searchcolor"
                        placeholder="Search Invoices or Quotes..."
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </InputGroup>
                  </div>
                  <div className="col-6 ">
                    <div className="">
                      {/* <FontAwesomeIcon icon={faFilePdf} size="2x" color="red" className="me-4" /> */}
                      {/* <FontAwesomeIcon icon={faDownload} size="2x" color="blue" className="" /> */}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="container mt-4">
                  <div className="d-flex justify-content-center ">
                    <Button
                      variant={
                        selectedType === "invoice"
                          ? "primary"
                          : "outline-primary"
                      }
                      className="mx-2"
                      onClick={() => setSelectedType("invoice")}
                    >
                      📄 Invoices
                    </Button>
                    <Button
                      variant={
                        selectedType === "quote" ? "primary" : "outline-primary"
                      }
                      className="mx-2"
                      onClick={() => setSelectedType("quote")}
                    >
                      📝 Quotes
                    </Button>
                  </div>
                </div>
                <Table striped bordered responsive hover className="mt-2 table">
                  <thead>
                    <tr className="tablehead">
                      <th>SL</th>
                      <th>Date</th>

                      <th>Invoice ID</th>

                      <th>Customer Name</th>
                      <th> Status</th>
                      <th>Payment Terms</th>
                      <th>Due Date</th>

                      <th> Amount</th>
                      <th>Balance Due</th>

                      <th>Action</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody className="tablehead">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : products?.length > 0 ? (
                      products.map((item, index) => (
                        <tr key={item.id}>
                          <td className="tablehead ">
                            {" "}
                            {(currentPage - 1) * limit + index + 1}
                          </td>

                          <td>
                            {moment(item.invoiceDate).format("DD-MM-YYYY")}
                          </td>

                          <td>{item.id}</td>

                          <td>{item.customer_name}</td>
                          <td>{item.status}</td>
                          <td>{item.terms}</td>

                          <td>{moment(item.dueDate).format("DD-MM-YYYY")}</td>
                          <td>{item.total}</td>

                          <td>{item.balanceDue}</td>

                          <td className="">
                            <Button
                              className=""
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteConfirmation(item.id);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                // color="red"
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent dropdown from closing
                                  handleDeleteConfirmation(item.id); // Show modal for deletion
                                }}
                              />
                            </Button>
                          </td>

                          <td className="">
                            <Button
                              className="me-2"
                              onClick={() => {
                                Customerview(item.id);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faEye}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  Customerview(item.id); // Show modal for deletion
                                }}
                              />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <></>
                    )}
                  </tbody>
                </Table>

                {/* Pagination */}
                <div className="centree">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    <div className="paginationaldes">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <Pagination.Item
                          key={i + 1}
                          active={i + 1 === currentPage}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                    </div>
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* -----------Error Modal-------? */}

      <Modal
        show={showModalerror}
        onHide={() => setShowModalerror(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMessage.type === "success" ? (
              <img
                src={Tick} // Replace with your warning image path
                alt="Tick"
                style={{ width: "30px", marginRight: "10px" }}
              />
            ) : (
              <img
                src={Examclination} // Replace with your warning image path
                alt="Warning"
                style={{ width: "30px", marginRight: "10px" }}
              />
            )}
            {modalMessage.type === "success" ? "Success" : "Warning"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage.message}</p>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation unit Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Unit?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={deleteEvent}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal list */}
      <Modal show={showDeleteModallist} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this Invoice or Quote?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            No
          </Button>
          <Button variant="danger" onClick={Excutivedelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Invoices;






import React, { useEffect, useState } from 'react'
import '../Banking/Banking.css'
import '../Sales/Customers.css'
import { motion } from 'framer-motion'

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
} from 'react-bootstrap'
import axios from 'axios'
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import moment from 'moment/moment'
const Deliverychallans = () => {
  const Navi = useNavigate()
  const user_id = sessionStorage.getItem('user_id')
  const token = sessionStorage.getItem('token')
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [limit] = useState(13) // Items per page
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  // Fetch Products
  const fetchProducts = async (page = 1, search = '') => {
    setLoading(true)
    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/list/delivery-challan',
        {
          page_no: page,
          limit: limit,
          search: search,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )

      if (response.data.result === true) {
        setProducts(response.data.list)
        setTotalItems(response.data.total_count)
        setTotalPages(Math.ceil(response.data.total_count / limit))
        setCurrentPage(page)
      } else {
        console.error(response.data.message) // Log API error messages
        setProducts([]) // Clear the product list if no data is found
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleShow = () => {
    Navi('/dashboard/Deliverychallans/AddDeliverychallans')
  }
  const Customerview = (dc_id) => {
    Navi(`/dashboard/Deliverychallans/ViewDeliverychallans/${dc_id}`)
  }
  // Handle Page Change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      fetchProducts(page, searchTerm)
    }
  }

  // Handle Search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    fetchProducts(1, e.target.value) // Reset to page 1 on search
  }

  const [selectedItem, setSelectedItem] = useState('')

  //------------delete----------------

  const [showDeleteModallist, setShowDeleteModallist] = useState(false)
  const [deleteEmpId, setDeleteEmpId] = useState(null)
  const handleDeleteConfirmation = (empId) => {
    setDeleteEmpId(empId) // Store the employee ID
    setShowDeleteModallist(true) // Show the delete confirmation modal
  }
  const handleCloseDeleteModal = () => {
    setShowDeleteModallist(false) // Close the modal
    setDeleteEmpId(null) // Reset the employee ID
  }
  const Excutivedelete = async () => {
    try {
      const del = {
        dc_id: deleteEmpId,
      }
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/sales/delete',
        del,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )

      console.log(response)
      if (response.data.result === true) {
        setShowDeleteModallist(false)
        fetchProducts()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  //-----------filter--------

  const [selected, setSelected] = useState('All')
  const [selectedactive, setSelectedactive] = useState('Sort By')

  const [isOpen, setIsOpen] = useState(false)
  const [isOpenactive, setIsOpenactive] = useState(false)

  const handleSelectFilter = (eventKey) => {
    setSelected(eventKey)
    setIsOpen(false) // Close dropdown after selection
  }

  const handleSelectFilteractive = (eventKey) => {
    setSelectedactive(eventKey)
    setIsOpenactive(false) // Close dropdown after selection
  }
  return (
    <>
      {products.length === 0 ? (
        searchTerm ? (
          <>
            <div className="spacemanger ">
              <Dropdown onToggle={(isOpen) => setIsOpen(isOpen)} onSelect={handleSelectFilter}>
                <Dropdown.Toggle className="dropdownitem">{selected}</Dropdown.Toggle>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className=" show"
                  >
                    <Dropdown.Menu show className="mt-5">
                      <Dropdown.Item eventKey="All">All</Dropdown.Item>
                      <Dropdown.Item eventKey="Active">Active</Dropdown.Item>
                      <Dropdown.Item eventKey="Inactive">Inactive</Dropdown.Item>
                      {/* 
                      <Dropdown.Divider />
                      <Button
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

              <div className="d-md-flex justify-content-end align-items-center col-md-4">
                <Button className="mb-3 bgaditem" type="submit" onClick={handleShow}>
                  <i className="fa fa-plus" aria-hidden="true"></i> Add New delivery Challan
                </Button>

                <Dropdown
                  className="ms-md-3 mb-3"
                  onToggle={(isOpen) => setIsOpenactive(isOpen)}
                  onSelect={handleSelectFilteractive}
                >
                  <Dropdown.Toggle className="dropdownitem">{selectedactive}</Dropdown.Toggle>

                  {isOpenactive && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className=" show"
                    >
                      <Dropdown.Menu className="mt-5" show>
                        <Dropdown.Item eventKey="importitems">Import Items</Dropdown.Item>
                        <Dropdown.Item eventKey="exportitems">Export Items</Dropdown.Item>
                        <Dropdown.Item eventKey="Inactive">Inactive</Dropdown.Item>

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
                      placeholder="Search Delivery Challan ..."
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
              <Table striped bordered responsive hover className="mt-4 table">
                <thead>
                  <tr className="tablehead">
                    <th>SL</th>
                    <th>Customer Id</th>

                    <th>Customer Name</th>

                    <th>Delivery Challan Id</th>
                    <th>Reference</th>

                    <th> Date</th>
                    <th>Type</th>

                    <th>Status</th>
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
                    products?.map((account, index) => (
                      <tr key={account.dc_id}>
                        <td className="tablehead me-3"> {(currentPage - 1) * limit + index + 1}</td>
                        <td>{account.dc_customer_id}</td>

                        <td>{account.dc_customer_name}</td>
                        <td>{account.dc_delivery_challan_id}</td>
                        <td>{account.dc_reference}</td>

                        <td>{moment(account.dc_date).format('DD-MM-YYYY')}</td>

                        <td>{account.dc_type}</td>

                        <td>
                          <Badge bg={account.dc_status === 'active' ? 'info' : 'danger'}>
                            {account.dc_status}
                          </Badge>
                        </td>
                      <td className="justify-content-center d-flex ">
                          <Button
                            className="btn-deletelist"
                            // variant="danger"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteConfirmation(account.dc_id)
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              size="sm"
                              color="red"
                              style={{ cursor: 'pointer' }}
                              onClick={(e) => {
                                e.stopPropagation() // Prevent dropdown from closing
                                handleDeleteConfirmation(account.dc_id) // Show modal for deletion
                              }}
                            />
                          </Button>
                        </td>

                        <td className="">
                          <Button
                            className=""
                            size="sm"
                            onClick={() => {
                              Customerview(account.dc_id)
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faEye}
                              size="sm"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                Customerview(account.dc_id) // Show modal for deletion
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
              No results found for "{searchTerm}
            </Alert>
          </>
        ) : (
          <div className="banking-container">
          <h2>Deliver Goods effectively!</h2>
          <p>
          Create, customize and print professional Delivery Challans
          </p>
          <div className="button-group">
            <button className="connect-button">
              <a href='/dashboard/Deliverychallans/AddDeliverychallans' className='text-white'>
               CREATE  DELIVERY CHALLANS
               </a>
               </button>
            {/* <button className="add-manually-button">Add Manually</button> */}
          </div>
          {/* <p className="skip-link">
          Click here to import customers from file
          </p> */}
          {/* <div className="watch-video">
            <i className="fas fa-play-circle"></i>
            <span>Watch how to connect your bank account to Zoho Books</span>
          </div> */}
        </div>
        )
      ) : (
        <>
          <div className="spacemanger ">
            <Dropdown onToggle={(isOpen) => setIsOpen(isOpen)} onSelect={handleSelectFilter}>
              <Dropdown.Toggle className="dropdownitem">{selected}</Dropdown.Toggle>

              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className=" show"
                >
                  <Dropdown.Menu show className="mt-5">
                    <Dropdown.Item eventKey="All">All</Dropdown.Item>
                    <Dropdown.Item eventKey="Active">Active</Dropdown.Item>
                    <Dropdown.Item eventKey="Inactive">Inactive</Dropdown.Item>

                    {/* <Dropdown.Divider />
                    <Button
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

            <div className="d-md-flex justify-content-end align-items-center col-md-4">
              <Button className="mb-3 bgaditem" type="submit" onClick={handleShow}>
                <i className="fa fa-plus" aria-hidden="true"></i>Add New delivery Challan
              </Button>

              <Dropdown
                className="ms-md-3 mb-3"
                onToggle={(isOpen) => setIsOpenactive(isOpen)}
                onSelect={handleSelectFilteractive}
              >
                <Dropdown.Toggle className="dropdownitem">{selectedactive}</Dropdown.Toggle>

                {isOpenactive && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className=" show"
                  >
                    <Dropdown.Menu className="mt-5" show>
                      <Dropdown.Item eventKey="importitems">Import Items</Dropdown.Item>
                      <Dropdown.Item eventKey="exportitems">Export Items</Dropdown.Item>
                      <Dropdown.Item eventKey="Inactive">Inactive</Dropdown.Item>

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
                    placeholder="Search Delivery Challan ..."
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
          <Table striped bordered responsive hover className="mt-4 table">
                <thead>
                  <tr className="tablehead">
                    <th>SL</th>
                    <th>Customer Id</th>

                    <th>Customer Name</th>

                    <th>Delivery Challan Id</th>
                    <th>Reference</th>

                    <th> Date</th>
                    <th>Type</th>

                    <th>Status</th>
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
                    products?.map((account, index) => (
                      <tr key={account.dc_id}>
                        <td className="tablehead me-3"> {(currentPage - 1) * limit + index + 1}</td>
                        <td>{account.dc_customer_id}</td>

                        <td>{account.dc_customer_name}</td>
                        <td>{account.dc_delivery_challan_id}</td>
                        <td>{account.dc_reference}</td>

                        <td>{moment(account.dc_date).format('DD-MM-YYYY')}</td>

                        <td>{account.dc_type}</td>

                        <td>
                          <Badge bg={account.dc_status === 'active' ? 'info' : 'danger'}>
                            {account.dc_status}
                          </Badge>
                        </td>
                      <td className="justify-content-center d-flex ">
                          <Button
                            className="btn-deletelist"
                            // variant="danger"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteConfirmation(account.dc_id)
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              // size="sm"
                              // color="red"
                              style={{ cursor: 'pointer' }}
                              onClick={(e) => {
                                e.stopPropagation() // Prevent dropdown from closing
                                handleDeleteConfirmation(account.dc_id) // Show modal for deletion
                              }}
                            />
                          </Button>
                        </td>

                        <td className="">
                        <div className='justify-content-center d-flex'>
                          <Button
                            className=""
                            // size="sm"
                            onClick={() => {
                              Customerview(account.dc_id)
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faEye}
                              // size="sm"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                Customerview(account.dc_id) // Show modal for deletion
                              }}
                            />
                          </Button>
                          </div>
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

      {/* Delete Confirmation Modal list */}
      <Modal show={showDeleteModallist} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Delivery Challans?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            No
          </Button>
          <Button variant="danger" onClick={Excutivedelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <Bankingdashboard/> */}
    </>
  )
}

export default Deliverychallans

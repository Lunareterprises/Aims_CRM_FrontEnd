import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useCallback } from 'react'
import Select from 'react-select'
import { motion } from 'framer-motion'
import Examclination from '../../../assets/images/exclamation.png'
import Tick from '../../../assets/images/Tick.png'

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
import { Controller, useForm } from 'react-hook-form'
import axios from 'axios'
import '../Products/Products.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBox,
  faDownload,
  faEye,
  faFilePdf,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import InvoiceForm from '../../../components/Invoicecomponent/InvoiceForm'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css' // Import CSS
import { CHeaderDivider } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
const Products = () => {
  const Navi = useNavigate()

  const user_id = sessionStorage.getItem('user_id')
  const token = sessionStorage.getItem('token')
  const [pageloader, setPageloader] = useState('')
  const [filter, setFilter] = useState('') // Default filter for API
  const [loader, setLoader] = useState(false)

  const [showModalerror, setShowModalerror] = useState(false)
  const handleCloseerror = () => setShowModalerror(false)
  const [modalMessage, setModalMessage] = useState('')

  const [imagebinary, setImagebinary] = useState(null)

  const [showModaladdunit, setShowModaladdunit] = useState(false) // Modal state

  /// item adding api ---------------------//////////////////
  const [showModal, setShowModal] = useState(false) // add Modal state

  const valuationMethodOptions = [
    { value: 'FIFO', label: 'FIFO (First-In-First-Out)' },
    { value: 'LIFO', label: 'LIFO (Last-In-First-Out)' },
    { value: 'Weighted Average', label: 'Weighted Average' },
  ]
  const [isTrackInventory, setIsTrackInventory] = useState(false)
  const [isSalesEnabled, setSalesEnabled] = useState(true)
  const [isPurchaseEnabled, setPurchaseEnabled] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm()

  const handleShow = () => setShowModal(true)
  const handleClose = () => {
    reset()
    setShowModal(false)
  }

  const onSubmit = async (data) => {
    console.log(data, 'datadatadatadata')

    if (!imagebinary) {
      setModalMessage({
        type: 'fail',
        message: '⚠ Please add an image!',
      })
      setShowModalerror(true)
      setTimeout(() => {
        setShowModalerror(false)
      }, 3000)
      return // Stop form submission
    }
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('user_id', user_id)
      formData.append('type', data.type)
      formData.append('name', data.name)
      formData.append('unit', data.unit)
      formData.append('selling_price', data.selling_price)
      formData.append('image', imagebinary)
      // formData.append('valuation_method', data.valuation_method)

      // Sales Fields (Append only if enabled)
      if (isSalesEnabled) {
        formData.append('sales_status', "Sales")
        formData.append('sales_account', data.sales_account)
        formData.append('sales_description', data.sales_description)
        formData.append('is_sales_enabled', isSalesEnabled)
      }

      // Purchase Fields (Append only if enabled)
      if (isPurchaseEnabled) {
        formData.append('purchase_status', "Purchase")
        formData.append('purchase_cost_price', data.purchase_cost_price)
        if (data.purchase_account) {
          formData.append('purchase_account', data.purchase_account.label)
          formData.append('purchase_account_id', data.preferred_vendor.value)
        }
        formData.append('purchase_description', data.purchase_description)

        if (data.preferred_vendor) {
          formData.append('preferred_vendor', data.preferred_vendor.label)
          formData.append('preferred_vendor_id', data.preferred_vendor.value) // Corrected this line
        }

        formData.append('is_purchase_enabled', isPurchaseEnabled)
      }
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/item/add',
        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )
      if (response.data.result) {
        fetchProducts(currentPage) // Refresh product list
        handleClose() // Close modal
        reset()
        setModalMessage({
          type: 'success',
          message: response.data.message,
        })
        setShowModalerror(true)

        setTimeout(() => {
          setShowModalerror(false)
        }, 3000)
      } else {
        setModalMessage({
          type: 'fail',
          message: response.data.message,
        })
        setShowModalerror(true)

        setTimeout(() => {
          setShowModalerror(false)
        }, 3000)
      }
      1
    } catch (error) {
      console.error('Error adding item:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewAccount = () => {
    Navi('/dashboard/Banking/Addbanking')
  }
  //------------------------------------------------------------------------------------------

  //------------------Delete Event

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const deleteEvent = async () => {
    if (!showDeleteModal) return // Check if a unit ID is selected
    try {
      await axios.post(
        'https://lunarsenterprises.com:5016/crm/unit-delete',
        { u_id: showDeleteModal },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )
      setShowDeleteModal(null) // Close the modal after deletion
      // fetchProducts();
      Unitapi()
      // Fetch the updated list of products/units
    } catch (error) {
      console.error('Error deleting unit:', error)
    }
  }

  useEffect(() => {
    Unitapi()
  }, [])

  // State for unit data
  const [unit, setUnit] = useState([])

  const Unitapi = async () => {
    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/unit-list',
        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )

      if (response.data.result == true) {
        setUnit(response.data.list)
      } else {
        console.log(response.data.message)
      }
    } catch (error) {
      console.error('Error fetching unit:', error)
    }
  }

  //add unit

  const handleShowunit = () => setShowModaladdunit(true)
  const handleCloseunit = () => {
    reset()
    setShowModaladdunit(false)
  }

  const {
    register: registerUnit,
    handleSubmit: handleSubmitunit,
    reset: resetunit,
    formState: { errors: errorsunit },
  } = useForm()

  // Form submission
  const onSubmitunit = async (data) => {
    setLoading(true)
    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/unit/add',
        { unit_name: data.unit_name, u_id: user_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )
      if (response.data.result) {
        setModalMessage({
          type: 'success',
          message: response.data.message,
        })
        setShowModalerror(true)

        setTimeout(() => {
          setShowModalerror(false)
        }, 3000)
        handleCloseunit() // Close modal
        resetunit()
        Unitapi()
      } else {
        setModalMessage({
          type: 'fail',
          message: response.data.message,
        })
        setShowModalerror(true)

        setTimeout(() => {
          setShowModalerror(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Error adding item:', error)
    } finally {
      setLoading(false)
    }
  }
  //item

  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [limit] = useState(13) // Items per page
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch Products
  const fetchProducts = async (page = 1, search = '', selectedFilter = '') => {
    setLoading(true)
    if (!search) {
      setPageloader(true)
    }
    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/item/list',
        {
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
      setPageloader(false)
    }
  }
  useEffect(() => {
    fetchProducts(1, '', filter)
  }, [filter])

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

  useEffect(() => {
    fetchProducts()
  }, [])

  const [selectedItem, setSelectedItem] = useState('')

  const handleSelect = (item) => {
    setSelectedItem(item.un_name) // Update selected item
    setValue('unit', item.un_name) // Update react-hook-form value for unit field
  }

  //  // Delete list product

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
        item_id: deleteEmpId,
      }
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/item/delete',
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

  //-----------------imgupload
  const [image, setImage] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setImagebinary(file); // Store binary file

    const previewURL = URL.createObjectURL(file);
    setImage(previewURL); // Update preview image

    setValue("image", file); // Store file in useForm

    console.log("Uploaded Image:", file);
  }, [setValue]);



  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    onDrop,
  })

  // Remove the uploaded image
  const removeImage = () => {
    setImage(null);
    setImagebinary(null);
    setValue("image", null);
  }

  //-----------filter--------

  const [selected, setSelected] = useState('Active Items')
  const [selectedactive, setSelectedactive] = useState('Sort By')

  const [isOpen, setIsOpen] = useState(false)
  const [isOpenactive, setIsOpenactive] = useState(false)

  const handleSelectFilter = (eventKey) => {
    setSelected(filterOptions[eventKey]) // Set Label
    setFilter(eventKey === 'all' ? '' : eventKey) // Set API filter (empty string for "All")
  }
  const filterOptions = {
    all: 'All',
    active: 'Active',
    inactive: 'Inactive',
    sales: 'Sales',
    purchase: 'Purchase',
  
 
  }
  const handleSelectFilteractive = (eventKey) => {
    setSelectedactive(eventKey)
    setIsOpenactive(false) // Close dropdown after selection
  }

  const Customerview = (item_id) => {
    Navi(`/dashboard/Products/productsView/${item_id}`)
  }

  const [accountsList, setAccountsList] = useState([])

  const fetchAccounts = async () => {
    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/list/bank-details',
        {},
        {
          headers: { Authorization: `Bearer ${token}`, user_id },
        },
      )

      if (response.data.result === true) {
        const mappedAccounts = response.data.list.map((account) => ({
          value: account.bd_id,
          label: account.bd_acc_bank_name,
        }))
        setAccountsList(mappedAccounts)
      } else {
        console.error(response.data.message)
        setAccountsList([])
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
    }
  }

  const [productsvendor, setProductsvendor] = useState([])
  const fetchProductsvendor = async () => {
    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/list/vendors',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )

      if (response.data.result === true) {
        // Map the customer list to an array of options with `value` and `label`
        const mappedProducts = response.data.list.map((customer) => ({
          value: customer.ve_id,
          // You can choose the label format you want
          label:
            `${customer.ve_salutation} ${customer.ve_first_name} ${customer.ve_last_name}`.trim(),
        }))
        setProductsvendor(mappedProducts)
      } else {
        console.error(response.data.message) // Log API error messages
        setProductsvendor([]) // Clear the product list if no data is found
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  useEffect(() => {
    fetchAccounts()
    fetchProductsvendor()
  }, [])
  return (
    <div className="vh-100 ">
      {pageloader ? (
        <div style={{position:"relative",top:"25%",bottom:"50%",right:"50%",left:"50%"}}>
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
                  {/* <Dropdown onToggle={(isOpen) => setIsOpen(isOpen)} onSelect={handleSelectFilter}>
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
                        <Dropdown.Item eventKey="Sales">Sales</Dropdown.Item>
                        <Dropdown.Item eventKey="Purchase">Purchase</Dropdown.Item>
                        <Dropdown.Item eventKey="Services">Services</Dropdown.Item>
                        <Dropdown.Item eventKey="Inventory Items">Inventory Items</Dropdown.Item>
                        <Dropdown.Item eventKey="Non-inventory Items">
                          Non-inventory Items
                        </Dropdown.Item> */}
                  {/* <Dropdown.Divider />
                        <Button
                          variant="success"
                          className=" mb-3 justify-Content d-flex align-item  ms-5"
                          onClick={() => alert('Add Item Clicked!')}
                        >
                          Add Item
                        </Button>
                      </Dropdown.Menu>
                    </motion.div>
                  )}
                </Dropdown> */}

                  <Dropdown onSelect={handleSelectFilter}>
                    <Dropdown.Toggle className="dropdownitem">{selected}</Dropdown.Toggle>
                    <Dropdown.Menu show className="mt-5">
                      {Object.entries(filterOptions).map(([key, label]) => (
                        <Dropdown.Item key={key} eventKey={key}>
                          {label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>

                  <div>
                    <Button className="mb-3 bgaditem" onClick={handleShow}>
                      <i className="fa fa-plus" aria-hidden="true"></i> Add Products
                    </Button>

                    <Button className="mb-3 ms-3 bgaditem" onClick={handleShowunit}>
                      Add unit
                    </Button>

                    <Dropdown
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
                  <Table striped bordered responsive hover className="mt-4 table">
                    <thead>
                      <tr className="tablehead">
                        <th>SL</th>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Unit</th>
                        <th>Sales Price</th>
                        <th>Purchase Price</th>

                        <th>Sales Account</th>
                        <th>Purchase Account</th>
                        <th>Preferred Vendor</th>
                        <th>Sales Status</th>
                        <th>Purchase Status</th>
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
                        products?.map((item, index) => (
                          <tr key={item.i_id}>
                            <td className="tablehead me-3">
                              {' '}
                              {(currentPage - 1) * limit + index + 1}
                            </td>
                            <td>{item.i_type}</td>
                            <td>{item.i_name}</td>
                            <td>{item.i_unit}</td>
                            <td>{item.i_sales_price}</td>
                            <td>{item.i_purchase_price}</td>

                            <td>{item.i_sales_account || 'nil'}</td>
                            <td>{item.i_purchase_account}</td>
                            <td>{item.i_preferred_vendor}</td>
                            <td>{item.i_sales_status || '0'}</td>
                            <td>{item.i_purchase_status || '0'}</td>
                            <td className="">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteConfirmation(item.i_id)
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  style={{ cursor: 'pointer' }}
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent dropdown from closing
                                    handleDeleteConfirmation(item.i_id) // Show modal for deletion
                                  }}
                                />
                              </Button>
                            </td>

                            <td className="">
                              <Button
                                className=""
                                size="sm"
                                onClick={() => {
                                  Customerview(item.i_id)
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faEye}
                                  size="sm"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    Customerview(item.i_id) // Show modal for deletion
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
                      <h2>Manage Your Products Efficiently</h2>
                      <p>
                        Keep track of your products, pricing, and inventory all in one place. Easily
                        add new products, categorize them, and update details whenever needed.
                      </p>
                      <div className="button-group">
                        {/* <button className="connect-button">Connect Bank / Credit Card</button> */}
                        <button className="connect-button" onClick={() => setShowModal(true)}>
                          <a className="text-white">ADD PRODUCT</a>
                        </button>
                      </div>
                      {/* <p className="skip-link">
        Don't use banking for your business? <span>Skip</span>
      </p> */}
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
              <Dropdown onSelect={handleSelectFilter}>
                    <Dropdown.Toggle className="dropdownitem">{selected}</Dropdown.Toggle>
                    <Dropdown.Menu show className="mt-5">
                      {Object.entries(filterOptions).map(([key, label]) => (
                        <Dropdown.Item key={key} eventKey={key}>
                          {label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>

                <div>
                  <Button className="mb-3 bgaditem" onClick={handleShow}>
                    <i className="fa fa-plus" aria-hidden="true"></i> Add Item
                  </Button>

                  <Button className="mb-3 ms-3 bgaditem" onClick={handleShowunit}>
                    Add unit
                  </Button>

                  <Dropdown
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
                <Table striped bordered responsive hover className="mt-4 table">
                  <thead>
                    <tr className="tablehead">
                      <th>SL</th>
                      <th>Type</th>
                      <th>Name</th>
                      <th>Unit</th>
                      <th>Sales Price</th>
                      <th>Purchase Price</th>
                      <th>Sales Account</th>
                      <th>Purchase Account</th>
                      <th>Preferred Vendor</th>
                      <th>Sales Status</th>
                      <th>Purchase Status</th>
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
                    ) : products.length > 0 ? (
                      products.map((item, index) => (
                        <tr key={item.i_id}>
                          <td className="tablehead "> {(currentPage - 1) * limit + index + 1}</td>
                          <td>{item.i_type}</td>
                          <td>{item.i_name}</td>
                          <td>{item.i_unit}</td>
                          <td>{item.i_sales_price}</td>
                          <td>{item.i_purchase_price}</td>

                          <td>{item.i_sales_account || 'nil'}</td>
                          <td>{item.i_purchase_account}</td>
                          <td>{item.i_preferred_vendor}</td>
                          <td>{item.i_sales_status || '0'}</td>
                          <td>{item.i_purchase_status || '0'}</td>
                          <td className="">
                            <Button
                              className=""
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteConfirmation(item.i_id)
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                // color="red"
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                  e.stopPropagation() // Prevent dropdown from closing
                                  handleDeleteConfirmation(item.i_id) // Show modal for deletion
                                }}
                              />
                            </Button>
                          </td>

                          <td className="">
                            <Button
                              className="me-2"
                              onClick={() => {
                                Customerview(item.i_id)
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faEye}
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  Customerview(item.i_id) // Show modal for deletion
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

      <Modal show={showModalerror} onHide={() => setShowModalerror(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMessage.type === 'success' ? (
              <img
                src={Tick} // Replace with your warning image path
                alt="Tick"
                style={{ width: '30px', marginRight: '10px' }}
              />
            ) : (
              <img
                src={Examclination} // Replace with your warning image path
                alt="Warning"
                style={{ width: '30px', marginRight: '10px' }}
              />
            )}
            {modalMessage.type === 'success' ? 'Success' : 'Warning'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage.message}</p>
        </Modal.Body>
      </Modal>

      {/*-------------------- Modal   item add sector---------------------*/}

      <Modal className="modal-xl" show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  {/* Sales Information */}

                  <div>
                    <label htmlFor="type" className="form-label me-2">
                      Type
                    </label>

                    <svg
                      data-tooltip-id="Type-tooltip"
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0"
                      y="0"
                      viewBox="0 0 512 512"
                      xml:space="preserve"
                      class="icon icon-sm align-text-bottom text-muted cursor-pointer"
                    >
                      <path d="M317.1 147.5c-15.1-13.8-35.5-20.8-60.5-20.8-23.7 0-43.1 6.5-57.7 19.4-14.6 12.9-23.5 31.5-26.4 55.5l-.6 4.9 40.4 4.8.7-4.6c2.5-15.8 7.7-27.5 15.4-34.7 7.7-7.2 17.1-10.7 28.7-10.7 12 0 21.9 3.9 30.1 11.9 8.2 8 12.2 16.9 12.2 27.3 0 5.6-1.3 10.7-4 15.4-2.8 4.9-9.3 11.9-19.3 20.7-10.7 9.4-17.9 16.5-22.1 21.5-5.8 7-10 14-12.6 20.8-3.5 9.1-5.3 19.9-5.3 32.3 0 2.1.1 5.1.2 9l.1 4.7h38.4l.1-4.8c.3-14.3 1.4-21.4 2.3-24.7 1.3-4.7 3.2-8.8 5.9-12.5 2.8-3.8 9-10 18.5-18.4 15.1-13.4 25.1-24.6 30.4-34.2 5.4-9.7 8.1-20.4 8.1-31.9 0-19.9-7.7-37-23-50.9zM256.3 385.3c12.1 0 22-9.8 22-22 0-12.1-9.8-22-22-22-12.1 0-22 9.8-22 22s9.8 22 22 22z"></path>
                      <path d="M437.4 74.6C388.9 26.1 324.5-.5 256-.5S123.1 26.2 74.6 74.6C26.1 123.1-.5 187.5-.5 256s26.7 132.9 75.1 181.4c48.5 48.5 112.9 75.1 181.4 75.1s132.9-26.7 181.4-75.1c48.5-48.5 75.1-112.9 75.1-181.4s-26.6-132.9-75.1-181.4zm-22.6 340.2c-42.4 42.4-98.8 65.8-158.8 65.8s-116.4-23.4-158.8-65.8C54.8 372.4 31.5 316 31.5 256S54.8 139.6 97.2 97.2C139.6 54.8 196 31.5 256 31.5s116.4 23.4 158.8 65.8c42.4 42.4 65.8 98.8 65.8 158.8s-23.4 116.3-65.8 158.7z"></path>
                    </svg>
                    <Tooltip id="Type-tooltip" place="top" effect="solid">
                      Select if this item is a physical good <br />
                      or a service.Remember that you <br />
                      cannot change the type if this item <br />
                      is included in a transaction.
                    </Tooltip>
                  </div>
                  <select
                    id="type"
                    className="form-select"
                    {...register('type', { required: 'Type is required' })}
                  >
                    <option value="goods">Goods</option>
                    <option value="services">Services</option>
                  </select>
                  {errors.type && <p className="text-danger">{errors.type.message}</p>}
                </div>

                <div className="mb-3">
                  <div>
                    <label htmlFor="name" className="form-label me-2 mt-3">
                      Name
                    </label>
                    <svg
                      data-tooltip-id="name-tooltip"
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0"
                      y="0"
                      viewBox="0 0 512 512"
                      xml:space="preserve"
                      class="icon icon-sm align-text-bottom text-muted cursor-pointer"
                    >
                      <path d="M317.1 147.5c-15.1-13.8-35.5-20.8-60.5-20.8-23.7 0-43.1 6.5-57.7 19.4-14.6 12.9-23.5 31.5-26.4 55.5l-.6 4.9 40.4 4.8.7-4.6c2.5-15.8 7.7-27.5 15.4-34.7 7.7-7.2 17.1-10.7 28.7-10.7 12 0 21.9 3.9 30.1 11.9 8.2 8 12.2 16.9 12.2 27.3 0 5.6-1.3 10.7-4 15.4-2.8 4.9-9.3 11.9-19.3 20.7-10.7 9.4-17.9 16.5-22.1 21.5-5.8 7-10 14-12.6 20.8-3.5 9.1-5.3 19.9-5.3 32.3 0 2.1.1 5.1.2 9l.1 4.7h38.4l.1-4.8c.3-14.3 1.4-21.4 2.3-24.7 1.3-4.7 3.2-8.8 5.9-12.5 2.8-3.8 9-10 18.5-18.4 15.1-13.4 25.1-24.6 30.4-34.2 5.4-9.7 8.1-20.4 8.1-31.9 0-19.9-7.7-37-23-50.9zM256.3 385.3c12.1 0 22-9.8 22-22 0-12.1-9.8-22-22-22-12.1 0-22 9.8-22 22s9.8 22 22 22z"></path>
                      <path d="M437.4 74.6C388.9 26.1 324.5-.5 256-.5S123.1 26.2 74.6 74.6C26.1 123.1-.5 187.5-.5 256s26.7 132.9 75.1 181.4c48.5 48.5 112.9 75.1 181.4 75.1s132.9-26.7 181.4-75.1c48.5-48.5 75.1-112.9 75.1-181.4s-26.6-132.9-75.1-181.4zm-22.6 340.2c-42.4 42.4-98.8 65.8-158.8 65.8s-116.4-23.4-158.8-65.8C54.8 372.4 31.5 316 31.5 256S54.8 139.6 97.2 97.2C139.6 54.8 196 31.5 256 31.5s116.4 23.4 158.8 65.8c42.4 42.4 65.8 98.8 65.8 158.8s-23.4 116.3-65.8 158.7z"></path>
                    </svg>
                    <Tooltip id="name-tooltip" place="top" effect="solid">
                      Enter your full name
                    </Tooltip>
                  </div>

                  <input
                    id="name"
                    className="form-control"
                    {...register('name', {
                      required: 'Name is required',
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: 'Name can only contain letters and spaces',
                      },
                    })}
                    placeholder="Enter item name"
                  />
                  {errors.name && <p className="text-danger">{errors.name.message}</p>}
                </div>
                <div className="mb-3">
                  <div className="">
                    <label htmlFor="sku" className="form-label me-2">
                      SKU
                    </label>

                    <svg
                      data-tooltip-id="sku-tooltip"
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0"
                      y="0"
                      viewBox="0 0 512 512"
                      xml:space="preserve"
                      class="icon icon-sm align-text-bottom text-muted cursor-pointer"
                    >
                      <path d="M317.1 147.5c-15.1-13.8-35.5-20.8-60.5-20.8-23.7 0-43.1 6.5-57.7 19.4-14.6 12.9-23.5 31.5-26.4 55.5l-.6 4.9 40.4 4.8.7-4.6c2.5-15.8 7.7-27.5 15.4-34.7 7.7-7.2 17.1-10.7 28.7-10.7 12 0 21.9 3.9 30.1 11.9 8.2 8 12.2 16.9 12.2 27.3 0 5.6-1.3 10.7-4 15.4-2.8 4.9-9.3 11.9-19.3 20.7-10.7 9.4-17.9 16.5-22.1 21.5-5.8 7-10 14-12.6 20.8-3.5 9.1-5.3 19.9-5.3 32.3 0 2.1.1 5.1.2 9l.1 4.7h38.4l.1-4.8c.3-14.3 1.4-21.4 2.3-24.7 1.3-4.7 3.2-8.8 5.9-12.5 2.8-3.8 9-10 18.5-18.4 15.1-13.4 25.1-24.6 30.4-34.2 5.4-9.7 8.1-20.4 8.1-31.9 0-19.9-7.7-37-23-50.9zM256.3 385.3c12.1 0 22-9.8 22-22 0-12.1-9.8-22-22-22-12.1 0-22 9.8-22 22s9.8 22 22 22z"></path>
                      <path d="M437.4 74.6C388.9 26.1 324.5-.5 256-.5S123.1 26.2 74.6 74.6C26.1 123.1-.5 187.5-.5 256s26.7 132.9 75.1 181.4c48.5 48.5 112.9 75.1 181.4 75.1s132.9-26.7 181.4-75.1c48.5-48.5 75.1-112.9 75.1-181.4s-26.6-132.9-75.1-181.4zm-22.6 340.2c-42.4 42.4-98.8 65.8-158.8 65.8s-116.4-23.4-158.8-65.8C54.8 372.4 31.5 316 31.5 256S54.8 139.6 97.2 97.2C139.6 54.8 196 31.5 256 31.5s116.4 23.4 158.8 65.8c42.4 42.4 65.8 98.8 65.8 158.8s-23.4 116.3-65.8 158.7z"></path>
                    </svg>
                    <Tooltip id="sku-tooltip" place="top" effect="solid">
                      The Stock Keeping Unit (SKU) of the item.
                    </Tooltip>
                  </div>
                  <input
                    id="sku"
                    type="text"
                    // step="0.01"
                    className="form-control"
                    {...register('sku', {
                      required: 'SKU is required',
                      // pattern: {
                      //   value: /^\d+(\.\d{1,2})?$/,
                      //   message: 'Price must be a number with up to 2 decimal places',
                      // },
                    })}
                    placeholder="Enter sku"
                  />
                  {errors.sku && <p className="text-danger">{errors.sku.message}</p>}
                </div>

                <div className="mb-3">
                  <div className="mb-3 ">
                    <label htmlFor="unit" className="form-label me-2">
                      Unit
                    </label>
                    <svg
                      data-tooltip-id="unit-tooltip"
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0"
                      y="0"
                      viewBox="0 0 512 512"
                      xml:space="preserve"
                      class="icon icon-sm align-text-bottom text-muted cursor-pointer"
                    >
                      <path d="M317.1 147.5c-15.1-13.8-35.5-20.8-60.5-20.8-23.7 0-43.1 6.5-57.7 19.4-14.6 12.9-23.5 31.5-26.4 55.5l-.6 4.9 40.4 4.8.7-4.6c2.5-15.8 7.7-27.5 15.4-34.7 7.7-7.2 17.1-10.7 28.7-10.7 12 0 21.9 3.9 30.1 11.9 8.2 8 12.2 16.9 12.2 27.3 0 5.6-1.3 10.7-4 15.4-2.8 4.9-9.3 11.9-19.3 20.7-10.7 9.4-17.9 16.5-22.1 21.5-5.8 7-10 14-12.6 20.8-3.5 9.1-5.3 19.9-5.3 32.3 0 2.1.1 5.1.2 9l.1 4.7h38.4l.1-4.8c.3-14.3 1.4-21.4 2.3-24.7 1.3-4.7 3.2-8.8 5.9-12.5 2.8-3.8 9-10 18.5-18.4 15.1-13.4 25.1-24.6 30.4-34.2 5.4-9.7 8.1-20.4 8.1-31.9 0-19.9-7.7-37-23-50.9zM256.3 385.3c12.1 0 22-9.8 22-22 0-12.1-9.8-22-22-22-12.1 0-22 9.8-22 22s9.8 22 22 22z"></path>
                      <path d="M437.4 74.6C388.9 26.1 324.5-.5 256-.5S123.1 26.2 74.6 74.6C26.1 123.1-.5 187.5-.5 256s26.7 132.9 75.1 181.4c48.5 48.5 112.9 75.1 181.4 75.1s132.9-26.7 181.4-75.1c48.5-48.5 75.1-112.9 75.1-181.4s-26.6-132.9-75.1-181.4zm-22.6 340.2c-42.4 42.4-98.8 65.8-158.8 65.8s-116.4-23.4-158.8-65.8C54.8 372.4 31.5 316 31.5 256S54.8 139.6 97.2 97.2C139.6 54.8 196 31.5 256 31.5s116.4 23.4 158.8 65.8c42.4 42.4 65.8 98.8 65.8 158.8s-23.4 116.3-65.8 158.7z"></path>
                    </svg>
                    <Tooltip id="unit-tooltip" place="top" effect="solid">
                      The item will be measured in terms of <br /> this unit (e.g:kg,gm,dozen)
                    </Tooltip>

                    <Controller
                      name="unit"
                      control={control}
                      rules={{ required: 'Unit is required' }}
                      render={({ field }) => (
                        <DropdownButton
                          className="dropdowndesign"
                          id="dropdown-basic-button"
                          title={selectedItem || 'Select an Unit'}
                          variant="secondary"
                          {...field}
                        >
                          {unit && unit.length > 0 ? (
                            unit.map((item, index) => (
                              <Dropdown.Item key={index} as="div">
                                <span onClick={() => handleSelect(item)}>{item.un_name}</span>
                                <Button
                                  className="btn-delete "
                                  variant="danger"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation() // Prevent dropdown from closing
                                    setShowDeleteModal(item.un_id) // Show modal for deletion
                                  }}
                                >
                                  <FontAwesomeIcon
                                    className=""
                                    icon={faTrash}
                                    size="sm"
                                    color="red"
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => {
                                      e.stopPropagation() // Prevent dropdown from closing
                                      setShowDeleteModal(item.un_id) // Show modal for deletion
                                    }}
                                  />
                                </Button>
                              </Dropdown.Item>
                            ))
                          ) : (
                            <Dropdown.Item disabled>No units available</Dropdown.Item>
                          )}

                          <Dropdown.Divider />
                          <Dropdown.Item as="div" onClick={handleShowunit}>
                            <FontAwesomeIcon icon={faPlus} className="me-2" /> Add New Unit
                          </Dropdown.Item>
                        </DropdownButton>
                      )}
                    />

                    {errors.unit && <p className="text-danger">{errors.unit.message}</p>}
                  </div>
                </div>
              </Col>

              <Col md={6}>
                <div
                  {...getRootProps()}
                  style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '12px',
                    marginTop: '25px',
                    // width: '320px',
                    height: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    cursor: 'pointer',
                    transition: 'border 0.2s ease-in-out',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.border = '2px dashed #3b82f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.border = '2px dashed #d1d5db')}
                >
                  <input {...getInputProps()} />
                  <input type="hidden" {...register('image')} /> {/* Register hidden field */}
                  {image ? (
                    <>
                      <img
                        src={image}
                        alt="Uploaded"
                        style={{
                          width: '200px',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          marginBottom: '10px',
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage()
                        }}
                        style={{
                          backgroundColor: '#ef4444',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          marginBottom: '5px',
                        }}
                      >
                        Delete
                      </button>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#3b82f6' }}>
                        Click to change
                      </p>
                    </>
                  ) : (
                    <>
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/1829/1829586.png"
                        alt="Upload"
                        style={{
                          width: '150px',
                          height: '150px',
                          opacity: '0.7',
                          marginBottom: '10px',
                        }}
                      />
                      <p style={{ fontSize: '14px', marginBottom: '4px' }}>Drag image(s) here or</p>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#3b82f6' }}>
                        Browse images
                      </p>
                    </>
                  )}
                </div>

                {/* <button
                  type="submit"
                  style={{
                    marginTop: '15px',
                    backgroundColor: '#3b82f6',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  Submit
                </button> */}
                {!imagebinary && (
                  <div style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}>
                    ⚠ Please add an image before submitting!
                  </div>
                )}
              </Col>
            </Row>

            <Row className="mt-3">
              {/* Sales Information */}
              <Col md={6}>
                <Form.Check
                  type="checkbox"
                  label="Sales Information"
                  checked={isSalesEnabled}
                  onChange={(e) => setSalesEnabled(e.target.checked)}
                />
                <Form.Group className="mt-3">
                  <Form.Label>Selling Price*</Form.Label>
                  <Form.Control
                    step={0.5}
                    type="number"
                    placeholder="Enter selling price"
                    disabled={!isSalesEnabled}
                    min="0" // Prevents negative values
                    {...register('selling_price', {
                      required: 'selling price is required',
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: 'Price must be a number with up to 2 decimal places',
                      },
                      validate: (value) => (value >= 0 ? true : 'Price cannot be negative'),
                    })}
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e') e.preventDefault() // Prevent negative input and scientific notation
                    }}
                    onChange={(e) => {
                      if (e.target.value < 0) {
                        e.target.value = 0 // Force value to be positive
                      }
                    }}
                  />
                  {errors.selling_price && (
                    <p className="text-danger">{errors.selling_price.message}</p>
                  )}
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Account*</Form.Label>
                  <Form.Select disabled={!isSalesEnabled} {...register('sales_account')}>
                    <option value="Sales">Sales</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    disabled={!isSalesEnabled}
                    {...register('sales_description')}
                  />
                </Form.Group>
              </Col>

              {/* Purchase Information */}
              <Col md={6} className="mt-2">
                <Form.Check
                  type="checkbox"
                  label="Purchase Information"
                  checked={isPurchaseEnabled}
                  onChange={(e) => setPurchaseEnabled(e.target.checked)}
                />
                <Form.Group className="mt-3">
                  <Form.Label>Cost Price</Form.Label>
                  <Form.Control
                    type="number"
                    step={0.5}
                    min="0"
                    placeholder="Enter cost price"
                    disabled={!isPurchaseEnabled}
                    {...register('purchase_cost_price', {
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: 'Price must be a number with up to 2 decimal places',
                      },
                      validate: (value) => (value >= 0 ? true : 'Price cannot be negative'), // Extra validation
                    })}
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e') e.preventDefault() // Prevent negative input
                    }}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Account</Form.Label>

                  <Controller
                    name="purchase_account"
                    control={control}
                    // rules={{ required: 'Industry is required' }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={accountsList}
                        isClearable
                        isSearchable
                        placeholder="Select your Purchase Account "
                        classNamePrefix="react-select"
                        isDisabled={!isPurchaseEnabled}
                      />
                    )}
                  />
                  {errors.purchase_account && (
                    <p className="text-danger">{errors.purchase_account.message}</p>
                  )}
                  <button
                    className="btn btn-link mt-2 p-2 pe-2"
                    onClick={handleNewAccount}
                    style={{ color: '#007bff', textDecoration: 'underline' }}
                  >
                    + New Account
                  </button>

                  {/* </Form.Select> */}
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    disabled={!isPurchaseEnabled}
                    {...register('purchase_description')}
                  />
                </Form.Group>

                <Form.Group className="mt-3 mb-5">
                  <Form.Label>Preferred Vendor</Form.Label>
                  <Controller
                    name="preferred_vendor"
                    control={control}
                    rules={isPurchaseEnabled ? { required: 'Select Vendor name' } : {}}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={productsvendor}
                        isClearable
                        isSearchable
                        placeholder="Select a Vendor name"
                        classNamePrefix="react-select"
                        isDisabled={!isPurchaseEnabled} // Disable when isPurchaseEnabled is false
                      />
                    )}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* <Form.Check
              type="checkbox"
              label={
                <>
                  Track Inventory for this item{' '}
                  <span className="text-muted">
                    (You cannot enable/disable inventory tracking once you've created transactions
                    for this item)
                  </span>
                </>
              }
              checked={isTrackInventory}
              onChange={(e) => setIsTrackInventory(e.target.checked)}
              className="mb-3"
            />

            {isTrackInventory && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Inventory Account*</Form.Label>
                  <Controller
                    name="inventoryAccount"
                    control={control}
                    rules={{ required: 'Inventory Account is required' }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={accountOptions}
                        isClearable
                        isSearchable
                        placeholder="Select an account"
                        classNamePrefix="react-select"
                      />
                    )}
                  />
                  {errors.inventoryAccount && (
                    <p className="text-danger">{errors.inventoryAccount.message}</p>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Inventory Valuation Method*</Form.Label>
                  <Controller
                    name="valuationMethod"
                    control={control}
                    rules={{ required: 'Inventory Valuation Method is required' }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={valuationMethodOptions}
                        isClearable
                        isSearchable
                        placeholder="Select the valuation method"
                        classNamePrefix="react-select"
                      />
                    )}
                  />
                  {errors.valuationMethod && (
                    <p className="text-danger">{errors.valuationMethod.message}</p>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Opening Stock</Form.Label>
                  <Controller
                    name="openingStock"
                    control={control}
                    render={({ field }) => (
                      <Form.Control {...field} type="number" placeholder="Enter opening stock" />
                    )}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Opening Stock Rate per Unit</Form.Label>
                  <Controller
                    name="stockRatePerUnit"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        type="number"
                        placeholder="Enter stock rate per unit"
                      />
                    )}
                  />
                </Form.Group>
              </>
            )} */}

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Add Item'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal  add unit*/}
      <Modal show={showModaladdunit} onHide={handleCloseunit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Unit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmitunit(onSubmitunit)}>
            <div className="mb-3">
              <label htmlFor="unit_name" className="form-label">
                Unit Name
              </label>
              <input
                id="unit_name"
                className="form-control"
                {...registerUnit('unit_name', {
                  required: 'Unit Name is required',
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: 'Unit Name can only contain letters and spaces',
                  },
                })}
                placeholder="Enter Unit name"
              />
              {errorsunit.unit_name && (
                <p className="text-danger">{errorsunit.unit_name.message}</p>
              )}
            </div>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Add Unit'}
            </Button>
          </form>
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
        <Modal.Body>Are you sure you want to delete this Product?</Modal.Body>
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
  )
}

export default Products

import { faPlus, faEye, faEyeSlash, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import {
  Table,
  Badge,
  Button,
  Collapse,
  Form,
  Pagination,
  Modal,
  Spinner,
  Alert,
  InputGroup,
  FormControl,
} from 'react-bootstrap'
import '../Company/Company.css'
import { useForm, Controller } from 'react-hook-form'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import axios from 'axios'
const Company = () => {
  //list company

  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [limit] = useState(13) // Items per page
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  //modal................

  const [showModal, setShowModal] = useState(false)

  const handleShow = () => setShowModal(true)
  const handleClose = () => setShowModal(false)

  const [isLoading, setIsLoading] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [failureMessage, setFailureMessage] = useState('')
  const [showGSTInput, setShowGSTInput] = useState(false)
  const [showVATInput, setShowVATInput] = useState(false)
  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    console.log(data)
    setIsLoading(true)

    fetch('https://lunarsenterprises.com:5016/crm/client/client_register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => response.json()) // Parse the response JSON
      .then((result) => {
        const { message, result: apiResult } = result // Destructure result and message

        if (apiResult) {
          // If result is true, show success message and close modal
          console.log('Success:', message)
          setSuccessMessage(message)
          setShowModal(false)
          fetchProducts()
          setTimeout(() => setSuccessMessage(''), 5000) // Clear success message after 3 seconds
        } else {
          // If result is false, show error message
          console.error('Error:', message)
          setFailureMessage(message)
          setTimeout(() => setFailureMessage(''), 5000) // Clear error message after 3 seconds
        }

        setIsLoading(false) // Stop the loading state
      })
      .catch((error) => {
        // Handle network or unexpected errors
        console.error('Error:', error)
        setFailureMessage('An unexpected error occurred. Please try again.')
        setTimeout(() => setFailureMessage(''), 5000) // Clear error message after 3 seconds
        setIsLoading(false)
      })
  }

  // Watch the password field for confirm password validation
  const password = watch('password')

  //-----------list company

  const fetchProducts = async (page = 1, search = '') => {
    setLoading(true)
    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/client/client_list',
        {
          page_no: page,
          limit: limit,
          search: search,
        },
      )

      if (response.data.result === true) {
        setProducts(response.data.list)
        setTotalItems(response.data.total_count)
        setTotalPages(Math.ceil(response.data.total_count / limit))
        setCurrentPage(page)
      } else {
        console.error(response.data.message)
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
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

  useEffect(() => {
    fetchProducts()
  }, [])

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
        u_id: deleteEmpId,
      }
      const response = await axios.post('https://lunarsenterprises.com:5016/crm/delete/reg', del)

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

  return (
    <div>
      <div className="item-manager">
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
      </div>

      <div className="add-company mb-3">
        <Button variant="success" className="mb-3 " onClick={handleShow}>
          Client Register
        </Button>
      </div>

      {/* Modal     Add Company */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)} className="+">
            <div className="item-manager">
              {failureMessage && <Alert variant="danger">{failureMessage}</Alert>}
            </div>
            {/* Company Name */}
            <Form.Group className="mb-2" controlId="formCompanyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter company name"
                {...register('c_client_Companyname', {
                  // required: 'Company name is required',
                  minLength: { value: 3, message: 'Minimum length is 3' },
                  maxLength: { value: 200, message: 'Maximum length is 200' },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: 'Only letters and spaces are allowed',
                  },
                })}
              />
              {errors.c_client_Companyname && (
                <p className="text-danger">{errors.c_client_Companyname.message}</p>
              )}
            </Form.Group>

            {/* User Name */}
            <Form.Group className="mb-2" controlId="formFullName">
              <Form.Label>Client Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                {...register('c_clientname', {
                  required: 'Name is required',
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: 'Only letters and spaces are allowed',
                  },
                })}
              />
              {errors.c_clientname && <p className="text-danger">{errors.c_clientname.message}</p>}
            </Form.Group>

            <Form.Group className="mb-2" controlId="formFullName">
              <Form.Label>Client Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Project name"
                {...register('c_clientproject_name', {
                  required: 'Name is required',
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: 'Only letters and spaces are allowed',
                  },
                })}
              />
              {errors.c_clientproject_name && (
                <p className="text-danger">{errors.c_clientproject_name.message}</p>
              )}
            </Form.Group>

            {/* Company Email */}
            <Form.Group className="mb-2" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...register('c_email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.c_email && <p className="text-danger">{errors.c_email.message}</p>}
            </Form.Group>

            <Form.Label>GST and VAT (Optional)</Form.Label>

            {/* GST Checkbox */}
            <Form.Group className="mb-2" controlId="formGST">
              <Form.Check
                type="checkbox"
                label="GST"
                onChange={(e) => setShowGSTInput(e.target.checked)}
              />
            </Form.Group>

            {/* GST Input */}
            {showGSTInput && (
              <Form.Group className="mb-2" controlId="formGSTNumber">
                <Form.Label>GST Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter GST number"
                  {...register('gst_number', {
                    required: 'GST number is required',
                  })}
                />
                {errors.gst_number && <p className="text-danger">{errors.gst_number.message}</p>}
              </Form.Group>
            )}

            {/* VAT Checkbox */}
            <Form.Group className="mb-2" controlId="formVAT">
              <Form.Check
                type="checkbox"
                label="VAT"
                onChange={(e) => setShowVATInput(e.target.checked)}
              />
            </Form.Group>

            {/* VAT Input */}
            {showVATInput && (
              <Form.Group className="mb-2" controlId="formVATNumber">
                <Form.Label>VAT Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter VAT number"
                  {...register('vat_number', {
                    required: 'VAT number is required',
                  })}
                />
                {errors.vat_number && <p className="text-danger">{errors.vat_number.message}</p>}
              </Form.Group>
            )}

            {/* Company Mobile */}
            <Form.Group className="mb-2" controlId="c_ph">
              <Form.Label>Phone Number</Form.Label>
              <Controller
                name="c_ph"
                control={control}
                defaultValue=""
                rules={{
                  required: 'Phone number is required',
                }}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    country="in"
                    inputStyle={{ height: '40px', width: '100%' }}
                    placeholder="Enter phone number"
                  />
                )}
              />
              {errors.c_ph && <p className="text-danger">{errors.c_ph.message}</p>}
            </Form.Group>

            <Form.Group className="mb-2" controlId="formFullName">
              <Form.Label>Client Budget</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Budget"
                {...register('c_budget', {
                  required: 'Budget is required',
                  pattern: {
                    value: /^[0-9]+(\.[0-9]{1,2})?$/, // Allows numbers with an optional decimal point
                    message: 'Only numbers and a decimal point are allowed (max two decimals)',
                  },
                })}
              />
              {errors.c_budget && <p className="text-danger">{errors.c_budget.message}</p>}
            </Form.Group>

            <Form.Group className="mb-2" controlId="c_date">
              <Form.Label>Project Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter Project  closing Date"
                {...register('c_date', {
                  required: 'Date is required',
                })}
              />
              {errors.c_date && <p className="text-danger">{errors.c_date.message}</p>}
            </Form.Group>

            <Form.Group className="mb-2" controlId="c_project_deliverydate">
              <Form.Label>Project Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter Project Delivery Date"
                {...register('c_project_deliverydate', {
                  required: 'Date is required',
                })}
              />
              {errors.c_project_deliverydate && (
                <p className="text-danger">{errors.c_project_deliverydate.message}</p>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          {/* Submit Button */}
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="d-flex align-items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Registering...
              </>
            ) : (
              'Register'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="row mb-3">
        <div className="col-md-6">
          <InputGroup className="">
            <FormControl
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
        </div>
        {/* <div className="col-md-6 d-flex">
          <Form.Control
            type="date"
            placeholder="Start date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="me-2"
          />
          <Form.Control
            type="date"
            placeholder="End date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div> */}
      </div>
      <div>
        <Table striped bordered hover responsive className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Company Name</th>
              <th>Name</th>
              <th>Project Name</th>
              <th>Gst Number/Vat Number</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Budget</th>

              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((item, index) => (
                <tr key={item.i_id}>
                  <td>{(currentPage - 1) * limit + index + 1}</td>
                  <td>{item.c_client_Companyname || 'Lunar'}</td>
                  <td>{item.c_clientname || 'ABC'}</td>
                  <td>{item.c_clientproject_name || 'Website'}</td>
                  <td>{item.gst_number || item.vat_number || '1234567890'}</td>


                  <td>{item.c_email || 'lunar@gmail.com'}</td>
                  <td>{item.c_ph || '047122334455'}</td>
                  <td>{item.c_budget || '45000'}</td>

                  <td>{item.c_date || '01/01/2025'}</td>
                  <td>{item.c_project_deliverydate || '05/03/2025'}</td>
                  
                  <td className="btn-deleteview">
                    <Button
                      className="btn-deletelist"
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteConfirmation(item.u_id)
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        size="sm"
                        color="red"
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation() // Prevent dropdown from closing
                          handleDeleteConfirmation(item.u_id) // Show modal for deletion
                        }}
                      />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No products found
                </td>
              </tr>
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
      {/* Delete Confirmation Modal compamy */}
      <Modal show={showDeleteModallist} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Company?</Modal.Body>
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

export default Company

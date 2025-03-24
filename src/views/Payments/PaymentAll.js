import React, { useEffect, useState } from 'react'
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
} from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import axios from 'axios'
import '../pages/Products/Products.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faDownload, faFilePdf, faTrash } from '@fortawesome/free-solid-svg-icons'

const PaymentAll = () => {
  const [Productlist, setProductlist] = useState([]) // Product list
  const [serviceToDelete, setServiceToDelete] = useState(null)
  const [showModal, setShowModal] = useState(false) // Modal state
  const [successMessage, setSuccessMessage] = useState('') // Success message

  const [showModaladdunit, setShowModaladdunit] = useState(false) // Modal state

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm()

  // Show/Hide modal handlers
  const handleShow = () => setShowModal(true)
  const handleClose = () => {
    reset()
    setShowModal(false)
  }

  // Form submission
  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await axios.post('https://lunarsenterprises.com:5016/crm/item/add', data)
      if (response.data.result) {
        setSuccessMessage(response.data.message)
        fetchProducts(currentPage) // Refresh product list
        handleClose() // Close modal
        setTimeout(() => setSuccessMessage(''), 3000) // Clear success message after 3 seconds
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      console.error('Error adding item:', error)
    } finally {
      setLoading(false)
    }
  }

  //  // Delete Event

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const deleteEvent = async () => {
    if (!showDeleteModal) return // Check if a unit ID is selected
    try {
      const token = sessionStorage.getItem('user_token')
      await axios.post(
        'https://lunarsenterprises.com:5016/crm/unit-delete',
        { u_id: showDeleteModal },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
      const response = await axios.post('https://lunarsenterprises.com:5016/crm/unit-list')

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

  const [inputs, setInputs] = useState([{ id: Date.now(), subtitle: '' }]);
  const handleAddInput = () => {
    setInputs([...inputs, { id: Date.now(), subtitle: '' }]);
  };

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

      const formData = new FormData();
      formData.append('py_clientname', data.py_clientname);

      inputs.forEach((input, index) => {
        if (data[`image_${input.id}`]) {
          formData.append(`image_${index + 1}`, data[`image_${input.id}`][0]);
          formData.append(`subtitle_${index + 1}`, input.subtitle);
        }
      });
      
      const response = await axios.post('https://lunarsenterprises.com:5016/crm/unit/add', data)
      if (response.data.result) {
        setSuccessMessage(response.data.message)
        // handleCloseunit() // Close modal
        resetunit()
        Unitapi()

        alert('Images uploaded successfully');
        reset();
        // handleClose();
        setInputs([{ id: Date.now(), subtitle: '' }]);
        setTimeout(() => setSuccessMessage(''), 3000) // Clear success message after 3 seconds
      } else {
        alert(response.data.message)
        alert('Upload failed');
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
  const fetchProducts = async (page = 1, search = '') => {
    setLoading(true)
    try {
      const response = await axios.post('https://lunarsenterprises.com:5016/crm/payment/list', {
        page_no: page,
        limit: limit,
        search: search,
      })

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
        i_id: deleteEmpId,
      }
      const response = await axios.post('https://lunarsenterprises.com:5016/crm/item/delete', del)

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
    <div className="item-manager">
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <div>
        <Button variant="success" className="mb-3" onClick={handleShow}>
          Add Item
        </Button>

        <Button variant="success" className="mb-3 ms-3" onClick={handleShowunit}>
          Add unit
        </Button>
      </div>
      <div className="  col-12 ">
        <div className="row ">
          <div className="col-6 ">
            <InputGroup className="">
              <FormControl
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </InputGroup>
          </div>
          <div className="col-6 ">
            <div className="">
              {/* <FontAwesomeIcon icon={faFilePdf} size="2x" color="red" className="me-4" /> */}
              <FontAwesomeIcon icon={faDownload} size="2x" color="blue" className="" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Table striped bordered responsive hover className="mt-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Client Name</th>
              <th>Project Name</th>
              <th>Payment Method</th>
              <th>Advance Amount</th>
              <th>Balance Amount</th>
              <th>Transaction Proof</th>
              <th>Payment Status</th>
              <th> Total Amount</th>
              <th>Action</th>
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
                  <td>{item.client_name}</td>
                  <td>{item.py_pro_name}</td>
                  <td>{item.py_method}</td>
                  <td>{item.py_adv_amount}</td>
                  <td>{item.py_balance_amount}</td>
                  <td>{item.py_trans_image}</td>
                  <td>{item.py_payment_status}</td>
                  <td>{item.py_total_amount}</td>
                  {/* <td className={`${item.i_price === 5 ? 'credit' : 'debit'}`}>{item.i_price}</td> */}
                  <td className="btn-deleteview">
                    <Button
                      className="btn-deletelist"
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteConfirmation(item.i_id)
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        size="sm"
                        color="red"
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation() // Prevent dropdown from closing
                          handleDeleteConfirmation(item.i_id) // Show modal for deletion
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

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="py_clientname" className="form-label">
                Name
              </label>
              <input
                id="py_clientname"
                className="form-control"
                {...register('py_clientname', {
                  required: 'Name is required',
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: 'Name can only contain letters and spaces',
                  },
                })}
                placeholder="Enter Client Name"
              />
              {errors.py_clientname && (
                <p className="text-danger">{errors.py_clientname.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="py_pro_name" className="form-label">
                Project Name
              </label>
              <input
                id="py_pro_name"
                className="form-control"
                {...register('py_pro_name', {
                  required: 'Name is required',
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: 'Name can only contain letters and spaces',
                  },
                })}
                placeholder="Enter   Project Name"
              />
              {errors.py_pro_name && <p className="text-danger">{errors.py_pro_name.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="py_adv_amount" className="form-label">
                Advance Amount
              </label>
              <input
                id="py_adv_amount"
                type="number"
                step="0.01"
                className="form-control"
                {...register('py_adv_amount', {
                  required: 'Price is required',
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Price must be a number with up to 2 decimal places',
                  },
                })}
                placeholder="Enter Advance amount"
              />
              {errors.py_adv_amount && (
                <p className="text-danger">{errors.py_adv_amount.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="py_balance_amount" className="form-label">
                Balance Amount
              </label>
              <input
                id="py_balance_amount"
                type="number"
                step="0.01"
                className="form-control"
                {...register('py_balance_amount', {
                  required: 'Price is required',
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Price must be a number with up to 2 decimal places',
                  },
                })}
                placeholder="Enter Balance Amount"
              />
              {errors.py_balance_amount && (
                <p className="text-danger">{errors.py_balance_amount.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="py_total_amount" className="form-label">
                Total Amount
              </label>
              <input
                id="py_total_amount"
                type="number"
                step="0.01"
                className="form-control"
                {...register('py_total_amount', {
                  required: 'Price is required',
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Price must be a number with up to 2 decimal places',
                  },
                })}
                placeholder="Enter Total Amount "
              />
              {errors.py_total_amount && (
                <p className="text-danger">{errors.py_total_amount.message}</p>
              )}
            </div>

          


            {inputs.map((input, index) => (
            <div key={input.id} className="mb-3">
              <label className="form-label">Upload Image: {`Payment ${index + 1}`}</label>
              <input
                type="file"
                className="form-control"
                {...register(`image_${input.id}`, { required: 'Image is required' })}
              />
              {errors[`image_${input.id}`] && <p className="text-danger">{errors[`image_${input.id}`].message}</p>}
              <input
                type="text"
                className="form-control mt-2"
                placeholder={`Subtitle for Payment ${index + 1}`}
                value={input.subtitle}
                onChange={(e) => {
                  const newInputs = [...inputs];
                  newInputs[index].subtitle = e.target.value;
                  setInputs(newInputs);
                }}
              />
            </div>
          ))}

          <Button variant="secondary" onClick={handleAddInput} className="mb-3">Add Another Image</Button>





            <div className="mb-3">
              <label htmlFor="py_payment_status" className="form-label">
                Payment Status
              </label>
              <input
                id="py_payment_status"
                className="form-control"
                {...register('py_payment_status', {
                  required: 'Status is required',
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: 'Name can only contain letters and spaces',
                  },
                })}
                placeholder="Enter Payment Status"
              />
              {errors.py_payment_status && (
                <p className="text-danger">{errors.py_payment_status.message}</p>
              )}
            </div>

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

      {/* Delete Confirmation Modal */}
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

export default PaymentAll

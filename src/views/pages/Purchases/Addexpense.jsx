import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import Select from 'react-select'
import '../Sales/Customers.css'
import {
  Form,
  Row,
  Col,
  Button,
  Tab,
  Tabs,
  Table,
  DropdownButton,
  Dropdown,
  Modal,
  Spinner,
  InputGroup,
} from 'react-bootstrap'
import axios from 'axios'
import Examclination from '../../../assets/images/exclamation.png'
import Tick from '../../../assets/images/Tick.png'
import { useDropzone } from 'react-dropzone'
import moment from 'moment'

const paymentexpensive = [
  { value: 'Google Pay', label: 'Google Pay' },
  { value: 'Bank', label: 'Bank' },
  { value: 'cash', label: 'cash' },
]

const paymentexpensiveacc = [
  { value: 'Trust', label: 'Trust' },
  { value: 'Bank', label: 'Bank' },
  { value: 'cash', label: 'cash' },
]

const Addexpense = () => {
  const user_id = sessionStorage.getItem('user_id')
  const [loader, setLoader] = useState(false)
  const [imagebinary, setImagebinary] = useState(null)

  const token = sessionStorage.getItem('token')

  const [showModal, setShowModal] = useState(false)
  const handleClose = () => setShowModal(false)
  const [modalMessage, setModalMessage] = useState('')
  const [products, setProducts] = useState([])

  const [productscustm, setProductscustm] = useState([])

  useEffect(() => {
    fetchProducts()
    productscustmer()
  }, [])

  // Fetch Products
  const fetchProducts = async () => {
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
        const mappedProducts = response?.data.list.map((customer) => ({
          value: customer.ve_id,
          // You can choose the label format you want
          label:
            `${customer.ve_salutation} ${customer.ve_first_name} ${customer.ve_last_name}`.trim(),
        }))
        setProducts(mappedProducts)
      } else {
        console.error(response.data.message) // Log API error messages
        setProducts([]) // Clear the product list if no data is found
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const productscustmer = async () => {
    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/list/customers',
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
        const mappedProducts = response?.data.list.map((customer) => ({
          value: customer.cu_id,
          // You can choose the label format you want
          label:
            `${customer.cu_salutation} ${customer.cu_first_name} ${customer.cu_last_name}`.trim(),
        }))
        setProductscustm(mappedProducts)
      } else {
        console.error(response.data.message) // Log API error messages
        setProductscustm([]) // Clear the product list if no data is found
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      files: [],
    },
  })

  const contacts = watch('contacts') // Watching for changes

  const handleUpdate = (index, field, value) => {
    const updatedContacts = [...contacts]
    updatedContacts[index][field] = value
    setValue('contacts', updatedContacts) // Ensures the field updates in React Hook Form
  }

  const onSubmit = async (data) => {
    setLoader(true)

    // setContacts([...contacts, data])

    console.log('dataaaaa', data)

    try {
      const formData = new FormData()

      // If you have multiple images (e.g., from a file input or dropzone) in data.images:
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append('image', file)
        })
      }

      // Or, if you want to append a selectedFile (if present):
      // if (selectedFile) {
      //   formData.append('image', selectedFile)
      // }

      // Append individual customer data fields
      formData.append('ep_employee_id', user_id)

      // formData.append("ep_date", formatDate(data.ep_date));
      // console.log("Formatted Date:", );

      formData.append('ep_date', data.ep_date)
      formData.append('ep_currency', data.ep_currency)

      if (data.ep_customer_name) {
        formData.append('ep_customer_name', data.ep_customer_name.label) // Append customer name
        formData.append('ep_customer_id', data.ep_customer_name.value) // Append customer ID from selected object
      }

      formData.append('ep_expense_account', data.ep_expense_account.label)
      formData.append('ep_amount', data.ep_amount)

      if (data.ep_paid_through) {
        formData.append('so_payment_terms', data.ep_paid_through.label)
      }

      if (data.ep_vendor_name) {
        formData.append('ep_vendor_name', data.ep_vendor_name.label) // Append vendor name
        formData.append('ep_vendor_id', data.ep_vendor_name.value) // Correctly get the vendor ID
      }

      formData.append('ep_invoice', data.ep_invoice)

      formData.append('ep_notes', data.ep_notes)

      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/add/expenses',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )

      if (response.data.result === true) {
        reset({
          ep_vendor_name: null, // Resetting react-select fields
          ep_customer_name: null,
          ep_paid_through: null,
          ep_expense_account: null,
          ep_date: '',
          ep_amount: '',
          ep_invoice: '',
          ep_notes: '',
          files: [], // Reset file uploads
        })

        console.log('Success:', response.data)
        setModalMessage({
          type: 'success',
          message: response.data.message,
        })
        setShowModal(true)

        setTimeout(() => {
          setShowModal(false)
        }, 3000)
      } else {
        console.warn('Failed:', response.data.message)
        setModalMessage({
          type: 'fail',
          message: response.data.message,
        })
        setShowModal(true)

        setTimeout(() => {
          setShowModal(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Submission Error:', error)
      setModalMessage({
        type: 'fail',
        message: 'Something went wrong. Please try again.',
      })
      setShowModal(true)

      setTimeout(() => {
        setShowModal(false)
      }, 3000)
    } finally {
      setLoader(false)
    }
  }

  //-----------------imgupload
  const [uploadedFiles, setUploadedFiles] = useState([])

  // onDrop now accepts multiple files.
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Map acceptedFiles to an object that includes preview for images.
      const newFiles = acceptedFiles.map((file) => {
        // If file is an image, create a preview URL.
        let preview = ''
        if (file.type.startsWith('image/')) {
          preview = URL.createObjectURL(file)
        }
        return { file, preview }
      })

      // Update state with new files.
      setUploadedFiles((prevFiles) => {
        const updatedFiles = [...prevFiles, ...newFiles]
        // Also update the form value.
        setValue(
          'files',
          updatedFiles.map((f) => f.file),
        )
        return updatedFiles
      })
    },
    [setValue],
  )

  // Configure dropzone to accept images and PDFs.
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
      'application/pdf': [],
    },
    multiple: true,
    onDrop,
  })

  // Remove a file from the list.
  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index)
      setValue(
        'files',
        updatedFiles.map((f) => f.file),
      )
      return updatedFiles
    })
  }

  // Watch the form's file field (optional)
  const files = watch('files')
  // -----------------------

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
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
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h4> Add New Expenses</h4>

        <Row>
          <Col md={6}>
            <Form.Group controlId="ep_vendor_name" className="mt-2">
              <Form.Label>Vendor Name*</Form.Label>
              <Controller
                name="ep_vendor_name"
                control={control}
                rules={{ required: 'Select Vendor' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={products}
                    isClearable
                    isSearchable
                    placeholder="Select Vendor"
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.ep_vendor_name && (
                <p className="text-danger">{errors.ep_vendor_name.message}</p>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="ep_expense_account" className="mt-2">
              <Form.Label>Expense Account*</Form.Label>
              <Controller
                name="ep_expense_account"
                control={control}
                rules={{ required: 'Expense Account' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={paymentexpensiveacc}
                    isClearable
                    isSearchable
                    placeholder="Expense Account"
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.ep_expense_account && (
                <p className="text-danger">{errors.ep_expense_account.message}</p>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Amount*</Form.Label>

              <InputGroup>
                {/* Dropdown */}
                <Form.Select
                  {...register('ep_currency', { required: 'Currency is required' })}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Currency
                  </option>
                  <option value="AED">AED</option>
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </Form.Select>

                {/* Input Field */}
                <Form.Control
                  type="number"
                  min={0}
                  step={0.05}
                  placeholder="Enter amount"
                  {...register('ep_amount', {
                    required: 'Amount is required',
                    min: { value: 0, message: 'Amount must be at least 0' },
                  })}
                />
              </InputGroup>
            </Form.Group>
            <div className='text-danger d-flex justify-content-between'>
            {errors.ep_currency && <p className="text-danger">{errors.ep_currency.message}</p>}

            {errors.ep_amount && <p className="text-danger">{errors.ep_amount.message}</p>}
            </div>
          </Col>

          <Col md={6}>
            <Form.Group controlId="so_payment_terms" className="mt-2">
              <Form.Label>Paid Through *</Form.Label>
              <Controller
                name="so_payment_terms"
                control={control}
                rules={{ required: 'Paid Through' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={paymentexpensive}
                    isClearable
                    isSearchable
                    placeholder="Paid Through"
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.so_payment_terms && (
                <p className="text-danger">{errors.so_payment_terms.message}</p>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Date*</Form.Label>
              <Form.Control
                type="date"
                {...register('ep_date', { required: 'Date is required' })}
              />
            </Form.Group>
            {errors.ep_date && <p className="text-danger">{errors.ep_date.message}</p>}
          </Col>

          <Col md={6}>
            <Form.Group controlId="industries" className="mt-2">
              <Form.Label>Customer Name*</Form.Label>
              <Controller
                name="ep_customer_name"
                control={control}
                rules={{ required: 'Select Customer' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={productscustm}
                    isClearable
                    isSearchable
                    placeholder="Select Customer"
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.ep_customer_name && (
                <p className="text-danger">{errors.ep_customer_name.message}</p>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea" // Converts input to a textarea
                rows={3} // Sets it to 3 lines
                {...register('ep_notes')}
              />
            </Form.Group>
            {errors.ep_notes && <p className="text-danger">{errors.ep_notes.message}</p>}
          </Col>
        </Row>

        {/* File Upload Section */}
        <Form.Label>Add Image / PDF</Form.Label>
        <Col md={6}>
          <div
            {...getRootProps()}
            style={{
              border: '2px dashed #d1d5db',
              borderRadius: '12px',
              marginTop: '25px',
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
            <div className=" imagescroll">
              <input {...getInputProps()} />
              {/* Hidden input to register the field */}
              <input type="hidden" {...register('files')} />
              {uploadedFiles.length > 0 ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '10px',
                      justifyContent: 'center',
                    }}
                  >
                    {uploadedFiles.map((fileObj, index) => (
                      <div
                        key={index}
                        style={{
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          padding: '5px',
                          textAlign: 'center',
                        }}
                      >
                        {fileObj.preview ? (
                          <img
                            src={fileObj.preview}
                            alt={`Uploaded ${index}`}
                            style={{
                              width: '150px',
                              height: '150px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#f0f0f0',
                              borderRadius: '8px',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '150px',
                              height: '150px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#f0f0f0',
                              borderRadius: '8px',
                            }}
                          >
                            <p>PDF File</p>
                          </div>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile(index)
                          }}
                          style={{ marginTop: '5px' }}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#3b82f6',
                      marginTop: '10px',
                      textAlign: 'center',
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
                      width: '150px',
                      height: '150px',
                      opacity: '0.7',
                      marginBottom: '10px',
                    }}
                  />
                  <p style={{ fontSize: '14px', marginBottom: '4px' }}>Drag files here or</p>
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#3b82f6',
                    }}
                  >
                    Browse files
                  </p>
                </>
              )}
            </div>
            {uploadedFiles.length === 0 && (
              <div
                style={{
                  color: 'red',
                  marginTop: '8px',
                  fontSize: '14px',
                }}
              >
                ⚠ Please add an image or PDF before submitting!
              </div>
            )}
          </div>
        </Col>

        <div className="text-center mb-5 ">
          <Button disabled={loader} variant="success" type="submit" className="w-100 mt-3">
            {loader ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Save & Continue ...
              </>
            ) : (
              'Save & Continue'
            )}
          </Button>
        </div>
      </Form>
    </>
  )
}

export default Addexpense

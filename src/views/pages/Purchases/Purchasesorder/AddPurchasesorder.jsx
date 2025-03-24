import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import Select from 'react-select'
import '../../Sales/Customers.css'
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
} from 'react-bootstrap'
import axios from 'axios'
import Examclination from '../../../../assets/images/exclamation.png'
import Tick from '../../../../assets/images/Tick.png'
import { useDropzone } from 'react-dropzone'

import moment from 'moment'
import { POuseSales } from './AddContextPurchasesorder'
import TablePurchasesorder from './AddTablePurchasesorder'
import { FaLink } from 'react-icons/fa'

const AddPurchasesorder = () => {
  const {
    accountType,
    productsitem,
    data,
    commissionOptions,
    shipping,
    selectedCommission,
    adjustment,
    subTotal,
    commissionAmount,
    totalAmount,
    productslist,
    setProductslist,

    bankdetails,
    Products,
    handleDeleteitem,
    handleCalculate,
  } = POuseSales()

  useEffect(() => {
    Products()
  }, [])
  const sales_order_items = data.map((row) => {
    const itemObject = typeof row.item === 'object' && row.item !== null

    const product = itemObject ? row.item : productslist.find((prod) => prod.value === row.item)

    const itemObjectac = typeof row.ac === 'object' && row.ac !== null

    const productac = itemObject ? row.ac : bankdetails.find((prod) => prod.value === row.ac)

    return {
      is_item_name: product ? product.label : row.item,
      is_item_id: itemObject ? row.item.value : row.item,
      is_item_account_name: productac ? productac.label : row.ac,
      is_item_account_id: itemObjectac ? row.item.value : row.ac,
      is_quantity: row.quantity,
      is_rate: row.rate.toFixed(2),
      is_discount: String(row.discount),
      is_amount: row.amount,
    }
  })

  console.log(sales_order_items, 'dhfbdshfbhbgf')

  const user_id = sessionStorage.getItem('user_id')
  const [loader, setLoader] = useState(false)
  const [imagebinary, setImagebinary] = useState(null)

  const token = sessionStorage.getItem('token')

  const [showModal, setShowModal] = useState(false)
  const handleClose = () => setShowModal(false)
  const [modalMessage, setModalMessage] = useState('')

  useEffect(() => {
    fetchProducts()
    fetchProductsvendor()
  }, [])

  // Fetch Products
  const fetchProducts = async () => {
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
        const mappedProducts = response.data.list.map((customer) => ({
          value: customer.cu_id,
          // You can choose the label format you want
          label:
            `${customer.cu_salutation} ${customer.cu_first_name} ${customer.cu_last_name}`.trim(),
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

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: 'contacts',
  // })

  const contacts = watch('contacts') // Watching for changes
  const orderDate = watch('po_order_date') // Watching order date for comparison

  const handleUpdate = (index, field, value) => {
    const updatedContacts = [...contacts]
    updatedContacts[index][field] = value
    setValue('contacts', updatedContacts) // Ensures the field updates in React Hook Form
  }

  const onSubmit = async (data) => {
    setLoader(true)

    // setContacts([...contacts, data])

    console.log(data, files)

    try {
      const formData = new FormData()

      // If you have multiple images (e.g., from a file input or dropzone) in data.images:
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append('image', file)
        })
      }

      formData.append('user_id', user_id)
      formData.append('po_tax_name', selectedCommission.label)
      formData.append('po_tax', selectedCommission.rate)
      if (data.po_delivery_customer_name) {
        formData.append('po_delivery_customer_name', data.po_delivery_customer_name.label)
        formData.append('po_delivery_customer_id', data.po_delivery_customer_name.value)
      }

      if (data.po_vendor_name) {
        formData.append('po_vendor_name', data.po_vendor_name.label)
        formData.append('po_vendor_id', data.po_vendor_name.value) // Corrected this line
      }

      formData.append('so_sales_order_id', data.so_sales_order_id)
      formData.append('po_reference', data.po_reference)

      formData.append('po_order_date', data.po_order_date)

      formData.append('po_delivery_date', data.po_delivery_date)

      if (data.po_payment_terms) {
        formData.append('po_payment_terms', data.po_payment_terms.label)
      }
      if (data.po_shipment_preference) {
        formData.append('po_shipment_preference', data.po_shipment_preference.label)
      }

      formData.append('po_delivery_addr_option', data.po_delivery_addr_option)
      formData.append('po_delivery_address', data.po_delivery_address)

      formData.append('po_customer_notes', data.po_customer_notes)

      formData.append('so_shipping_charge', shipping)

      formData.append('po_adjustment', adjustment)
      formData.append('po_tds_tcs', accountType)
      formData.append('po_total_amount', totalAmount)
      formData.append('po_terms_condition', data.po_terms_condition)

      formData.append('purchase_order_items', JSON.stringify(sales_order_items))

      console.log([...formData]) // Logs all FormData entries for verification

      // Send the form data to the server
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/add/purchase-order',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )

      if (response.data.result === true) {
        console.log('Success:', response.data)
        setModalMessage({
          type: 'success',
          message: response.data.message,
        })
        setShowModal(true)
        reset() // Clear form after adding
        setTimeout(() => {
          setShowModal(false)
          navigate('/dashboard') // Change to your success page
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

  const [isSameAddress, setIsSameAddress] = useState(false)

  const handleSameAddressChange = () => {
    setIsSameAddress(!isSameAddress)
  }

  // const [contacts, setContacts] = useState([])

  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const [contactPersons, setContactPersons] = useState([
    {
      Salutation: 'Mr.',
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john@example.com',
      WorkPhone: '1234567890',
      Mobile: '9876543210',
    },
  ])

  const handleAdd = () => {
    setContactPersons([
      ...contactPersons,
      { Salutation: '', FirstName: '', LastName: '', Email: '', WorkPhone: '', Mobile: '' },
    ])
  }

  const handleRemove = (index) => {
    const updatedContacts = contactPersons.filter((_, i) => i !== index)
    setContactPersons(updatedContacts)
  }

  const handleChange = (index, field, value) => {
    const updatedContacts = [...contactPersons]
    updatedContacts[index][field] = value
    setContactPersons(updatedContacts)
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

  const industriesOptions = [
    { value: '  Net 15', label: '  Net 15' },
    { value: '  Net 30', label: '  Net 30' },
    { value: 'Due end of the month', label: ' Due end of the month ' },
  ]

  const SalesPerson = [
    { value: 'Cryil', label: ' Cryil' },
    { value: 'Antony', label: 'Antony' },
    { value: 'Kavya', label: ' Kavya ' },
  ]
  const Deliverymethod = [
    { value: 'Online', label: 'Online' },
    { value: 'Hand Over', label: 'Hand Over' },
  ]

  const [products, setProducts] = useState([])

  //---------------draggable

  // const { control, register, setValue, watch } = useForm();
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Jaison',
      sku: '22',
      description: 'Good',
      quantity: 1,
      rate: 300,
      discount: 0,
      stock: '100 kg',
    },
    { id: 2, name: '', sku: '', description: '', quantity: 1, rate: 0, discount: 0, stock: '' },
    { id: 3, name: '', sku: '', description: '', quantity: 1, rate: 0, discount: 0, stock: '' },
  ])

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleDragEnd = (newList) => {
    setItems(newList)
  }

  const [selectedType, setSelectedType] = useState('organization')

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
        <h4>Add Purchase Order</h4>

        <Row>
          <Col md={6}>
            <Form.Group controlId="industries" className="mt-2">
              <Form.Label>Vendor Name*</Form.Label>
              <Controller
                name="po_vendor_name"
                control={control}
                rules={{ required: 'Select Vendor name' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={productsvendor}
                    isClearable
                    isSearchable
                    placeholder="Select a Vendor name"
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.po_vendor_name && (
                <p className="text-danger">{errors.po_vendor_name.message}</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="po_payment_terms" className="mt-2">
              <Form.Label>Payment Terms</Form.Label>
              <Controller
                name="po_payment_terms"
                control={control}
                rules={{ required: 'Due On  Receipt' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={industriesOptions}
                    isClearable
                    isSearchable
                    placeholder="Due On  Receipt"
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.po_payment_terms && (
                <p className="text-danger">{errors.po_payment_terms.message}</p>
              )}
            </Form.Group>
          </Col>
        </Row>
        {/* <div className="delivery-address-container">
      <p className="label">Delivery Address*</p>
      <div className="d-flex align-items-center">
        <Form.Check
          type="radio"
          id="organization"
          label="Organization"
          name="deliveryType"
          checked={selectedType === "Organization"}
          onChange={() => setSelectedType("Organization")}
          className="me-3"
        />
        <Form.Check
          type="radio"
          id="customer"
          label="Customer"
          name="deliveryType"
          checked={selectedType === "Customer"}
          onChange={() => setSelectedType("Customer")}
        />
      </div>

      <div className="customer-info">
        <span className="customer-name">rahillunar123</span>
        <FaLink className="link-icon" />
      </div>

      <div className="address-details">
        <p>tc/23 trivandrum</p>
        <p>test, Kerala</p>
        <p>India, 695572</p>
        <p>7034500199</p>
      </div>

      <p className="change-destination">Change destination to deliver</p>
    </div> */}

        <Col md={6}>
          <Form.Group className="mt-2">
            <p className="label">Delivery Address*</p>

            {/* Radio Buttons for Organization or Customer Selection */}
            <div className="d-flex align-items-center mb-2">
              <Form.Check
                type="radio"
                id="organization"
                label="Organization"
                name="deliveryType"
                checked={selectedType === 'organization'}
                onChange={() => setSelectedType('organization')}
                className="me-3"
              />
              <Form.Check
                type="radio"
                id="customer"
                label="Customer"
                name="deliveryType"
                checked={selectedType === 'customer'}
                onChange={() => setSelectedType('customer')}
              />
            </div>

            {/* Show Customer Select Dropdown when "Customer" is selected */}
            {selectedType === 'customer' && (
              <>
                {' '}
                <Controller
                  name="po_delivery_customer_name"
                  control={control}
                  rules={{ required: 'Select  a Customer' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={products}
                      isClearable
                      isSearchable
                      placeholder="Select  a Customer"
                      classNamePrefix="react-select"
                    />
                  )}
                />
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter Customer Address"
                  {...control.register('po_delivery_address', {
                    required: 'Customer address is required',
                    pattern: {
                      value: /^[A-Za-z0-9\s,.-]+$/, // Allows letters, numbers, spaces, comma, period, and hyphen
                      message:
                        'Only letters, numbers, spaces, comma, period, and hyphen are allowed',
                    },
                  })}
                />
              </>
            )}

            {/* Show Organization Name Input when "Organization" is selected */}
            {selectedType === 'organization' && (
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter Organization Address"
                {...control.register('po_delivery_addr_option', {
                  required: 'Customer address is required',
                  pattern: {
                    value: /^[A-Za-z0-9\s,.-]+$/, // Allows letters, numbers, spaces, comma, period, and hyphen
                    message: 'Only letters, numbers, spaces, comma, period, and hyphen are allowed',
                  },
                })}
              />
            )}

            {/* Error Messages */}
            {errors.po_delivery_address && selectedType === 'customer' && (
              <p className="text-danger">{errors.po_delivery_address.message}</p>
            )}
            {errors.po_delivery_addr_option && selectedType === 'organization' && (
              <p className="text-danger">{errors.po_delivery_addr_option.message}</p>
            )}
          </Form.Group>
        </Col>

        <Row>
          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Order Date*</Form.Label>
              <Form.Control
                type="date"
                {...register('po_order_date', { required: 'Sales Order Date is required' })}
              />
            </Form.Group>
            {errors.po_order_date && <p className="text-danger">{errors.po_order_date.message}</p>}
          </Col>

          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Delivery date</Form.Label>
              <Form.Control
                type="date"
                {...register('po_delivery_date', {
                  required: 'Delivery Date is required',
                  validate: (value) =>
                    !orderDate || value > orderDate || 'Delivery date must be after the order date',
                })}
              />
            </Form.Group>
            {errors.po_delivery_date && (
              <p className="text-danger">{errors.po_delivery_date.message}</p>
            )}
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="receipt" className="mt-2">
              <Form.Label>Shipment Preference</Form.Label>
              <Controller
                name="po_shipment_preference"
                control={control}
                rules={{ required: 'Shipment Preference Required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={Deliverymethod}
                    isClearable
                    isSearchable
                    placeholder="Shipment Preference"
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.po_shipment_preference && (
                <p className="text-danger">{errors.po_shipment_preference.message}</p>
              )}
            </Form.Group>
          </Col>
        </Row>

        <TablePurchasesorder />

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
        </Col>
        <Row>
          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Customer Notes</Form.Label>
              <Form.Control type="textarea" {...register('po_customer_notes')} />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Terms Conditions</Form.Label>
              <Form.Control type="text" {...register('po_terms_condition')} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Reference</Form.Label>
              <Form.Control type="text" {...register('po_reference')} />
            </Form.Group>
          </Col>
        </Row>

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

export default AddPurchasesorder

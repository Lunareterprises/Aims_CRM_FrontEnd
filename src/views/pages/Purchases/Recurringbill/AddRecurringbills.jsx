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
import { AddRBuseSales } from './AddRecurringcontext'
import AddTableRecurring from './AddTableRecurring'

const AddRecurringbills = () => {
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

    handleAdditem,
    Products,
    handleDeleteitem,
    handleCalculate,
  } = AddRBuseSales()

  useEffect(() => {
    Products()
  }, [])
  const sales_order_items = data.map((row) => {
    const itemObject = typeof row.item === 'object' && row.item !== null

    const product = itemObject ? row.item : productslist.find((prod) => prod.value === row.item)

    return {
      soi_name: product ? product.label : row.item,
      soi_item_id: itemObject ? row.item.value : row.item,
      soi_quantity: row.quantity,
      soi_rate: row.rate.toFixed(2),
      soi_discount: String(row.discount),
      soi_amount: row.amount,
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
        const mappedProducts = response.data.list.map((customer) => ({
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
      formData.append('rb_profile_name', data.rb_profile_name)

      formData.append('so_selected_name', selectedCommission.label)
      
      formData.append('so_selected_tax', selectedCommission.rate)
      if (data.rb_vendor_name) {
        formData.append('rb_vendor_name', data.rb_vendor_name.label)
        formData.append('rb_vendor_id', data.rb_vendor_name.value)
      }

      if (data.rb_repeat_every) {
        formData.append('rb_repeat_every', data.rb_repeat_every.label)
     
      }


      formData.append('so_sales_order_id', data.so_sales_order_id)
      formData.append('so_reference', data.so_reference)

      formData.append('rb_never_expiry', data.rb_never_expiry)


      formData.append(
        'rb_start_date',
        moment(data.rb_start_date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      )

      formData.append(
        'rb_end_date',
        moment(data.rb_end_date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      )

      if (data.rb_payment_terms) {
        formData.append('rb_payment_terms', data.rb_payment_terms.label)
      }
      if (data.so_delivery_method) {
        formData.append('so_delivery_method', data.so_delivery_method.label)
      }

      if (data.so_salesperson_name) {
        formData.append('so_salesperson_name', data.so_salesperson_name.label)
        formData.append('so_salesperson_id', data.so_salesperson_name.value)
      }

      formData.append('so_customer_notes', data.so_customer_notes)

      formData.append('so_shipping_charge', shipping)

      formData.append('so_adjustment_amount', adjustment)
      formData.append('so_tds_tcs', accountType)
      formData.append('so_total_amount', totalAmount)
      formData.append('so_terms_conditions', data.so_terms_conditions)

      formData.append('sales_order_items', JSON.stringify(sales_order_items))








// rb_discount: 10
// rb_discount_account_id:2
// rb_discount_account_name: ABC Discounts
// rb_tds_tax: 5
// rb_adjustment:200
// rb_total_amount: 5000
// rb_notes: Quarterly review required
// recurring_bills_items:[{"is_item_name":"ItemABC","is_item_id":"I123","is_quantity":10,"is_rate":200,"is_discount":"15%","is_amount":1700},{"is_item_name":"ItemXYZ","is_item_id":"I456","is_quantity":5,"is_rate":300,"is_discount":"10%","is_amount":1350}]↵

      console.log([...formData]) // Logs all FormData entries for verification

      // Send the form data to the server
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/add/sales-order',
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



const Repeatweekly = [
  { value: 'Week', label: 'Week' },
  { value: '2 weeks', label: '2 Weeks' },
  { value: 'Month', label: 'Month' },
  { value: '2 Months', label: '2 Months' },
  { value: '3 Months', label: '3 Months' },

];

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
        <h4>Sales Order</h4>

        <Row>
          <Col md={6}>
            <Form.Group controlId="industries" className="mt-2">
              <Form.Label>Vendor Name*</Form.Label>
              <Controller
                name="rb_vendor_name"
                control={control}
                rules={{ required: 'Select Vendor Name' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={products}
                    isClearable
                    isSearchable
                    placeholder="Select a Vendor Name"
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.rb_vendor_name && (
                <p className="text-danger">{errors.rb_vendor_name.message}</p>
              )}
            </Form.Group>
          </Col>


          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Profile Name*</Form.Label>
              <Form.Control type="text"     {...register('rb_profile_name', { required: 'Profile Name  is required' })}
              
              
 />
            </Form.Group>
          </Col>
        </Row>

     

        <Row>
          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Start On</Form.Label>
              <Form.Control
                type="date"
                {...register('rb_start_date', { required: 'Sales Order Date is required' })}
              />
            </Form.Group>
            {errors.rb_start_date && <p className="text-danger">{errors.rb_start_date.message}</p>}
          </Col>

          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>End On</Form.Label>
              <Form.Control
                type="date"
                {...register('rb_end_date', { required: 'Shipment Date is required' })}
              />
            </Form.Group>
            {errors.rb_end_date && (
              <p className="text-danger">{errors.rb_end_date.message}</p>
            )}
          </Col>
        </Row>

        <Row>
        <Col md={6}>
            <Form.Group controlId="rb_repeat_every" className="mt-2">
              <Form.Label>Repeat Every</Form.Label>
              <Controller
                name="rb_repeat_every"
                control={control}
                rules={{ required: 'Required Repeat Every' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={Repeatweekly}
                    isClearable
                    isSearchable
                    placeholder="Required Repeat Every"
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.rb_repeat_every && (
                <p className="text-danger">{errors.rb_repeat_every.message}</p>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="rb_payment_terms" className="mt-2">
              <Form.Label>Payment Terms</Form.Label>
              <Controller
                name="rb_payment_terms"
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
              {errors.rb_payment_terms && (
                <p className="text-danger">{errors.rb_payment_terms.message}</p>
              )}
            </Form.Group>
          </Col>
        </Row>

        <AddTableRecurring />

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
              <Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" rows={3} {...register('so_reference')} />
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

export default AddRecurringbills

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
} from 'react-bootstrap'
import axios from 'axios'
import Examclination from '../../../assets/images/exclamation.png'
import Tick from '../../../assets/images/Tick.png'
import { useDropzone } from 'react-dropzone'
import { useSales } from '../Banking/SalesContext'
import moment from 'moment'
import DeliveryTablecomponent from './DeliveryTablecomponent'
import { useAddDeliverychallansview } from '../../../components/Deliverycontext'

const AddDeliverychallans = () => {
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
  } = useAddDeliverychallansview()

  useEffect(() => {
    Products()
  }, [])
  const sales_order_items = data.map((row) => {
    const itemObject = typeof row.item === 'object' && row.item !== null

    const product = itemObject ? row.item : productslist.find((prod) => prod.value === row.item)

    return {
      is_item_name: product ? product.label : row.item,
      is_item_id: itemObject ? row.item.value : row.item,
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

      // Or, if you want to append a selectedFile (if present):
      // if (selectedFile) {
      //   formData.append('image', selectedFile)
      // }

      // Append individual customer data fields
      //   formData.append('user_id', user_id)
      //   formData.append('so_selected_name', selectedCommission.label)
      //   formData.append('so_selected_tax', selectedCommission.rate)
      if (data.dc_customer_name) {
        formData.append('dc_customer_name', data.dc_customer_name.label)
        formData.append('dc_customer_id', data.dc_customer_name.value)
      }

      formData.append('dc_delivery_challan_id', data.dc_delivery_challan_id)
      formData.append('dc_reference', data.dc_reference)

      formData.append('dc_date', moment(data.dc_date, 'DD-MM-YYYY').format('YYYY-MM-DD'))

      if (data.dc_type) {
        formData.append('dc_type', data.dc_type.label)
      }

      formData.append('dc_customer_notes', data.dc_customer_notes)

      //   formData.append('so_shipping_charge', shipping)

      formData.append('dc_adjustment', adjustment)
      //   formData.append('so_tds_tcs', accountType)
      formData.append('dc_total_amount', totalAmount)
      formData.append('dc_terms_conditions', data.dc_terms_conditions)

      formData.append('delivery_challan_items', JSON.stringify(sales_order_items))

      console.log([...formData]) // Logs all FormData entries for verification

      // Send the form data to the server
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/add/delivery-challan',
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
        reset({
          dc_customer_name: null,
          dc_customer_id: '',
          dc_delivery_challan_id: '',
          dc_reference: '',
          dc_date: '',
          dc_type: null,
          dc_customer_notes: '',
          dc_adjustment: '',
          dc_terms_conditions: '',
          delivery_challan_items: [],
          files: [], // Ensure the files field is cleared
        }) // Clear form after adding

        setUploadedFiles([]) // Clear uploaded files state
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

  const ChallanType = [
    { value: 'regular', label: 'Regular Challan' },
    { value: 'return', label: 'Return Challan' },
    { value: 'export', label: 'Export Challan' },
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
        <h4>New Delivery Challan</h4>

        <Row>
          <Col md={6}>
            <Form.Group controlId="industries" className="mt-2">
              <Form.Label>Customer Name*</Form.Label>
              <Controller
                name="dc_customer_name"
                control={control}
                rules={{ required: 'Select or  add a Customer' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={products}
                    isClearable
                    isSearchable
                    placeholder="Select or  add a Customer"
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.dc_customer_name && (
                <p className="text-danger">{errors.dc_customer_name.message}</p>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Delivery Challan Date*</Form.Label>
              <Form.Control
                type="date"
                {...register('dc_date', { required: 'Delivery Challan Date is required' })}
              />
            </Form.Group>
            {errors.dc_date && <p className="text-danger">{errors.dc_date.message}</p>}
          </Col>
        </Row>

        <Row>
       

          <Col md={6}>
            <Form.Group controlId="dc_type" className="mt-2">
              <Form.Label>Challan Type</Form.Label>
              <Controller
                name="dc_type"
                control={control}
                rules={{ required: 'Challan Type' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={ChallanType}
                    isClearable
                    isSearchable
                    placeholder="Challan Type
"
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.dc_type && <p className="text-danger">{errors.dc_type.message}</p>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Reference</Form.Label>
              <Form.Control type="text" {...register('dc_reference')} />
            </Form.Group>
          </Col>
        </Row>


        <DeliveryTablecomponent />

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
              <Form.Control as="textarea" rows={3} {...register('dc_customer_notes')} />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Terms Conditions</Form.Label>
              <Form.Control as="textarea" rows={3} {...register('dc_terms_conditions')} />
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

export default AddDeliverychallans

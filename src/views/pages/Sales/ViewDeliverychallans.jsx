import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Form, Row, Col, Button, Modal, Spinner } from 'react-bootstrap'
import axios from 'axios'
import Examclination from '../../../assets/images/exclamation.png'
import Tick from '../../../assets/images/Tick.png'
import { useDropzone } from 'react-dropzone'
import { useLocation, useParams } from 'react-router-dom'
import moment from 'moment'
import Select from 'react-select'

import TableViewDeliverychallans from './TableViewDeliverychallans'
import { useViewDeliverychallansview } from '../../../components/contextViewDeliverychallans'

const paymentOptions = [
  { value: 'net 15', label: 'Net 15' },
  { value: 'net 30', label: 'Net 30' },
  { value: 'net 50', label: 'Net 50' },
  { value: 'Due end of the month', label: 'Due End of the Month' },
]

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

const ViewDeliverychallans = () => {
  const {
    accountType,

    data,
    fetchSalesOrder,
    commissionOptions,
    shipping,
    setShipping,
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
  } = useViewDeliverychallansview()
  console.log(data, 'data')

  const location = useLocation()

  const { dc_id } = useParams() // Get from URL

  const [saleid, setSaleid] = useState(() => sessionStorage.getItem('dc_id') || dc_id) // Initialize from sessionStorage

  useEffect(() => {
    if (dc_id) {
      setSaleid(dc_id) // Update state
      sessionStorage.setItem('dc_id', dc_id) // Save to local storage
    }
  }, [dc_id]) // Run when `dc_id` changes

  useEffect(() => {}, [saleid])

  useEffect(() => {
    Products()
  }, [data])

  useEffect(() => {
    setTimeout(() => {
      sessionStorage.removeItem('hasReloaded') // Remove after 2 sec
    }, 2000)
  }, [])

  const sales_order_items = data.map((row) => {
    return {
      is_id: row.main_id || null, // Keep track of existing ID or set to null if new
      is_item_id: row.id, // Ensure updated item ID
      is_item_name: row.item,
      is_quantity: Number(row.quantity) || 1,
      is_rate: Number(row.rate || 0).toFixed(2),
      is_discount: String(row.discount || '0'),
      is_amount: Number(row.amount || 0).toFixed(2),
    }
  })

  console.log(sales_order_items, 'newdataaaaa')

  console.log('Saleorderview - newdata before render:', data)

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
      documents: [],

      dc_delivery_challan_id: '',
      dc_date: '',
      so_shipment_date: '',
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
      const documents = watch('documents')
      documents.forEach((img, index) => {
        if (img.file) {
          // Append new uploaded file
          formData.append(`image`, img.file)
        } else if (img.sd_file) {
          // Append existing file as a Blob/File instead of just a reference
          const existingFile = new File([img.sd_file], `existing_image_${index}.jpg`, {
            type: 'image/jpeg',
          })
          formData.append(`${img.sd_id}`, existingFile)
        }
      })

      // Or, if you want to append a selectedFile (if present):
      // if (selectedFile) {
      //   formData.append('image', selectedFile)
      // }

      // Append individual customer data fields
      formData.append('user_id', user_id)
      formData.append('dc_id', dc_id)

      if (data.dc_customer_name) {
        formData.append('dc_customer_name', data.dc_customer_name.label || '')
        formData.append('dc_customer_id', data.dc_customer_name.value || '')
      }

      formData.append('dc_delivery_challan_id', data.dc_delivery_challan_id)
      formData.append('dc_reference', data.dc_reference)

      formData.append('dc_customer_notes', data.dc_customer_notes)

      formData.append('dc_adjustment', adjustment)

      formData.append('so_total_amount', totalAmount)

      formData.append('delivery_challan_items', JSON.stringify(sales_order_items))

      console.log([...formData]) // Logs all FormData entries for verification

      // Send the form data to the server
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/edit/delivery-challan',
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
          // navigate('/dashboard') // Change to your success page
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

  const [uploadedImages, setUploadedImages] = useState([])

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles) => {
      const newImages = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
      // setUploadedImages([...uploadedImages, ...newImages])
      setUploadedImages((prevImages) => [...prevImages, ...newImages])

      // Update form state
      setValue('documents', [...watch('documents'), ...newImages])
    },
    [uploadedImages, setValue, watch],
  )

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: true, // Allow multiple images
    onDrop,
  })

  // Remove an uploaded image
  const removeImage = (index) => {
    const updatedDocs = watch('documents').filter((_, i) => i !== index)
    setValue('documents', updatedDocs)
  }

  // Remove an existing image
  const removeExistingImage = (index) => {
    const updatedImages = products[0]?.documents || []
    updatedImages.splice(index, 1)
    setProducts([{ ...products[0], documents: updatedImages }])
  }

  //---------------

  // Watch the form's file field (optional)
  const files = watch('files')
  // -----------------------

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

  //-------------------

  const [Saleorderlistdata, setaleorderlistdata] = useState([])

  useEffect(() => {
    Saleorderlist()
  }, [])

  // Fetch Products
  const Saleorderlist = async () => {
    try {
      const data = { dc_id: JSON.parse(dc_id) }
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/list/delivery-challan',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )

      if (response.data.result) {
        const vendorDatalist = response.data.list[0]

        setaleorderlistdata([vendorDatalist])
        // setProductscontact(vendorDatalist.contact_persons)

        if (vendorDatalist?.dc_customer_name) {
          setValue('dc_customer_name', {
            label: vendorDatalist.dc_customer_name,
            value: vendorDatalist.dc_customer_id, // Ensure correct ID
          })
        }

        const selectedChallanType = ChallanType.find(
          (opt) => opt.value === vendorDatalist.dc_type,
        ) || {
          value: vendorDatalist.dc_type,
          label: vendorDatalist.dc_type,
        }

        // Populate Form Fields with API Data
        reset({
          dc_type: selectedChallanType,
          full_name: `${vendorDatalist.cu_salutation} ${vendorDatalist.cu_first_name} ${vendorDatalist.cu_last_name}`,
          dc_customer_name: vendorDatalist.dc_customer_name,
          dc_delivery_challan_id: vendorDatalist.dc_delivery_challan_id,

          dc_date: vendorDatalist.dc_date,
          dc_date: moment(vendorDatalist?.dc_date).format('DD/MM/YYYY') || '2025',
          dc_customer_notes: vendorDatalist?.dc_customer_notes,

          dc_reference: vendorDatalist?.dc_reference || 'nil',

          documents: vendorDatalist?.documents?.map((contact) => ({
            sd_id: contact.sd_id,
            sd_file: contact.sd_file,
          })),

          bankdetails: vendorDatalist?.bank_details?.map((contactbankdetails) => ({
            vbd_vendor_id: contactbankdetails.vbd_vendor_id, // You can prepopulate this if needed.
            vbd_id: contactbankdetails.vbd_id,
            vbd_acc_name: contactbankdetails.vbd_acc_name,
            vbd_bank_name: contactbankdetails.vbd_bank_name,
            vbd_acc_number: contactbankdetails.vbd_acc_number,
            vbd_ifsc_code: contactbankdetails.vbd_ifsc_code,
          })),
        })
      } else {
        console.error(response.data.message) // Log API error messages
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
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
        <h4>Delivery Challan View</h4>

        <Row>
          <Col md={6}>
            <Form.Group controlId="industries" className="mt-2">
              <Form.Label>Customer Name*</Form.Label>

              <Controller
                name="dc_customer_name"
                control={control}
                render={({ field }) => (
                  <Form.Select
                    {...field}
                    className="form-control"
                    disabled
                    value={field.value?.value || ''}
                    onChange={(e) => {
                      const selectedOption = products.find(
                        (item) => item.value === Number(e.target.value),
                      )
                      field.onChange(selectedOption) // Store the entire object { label, value }
                    }}
                  >
                    <option value="">{field.value?.label || watch('dc_customer_name')}</option>
                    {products.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </Form.Select>
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
                type="text"
                {...register('dc_date', { required: 'Sales Order Date is required' })}
                disabled
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
                rules={{ required: 'Challan Type is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={ChallanType}
                    isClearable
                    isSearchable
                    placeholder="Challan Type"
                    classNamePrefix="react-select"
                    value={
                      ChallanType.find((opt) => opt.value === field.value?.value) || field.value
                    }
                    onChange={(selectedOption) => field.onChange(selectedOption)}
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

        <TableViewDeliverychallans />

        <Form.Label>Edit Image / Documents</Form.Label>

        <Row>
          {/* Image Upload Section */}
          <Col md={6}>
            <Form.Group className="mb-3">
              {/* Display Uploaded Images */}
              <div className="mt-3 d-flex flex-wrap">
                {/* {watch('documents').map((image, index) => ( */}
                {watch('documents')?.map((doc, index) => {
                  // Determine if the file is a PDF. If sd_file exists, check its extension.
                  const isPdf =
                    (doc.sd_file && doc.sd_file.toLowerCase().endsWith('.pdf')) ||
                    (doc.file && doc.file.type === 'application/pdf')

                  return (
                    <div key={doc.sd_id || index} className="position-relative me-2 mb-2">
                      {isPdf ? (
                        // Render PDF placeholder for PDFs
                        <div
                          style={{
                            width: '100px',
                            height: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f0f0f0',
                            borderRadius: '8px',
                          }}
                        >
                          <p>PDF File</p>
                        </div>
                      ) : (
                        // Render image preview for images
                        <img
                          src={doc.preview || `https://lunarsenterprises.com:5016/${doc.sd_file}`}
                          alt="Vendor"
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                          }}
                        />
                      )}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute"
                        style={{ top: 5, right: 5 }}
                        onClick={() => removeImage(index)}
                      >
                        ✖
                      </button>
                    </div>
                  )
                })}{' '}
              </div>
            </Form.Group>
          </Col>

          {/* Drag & Drop Upload */}
          <Col md={6} className="mb-5">
            <div
              {...getRootProps()}
              style={{
                border: '2px dashed #d1d5db',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <input {...getInputProps()} />
              <p>Drag & drop or click to upload images</p>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Customer Notes</Form.Label>
              <Form.Control as="textarea" rows={3} {...(register('dc_customer_notes') || 'nil')} />
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

export default ViewDeliverychallans

import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Form, Row, Col, Button, Modal, Spinner } from 'react-bootstrap'
import axios from 'axios'
import Examclination from '../../../assets/images/exclamation.png'
import Tick from '../../../assets/images/Tick.png'
import { useDropzone } from 'react-dropzone'
import { useLocation, useParams } from 'react-router-dom'
import moment from 'moment'
import DraggableTableDivview from './SaleorderviewDragg'
import { useSalesview } from '../../../components/Saleorderviewcontext'

const paymentOptions = [
  { value: 'net 15', label: 'Net 15' },
  { value: 'net 30', label: 'Net 30' },
  { value: 'net 50', label: 'Net 50' },
  { value: 'Due end of the month', label: 'Due End of the Month' },
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

const Saleorderview = () => {
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
  } = useSalesview()
  console.log(data, 'data')

  const location = useLocation()

  const { so_id } = useParams() // Get from URL

  const [saleid, setSaleid] = useState(() => sessionStorage.getItem('so_id') || so_id) // Initialize from sessionStorage

  useEffect(() => {
    if (so_id) {
      setSaleid(so_id) // Update state
      sessionStorage.setItem('so_id', so_id) // Save to local storage
    }
  }, [so_id]) // Run when `so_id` changes

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

      so_sales_order_id: '',
      so_order_date: '',
      so_shipment_date: '',
      so_customer_notes: '',
      so_terms_conditions: '',
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
      formData.append('user_id', user_id)
      formData.append('so_id', so_id)

      formData.append('so_selected_name', selectedCommission.label)
      formData.append('so_selected_tax', selectedCommission.rate)
      if (data.so_customer_name) {
        formData.append('so_customer_name', data.so_customer_name.label || '')
        formData.append('so_customer_id', data.so_customer_name.value || '')
      }

      
      formData.append('so_reference', data.so_reference)
     
      formData.append('so_payment_terms', data.so_payment_terms)

      if (data.so_delivery_method) {
        formData.append('so_delivery_method', data.so_delivery_method)
      }

      if (data.so_salesperson_name) {
        formData.append('so_salesperson_name', data.so_salesperson_name)
      }

      formData.append('so_customer_notes', data.so_customer_notes)

      formData.append('so_shipping_charge', shipping)

      formData.append('so_adjustment_amount', adjustment)
      formData.append('so_tds_tcs', accountType)
      formData.append('so_total_amount', totalAmount)
      formData.append('so_terms_conditions', data.so_terms_conditions)

      formData.append('sales_order_items', JSON.stringify(sales_order_items))

      // formData.append('contact_person', JSON.stringify(data.contacts))

      console.log([...formData]) // Logs all FormData entries for verification

      // Send the form data to the server
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/edit/sales-order',
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
      const data = { so_id: JSON.parse(so_id) }
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/list/sales-order',
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

        if (vendorDatalist?.so_customer_name) {
          setValue('so_customer_name', {
            label: vendorDatalist.so_customer_name,
            value: vendorDatalist.so_customer_id, // Ensure correct ID
          })
        }

        if (vendorDatalist?.so_payment_terms) {
          setValue('so_payment_terms', {
            label: vendorDatalist.so_payment_terms,
            value: vendorDatalist.so_payment_terms_id, // Ensure correct ID
          })
        }


        setValue('so_order_date', moment(vendorDatalist?.so_order_date).format('DD/MM/YYYY') || '')
        setValue(
          'so_shipment_date',
          moment(vendorDatalist?.so_shipment_date).format('DD/MM/YYYY') || '',
        )

        setValue('so_payment_terms', vendorDatalist?.so_payment_terms || '')

        setValue('so_delivery_method', vendorDatalist?.so_delivery_method || '')
        setValue('so_customer_notes', vendorDatalist?.so_customer_notes || '')
        setValue('so_terms_conditions', vendorDatalist?.so_terms_conditions || '')

        setValue('so_salesperson_name', vendorDatalist?.so_salesperson_name || '')

        setValue('so_reference', vendorDatalist?.so_reference || '')

        setValue('cu_b_addr_country', vendorDatalist?.cu_b_addr_country || '')

        console.log('cu_portal_language:', vendorDatalist?.cu_portal_language)

        // Populate Form Fields with API Data
        reset({
          full_name: `${vendorDatalist.cu_salutation} ${vendorDatalist.cu_first_name} ${vendorDatalist.cu_last_name}`,
          so_customer_name: vendorDatalist.so_customer_name,
          so_sales_order_id: vendorDatalist.so_sales_order_id,

          so_order_date: vendorDatalist.so_order_date,
          so_order_date: moment(vendorDatalist?.so_order_date).format('DD/MM/YYYY') || '2025',
          so_payment_terms: vendorDatalist?.so_payment_terms,
          so_delivery_method: vendorDatalist?.so_delivery_method,

          so_salesperson_name: vendorDatalist?.so_salesperson_name || 'nil',
          so_terms_conditions: vendorDatalist?.so_terms_conditions || 'nil',

          so_reference: vendorDatalist?.so_reference || 'nil',

          contacts: vendorDatalist?.contact_persons?.map((contact) => ({
            ccp_id: contact.ccp_id,
            ccp_salutation: contact.ccp_salutation,
            ccp_firstname: contact.ccp_firstname,
            ccp_lastname: contact.ccp_lastname,
            ccp_email: contact.ccp_email,
            ccp_phone: contact.ccp_phone,
            ccp_mobile: contact.ccp_mobile,
          })),

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
        <h4>Sales Order View</h4>

        <Row>
          <Col md={6}>
            <Form.Group controlId="industries" className="mt-2">
              <Form.Label>Customer Name*</Form.Label>

              <Controller
                name="so_customer_name"
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
                    <option value="">{field.value?.label || watch('so_customer_name')}</option>
                    {products.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </Form.Select>
                )}
              />

              {errors.so_customer_name && (
                <p className="text-danger">{errors.so_customer_name.message}</p>
              )}
            </Form.Group>
          </Col>
      
          <Col md={6}>
            <Form.Group controlId="so_salesperson_name" className="mt-2">
              <Form.Label>Sales Person</Form.Label>

              <Controller
                name="so_salesperson_name"
                control={control}
                render={({ field }) => (
                  <Form.Select {...field} className="form-control">
                    {SalesPerson.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                )}
              />
            </Form.Group>
          </Col>


        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Sale Order Date*</Form.Label>
              <Form.Control
                type="text"
                {...register('so_order_date', { required: 'Sales Order Date is required' })}
                disabled
              />
            </Form.Group>
            {errors.so_order_date && <p className="text-danger">{errors.so_order_date.message}</p>}
          </Col>

          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Expected Shipment Data Order</Form.Label>
              <Form.Control
                type="text"
                {...register('so_shipment_date', { required: 'Shipment Date is required' })}
                disabled
              />
            </Form.Group>
            {errors.so_shipment_date && (
              <p className="text-danger">{errors.so_shipment_date.message}</p>
            )}
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="so_payment_terms" className="mt-2">
              <Form.Label>Payment Terms</Form.Label>

              <Controller
                name="so_payment_terms"
                control={control}
                render={({ field }) => (
                  <Form.Select {...field} className="form-control">
                    {paymentOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                )}
              />

              {errors.so_payment_terms && (
                <p className="text-danger">{errors.so_payment_terms.message}</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="receipt" className="mt-2">
              <Form.Label>Delivery Method</Form.Label>

              <Controller
                name="so_delivery_method"
                control={control}
                render={({ field }) => (
                  <Form.Select {...field} className="form-control">
                    {Deliverymethod.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                )}
              />

              {errors.so_delivery_method && (
                <p className="text-danger">{errors.so_delivery_method.message}</p>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Customer Notes</Form.Label>
              <Form.Control {...(register('so_customer_notes') || 'nil')} />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Terms Conditions</Form.Label>
              <Form.Control type="text" {...(register('so_terms_conditions') || 'nil')} />
            </Form.Group>
          </Col>
        </Row>

        <Row>
         

          <Col md={6}>
            <Form.Group className="mt-2">
              <Form.Label>Reference</Form.Label>
              <Form.Control type="text" {...register('so_reference')} />
            </Form.Group>
          </Col>
        </Row>

        <DraggableTableDivview />

        {/* File Upload Section */}
        <Row>
          {/* Image Upload Section */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Sale Details</Form.Label>

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

export default Saleorderview

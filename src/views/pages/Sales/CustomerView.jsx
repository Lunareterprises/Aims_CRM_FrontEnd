import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Table,
  Modal,
  Spinner,
  Tabs,
  Tab,
} from 'react-bootstrap'
import { useFieldArray, useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import Examclination from '../../../assets/images/exclamation.png'
import Tick from '../../../assets/images/Tick.png'
import { useDropzone } from 'react-dropzone'

const CustomerView = () => {
  const user_id = sessionStorage.getItem('user_id')
  const token = sessionStorage.getItem('token')
  const { cu_id } = useParams()
  const Navi = useNavigate()

  const [loading, setLoading] = useState(false)
  const [loadingedit, setLoadingedit] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [products, setProducts] = useState([])
  const [productscontact, setProductscontact] = useState([])

  const apiResponse = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
    { id: '3', name: 'Option 3' },
  ]

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: '', // Set a default value
      contacts: [],
      documents: [],
      bankdetails: [],
    },
  })

  const [options, setOptions] = useState([])

  useEffect(() => {
    const fetchDefaultValue = async () => {
      // Simulated API call for preset value
      const defaultData = await new Promise((resolve) =>
        setTimeout(() => resolve({ category: '1' }), 1000),
      )

      setValue('category', defaultData.category) // Set the preset value in the form
    }

    fetchDefaultValue()
  }, [setValue])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
    keyName: 'documents',
    // bankdetails: 'bankdetails',
  })

  const {
    fields: bankFields,
    append: appendBank,
    remove: removeBank,
  } = useFieldArray({
    control,
    name: 'bankdetails',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const data = { cust_id: cu_id }
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/list/customers',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )

      if (response.data.result) {
        const vendorData = response.data.list[0]
        setProducts([vendorData])
        setProductscontact(vendorData.contact_persons)

        setValue('cu_currency', vendorData?.cu_currency || '')

        setValue('cu_payment_terms', vendorData?.cu_payment_terms || '')

        // setValue('cu_portal_language', vendorData?.cu_portal_language || '')

        setValue('cu_s_addr_country', vendorData?.cu_s_addr_country || '')

        reset({
          full_name: `${vendorData.cu_salutation} ${vendorData.cu_first_name} ${vendorData.cu_last_name}`,
          cu_company_name: vendorData.cu_company_name,
          cu_email: vendorData.cu_email,
          cu_mobile: vendorData.cu_mobile,
          cu_b_addr_country: vendorData.cu_b_addr_country,

          // cu_b_addr_address: vendorData.cu_b_addr_address,

          cu_b_addr_state: vendorData.cu_b_addr_state,
          cu_b_addr_pincode: vendorData.cu_b_addr_pincode,

          cu_pan_no: vendorData.cu_pan_no,

          cu_currency: vendorData.cu_currency,

          cu_opening_balance: vendorData.cu_opening_balance,

          cu_payment_terms: vendorData.cu_payment_terms,

          cu_b_addr_country: vendorData.cu_b_addr_country,
          // cu_portal_language: vendorData.cu_portal_language,
          cu_b_addr_address: vendorData.cu_b_addr_address,

          cu_department: vendorData.cu_department,
          cu_designation: vendorData.cu_designation,
          cu_b_addr_attention: vendorData.cu_b_addr_attention,

          cu_b_addr_city: vendorData.cu_b_addr_city,

          cu_b_addr_pincode: vendorData.cu_b_addr_pincode,

          cu_b_addr_phone: vendorData.cu_b_addr_phone,
          cu_b_addr_fax_number: vendorData.cu_b_addr_fax_number,

          cu_s_addr_attention: vendorData.cu_s_addr_attention,
          cu_s_addr_country: vendorData.cu_s_addr_country,

          cu_s_addr_address: vendorData.cu_s_addr_address,
          cu_s_addr_city: vendorData.cu_s_addr_city,

          cu_s_addr_state: vendorData.cu_s_addr_state,

          cu_s_addr_pincode: vendorData.cu_s_addr_pincode,
          cu_s_addr_phone: vendorData.cu_s_addr_phone,

          cu_s_addr_fax_number: vendorData.cu_s_addr_fax_number,

          contacts: vendorData?.contact_persons?.map((contact) => ({
            ccp_id: contact.ccp_id,
            ccp_salutation: contact.ccp_salutation,
            ccp_firstname: contact.ccp_firstname,
            ccp_lastname: contact.ccp_lastname,
            ccp_email: contact.ccp_email,
            ccp_phone: contact.ccp_phone,
            ccp_mobile: contact.ccp_mobile,
          })),

          documents: vendorData?.documents?.map((contact) => ({
            sd_id: contact.sd_id,
            sd_file: contact.sd_file,
          })),

          bankdetails: vendorData?.bank_details?.map((contactbankdetails) => ({
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

  // Handle Form Submit (Save Edited Data)
  const onSubmit = async (formData) => {
    setLoading(true)

    try {
      const documents = watch('documents')
      const formDataappend = new FormData()

      formDataappend.append('cu_id', cu_id)
      // formDataappend.append('full_name', cu_id)

      formDataappend.append('cu_mobile', formData.cu_mobile)
      formDataappend.append('cu_email', formData.cu_email)

      formDataappend.append('cu_b_addr_country', formData.cu_b_addr_country)

      formDataappend.append('cu_b_addr_address', formData.cu_b_addr_address)
      formDataappend.append('cu_b_addr_city', formData.cu_b_addr_city)
      formDataappend.append('cu_b_addr_state', formData.cu_b_addr_state)
      formDataappend.append('cu_b_addr_pincode', formData.cu_b_addr_pincode)

      formDataappend.append('cu_pan_no', formData.cu_pan_no)

      formDataappend.append('cu_currency', formData.cu_currency)

      formDataappend.append('cu_opening_balance', formData.cu_opening_balance)

      formDataappend.append('cu_payment_terms', formData.cu_payment_terms)

      // formDataappend.append('cu_portal_language', formData.cu_portal_language)

      formDataappend.append('cu_department', formData.cu_department)
      formDataappend.append('cu_designation', formData.cu_designation)
      formDataappend.append('cu_b_addr_attention', formData.cu_b_addr_attention)

      formDataappend.append('cu_b_addr_pincode', formData.cu_b_addr_pincode)

      formDataappend.append('cu_b_addr_phone', formData.cu_b_addr_phone)
      formDataappend.append('cu_b_addr_fax_number', formData.cu_b_addr_fax_number)

      formDataappend.append('cu_s_addr_attention', formData.cu_s_addr_attention)
      formDataappend.append('cu_s_addr_country', formData.cu_s_addr_country)

      formDataappend.append('cu_s_addr_address', formData.cu_s_addr_address)
      formDataappend.append('cu_s_addr_city', formData.cu_s_addr_city)

      formDataappend.append('cu_s_addr_state', formData.cu_s_addr_state)

      formDataappend.append('cu_s_addr_pincode', formData.cu_s_addr_pincode)
      formDataappend.append('cu_s_addr_phone', formData.cu_s_addr_phone)

      formDataappend.append('cu_s_addr_fax_number', formData.cu_s_addr_fax_number)

      formDataappend.append('contact_person', JSON.stringify(formData.contacts))
      documents.forEach((img, index) => {
        if (img.file) {
          // Append new uploaded file
          formDataappend.append(`image`, img.file)
        } else if (img.sd_file) {
          // Append existing file as a Blob/File instead of just a reference
          const existingFile = new File([img.sd_file], `existing_image_${index}.jpg`, {
            type: 'image/jpeg',
          })
          formDataappend.append(`${img.sd_id}`, existingFile)
        }
      })
      // formDataappend.append('bankdetails', JSON.stringify(formData.bankdetails))

      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/edit/customer',
        formDataappend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )

      if (response.data.result) {
        setModalMessage({ type: 'success', message: response.data.message })
        setShowModal(true)

        setTimeout(() => {}, 3000)
      } else {
        setModalMessage({ type: 'fail', message: response.data.message })
        setShowModal(true)

        setTimeout(() => setShowModal(false), 3000)
      }
    } catch (error) {
      console.error('Error updating vendor:', error)
    } finally {
      setLoading(false)
    }
  }

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

  //-------------------------

  //------------delete----------------
  // State to control delete confirmation modal.
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [contactToDelete, setContactToDelete] = useState({ index: null, ccp_id: null })

  const handleShowDeleteModal = (index, ccp_id) => {
    setContactToDelete({ index, ccp_id })
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    const { index, ccp_id } = contactToDelete
    // Close the modal.
    setShowDeleteModal(false)

    // If the contact exists on the backend, call the API.
    if (ccp_id) {
      try {
        const response = await axios.post(
          'https://lunarsenterprises.com:5016/crm/delete/customer-contact-person',
          { ccp_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              user_id: user_id,
            },
          },
        )
        if (!response.data.result) {
          console.error('Deletion failed:', response.data.message)
          // Optionally, display an error message.
          return
        }
      } catch (error) {
        console.error('Error deleting contact:', error)
        return
      }
    }
    // Remove from form state whether or not it exists in backend.
    remove(index)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setContactToDelete({ index: null, ccp_id: null })
  }

  const [isSameAddress, setIsSameAddress] = useState(false)

  const handleSameAddressChange = () => {
    setIsSameAddress(!isSameAddress)
  }
  // console.log('Currency from API:', products?.[0]?.cu_currency)

  return (
    <>
      {/* Success / Error Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <img
              src={modalMessage.type === 'success' ? Tick : Examclination}
              alt={modalMessage.type === 'success' ? 'Tick' : 'Warning'}
              style={{ width: '30px', marginRight: '10px' }}
            />
            {modalMessage.type === 'success' ? 'Success' : 'Warning'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage.message}</p>
        </Modal.Body>
      </Modal>

      {/* Vendor Details Form */}
      <h2 className="mt-4 mb-3">Customer Details</h2>

      <Form onSubmit={handleSubmit(onSubmit)} className="mt-4 p-4 border">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" {...register('full_name')} disabled />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control type="text" {...register('cu_company_name')} disabled />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                {...register('cu_email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Standard email regex
                    message: 'Enter a valid email address',
                  },
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Z0-9@._%+-]/g, '') // Prevents invalid characters
                }}
                placeholder="Enter email"
              />
              {errors.cu_email && <span className="text-danger">{errors.cu_email.message}</span>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                type="text"
                {...register('cu_mobile', {
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{7,15}$/, // Allows only numbers, min 7, max 15 digits
                    message: 'Mobile number must be between 7 and 15 digits',
                  },
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 15) // Allow only numbers, limit to 15 digits
                }}
              />
              {errors.cu_mobile && <span className="text-danger">{errors.cu_mobile.message}</span>}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* Image Upload Section */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Customer Images</Form.Label>

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

        <Tabs defaultActiveKey="Contact Person" id="Contact Person">
          <Tab eventKey="other" title="Other Details">
            <Form.Group className="mt-2">
              <Form.Label>PAN/Emirates ID</Form.Label>
              <Form.Control
                type="text"
                {...register('cu_pan_no', {
                  required: 'PAN/Emirates ID is required',
                  pattern: {
                    value: /^[A-Za-z0-9]+$/, // Allows only letters and numbers
                    message: 'Only letters and numbers are allowed',
                  },
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '') // Removes non-alphanumeric characters
                }}
                min={4}
                maxLength={20}
                className="text-uppercase"
                placeholder="Enter PAN/Emirates ID is required"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Currency</Form.Label>

              <div>
                <Controller
                  name="cu_currency"
                  control={control}
                  render={({ field }) => (
                    <Form.Select {...field} className="form-control">
                      <option value="">{watch('cu_currency') || 'Select Currency'}</option>
                      <option value="AED - United State Emirates">
                        AED - United ARAB Emirates
                      </option>
                      <option value="INR - Indian Rupee">INR - Indian Rupee</option>
                      <option value="USD - US Dollar">USD - US Dollar</option>
                      <option value="EUR - Euro">EUR - Euro</option>
                    </Form.Select>
                  )}
                />
              </div>

              {/* <p>Selected Currency: {watch('cu_currency')}</p> */}
            </Form.Group>

            <Form.Group>
              <Form.Label>Opening Balance</Form.Label>
              <Form.Control
                {...register('cu_opening_balance')}
                type="text"
                placeholder="Opening Balance"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '') // Removes non-numeric characters
                }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Payment Terms</Form.Label>

              <div>
                <Controller
                  name="cu_payment_terms"
                  control={control}
                  render={({ field }) => (
                    <Form.Select {...field} className="form-control">
                      <option value="">{watch('cu_payment_terms') || 'Due On Receipt'}</option>
                      <option>Net 30</option>
                      <option>Net 60</option>
                    </Form.Select>
                  )}
                />
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>Department</Form.Label>
              <Form.Control
                {...register('cu_department')}
                type="text"
                placeholder="Enter department"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                }}
                className="text-capitalize"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Designation</Form.Label>
              <Form.Control
                {...register('cu_designation')}
                type="text"
                placeholder="Enter designation"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                }}
                className="text-capitalize"
              />
            </Form.Group>

            {/* <Form.Group>
                <Form.Label>Twitter</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    {...register('twitter')}
                    type="url"
                    placeholder="http://www.twitter.com/"
                  />
                  <AiOutlineClose className="ms-2 text-danger" style={{ cursor: 'pointer' }} />
                </div>
              </Form.Group> */}
          </Tab>

          <Tab eventKey="address" title="Address">
            <div className="row mt-4">
              <div className="col-md-6">
                <h5>Billing Address</h5>
                <div className="mb-3 mt-5">
                  <label htmlFor="cu_b_addr_attention" className="form-label">
                    Attention
                  </label>
                  <input
                    type="text"
                    id="cu_b_addr_attention"
                    className="form-control text-capitalize"
                    // Assuming you're using React Hook Form
                    {...register('cu_b_addr_attention')}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cu_b_addr_country" className="form-label">
                    Country / Region
                  </label>

                  <Controller
                    name="cu_b_addr_country"
                    control={control}
                    render={({ field }) => (
                      <Form.Select {...field} className="form-control">
                        <option value="">{watch('cu_b_addr_country') || 'Select Country'}</option>
                        <option value="UAE">United ARAB Emirates </option>
                        <option value="US">United States</option>
                        <option value="IN">India</option>
                      </Form.Select>
                    )}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cu_b_addr_address" className="form-label">
                    Address
                  </label>
                  <textarea
                    type="text"
                    id="cu_b_addr_address"
                    className="form-control text-capitalize"
                    rows={3} // Specifies 3 lines of text
                    placeholder="Street 1"
                    {...register('cu_b_addr_address')}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                    }}
                  />
                </div>
                {/* <div className="mb-3">
                  <input
                    type="text"
                    id="billingAddress2"
                    className="form-control"
                    placeholder="Street 2"
                    {...register('billingAddress2')}
                  />
                </div> */}
                <div className="mb-3">
                  <label htmlFor="cu_b_addr_state" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    id="cu_b_addr_state"
                    className="form-control text-capitalize"
                    {...register('cu_b_addr_state')}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cu_b_addr_city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    id="cu_b_addr_city"
                    className="form-control text-capitalize"
                    {...register('cu_b_addr_city')}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="cu_b_addr_pincode" className="form-label">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="cu_b_addr_pincode"
                    className="form-control text-capitalize"
                    {...register('cu_b_addr_pincode', {
                      pattern: {
                        value: /^[0-9]{6,12}$/, // Allows only numbers, min 6, max 12 digits
                        message: 'PIN must be between 6 and 12 digits',
                      },
                    })}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 12) // Allow only numbers, limit to 12 digits
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cu_b_addr_phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="cu_b_addr_phone"
                    className="form-control"
                    placeholder="Mobile"
                    maxLength={15} // Adjust as per your country's mobile number length
                    inputMode="numeric" // Opens numeric keypad on mobile devices
                    {...register('cu_b_addr_phone', {
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[0-9]{15}$/, // Allows exactly 10 digits
                        message: 'Enter a valid  mobile number',
                      },
                    })}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '') // Removes non-numeric characters
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cu_b_addr_fax_number" className="form-label">
                    Fax Number
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    min={4}
                    id="cu_b_addr_fax_number"
                    className="form-control"
                    {...register('cu_b_addr_fax_number')}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '') // Removes non-numeric characters
                    }}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <h5>Shipping Address</h5>
                {/* <div className="mb-3">
                  <input
                    type="checkbox"
                    id="sameAddress"
                    className="form-check-input"
                    checked={isSameAddress}
                    onChange={handleSameAddressChange}
                  />
                  <label htmlFor="sameAddress" className="form-check-label ms-2">
                    Billing address and shipping address are the same
                  </label>
                </div> */}
                <div className="mb-3">
                  <label htmlFor="cu_s_addr_attention" className="form-label">
                    Attention
                  </label>
                  <input
                    type="text"
                    id="cu_s_addr_attention"
                    className="form-control text-capitalize"
                    {...register('cu_s_addr_attention')}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cu_s_addr_country" className="form-label">
                    Country / Region
                  </label>

                  <Controller
                    name="cu_s_addr_country"
                    control={control}
                    render={({ field }) => (
                      <Form.Select {...field} className="form-control">
                          <option value="UAE">United Arab States</option>
                        <option value="US">United States</option>
                        <option value="IN">India</option>
                      </Form.Select>
                    )}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cu_s_addr_address" className="form-label">
                    Address
                  </label>
                  <textarea
                    type="text"
                    id="cu_s_addr_address"
                    className="form-control text-capitalize"
                    rows={3} // Specifies 3 lines of text
                    placeholder="Street 1"
                    {...register('cu_s_addr_address')}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="cu_s_addr_state" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    id="cu_s_addr_state"
                    className="form-control text-capitalize"
                    {...register('cu_s_addr_state')}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="cu_s_addr_city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    id="cu_s_addr_city"
                    className="form-control text-capitalize"
                    {...register('cu_s_addr_city')}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                    }}
                    // value={isSameAddress ? watch('cu_s_addr_city') : ''}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="cu_s_addr_pincode" className="form-label">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="cu_s_addr_pincode"
                    className="form-control"
                    {...register('cu_s_addr_pincode', {
                      pattern: {
                        value: /^[0-9]{6,12}$/, // Allows only numbers, min 6, max 12 digits
                        message: 'PIN must be between 6 and 12 digits',
                      },
                    })}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 12) // Allow only numbers, limit to 12 digits
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cu_s_addr_phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="cu_s_addr_phone"
                    className="form-control"
                    placeholder="Mobile"
                    maxLength={15} // Adjust as per your country's mobile number length
                    inputMode="numeric" // Opens numeric keypad on mobile devices
                    {...register('cu_s_addr_phone', {
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[0-9]{15}$/, // Allows exactly 10 digits
                        message: 'Enter a valid  mobile number',
                      },
                    })}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '') // Removes non-numeric characters
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="cu_s_addr_fax_number" className="form-label">
                    Fax Number
                  </label>
                  <input
                    type="text"
                    id="cu_s_addr_fax_number"
                    maxLength={15}
                    min={4}
                    inputMode="numeric" 

                    className="form-control"
                    {...register('cu_s_addr_fax_number')}
                    // value={isSameAddress ? watch('cu_s_addr_fax_number') : ''}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '') // Removes non-numeric characters
                    }}
                  />
                </div>
              </div>
            </div>
          </Tab>

          <Tab eventKey="Contact Person" title="Contact Person">
            <Table striped bordered responsive hover className="mt-4">
              <thead>
                <tr>
                  <th>Salutation</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email Address</th>
                  <th>Work Phone</th>
                  <th>Mobile</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((contact, index) => (
                  <tr key={contact.id}>
                    <td>
                      <Form.Select {...register(`contacts.${index}.ccp_salutation`)}>
                        <option value="">Select</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        {...register(`contacts.${index}.ccp_firstname`, {
                          required: 'First name is required',
                          pattern: {
                            value: /^[A-Za-z\s]+$/, // Allows only letters and spaces
                            message: 'Only letters and spaces are allowed',
                          },
                        })}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove numbers & special characters
                        }}
                      />
                      {errors.contacts?.[index]?.ccp_firstname && (
                        <span className="text-danger">
                          {errors.contacts[index].ccp_firstname.message}
                        </span>
                      )}
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        {...register(`contacts.${index}.ccp_lastname`)}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove numbers & special characters
                        }}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="email"
                        {...register(
                          `contacts.${index}.ccp_email`,

                          {
                            required: 'Email is required',
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Standard email regex
                              message: 'Enter a valid email address',
                            },
                          },
                        )}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^a-zA-Z0-9@._%+-]/g, '') // Prevents invalid characters
                        }}
                      />
                      {errors.contacts?.[index]?.ccp_email && (
                        <span className="text-danger">
                          {errors.contacts[index].ccp_email.message}
                        </span>
                      )}
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        {...register(
                          `contacts.${index}.ccp_phone`,

                          {
                            required: 'Phone number is required',
                            pattern: {
                              value: /^[0-9]{7,15}$/, // Allows only numbers (7 to 15 digits)
                              message: 'Phone number must be between 7 and 15 digits',
                            },
                            minLength: { value: 7, message: 'Minimum 7 digits required' },
                            maxLength: { value: 15, message: 'Maximum 15 digits allowed' },
                          },
                        )}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, '') // Remove non-numeric characters
                        }}
                        placeholder="Enter phone number"
                      />
                      {errors.contacts?.[index]?.ccp_phone && (
                        <span className="text-danger">
                          {errors.contacts[index].ccp_phone.message}
                        </span>
                      )}
                    </td>
                    <td>
                      <Form.Control type="text" {...register(`contacts.${index}.ccp_mobile`
                        , {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[0-9]{7,15}$/, // Allows only numbers (7 to 15 digits)
                            message: 'Phone number must be between 7 and 15 digits',
                          },
                          minLength: { value: 7, message: 'Minimum 7 digits required' },
                          maxLength: { value: 15, message: 'Maximum 15 digits allowed' },
                        })}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, '') // Remove non-numeric characters
                        }}
                      />
                      {errors.contacts?.[index]?.ccp_mobile && (
                        <span className="text-danger">
                          {errors.contacts[index].ccp_mobile.message}
                        </span>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleShowDeleteModal(index, contact.ccp_id)}
                      >
                        ✖
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>

          <Button
            type="button"
            onClick={() =>
              append({
                ccp_salutation: '',
                ccp_firstname: '',
                ccp_lastname: '',
                ccp_email: '',
                ccp_phone: '',
                ccp_mobile: '',
              })
            }
          >
            ➕ Add Contact
          </Button>
        </Tabs>
        <div className="text-center mb-5">
          <Button disabled={loading} variant="success" type="submit" className="w-50 mt-3">
            {loading ? (
              <Spinner animation="border" size="sm" className="me-2" />
            ) : (
              'Save & Continue'
            )}
          </Button>
        </div>
      </Form>

      {/* Delete Confirmation Modal list */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this contact?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CustomerView

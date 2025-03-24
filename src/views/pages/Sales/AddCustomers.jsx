import React, { useCallback, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
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

import '../Sales/Customers.css'
const AddCustomers = () => {
  const user_id = sessionStorage.getItem('user_id')
  const [loader, setLoader] = useState(false)
  const [imagebinary, setImagebinary] = useState(null)

  const token = sessionStorage.getItem('token')

  const [showModal, setShowModal] = useState(false)
  const handleClose = () => setShowModal(false)
  const [modalMessage, setModalMessage] = useState('')

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
      contacts: [
        {
          ccp_salutation: '',
          ccp_firstname: '',
          ccp_lastname: '',
          ccp_email: '',
          ccp_phone: '',
          ccp_mobile: '',
        },
      ],
      files: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
  })

  const contacts = watch('contacts') // Watching for changes

  const handleUpdate = (index, field, value) => {
    const updatedContacts = [...contacts]
    updatedContacts[index][field] = value
    setValue('contacts', updatedContacts) // Ensures the field updates in React Hook Form
  }

  const onSubmit = async (data) => {
    setLoader(true)
    try {
      const formData = new FormData()
      formData.append('user_id', user_id)

      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append('image', file)
        })
      }
      formData.append('cu_salutation', data.salutationman)
      formData.append('cu_first_name', data.firstName)
      formData.append('cu_last_name', data.lastNamemanti)
      formData.append('cu_company_name', data.companyName)
      formData.append('cu_display_name', data.displayName)
      formData.append('cu_email', data.cu_email)
      // formData.append('cu_phone', data.linephone)
      formData.append('cu_mobile', data.Mobile)
      formData.append('cu_pan_no', data.pan)
      formData.append('cu_opening_balance', data.openingBalance)
      // formData.append('cu_website', data.cu_website)
      formData.append('cu_designation', data.designation)
      formData.append('cu_department', data.department)
      formData.append('cu_type', data.customerType)
      formData.append('cu_currency', data.currency)
      formData.append('cu_payment_terms', data.paymentTerms)
      // formData.append('cu_portal_language', data.portalLanguage)
      // formData.append('cu_portal_access', data.enablePortal)
      // formData.append('cu_remarks', data.cu_remarks)

      // Append Billing Address
      formData.append('cu_b_addr_attention', data.billingAttention)
      formData.append('cu_b_addr_country', data.billingCountry)
      formData.append('cu_b_addr_address', `${data.billingAddress1} ${data.billingAddress2}`.trim())
      formData.append('cu_b_addr_city', data.billingCity)
      formData.append('cu_b_addr_state', data.billingState)
      formData.append('cu_b_addr_pincode', data.billingPin)
      formData.append('cu_b_addr_phone', data.billingPhone)
      formData.append('cu_b_addr_fax_number', data.fax_number)

      // Append Shipping Address
      if (isSameAddress) {
        formData.append('cu_s_addr_attention', data.billingAttention)
        formData.append('cu_s_addr_country', data.billingCountry)
        formData.append(
          'cu_s_addr_address',
          `${data.billingAddress1} ${data.billingAddress2}`.trim(),
        )
        formData.append('cu_s_addr_city', data.billingCity)
        formData.append('cu_s_addr_state', data.billingState)
        formData.append('cu_s_addr_pincode', data.billingPin)
        formData.append('cu_s_addr_phone', data.billingPhone)
        formData.append('cu_s_addr_fax_number', data.fax_number)
      } else {
        formData.append('cu_s_addr_attention', data.cu_s_addr_attention)
        formData.append('cu_s_addr_country', data.cu_s_addr_country)
        formData.append(
          'cu_s_addr_address',
          `${data.cu_s_addr_address} ${data.cu_s_addr_address2}`.trim(),
        )
        formData.append('cu_s_addr_city', data.cu_s_addr_city)
        formData.append('cu_s_addr_state', data.cu_s_addr_state)
        formData.append('cu_s_addr_pincode', data.cu_s_addr_pincode)
        formData.append('cu_s_addr_phone', data.cu_s_addr_phone)
        formData.append('cu_s_addr_fax_number', data.cu_s_addr_fax_number)
      }

      // Append contact persons array as JSON
      formData.append('contact_person', JSON.stringify(data.contacts))

      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/add-customer',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )

      if (response.data.result === true) {
        setModalMessage({ type: 'success', message: response.data.message })
        setShowModal(true)
        reset()
        setTimeout(() => {
          setShowModal(false)
        }, 3000)
      } else {
        setModalMessage({ type: 'fail', message: response.data.message })
        setShowModal(true)
        setTimeout(() => {
          setShowModal(false)
        }, 3000)
      }
    } catch (error) {
      setModalMessage({ type: 'fail', message: 'Something went wrong. Please try again.' })
      setShowModal(true)
      setTimeout(() => {
        setShowModal(false)
      }, 3000)
    } finally {
      setLoader(false)
    }
  }

  const [isSameAddress, setIsSameAddress] = useState(false)

  // Handle "Same as Billing" checkbox change
  const handleSameAddressChange = (e) => {
    const checked = e.target.checked
    setIsSameAddress(checked)

    if (checked) {
      setValue('cu_s_addr_attention', watch('billingAttention'))
      setValue('cu_s_addr_country', watch('billingCountry'))
      setValue('cu_s_addr_address', watch('billingAddress1'))
      setValue('cu_s_addr_address2', watch('billingAddress2'))
      setValue('cu_s_addr_city', watch('billingCity'))
      setValue('cu_s_addr_state', watch('billingState'))
      setValue('cu_s_addr_pincode', watch('billingPin'))
      setValue('cu_s_addr_phone', watch('billingPhone'))
      setValue('cu_s_addr_fax_number', watch('fax_number'))
    } else {
      // Clear fields for manual entry
      setValue('cu_s_addr_attention', '')
      setValue('cu_s_addr_country', '')
      setValue('cu_s_addr_address', '')
      setValue('cu_s_addr_address2', '')
      setValue('cu_s_addr_city', '')
      setValue('cu_s_addr_state', '')
      setValue('cu_s_addr_pincode', '')
      setValue('cu_s_addr_phone', '')
      setValue('cu_s_addr_fax_number', '')
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
        <h4>New Customer</h4>
        {/* <a href="#" style={{ textDecoration: 'underline', color: '#007bff' }}>
          Fetch Customer Details From GSTN
        </a> */}

        <Form.Group as={Row} className="my-3">
          <Form.Label column sm={3}>
            Customer Type
          </Form.Label>
          <Col sm={9}>
            <Form.Check
              inline
              type="radio"
              label="Business"
              value="Business"
              {...register('customerType', { required: true })}
            />
            <Form.Check
              inline
              type="radio"
              label="Individual"
              value="Individual"
              {...register('customerType', { required: true })}
            />
            {errors.customerType && <span className="text-danger">This field is required</span>}
          </Col>
        </Form.Group>

        <Row className="mb-3">
          <Form.Label column sm={3}>
            Primary Contact
          </Form.Label>
          <Col sm={3}>
            <Form.Select {...register('salutationman', { required: 'Salutation is required' })}>
              <option value="">Salutation</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Dr.">Dr.</option>
            </Form.Select>
            {errors.salutationman && <span className="text-danger">Salutation is required</span>}
          </Col>

          <Col sm={3}>
            <Form.Control
              min={1}
              className="text-capitalize"
              maxLength={60}
              placeholder="First Name"
              {...register('firstName', {
                required: 'First name is required',
                pattern: {
                  value: /^[A-Za-z\s]+$/, // Only allows letters and spaces
                  message: 'Only letters and spaces are allowed',
                },
              })}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
              }}
            />
            {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
          </Col>

          <Col sm={3}>
            <Form.Control
              className="text-capitalize"
              min={1}
              maxLength={60}
              placeholder="Last Name"
              {...register('lastNamemanti', {
                required: 'Last Name is required',
                pattern: {
                  value: /^[A-Za-z\s]+$/, // Only allows letters and spaces
                  message: 'Only letters and spaces are allowed',
                },
              })}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
              }}
            />
            {errors.lastNamemanti && <span className="text-danger">last Name is required</span>}
          </Col>
        </Row>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3}>
            Company Name
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              className="text-capitalize"
              min={2}
              maxLength={60}
              placeholder="Company Name"
              {...register('companyName', {
                required: 'Company Name is required',
                pattern: {
                  value: /^[A-Za-z\s]+$/, // Only allows letters and spaces
                  message: 'Only letters and spaces are allowed',
                },
              })}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
              }}
            />
            {errors.companyName && (
              <span className="text-danger">{errors.companyName.message}</span>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3}>
            Display Name
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              className="text-capitalize"
              min={1}
              maxLength={60}
              placeholder="Display Name"
              {...register('displayName', {
                pattern: {
                  value: /^[A-Za-z\s]+$/, // Only allows letters and spaces
                  message: 'Only letters and spaces are allowed',
                },
              })}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
              }}
            />
            {errors.displayName && <span className="text-danger">Display Name is required</span>}
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3}>
            Email Address
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="email"
              placeholder="Email Address"
              {...register('cu_email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Invalid email format',
                },
              })}
            />
            {errors.cu_email && <span className="text-danger">{errors.cu_email.message}</span>}
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3}>
            Phone
          </Form.Label>

          <Col sm={5}>
            <Form.Control
              type="text"
              placeholder="Mobile"
              maxLength={15} // Ensures no more than 15 characters
              inputMode="numeric" // Opens numeric keypad on mobile devices
              {...register('Mobile', {
                required: 'Mobile number is required',
                pattern: {
                  value: /^[0-9]{7,15}$/, // Allows between 7 to 15 digits
                  message: 'Enter a valid mobile number (7-15 digits)',
                },
              })}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, '') // Removes non-numeric characters
              }}
            />
            {errors.Mobile && <span className="text-danger">{errors.Mobile.message}</span>}
          </Col>
        </Form.Group>

        <div className=" mt-4">
          <Tabs defaultActiveKey="address" id="address-tabs">
            <Tab eventKey="other" title="Other Details">
              <Form.Group className="mt-2">
                <Form.Label>PAN (India)/Emirates ID (UAE)</Form.Label>
                <Form.Control
                  {...register('pan', {
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
                  type="text"
                  placeholder="Enter PAN/Emirates ID is required"
                />
                {errors.pan && <span className="text-danger">{errors.pan.message}</span>}
              </Form.Group>

              <Form.Group>
                <Form.Label>Currency</Form.Label>
                <Form.Select {...register('currency', { required: 'Currency is required' })}>
                  <option>AED - United ARAB Emirates</option>
                  <option>INR - Indian Rupee</option>
                  <option>USD - US Dollar</option>
                </Form.Select>
                {errors.currency && <span className="text-danger">{errors.currency.message}</span>}
              </Form.Group>

              <Form.Group>
                <Form.Label>Opening Balance</Form.Label>
                <Form.Control
                  {...register('openingBalance', { required: 'Opening Balance is required' })}
                  type="text"
                  placeholder="Opening Balance"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, '') // Removes non-numeric characters
                  }}
                />
                {errors.openingBalance && (
                  <span className="text-danger">{errors.openingBalance.message}</span>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Label>Payment Terms</Form.Label>
                <Form.Select
                  {...register('paymentTerms', { required: 'Payment Terms  is required' })}
                >
                  <option value="" disabled selected hidden>
                    Due on Receipt
                  </option>

                  <option>Net 30</option>
                  <option>Net 60</option>
                </Form.Select>
                {errors.paymentTerms && (
                  <span className="text-danger">{errors.paymentTerms.message}</span>
                )}
              </Form.Group>

              {/* <Form.Group>
                <Form.Label>Portal Language</Form.Label>
                <Form.Select {...register('portalLanguage')}>
                  <option>English</option>
                  <option>Hindi</option>
                </Form.Select>
              </Form.Group> */}

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

              <Form.Group>
                <Form.Label>Department</Form.Label>
                <Form.Control
                  {...register('department')}
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
                  {...register('designation')}
                  type="text"
                  placeholder="Enter designation"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                  }}
                  className="text-capitalize"
                />
              </Form.Group>
            </Tab>
            <Tab eventKey="address" title="Address">
              <div className="row mt-4">
                <div className="col-md-6">
                  <h5>Billing Address</h5>
                  <div className="mb-3 mt-5">
                    <label htmlFor="billingAttention" className="form-label">
                      Attention
                    </label>
                    <input
                      type="text"
                      id="billingAttention"
                      className="form-control text-capitalize"
                      {...register('billingAttention', { required: 'Attention is required' })}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                      }}
                    />
                    {errors.billingAttention && (
                      <span className="text-danger">{errors.billingAttention.message}</span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="billingCountry" className="form-label">
                      Country / Region
                    </label>
                    <select
                      id="billingCountry"
                      className="form-select"
                      {...register('billingCountry', { required: 'Country is required' })}
                    >
                      
                      <option value="UAE">United ARAB Emirates </option>
                      <option value="US">United States</option>
                      <option value="IN">India</option>
                    </select>
                    {errors.billingCountry && (
                      <span className="text-danger">{errors.billingCountry.message}</span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="billingAddress1" className="form-label">
                      Address
                    </label>
                    <textarea
                      id="billingAddress1"
                      className="form-control text-capitalize"
                      placeholder="Street 1"
                      rows={3} // Specifies 3 lines of text
                      {...register('billingAddress1', { required: 'Address is required' })}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                      }}
                    />

                    {errors.billingAddress1 && (
                      <span className="text-danger">{errors.billingAddress1.message}</span>
                    )}
                  </div>
                  <div className="mb-3">
                    <textarea
                      id="billingAddress2"
                      className="form-control text-capitalize"
                      placeholder="Street 2"
                      {...register('billingAddress2')}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="billingState" className="form-label">
                      State
                    </label>
                    <input
                      type="text"
                      id="billingState"
                      className="form-control text-capitalize"
                      {...register('billingState', { required: 'State is required' })}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                      }}
                    />

                    {errors.billingState && (
                      <span className="text-danger">{errors.billingState.message}</span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="billingCity" className="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      id="billingCity"
                      className="form-control text-capitalize"
                      {...register('billingCity', { required: 'City is required' })}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                      }}
                    />
                    {errors.billingCity && (
                      <span className="text-danger">{errors.billingCity.message}</span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="billingPin" className="form-label">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="billingPin"
                      className="form-control"
                      {...register('billingPin', {
                        required: 'PIN is required',
                        pattern: {
                          value: /^[0-9]{6,12}$/, // Allows only numbers, min 6, max 12 digits
                          message: 'PIN must be between 6 and 12 digits',
                        },
                      })}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 12) // Allow only numbers, limit to 12 digits
                      }}
                    />
                    {errors.billingPin && (
                      <span className="text-danger">{errors.billingPin.message}</span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="billingPhone" className="form-label">
                      Phone
                    </label>
                    <input
                      type="text"
                      id="billingPhone"
                      className="form-control"
                      placeholder="Mobile"
                      maxLength={15} // Adjust as per your country's mobile number length
                      inputMode="numeric" // Opens numeric keypad on mobile devices
                      {...register('billingPhone', {
                        required: 'Mobile number is required',
                        pattern: {
                          value: /^[0-9]{7,15}$/, // Allows exactly 10 digits
                          message: 'Enter a valid  mobile number',
                        },
                      })}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, '') // Removes non-numeric characters
                      }}
                    />
                    {errors.billingPhone && (
                      <span className="text-danger">{errors.billingPhone.message}</span>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="fax_number" className="form-label">
                      Fax Number
                    </label>
                    <input
                      type="text"
                      id="fax_number"
                      className="form-control"
                      maxLength={15}
                      min={4}
                      {...register('fax_number')}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, '') // Removes non-numeric characters
                      }}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <h5>Shipping Address</h5>
                  <div className="mb-3">
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
                  </div>
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
                    <select
                      id="cu_s_addr_country"
                      className="form-select"
                      {...register('cu_s_addr_country')}
                      disabled={isSameAddress} // Only disable when checked
                    >
                      <option value="">Select</option>
                      <option value="UAE">United Arab States</option>

                      <option value="US">United States</option>
                      <option value="IN">India</option>
                    </select>
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
                    <textarea
                      type="text"
                      id="cu_s_addr_address2"
                      className="form-control"
                      placeholder="Street 2"
                      {...register('cu_s_addr_address2')}
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
                      className="form-control"
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
                      className="form-control"
                      {...register('cu_s_addr_city')}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                      }}
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
                      className="form-control"
                      maxLength={15}
                      min={4}
                      {...register('cu_s_addr_fax_number')}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, '') // Removes non-numeric characters
                      }}
                    />
                  </div>
                </div>
              </div>
            </Tab>

            <Tab eventKey="contactperson" title="Contact Person">
              <Table striped bordered responsive hover>
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
                          {...register(`contacts.${index}.ccp_email`, {
                            required: 'Email is required',
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Standard email regex
                              message: 'Enter a valid email address',
                            },
                          })}
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
                          {...register(`contacts.${index}.ccp_phone`, {
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
                          placeholder="Enter phone number"
                        />
                        {errors.contacts?.[index]?.ccp_phone && (
                          <span className="text-danger">
                            {errors.contacts[index].ccp_phone.message}
                          </span>
                        )}
                      </td>

                      <td>
                        <Form.Control
                          type="text"
                          {...register(`contacts.${index}.ccp_mobile`, {
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
                        <Button variant="danger" size="sm" onClick={() => remove(index)}>
                          ✖
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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
            </Tab>
          </Tabs>
        </div>

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

export default AddCustomers

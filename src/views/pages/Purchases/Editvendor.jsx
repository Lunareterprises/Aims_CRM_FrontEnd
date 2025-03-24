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

const Editvendor = () => {
  const user_id = sessionStorage.getItem('user_id')
  const token = sessionStorage.getItem('token')
  const { ve_id } = useParams()
  const Navi = useNavigate()

  const [loading, setLoading] = useState(false)
  const [loadingedit, setLoadingedit] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [products, setProducts] = useState([])
  const [productscontact, setProductscontact] = useState([])

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
      ve_mobile: '',
      ve_email: '',
      contacts: [],
      documents: [],
      bankdetails: [],
    },
  })

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
      const data = { vendor_id: ve_id }
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/list/vendors',
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

        setValue('ve_b_addr_country', vendorData?.ve_b_addr_country || '')

        // Populate Form Fields with API Data
        reset({
          full_name: `${vendorData.ve_salutation} ${vendorData.ve_first_name} ${vendorData.ve_last_name}`,
          ve_company_name: vendorData.ve_company_name,
          ve_email: vendorData.ve_email,
          ve_mobile: vendorData.ve_mobile,
          ve_pan_no: vendorData.ve_pan_no,
          ve_currency: vendorData.ve_currency,

          ve_opening_balance: vendorData.ve_opening_balance,
          ve_payment_terms: vendorData.ve_payment_terms,
          ve_tds: vendorData.ve_tds,

          //-------------------

          ve_b_addr_country: vendorData.ve_b_addr_country,

          ve_b_addr_state: vendorData.ve_b_addr_state,

          ve_b_addr_address: vendorData.ve_b_addr_address,

          ve_b_addr_attention: vendorData.ve_b_addr_attention,

          ve_b_addr_city: vendorData.ve_b_addr_city,

          ve_b_addr_pincode: vendorData.ve_b_addr_pincode,

          ve_b_addr_phone: vendorData.ve_b_addr_phone,
          ve_b_addr_fax_number: vendorData.ve_b_addr_fax_number,

          ve_s_addr_country: vendorData.ve_s_addr_country,

          ve_s_addr_state: vendorData.ve_s_addr_state,

          ve_s_addr_address: vendorData.ve_s_addr_address,

          ve_s_addr_attention: vendorData.ve_s_addr_attention,

          ve_s_addr_city: vendorData.ve_s_addr_city,

          ve_s_addr_pincode: vendorData.ve_s_addr_pincode,

          ve_s_addr_phone: vendorData.ve_s_addr_phone,
          ve_s_addr_fax_number: vendorData.ve_s_addr_fax_number,
          //-----------------------

          contacts: vendorData.contact_persons.map((contact) => ({
            ccp_salutation: contact.vcp_salutation,
            ccp_firstname: contact.vcp_first_name,
            ccp_lastname: contact.vcp_last_name,
            ccp_email: contact.vcp_email,
            ccp_phone: contact.vcp_phone,
            ccp_mobile: contact.vcp_mobile,
          })),

          documents: vendorData.documents.map((contact) => ({
            pd_id: contact.pd_id,
            pd_file: contact.pd_file,
          })),

          bankdetails: vendorData.bank_details.map((contactbankdetails) => ({
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

      formDataappend.append('ve_id', ve_id)

      formDataappend.append('ve_mobile', formData.ve_mobile)
      formDataappend.append('ve_email', formData.ve_email)

      formDataappend.append('ve_pan_no', formData.ve_pan_no)
      formDataappend.append('ve_currency', formData.ve_currency)
      formDataappend.append('ve_opening_balance', formData.ve_opening_balance)
      formDataappend.append('ve_payment_terms', formData.ve_payment_terms)
      formDataappend.append('ve_tds', formData.ve_tds)

      formDataappend.append('ve_b_addr_attention', formData.ve_b_addr_attention)
      formDataappend.append('ve_b_addr_country', formData.ve_b_addr_country)
      formDataappend.append('ve_b_addr_address', formData.ve_b_addr_address)
      formDataappend.append('ve_b_addr_city', formData.ve_b_addr_city)
      formDataappend.append('ve_b_addr_state', formData.ve_b_addr_state)
      formDataappend.append('ve_b_addr_pincode', formData.ve_b_addr_pincode)
      formDataappend.append('ve_b_addr_phone', formData.ve_b_addr_phone)
      formDataappend.append('ve_b_addr_fax_number', formData.ve_b_addr_fax_number)
      formDataappend.append('ve_s_addr_attention', formData.ve_s_addr_attention)
      formDataappend.append('ve_s_addr_country', formData.ve_s_addr_country)
      formDataappend.append('ve_s_addr_address', formData.ve_s_addr_address)
      formDataappend.append('ve_s_addr_city', formData.ve_s_addr_city)
      formDataappend.append('ve_s_addr_state', formData.ve_s_addr_state)
      formDataappend.append('ve_s_addr_pincode', formData.ve_s_addr_pincode)
      formDataappend.append('ve_s_addr_phone', formData.ve_s_addr_phone)
      formDataappend.append('ve_s_addr_fax_number', formData.ve_s_addr_fax_number)

      formDataappend.append('contact_persons', JSON.stringify(formData.contacts))
      documents.forEach((img, index) => {
        if (img.file) {
          // Append new uploaded file
          formDataappend.append(`image`, img.file)
        } else if (img.pd_file) {
          // Append existing file as a Blob/File instead of just a reference
          const existingFile = new File([img.pd_file], `existing_image_${index}.jpg`, {
            type: 'image/jpeg',
          })
          formDataappend.append(`${img.pd_id}`, existingFile)
        }
      })
      formDataappend.append('bankdetails', JSON.stringify(formData.bankdetails))

      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/edit/vendor',
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

  const onSubmitIndividualBank = async (index) => {
    setLoadingedit(true)
    const bankDetail = getValues(`bankdetails.${index}`)

    const dataforam = new FormData()

    dataforam.append('ve_id', bankDetail.vbd_vendor_id),
      dataforam.append('vbd_id', bankDetail.vbd_id),
      dataforam.append('vbd_acc_name', bankDetail.vbd_acc_name),
      dataforam.append(' vbd_bank_name', bankDetail.vbd_bank_name),
      dataforam.append('vbd_acc_number', bankDetail.vbd_acc_number),
      dataforam.append('vbd_ifsc_code', bankDetail.vbd_ifsc_code)

    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/edit/vendor-bank-details',
        dataforam,
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

        setTimeout(() => setShowModal(false), 3000)
      } else {
        setModalMessage({ type: 'fail', message: response.data.message })
        setShowModal(true)

        setTimeout(() => setShowModal(false), 3000)
      }
    } catch (error) {
      console.error('Error updating bank detail:', error)
    } finally {
      setLoadingedit(false)
    }
  }

  // const [imagebinary, setImagebinary] = useState(null)

  // //-----------------imgupload
  // const [image, setImage] = useState(null)

  // // Handle file drop
  // const onDrop = useCallback(
  //   (acceptedFiles) => {
  //     const file = acceptedFiles[0]
  //     setImagebinary(file)
  //     const previewURL = URL.createObjectURL(file)
  //     setImage(previewURL)
  //     setValue('image', file) // Store file in useForm
  //   },
  //   [setValue],
  // )

  // const { getRootProps, getInputProps } = useDropzone({
  //   accept: 'image/*',
  //   onDrop,
  // })

  // // Remove the uploaded image
  // const removeImage = () => {
  //   setImage(null)
  //   setValue('image', null)
  // }

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
      <h2 className="mt-4 mb-3">Vendor Details</h2>

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
              <Form.Control type="text" {...register('ve_company_name')} disabled />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                {...register('ve_email', {
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
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                type="text"
                {...register(
                  've_mobile',

                  {
                    required: 'Mobile number is required',
                    pattern: {
                      value: /^[0-9]{7,15}$/, // Allows only numbers, min 7, max 15 digits
                      message: 'Mobile number must be between 7 and 15 digits',
                    },
                  },
                )}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 15) // Allow only numbers, limit to 15 digits
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          {/* Image Upload Section */}

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Vendor Images</Form.Label>

              {/* Display Uploaded Images */}
              <div className="mt-3 d-flex flex-wrap">
                {/* {watch('documents').map((image, index) => ( */}
                {watch('documents')?.map((doc, index) => {
                  // Determine if the file is a PDF. If pd_file exists, check its extension.
                  const isPdf =
                    (doc.pd_file && doc.pd_file.toLowerCase().endsWith('.pdf')) ||
                    (doc.file && doc.file.type === 'application/pdf')

                  return (
                    <div key={doc.pd_id || index} className="position-relative me-2 mb-2">
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
                          src={doc.preview || `https://lunarsenterprises.com:5016/${doc.pd_file}`}
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
                {...register('ve_pan_no', {
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
                  name="ve_currency"
                  control={control}
                  render={({ field }) => (
                    <Form.Select {...field} className="form-control">
                      <option value="">{watch('ve_currency') || 'Select Currency'}</option>
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

              {/* <p>Selected Currency: {watch('ve_currency')}</p> */}
            </Form.Group>

            <Form.Group>
              <Form.Label>Opening Balance</Form.Label>
              <Form.Control
                {...register('ve_opening_balance')}
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
                  name="ve_payment_terms"
                  control={control}
                  render={({ field }) => (
                    <Form.Select {...field} className="form-control">
                      <option value="">{watch('ve_payment_terms') || 'Due On Receipt'}</option>
                      <option>Net 30</option>
                      <option>Net 60</option>
                    </Form.Select>
                  )}
                />
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>TDS</Form.Label>

              <div>
                <Controller
                  name="ve_tds"
                  control={control}
                  render={({ field }) => (
                    <Form.Select {...field} className="form-control">
                      <option value="">{watch('ve_tds') || 'select TDS'}</option>

                      <option> Commission or Brokerage [2%] </option>
                      <option>Commission or Brokerage (Reduced) [3.75%]</option>

                      <option>Dividend [10%]</option>
                      <option> Dividend (Reduced) [7.5%]</option>
                      <option>Other Interest than securities [10%]</option>
                    </Form.Select>
                  )}
                />
              </div>
            </Form.Group>
          </Tab>

          <Tab eventKey="address" title="Address">
            <div className="row mt-4">
              <div className="col-md-6">
                <h5>Billing Address</h5>
                <div className="mb-3 mt-5">
                  <label htmlFor="ve_b_addr_attention" className="form-label">
                    Attention
                  </label>
                  <input
                    type="text"
                    id="ve_b_addr_attention"
                    className="form-control text-capitalize"
                    // Assuming you're using React Hook Form
                    {...register('ve_b_addr_attention')}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="ve_b_addr_country" className="form-label">
                    Country / Region
                  </label>

                  <Controller
                    name="ve_b_addr_country"
                    control={control}
                    render={({ field }) => (
                      <Form.Select {...field} className="form-control">
                        <option value="">{watch('ve_b_addr_country') || 'Select Country'}</option>
                        <option value="UAE">United ARAB Emirates </option>
                        <option value="US">United States</option>
                        <option value="IN">India</option>
                      </Form.Select>
                    )}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="ve_b_addr_address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    id="ve_b_addr_address"
                    className="form-control text-capitalize"
                    placeholder="Street 1"
                    {...register('ve_b_addr_address')}
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
                  <label htmlFor="ve_b_addr_state" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    id="ve_b_addr_state"
                    className="form-control text-capitalize"
                    {...register('ve_b_addr_state')}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="ve_b_addr_city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    id="ve_b_addr_city"
                    className="form-control text-capitalize"
                    {...register('ve_b_addr_city')}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="ve_b_addr_pincode" className="form-label">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="ve_b_addr_pincode"
                    className="form-control text-capitalize"
                    {...register('ve_b_addr_pincode', {
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
                  <label htmlFor="ve_b_addr_phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="ve_b_addr_phone"
                    className="form-control"
                    placeholder="Mobile"
                    maxLength={15} // Adjust as per your country's mobile number length
                    inputMode="numeric"
                    {...register('ve_b_addr_phone', {
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
                  <label htmlFor="ve_b_addr_fax_number" className="form-label">
                    Fax Number
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    min={4}
                    id="ve_b_addr_fax_number"
                    className="form-control"
                    {...register('ve_b_addr_fax_number')}
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
                <div className="mb-3 mt-5">
                  <label htmlFor="ve_s_addr_attention" className="form-label">
                    Attention
                  </label>
                  <input
                    type="text"
                    id="ve_s_addr_attention"
                    className="form-control text-capitalize"
                    {...register('ve_s_addr_attention')}
                    // value={isSameAddress ? watch('cu_s_addr_attention') : ''}
                    // disabled={isSameAddress}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="ve_s_addr_country" className="form-label">
                    Country / Region
                  </label>

                  <Controller
                    name="ve_s_addr_country"
                    control={control}
                    render={({ field }) => (
                      <Form.Select {...field} className="form-control">
                        <option value="">{watch('ve_s_addr_country') || 'Select Country'}</option>
                        <option value="UAE">United Arab States</option>

                        <option value="US">United States</option>
                        <option value="IN">India</option>
                      </Form.Select>
                    )}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="ve_s_addr_address" className="form-label">
                    Address
                  </label>
                  <textarea
                    type="text"
                    id="ve_s_addr_address"
                    rows={3} // Specifies 3 lines of text
                    className="form-control text-capitalize"
                    placeholder="Street 1"
                    {...register('ve_s_addr_address')}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="ve_s_addr_state" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    id="ve_s_addr_state"
                    className="form-control text-capitalize"
                    {...register('ve_s_addr_state')}
                    // value={isSameAddress ? watch('cu_s_addr_state') : ''}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="ve_s_addr_city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    id="ve_s_addr_city"
                    className="form-control text-capitalize"
                    {...register('ve_s_addr_city')}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Remove non-letter characters
                    }} // value={isSameAddress ? watch('cu_s_addr_city') : ''}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="ve_s_addr_pincode" className="form-label">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    id="ve_s_addr_pincode"
                    className="form-control"
                    {...register('ve_s_addr_pincode', {
                      pattern: {
                        value: /^[0-9]{6,12}$/, // Allows only numbers, min 6, max 12 digits
                        message: 'PIN must be between 6 and 12 digits',
                      },
                    })}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 12) // Allow only numbers, limit to 12 digits
                    }}

                    // value={isSameAddress ? watch('cu_s_addr_pincode') : ''}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="ve_s_addr_phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="ve_s_addr_phone"
                    className="form-control"
                    placeholder="Mobile"
                    min={7}
                    maxLength={15} // Adjust as per your country's mobile number length
                    inputMode="numeric"
                    {...register('ve_s_addr_phone', {
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
                  <label htmlFor="ve_s_addr_fax_number" className="form-label">
                    Fax Number
                  </label>
                  <input
                    type="text"
                    id="ve_s_addr_fax_number"
                    placeholder="Mobile"
                    min={4}
                    maxLength={15} // Adjust as per your country's mobile number length
                    inputMode="numeric"
                    className="form-control"
                    {...register('ve_s_addr_fax_number')}
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
          </Tab>

          <Tab eventKey="Add Bank" title="Add Bank">
            {bankFields.map((bank, index) => (
              <div className="p-4" key={bank.id}>
                <Form.Group className="mt-3">
                  <Form.Label className="text-danger">Account Name*</Form.Label>
                  <Form.Control
                    type="text"
                    {...register(`bankdetails.${index}.vbd_acc_name`, { required: true })}
                  />
                  {errors.bankdetails && errors.bankdetails[index]?.vbd_acc_name && (
                    <span className="text-danger">This field is required</span>
                  )}
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control type="text" {...register(`bankdetails.${index}.vbd_bank_name`)} />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control
                    type="number"
                    {...register(`bankdetails.${index}.vbd_acc_number`)}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>IFSC</Form.Label>
                  <Form.Control type="text" {...register(`bankdetails.${index}.vbd_ifsc_code`)} />
                </Form.Group>

                <Button
                  disabled={loadingedit}
                  className="mt-4"
                  type="button"
                  onClick={() => onSubmitIndividualBank(index)}
                >
                  {loadingedit ? (
                    <Spinner animation="border" size="sm" className="me-2" />
                  ) : (
                    'Submit Bank Detail'
                  )}
                </Button>

                {/* <Form.Group className="mt-3">
                    <Form.Check
                      label="Make this primary"
                      type="checkbox"
                      {...register(`bankdetails.${index}.primary`)}
                      onChange={(e) =>
                        setValue(`bankdetails.${index}.primary`, e.target.checked ? '0' : '1')
                      }
                      // Adjust the checked condition as needed:
                      checked={watch(`bankdetails.${index}.primary`) === '0'}
                    />
                  </Form.Group> */}
              </div>
            ))}
            {/* Optionally, add a button to append a new bank detail */}
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
    </>
  )
}

export default Editvendor

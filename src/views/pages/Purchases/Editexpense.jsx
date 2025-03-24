import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import Select from 'react-select'
import '../Sales/Customers.css'
import { useNavigate, useParams } from 'react-router-dom'

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

const curency = [
  { value: 'AED', label: 'AED' },
  { value: 'INR', label: 'INR' },
  { value: 'USD', label: 'USD' },

]

const Editexpense = () => {
  const { ep_id } = useParams()

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

  const [productsexpenses, setProductsexpenses] = useState([])

  useEffect(() => {
    fetchexpenses()
  }, [])

  // Fetch Products
  const fetchexpenses = async () => {
    const data = { expense_id: ep_id }
    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/list/expenses',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )

      if (response.data.result === true) {
        const ExpenseData = response.data.list[0]
        setProductsexpenses([ExpenseData])

        // Vendor Name
        const selectedVendor = {
          value: ExpenseData?.ep_vendor_id,
          label: ExpenseData?.ep_vendor_name,
        }

        // Expense Account
        const selectedExpenseAccount = paymentexpensiveacc?.find(
          (opt) => opt.value === ExpenseData?.ep_expense_account,
        ) || { value: ExpenseData?.ep_expense_account, label: ExpenseData?.ep_expense_account }

        const selectcurency = curency.find((opt) => opt.value === ExpenseData.ep_currency) || {
          value: ExpenseData.ep_currency,
          label: ExpenseData.ep_currency,
        }

        // Paid Through
        const selectedPaidThrough = paymentexpensive.find(
          (opt) => opt.value === ExpenseData.ep_paid_through,
        ) || { value: ExpenseData.ep_paid_through, label: ExpenseData.ep_paid_through }

        // Customer Name
        const selectedCustomer = productscustm.find(
          (opt) => opt.value === ExpenseData.ep_customer_id,
        ) || { value: ExpenseData.ep_customer_id, label: ExpenseData.ep_customer_name }

        reset({
          ep_currency:selectcurency,
            ep_vendor_name: selectedVendor,
            ep_expense_account: selectedExpenseAccount,
            ep_paid_through: selectedPaidThrough,
            ep_customer_name: selectedCustomer,
            ep_date: ExpenseData.ep_date ? moment(ExpenseData.ep_date).format('YYYY-MM-DD') : '',

            ep_amount: ExpenseData.ep_amount || '',
            ep_notes: ExpenseData.ep_notes || '',
            documents: ExpenseData?.documents?.map((doc) => ({
              pd_id: doc.pd_id,
              pd_file: doc.pd_file,
            })) || [],
          });
      } else {
        console.error(response.data.message) // Log API error messages
        setProductsexpenses([]) // Clear the product list if no data is found
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
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
      const documents = watch('documents')

    formData.append('ep_id', ep_id)

      documents.forEach((img, index) => {
        if (img.file) {
          // Append new uploaded file
          formData.append(`image`, img.file)
        } else if (img.pd_file) {
          // Append existing file as a Blob/File instead of just a reference
          const existingFile = new File([img.pd_file], `existing_image_${index}.jpg`, {
            type: 'image/jpeg',
          })
          formData.append(`${img.pd_id}`, existingFile)
        }
      })
     

      formData.append('ep_date',data.ep_date)

      if (data.ep_customer_name) {
        formData.append('ep_customer_name', data.ep_customer_name.label) // Append customer name
        formData.append('ep_customer_id', data.ep_customer_name.value) // Append customer ID from selected object
      }

      formData.append('ep_expense_account', data.ep_expense_account.label)
      formData.append('ep_amount', data.ep_amount)

      if (data.ep_paid_through) {
        formData.append('ep_paid_through', data.ep_paid_through.label)
      }

      if (data.ep_vendor_name) {
        formData.append('ep_vendor_name', data.ep_vendor_name.label) // Append vendor name
        formData.append('ep_vendor_id', data.ep_vendor_name.value) // Correctly get the vendor ID
      }



      formData.append('ep_notes', data.ep_notes)

      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/edit/expenses',
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

        setTimeout(() => {
          setShowModal(false)
        }, 3000)
      } else {
        console.warn('Failed:', response.message)
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
        <h4> Edit Expenses</h4>

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
                    options={products} // Ensure this array has { value, label }
                    isClearable
                    isSearchable
                    placeholder="Select Vendor"
                    classNamePrefix="react-select"
                    value={products.find((opt) => opt.value === field.value?.value) || null} // Ensure correct selection
                    onChange={(selectedOption) => field.onChange(selectedOption)}
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
                    value={
                      paymentexpensiveacc.find((opt) => opt.value === field.value?.value) || null
                    }
                    onChange={(selectedOption) => field.onChange(selectedOption)}
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
                <Controller
                  name="ep_currency"
                  control={control}
                //   rules={{ required: 'Select Currency' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={curency}
                      isClearable
                      isSearchable
                      placeholder="Select Currency"
                      classNamePrefix="react-select"
                      value={
                        curency.find((opt) => opt.value === field.value?.value) ||
                        field.value ||
                        'select currency'
                      }
                      onChange={(selectedOption) => field.onChange(selectedOption)}
                    />
                  )}
                />


                {/* Input Field */}
                <Form.Control
                minLength={0}
                step={0.5}
                maxLength={100000}
                type="number" placeholder="Enter amount" {...register('ep_amount')} 
                
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '') // Removes non-numeric characters
                }}
                />
                {errors.ep_amount && <p className="text-danger">{errors.ep_amount.message}</p>}
              </InputGroup>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="ep_payment_terms" className="mt-2">
              <Form.Label>Paid Through *</Form.Label>
              <Controller
                name="ep_paid_through"
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
                    value={paymentexpensive.find((opt) => opt.value === field.value?.value) || null}
                    onChange={(selectedOption) => field.onChange(selectedOption)}
                  />
                )}
              />
              {errors.ep_payment_terms && (
                <p className="text-danger">{errors.ep_payment_terms.message}</p>
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
                    value={productscustm.find((opt) => opt.value === field.value?.value) || null}
                    onChange={(selectedOption) => field.onChange(selectedOption)}
                  />
                )}
              />
              {errors.ep_customer_name && (
                <p className="text-danger">{errors.ep_customer_name.message}</p>
              )}
            </Form.Group>
          </Col>
        </Row>

        {/* File Upload Section */}
        <Form.Label>Edit Image / Documents</Form.Label>

        <Row>
          {/* Image Upload Section */}
          <Col md={6}>
            <Form.Group className="mb-3">
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

export default Editexpense

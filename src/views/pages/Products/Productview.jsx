import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Form, Button, Container, Row, Col, Table, Modal, Spinner, Alert } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { useNavigate, useParams } from 'react-router-dom'
import Examclination from '../../../assets/images/exclamation.png'
import Tick from '../../../assets/images/Tick.png'
import { useDropzone } from 'react-dropzone'

const Productview = () => {
  const user_id = sessionStorage.getItem('user_id')
  const token = sessionStorage.getItem('token')
  const { i_id } = useParams()
  const Navi = useNavigate()

  console.log('cust_id:', i_id)

  const [productimg, setProductimg] = useState(null)
  const [backendImage, setBackendImage] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [products, setProducts] = useState([])

  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const handleClose = () => setShowModal(false)
  const [modalMessage, setModalMessage] = useState('')

  const { register, handleSubmit, watch, setValue, control } = useForm()
  const [imagebinary, setImagebinary] = useState(null)

  //-----------------imgupload
  const [image, setImage] = useState(null)

  // Handle file drop
  // Handle single image upload
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setUploadedImage(URL.createObjectURL(file))
        setImagebinary(file)
        setValue('image', file)
        setBackendImage(null) // Remove backend image if new one is uploaded
      }
    },
    [setValue],
  )

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false, // Only allow a single image
    onDrop,
  })

  const confirmDelete = () => {
    setShowDeleteModal(true)
  }

  // Handle Image Deletion
  const handleDeleteimg = () => {
    setUploadedImage(null) // Remove uploaded image preview
    setImagebinary(null) // Remove the file reference
    setBackendImage(null) // Remove backend image reference
    setShowDeleteModal(false) // Close the delete confirmation modal
  }

  useEffect(() => {
    fetchProducts()
    Unitapi()
    fetchProductsvendor()
    fetchAccounts()
  }, [])

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = {
        item_id: i_id,
      }
      const response = await axios.post('https://lunarsenterprises.com:5016/crm/item/view', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          user_id: user_id,
        },
      })

      if (response.data.result === true) {
        setProducts(response.data.list)

        if (response.data.list[0]?.i_image) {
          setBackendImage(`https://lunarsenterprises.com:5016${response.data.list[0].i_image}`)
        }

        if (response.data.list[0]?.i_unit) {
          setValue('i_unit', {
            label: response.data.list[0].i_unit,
            value: response.data.list[0].i_unit_id, // Ensure correct ID
          })
        }
        if (response.data.list[0]?.i_preferred_vendor) {
          setValue('i_preferred_vendor', {
            label: response.data.list[0].i_preferred_vendor,
            value: response.data.list[0].i_preferred_vendor_id, // Ensure correct ID
          })
        }

        if (response.data.list[0]?.i_purchase_account) {
          setValue('i_purchase_account', {
            label: response.data.list[0].i_purchase_account,
            value: response.data.list[0].i_purchase_account_id, // Ensure correct ID
          })
        }
      } else {
        console.error(response.data.message) // Log API error messages
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // State for unit data
  const [unit, setUnit] = useState([])

  const Unitapi = async () => {
    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/unit-list',
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
          value: customer.un_id,
          // You can choose the label format you want
          label: customer.un_name,
        }))
        setUnit(mappedProducts)
      } else {
        console.log(response.data.message)
      }
    } catch (error) {
      console.error('Error fetching unit:', error)
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
  const [accountsList, setAccountsList] = useState([])

  const fetchAccounts = async () => {
    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/list/bank-details',
        {},
        {
          headers: { Authorization: `Bearer ${token}`, user_id },
        },
      )

      if (response.data.result === true) {
        const mappedAccounts = response.data.list.map((account) => ({
          value: account.bd_id,
          label: account.bd_acc_bank_name,
        }))
        setAccountsList(mappedAccounts)
      } else {
        console.error(response.data.message)
        setAccountsList([])
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
    }
  }

  // Handle Form Submit (Save Edited Data)
  const onSubmit = async (data) => {
    try {
      const formData = new FormData()

      formData.append('item_id', i_id)
      formData.append('type', data.i_type || products[0]?.i_type)
      formData.append('name', data.i_name)

      if (imagebinary === null) {
        if (backendImage) {
          // Fetch the image as a Blob and convert it into a File
          const response = await fetch(backendImage)
          const blob = await response.blob()
          const file = new File([blob], 'existing_image.jpg', { type: blob.type })

          formData.append('1', file)
        } else {
          formData.append('image', '') // No image available
        }
      } else {
        formData.append('image', imagebinary)
      }

      formData.append('selling_price', data.i_sales_price)

  // Append unit
  formData.append('unit', data.i_unit?.label || '');
  formData.append('unit_id', data.i_unit?.value || '');

  // Append preferred vendor
  formData.append('preferred_vendor', data.i_preferred_vendor?.label || '');
  formData.append('preferred_vendor_id', data.i_preferred_vendor?.value || '');

  formData.append('sales_account', data.i_sales_account?.label || '');
  formData.append('sales_account_id', data.i_sales_account?.value || '');

  formData.append('purchase_account', data.i_purchase_account?.label || '');
  formData.append('purchase_account_id', data.i_purchase_account?.value || '');

      
      formData.append('sales_account', data.i_sales_account)
      formData.append('sales_description', data.i_sales_description)

      
      formData.append('purchase_description', data.i_purchase_description)

      
      formData.append('sales_status', data.i_sales_status)
      formData.append('purchase_status', data.i_purchase_status)

      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/item/edit',

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )

      if (response.data.result === true) {
        setModalMessage({
          type: 'success',
          message: response.data.message,
        })
        setShowModal(true)

        setTimeout(() => {
          setShowModal(false)
          //   navigate('/dashboard') // Change to your success page
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
      console.error('Error updating product:', error)
    } finally {
      setLoading(false)
    }
  }

  console.log(backendImage, 'backendImage')

  return (
    <>
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this image?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteimg}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
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
      <h2 className="mt-4 mb-3">Product Details</h2>

      <Form onSubmit={handleSubmit(onSubmit)} className="mt-4 p-4 border">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Type Name</Form.Label>
              <Form.Control
                type="text"
                {...register('i_type')}
                defaultValue={products[0]?.i_type}
                disabled={true}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label> Name</Form.Label>
              <Form.Control
                type="text"
                {...register('i_name')}
                defaultValue={products[0]?.i_name}
                disabled={true}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Unit</Form.Label>
              {/* <Form.Control
                type="text"
                {...register('i_unit')}
                defaultValue={products[0]?.i_unit}
              /> */}

              <Controller
                name="i_unit"
                control={control}
                rules={{ required: 'Select Unit name' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={unit}
                    isClearable
                    isSearchable
                    placeholder="Select a Unit name"
                    classNamePrefix="react-select"
                    onChange={(selected) => field.onChange(selected || { label: '', value: '' })}
                  />
                )}
              />

              {/* <Controller
    name="i_unit"
    control={control}
    render={({ field }) => (
        <Form.Select
            {...field}
            className="form-control"
            disabled
            value={field.value?.value || ''}
            onChange={(e) => {
                // ✅ Use `unit` instead of `products`
                const selectedOption = unit.find((item) => item.value === e.target.value)
                field.onChange(selectedOption) // Store the entire object { label, value }
            }}
        >
            <option value="">{field.value?.label || watch('i_unit')}</option>
            {unit.map((item) => (
                <option key={item.value} value={item.value}>
                    {item.label}
                </option>
            ))}
        </Form.Select>
    )}
/> */}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Sale Price</Form.Label>
              <Form.Control
                type="number"
                min={0}
                step={0.1}
                {...register('i_sales_price')}
                defaultValue={products[0]?.i_sales_price}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Sales Account</Form.Label>
              <Form.Control
  type="text"
  {...register('i_sales_account', {
    required: 'Sales account is required',
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: 'Only letters and spaces are allowed',
    },
  })}
  defaultValue={products[0]?.i_sales_account}
  onInput={(e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ''); // Remove non-letter characters
  }}
/>

            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Sales Description</Form.Label>
              <Form.Control
                type="text"
                {...register('i_sales_description')}
                defaultValue={products[0]?.i_sales_description}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Purchase Price </Form.Label>
              <Form.Control
                type="number"
                min={0}
                step={0.1}

                {...register('i_purchase_price')}
                defaultValue={products[0]?.i_purchase_price}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Purchase Account</Form.Label>
              {/* <Form.Control
                type="text"
                {...register('i_purchase_account')}
                defaultValue={products[0]?.i_purchase_account}
              /> */}

              <Controller
                name="i_purchase_account"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={accountsList}
                    isClearable
                    isSearchable
                    placeholder="Select a Purchase Account"
                    classNamePrefix="react-select"
                    onChange={(selected) => field.onChange(selected || { label: '', value: '' })}
                  />
                )}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Purchase Description</Form.Label>
              <Form.Control
                type="text"
                {...register('i_purchase_description')}
                defaultValue={products[0]?.i_purchase_description}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Preferred Vendor</Form.Label>
              {/* <Form.Control
                type="text"
                {...register('i_preferred_vendor')}
                defaultValue={products[0]?.i_preferred_vendor}
              /> */}

              <Controller
                name="i_preferred_vendor"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={productsvendor}
                    isClearable
                    isSearchable
                    placeholder="Select a Preferred Vendor"
                    classNamePrefix="react-select"
                    onChange={(selected) => field.onChange(selected || { label: '', value: '' })}
                  />
                )}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Sales Status</Form.Label>
              <Form.Control
                type="text"
                {...register('i_sales_status')}
                defaultValue={products[0]?.i_sales_status}
                disabled={true}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Purchase Status</Form.Label>
              <Form.Control
                type="text"
                {...register('i_purchase_status')}
                defaultValue={products[0]?.i_purchase_status}
                disabled={true}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            {/* Image Preview */}
            <div className="mt-3">
              {uploadedImage || backendImage ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={uploadedImage || backendImage}
                    alt="Product"
                    style={{
                      width: '150px',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                    }}
                  />
                  <button
                    type="button"
                    onClick={confirmDelete}
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <p style={{ color: 'gray' }}>No image uploaded</p>
              )}
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
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
                <p>Drag & drop an image here, or click to browse</p>
              </div>
            </Form.Group>
          </Col>
        </Row>
        {/* Delete Confirmation Modal */}
        {/* <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this image?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal> */}

        <div className="text-center mb-5 ">
          <Button disabled={loading} variant="success" type="submit" className="w-50 mt-3">
            {loading ? (
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

export default Productview

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Form, Button, Container, Row, Col, Table, Modal, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import Examclination from '../../../assets/images/exclamation.png'
import Tick from '../../../assets/images/Tick.png'

const Bankview = () => {
  const user_id = sessionStorage.getItem('user_id')
  const token = sessionStorage.getItem('token')
  const { bd_id } = useParams()
  const Navi = useNavigate()

  console.log('cust_id:', bd_id)

  const [products, setProducts] = useState([])

  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const handleClose = () => setShowModal(false)
  const [modalMessage, setModalMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    fetchProducts()
  }, [])

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = { bd_id }
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/list/bank-details',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )

      if (response.data.result === true) {
        setProducts(response.data.list)
        if (response.data.list.length > 0) {
          const product = response.data.list[0]
          setValue('bd_acc_currency', product.bd_acc_currency || '')
          setValue('bd_acc_primary', product.bd_acc_primary === '1' ? '1' : '0') // Ensure Primary field is set

          reset({
            bd_acc_type: product.bd_acc_type,
          
            bd_acc_name: product.bd_acc_name,
            bd_acc_code: product.bd_acc_code,
            bd_acc_currency: product.bd_acc_currency,
            bd_acc_number:product.bd_acc_number,
            bd_acc_bank_name: product.bd_acc_bank_name,
            bd_acc_ifsc: product.bd_acc_ifsc,
            bd_acc_description: product.bd_acc_description,
            bd_acc_primary: product.bd_acc_primary,
            bd_acc_status: product.bd_acc_status,
          })
        }
      } else {
        console.error(response.data.message)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle Form Submit (Save Edited Data)
  const onSubmit = async (formData) => {
    setLoading(true)

    const newFormData = new FormData()
    newFormData.append('bd_id', JSON.parse(bd_id))
    newFormData.append('bd_acc_name', formData.bd_acc_name)
    newFormData.append('bd_acc_type', formData.bd_acc_type)
    newFormData.append('bd_acc_code', Number(formData.bd_acc_code)) // Ensure number format
    newFormData.append('bd_acc_number', parseInt(formData.bd_acc_number, 10)) // Convert to integer
    newFormData.append('bd_acc_bank_name', formData.bd_acc_bank_name)
    newFormData.append('bd_acc_currency', formData.bd_acc_currency)
    newFormData.append('bd_acc_ifsc', formData.bd_acc_ifsc)
    newFormData.append('bd_acc_description', formData.bd_acc_description || '') // Avoid null
    newFormData.append('bd_acc_primary', formData.bd_acc_primary === 1 ? '1' : '0') // Ensure '1' or '0'

    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/edit/bank-details',

        newFormData,

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
      console.error('Error updating bank details:', error)
    } finally {
      setLoading(false)
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
      <h2 className="mt-4 mb-3">Banking Details</h2>

      <Form onSubmit={handleSubmit(onSubmit)} className="mt-4 p-4 border">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                {...register('bd_acc_name')}
                // defaultValue={products[0]?.bd_acc_name}
                disabled={true}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label> Bank Type</Form.Label>
              <Form.Control
                type="text"
                {...register('bd_acc_type')}
                // defaultValue={products[0]?.bd_acc_type}
                disabled={true}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Account Code</Form.Label>
              <Form.Control
                type="text"
                className="text-uppercase"
                min={0}
                maxLength={13}
                {...register('bd_acc_code', {
                  required: 'Account code is required',
                  pattern: {
                    value: /^[A-Za-z0-9]+$/, // Allows only letters and numbers
                    message: 'Only letters and numbers are allowed',
                  },
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '') // Remove non-alphanumeric characters
                }}
                defaultValue={products[0]?.bd_acc_code}
              />
            </Form.Group>
            {errors.bd_acc_code && (
              <span className="text-danger">{errors.bd_acc_code.message}</span>
            )}
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                type="text" // Change to text to prevent "e", ".", "-"
                inputMode="numeric" // Helps mobile devices show a numeric keyboard
                maxLength={20} // Limits input to 20 characters
                {...register('bd_acc_number', {
                  required: 'Account Number is required',
                  pattern: {
                    value: /^[0-9]{1,20}$/, // Allows only numbers (1 to 20 digits)
                    message: 'Only numbers are allowed (max 20 digits)',
                  },
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '') // Remove non-numeric characters
                }}
                // defaultValue={products[0]?.bd_acc_number}
                // disabled={true}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Account Bank Name</Form.Label>
              <Form.Control
                className="text-uppercase"
                type="text"
                defaultValue={products[0]?.bd_acc_bank_name}
                {...register('bd_acc_bank_name', {
                  required: 'Bank Name is required',
                  pattern: {
                    value: /^[A-Za-z\s]+$/, // Allows only letters and spaces
                    message: 'Only letters are allowed',
                  },
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Prevent invalid input
                }}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Account Currency</Form.Label>
              {/* <Form.Control
                type="text"
                {...register('bd_acc_currency')}
                defaultValue={products[0]?.bd_acc_currency}
                // disabled={true}
              /> */}

              <Form.Select
                {...register('bd_acc_currency', { required: true })}
                value={watch('bd_acc_currency') || products[0]?.bd_acc_currency || ''}
                onChange={(e) => setValue('bd_acc_currency', e.target.value)}
              >
                <option value="">Select Currency</option>
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="AED">AED</option> {/* Ensure "AED" is listed */}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Account IFSC</Form.Label>
              <Form.Control
                type="text"
                defaultValue={products[0]?.bd_acc_ifsc}
                className="text-uppercase"
                min={0}
                maxLength={13}
                {...register('bd_acc_ifsc', {
                  required: 'IFSC code is required',
                  pattern: {
                    value: /^[A-Za-z0-9]+$/, // Allows only letters and numbers
                    message: 'Only letters and numbers are allowed',
                  },
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '') // Remove non-alphanumeric characters
                }}
              />
            </Form.Group>
          </Col>
          {/* <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Account description</Form.Label>
              <Form.Control
                type="text"
                {...register('bd_acc_description')}
                defaultValue={products[0]?.bd_acc_description}
              />
            </Form.Group>
          </Col> */}
        </Row>

        <Row>
          {/* <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Account primary</Form.Label>

              <Form.Select
                {...register('bd_acc_primary', { required: true })}
                value={watch('bd_acc_primary') || (products[0]?.bd_acc_primary === '1' ? '0' : '1')}
                onChange={(e) => setValue('bd_acc_primary', e.target.value)}
              >
                <option value="1">Primary</option>
                <option value="0">Non-Primary</option>
              </Form.Select>
            </Form.Group>
          </Col> */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Account Status</Form.Label>
              <Form.Control
                type="text"
                className="text-capitalize"
                {...register('bd_acc_status')}
                // defaultValue={products[0]?.bd_acc_status}
                disabled={true}
              />
            </Form.Group>
          </Col>
        </Row>

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

export default Bankview

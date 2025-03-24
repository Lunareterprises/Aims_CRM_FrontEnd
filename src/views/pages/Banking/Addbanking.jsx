import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, Button, Modal, Spinner } from 'react-bootstrap'
import axios from 'axios'
import Examclination from '../../../assets/images/exclamation.png'
import Tick from '../../../assets/images/Tick.png'
import { useNavigate } from 'react-router-dom'

const AddBanking = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const Navi = useNavigate()
  const [accountType, setAccountType] = useState('Bank')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState({ type: '', message: '' })

  const user_id = sessionStorage.getItem('user_id')
  const token = sessionStorage.getItem('token') // Ensure the token is retrieved

  const onSubmit = async (data) => {
    const payload = {
      bd_acc_type: data.accountType,
      bd_acc_name: data.accountName,
      bd_acc_code: data.accountCode,
      bd_acc_currency: data.currency,
      bd_acc_number: data.accountNumber,
      bd_acc_bank_name: data.bankName,
      bd_acc_ifsc: data.ifsc,
      bd_acc_description: data.description,
      // bd_acc_primary: data.primary === '0' ? 0 : 1,
    }

    setLoading(true)

    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/add/bank-details',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        },
      )

      if (response.data.result) {
        setModalMessage({ type: 'success', message: 'Bank details added successfully' })
        reset()
        setTimeout(() => {
          setModalMessage(false)
          Navi('/dashboard/Banking')
        }, 3000)
      } else {
        setModalMessage({ type: 'error', message: response.data.message })
      }
    } catch (error) {
      setModalMessage({
        type: 'error',
        message: error.response?.data?.message || 'An error occurred',
      })
    } finally {
      setShowModal(true)
      setLoading(false)
    }
  }

  return (
    <>
      {/* Success/Error Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <img
              src={modalMessage.type === 'success' ? Tick : Examclination}
              alt={modalMessage.type}
              style={{ width: '30px', marginRight: '10px' }}
            />
            {modalMessage.type === 'success' ? 'Success' : 'Warning'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage.message}</p>
        </Modal.Body>
      </Modal>

      <div className="p-4">
        <h3>Add Bank or Credit Card</h3>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Label className="text-danger">Select Account Type*</Form.Label>
            <div>
              <Form.Check
                inline
                label="Bank"
                type="radio"
                value="Bank"
                {...register('accountType', { required: true })}
                checked={accountType === 'Bank'}
                onChange={() => setAccountType('Bank')}
              />
              <Form.Check
                inline
                label="Credit Card"
                type="radio"
                value="Credit Card"
                {...register('accountType', { required: true })}
                checked={accountType === 'Credit Card'}
                onChange={() => setAccountType('Credit Card')}
              />
            </div>
            {errors.accountType && <span className="text-danger">This field is required</span>}
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label className="text-danger">Accountant Name*</Form.Label>
            <Form.Control
              min={0}
              maxLength={60}
              className="text-capitalize"
              type="text"
              {...register('accountName', {
                required: 'Bank Name is required',
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: 'Only letters and spaces are allowed',
                },
              })}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '') // Prevent invalid input
              }}
            />

            {errors.accountName && (
              <span className="text-danger mt-1">{errors.accountName.message}</span>
            )}
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Bank Name</Form.Label>
            <Form.Control
              type="text"
              className="text-uppercase"
              {...register('bankName', {
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
            {errors.bankName && <span className="text-danger mt-1">{errors.bankName.message}</span>}
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Account Code</Form.Label>
            <Form.Control
              className="text-uppercase"
              type="text"
              min={0}
              maxLength={13}
              {...register('accountCode', {
                required: 'Account code is required',
                pattern: {
                  value: /^[A-Za-z0-9]+$/, // Allows only letters and numbers
                  message: 'Only letters and numbers are allowed',
                },
              })}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '') // Remove non-alphanumeric characters
              }}
            />
            {errors.accountCode && (
              <p style={{ color: 'red', fontSize: '12px' }}>{errors.accountCode.message}</p>
            )}
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label className="text-danger">Currency*</Form.Label>
            <Form.Select {...register('currency', { required: true })}>
              <option value="AED">AED</option>

              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </Form.Select>
          </Form.Group>
          {errors.currency && <span className="text-danger">This field is required</span>}

          {accountType === 'Bank' && (
            <>
              <Form.Group className="mt-3">
                <Form.Label>Account Number</Form.Label>
                <Form.Control
                  type="text" // Change to text to prevent "e", ".", "-"
                  inputMode="numeric" // Helps mobile devices show a numeric keyboard
                  maxLength={20} // Limits input to 20 characters
                  {...register('accountNumber', {
                    required: 'Account Number is required',
                    pattern: {
                      value: /^[0-9]{1,20}$/, // Allows only numbers (1 to 20 digits)
                      message: 'Only numbers are allowed (max 20 digits)',
                    },
                  })}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, '') // Remove non-numeric characters
                  }}
                />

                {errors.accountNumber && (
                  <span className="text-danger">{errors.accountNumber.message}</span>
                )}
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>IFSC</Form.Label>
                <Form.Control
                  type="text"
                  className="text-uppercase mb-4"
                  min={0}
                  maxLength={13}
                  {...register('ifsc', {
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
                {errors.ifsc && <span className="text-danger">IFSC Code is required</span>}
              </Form.Group>
            </>
          )}

          {/* <Form.Group className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              maxLength={500}
              {...register('description')}
              placeholder="Max. 500 characters"
            />
          </Form.Group> */}

          {/* <Form.Group className="mt-3 mb-5">
            <Form.Check
              label="Make this primary"
              type="checkbox"
              {...register('primary')}
              onChange={(e) => setValue('primary', e.target.checked ? '0' : '1')}
              checked={watch('primary') === '0'}
            />
          </Form.Group> */}

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Save'}
          </Button>
        </Form>
      </div>
    </>
  )
}

export default AddBanking

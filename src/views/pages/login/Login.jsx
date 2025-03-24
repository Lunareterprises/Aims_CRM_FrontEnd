import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons'
import './Login.css'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import loginimage from '../../../assets/images/loginimage.jpg'
import AuthContext from '../../../components/AuthContext'
import ImageCarousel from './Imagecarosuel'
import { useAuth } from '../../../components/Authication/Authication'

const SocialLoginButton = () => (
  <Fragment>
    <Button variant="primary" className="ezy__signin6-btn w-100 d-flex align-items-center mb-3">
      <span className="text-white fs-4 lh-1">
        <FontAwesomeIcon icon={faFacebook} />
      </span>
      <span className="w-100 text-center text-white">Continue with Facebook</span>
    </Button>
    <Button variant="danger" className="ezy__signin6-btn w-100 d-flex align-items-center">
      <span className="text-white fs-4 lh-1">
        <FontAwesomeIcon icon={faGoogle} />
      </span>
      <span className="w-100 text-center text-white">Continue with Google</span>
    </Button>
  </Fragment>
)

const SignInForm = () => {
  const navigate = useNavigate()
  const [validated, setValidated] = useState(false)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [isLoadingsend, setisLoadingsend] = useState()
  const [isLoading, setisLoading] = useState()
  const [isLoadingotp, setisLoadingotp] = useState()
  const [isLoadingreset, setisLoadingreset] = useState(false)

  const handleShowForgotPasswordModal = () => setShowForgotPasswordModal(true)
  const handleCloseForgotPasswordModal = () => setShowForgotPasswordModal(false)

  const handleSubmit = (event) => {
    event.preventDefault()

    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.stopPropagation()
    }

    setValidated(true)
    Loginapi()
  }
    const { authenticated } = useAuth();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const token = sessionStorage.getItem('fcm_token')
  console.log(token, 'tokentokentoken')

  const Loginapi = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email.')
      return
    }
    if (!password.trim()) {
      toast.error('Please enter your password.')
      return
    }
    const token = sessionStorage.getItem('fcm_token')
    console.log(token, 'tokentokentoken')
    setisLoading(true)
    const header = {
      email: email,
      password: password,
      role: role,

      // cd_role: 'admin',
      // fcm_token: token,
    }
    console.log(header, 'headerheaderheader')

    try {
      const response = await axios.post('https://lunarsenterprises.com:5016/crm/user/login', header)
      console.log(response)
      const { result, message, user_token, u_id, user_name, user_role } = response.data

      if (result) {
        toast.success(message)
        // Store user_token and user_id in local storage
        sessionStorage.setItem('token', user_token)
        sessionStorage.setItem('user_id', u_id)
        sessionStorage.setItem('user_name', user_name)
        sessionStorage.setItem('user_role', user_role)
        sessionStorage.setItem('authenticated',"true")

        navigate('/dashboard')
      } else {
        toast.error(message || 'Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setisLoading(false)
    }
  }

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [role, setRole] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false) // Track OTP status
  const [isOtpVerified, setIsOtpVerified] = useState(false) // Track OTP verification status
  const [showNewPassword, setShowNewPassword] = useState(false) // State for toggling new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false) // State for toggling confirm password visibility

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const [showNewPasswor, setShowNewPasswor] = useState(false) // State for toggling new password visibility
  const [showConfirmPasswor, setShowConfirmPasswor] = useState(false) // State for toggling confirm password visibility
  const toggleNewPasswordVisibilit = () => {
    setShowNewPasswor(!showNewPasswor)
  }

  const toggleConfirmPasswordVisibilit = () => {
    setShowConfirmPasswor(!showConfirmPasswor)
  }
  // Password pattern
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/

  // Function to handle sending OTP
  const sendOtp = async () => {
    if (!forgotPasswordEmail) {
      toast.error('Please enter an email address.')
      return
    }
    setisLoadingsend(true)
    try {
      const response = await axios.post('https://lunarsenterprises.com:5016/crm/forgotpass/otp', {
        email: forgotPasswordEmail,
        // role: 'admin',
      })

      const { status, message } = response.data
      if (status === true) {
        toast.success(message)
        setIsOtpSent(true) // Set OTP sent to true
      } else {
        toast.error(message || 'Error sending OTP.')
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setisLoadingsend(false)
    }
  }

  // Function to handle OTP verification
  const verifyOtp = async () => {
    setisLoadingotp(true)

    if (!otp) {
      toast.error('Please enter the OTP.')
      return
    }

    try {
      const response = await axios.post('https://lunarsenterprises.com:5016/crm/otp/verify', {
        email: forgotPasswordEmail,
        otp: otp,
        // role: 'admin',
      })

      const { result, message } = response.data
      if (result === true) {
        toast.success(message)
        setIsOtpVerified(true) // Set OTP verified to true
      } else {
        toast.error(message || 'Error verifying OTP.')
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setisLoadingotp(false)
    }
  }

  // Initializing state

  // Function to handle password reset
  const resetPassword = async () => {
    setisLoadingreset(true) // Start loading spinner

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.')
      setisLoadingreset(false) // Stop loading spinner
      return
    }

    if (!passwordPattern.test(newPassword)) {
      setisLoadingreset(false) // Stop loading spinner
      toast.error(
        'Password must be at least 6 characters and contain one uppercase, one lowercase, one number, and one special character.',
      )
      return
    }

    // Add your update password API call here
    try {
      const response = await axios.post('https://lunarsenterprises.com:5016/crm/changepass', {
        email: forgotPasswordEmail,
        // role: 'admin',
        password: newPassword,
      })

      const { result, message } = response.data
      if (result === true) {
        toast.success('Password updated successfully.')
        handleCloseForgotPasswordModal() // Close the modal after success
      } else {
        toast.error(message || 'Error resetting password.')
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setisLoadingreset(false) // Stop loading spinner in both success and failure cases
    }
  }

  return (
    <Fragment>
      <ToastContainer />
      <Modal show={showForgotPasswordModal} onHide={handleCloseForgotPasswordModal}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Email Address</Form.Label>
            <Form.Group className="d-flex mb-3">
              <Form.Control
                type="email"
                placeholder="Enter Email Address"
                className="me-2"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
                disabled={isOtpSent} // Disable email input after OTP is sent
              />

              <Button
                variant="primary"
                type="button"
                className="flex-shrink-0"
                onClick={sendOtp}
                disabled={isOtpSent || isLoadingsend} // Disable button while OTP is being sent
              >
                {isLoadingsend ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{' '}
                    Sending OTP...
                  </>
                ) : isOtpSent ? (
                  'OTP Sent'
                ) : (
                  'Send OTP'
                )}
              </Button>
            </Form.Group>

            {isOtpSent && !isOtpVerified && (
              <>
                <Form.Group className="d-flex mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter OTP"
                    className="me-2"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^\d{0,6}$/.test(value)) {
                        // Allow only up to 6 digits
                        setOtp(value)
                      }
                    }}
                    maxLength={6} // Ensures max 6 digits
                    required
                  />
                  <Button
                    variant="secondary"
                    type="button"
                    className="flex-shrink-0"
                    onClick={verifyOtp} // Handle OTP verification
                  >
                    {isLoadingotp ? (
                      <>
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />{' '}
                          Verify OTP...
                        </>
                      </>
                    ) : (
                      '   Verify OTP'
                    )}
                  </Button>
                </Form.Group>
              </>
            )}

            {isOtpVerified && (
              <>
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type={showNewPassword ? 'text' : 'password'} // Toggle between text and password
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <FontAwesomeIcon
                    icon={showNewPassword ? faEyeSlash : faEye} // Change icon based on visibility state
                    className="password-toggle-icon"
                    onClick={toggleNewPasswordVisibility} // Toggle password visibility
                    style={{ position: 'absolute', right: '10px', top: '38px', cursor: 'pointer' }}
                  />
                </Form.Group>

                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type={showConfirmPassword ? 'text' : 'password'} // Toggle between text and password
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye} // Change icon based on visibility state
                    className="password-toggle-icon"
                    onClick={toggleConfirmPasswordVisibility} // Toggle password visibility
                    style={{ position: 'absolute', right: '10px', top: '38px', cursor: 'pointer' }}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="button"
                  className="w-100"
                  onClick={resetPassword} // Handle reset password action
                >
                  {isLoadingreset ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{' '}
                      Sending Reset Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </>
            )}
          </Form>
        </Modal.Body>
      </Modal>

      <Form className="pe-md-4" noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-4 mt-2">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="custom-placeholder"
          />
          {/* <Form.Control.Feedback type="valid">Message</Form.Control.Feedback> */}
        </Form.Group>
        {/* <Form.Group className="mb-4 mt-2">
          <Form.Label>Select Your Privilege</Form.Label>

          <Form.Select
            className="custom-placeholder"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Select Your Privilege">Select Your Privilege</option>

            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="accountant">Accountant</option>
            <option value="cashier">Cashier</option>
          </Form.Select>
        </Form.Group> */}
        <Form.Group className=" position-relative mt-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type={showNewPasswor ? 'text' : 'password'}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="custom-placeholder"
          />
          {/* <Form.Control.Feedback type="valid">Message</Form.Control.Feedback> */}

          <FontAwesomeIcon
            icon={showNewPasswor ? faEye : faEyeSlash} // Change icon based on visibility state
            className="password-toggle-icon"
            onClick={toggleNewPasswordVisibilit} // Toggle password visibility
            style={{ position: 'absolute', right: '10px', top: '49px', cursor: 'pointer' }}
          />
        </Form.Group>

        <Button
          variant=""
          type="submit"
          className="ezy__signin6-btn-submit w-100 mt-4"
          onClick={handleSubmit}
          disabled={isLoading} // Disable the button while loading
        >
          {isLoading ? (
            <div className="d-flex  align-items-center justify-content-center">
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <p className="mb-0">Log In ...</p> {/* You can style this text to match the design */}
            </div>
          ) : (
            'Log In'
          )}
        </Button>

        <Button
          variant=""
          type="button"
          className="ezy__signin6-btn-submit w-100 mt-3"
          onClick={handleShowForgotPasswordModal}
        >
          Forgot your password?
        </Button>

        <p className="text-center mt-4" onClick={() => navigate('/Registeration')}>
          <p>
            Don't have an account? <a style={{ textDecoration: 'underline',cursor:'pointer' }}>Register</a>
          </p>
        </p>
      </Form>

      {/* Forgot Password Modal */}
      {/* <Modal show={showForgotPasswordModal} onHide={handleCloseForgotPasswordModal}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Email Address</Form.Label>
            <Form.Group className="d-flex mb-3 ">
              <Form.Control type="email" placeholder="Enter Email Address" className="me-2" style={{ flex: 1 }} required />
              <Button
                variant="primary"
                type="button"
                className="flex-shrink-0"
                // Handle verify OTP logic here
              >
                Send OTP
              </Button>
            </Form.Group>

            <Form.Group className="d-flex mb-3">
              <Form.Control type="text" placeholder="Enter OTP" className="me-2" style={{ flex: 1 }} required />
              <Button
                variant="primary"
                type="button"
                className="flex-shrink-0"
                // Handle verify OTP logic here
              >
                Verify
              </Button>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" placeholder="Enter New Password" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm New Password" />
            </Form.Group>
            <Button
              variant="primary"
              type="button"
              className="w-100"
              // Handle reset password logic here
            >
              Reset Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal> */}
    </Fragment>
  )
}

const SignInFormCard = () => (
  <div className="ezy__signin6-form-card">
    <Card.Body className="p-0">
      <h2 className="ezy__signin6-heading mb-5">Welcome to Accounting Software</h2>
      <SignInForm />
    </Card.Body>
  </div>
)

const Login = () => {
  // useEffect(() => {
  //   onMessage(messaging, (payload) => {
  //     console.log(payload);
  //     toast.success(payload.notification.body);
  //   });
  //   generateToken();
  // }, []);
  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker
  //     .register('../../../../dist/firebase-messaging-sw', { scope: '/' }) // Register with the correct scope
  //     .then((registration) => {
  //       console.log('Service Worker registered successfully:', registration);
  //     })
  //     .catch((error) => {
  //       console.error('Service Worker registration failed:', error);
  //     });
  // }

  const style = {
    backgroundImage: `url(${loginimage})`,
  }
  return (
    <section className="ezy__signin6 light d-flex paddingform bg-blackbg">
      <Container>
        <Row className="justify-content-between h-100">
          <Col lg={6}>
            <div className="ezy__signin6-bg-holder d-none d-lg-block h-100" >
              <ImageCarousel />
            </div>
          </Col>
          <Col lg={5} className="py-5">
            <Row className="align-items-center h-100">
              <Col xs={12}>
                <SignInFormCard />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Login

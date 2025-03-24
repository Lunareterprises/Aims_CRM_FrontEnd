import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Examclination from '../../../assets/images/exclamation.png'
import bg_image from '../../../assets/images/two.jpg'

import { Form, Button, Spinner, Modal, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import '../../pages/register/Register.css'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Passwordimg from '../../../assets/images/password.png'
import axios from 'axios'
import ImageCarousel from '../login/Imagecarosuel'
const Register = () => {
  const [currency, setCurrency] = useState('')

  const [resendDisabled, setResendDisabled] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const startResendTimer = () => {
    setResendDisabled(true)
    setResendTimer(120) // 300 seconds = 5 minutes

    const timerInterval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval)
          setResendDisabled(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const countries = [
    { name: 'Afghanistan', code: 'AF', currency: 'AFN' },
    { name: 'Albania', code: 'AL', currency: 'ALL' },
    { name: 'Algeria', code: 'DZ', currency: 'DZD' },
    { name: 'Andorra', code: 'AD', currency: 'EUR' },
    { name: 'Angola', code: 'AO', currency: 'AOA' },
    { name: 'Antigua and Barbuda', code: 'AG', currency: 'XCD' },
    { name: 'Argentina', code: 'AR', currency: 'ARS' },
    { name: 'Armenia', code: 'AM', currency: 'AMD' },
    { name: 'Australia', code: 'AU', currency: 'AUD' },
    { name: 'Austria', code: 'AT', currency: 'EUR' },
    { name: 'Azerbaijan', code: 'AZ', currency: 'AZN' },
    { name: 'Bahamas', code: 'BS', currency: 'BSD' },
    { name: 'Bahrain', code: 'BH', currency: 'BHD' },
    { name: 'Bangladesh', code: 'BD', currency: 'BDT' },
    { name: 'Barbados', code: 'BB', currency: 'BBD' },
    { name: 'Belarus', code: 'BY', currency: 'BYN' },
    { name: 'Belgium', code: 'BE', currency: 'EUR' },
    { name: 'Belize', code: 'BZ', currency: 'BZD' },
    { name: 'Benin', code: 'BJ', currency: 'CFA' },
    { name: 'Bhutan', code: 'BT', currency: 'BTN' },
    { name: 'Bolivia', code: 'BO', currency: 'BOB' },
    { name: 'Bosnia and Herzegovina', code: 'BA', currency: 'BAM' },
    { name: 'Botswana', code: 'BW', currency: 'BWP' },
    { name: 'Brazil', code: 'BR', currency: 'BRL' },
    { name: 'Brunei', code: 'BN', currency: 'BND' },
    { name: 'Bulgaria', code: 'BG', currency: 'BGN' },
    { name: 'Burkina Faso', code: 'BF', currency: 'XOF' },
    { name: 'Burundi', code: 'BI', currency: 'BIF' },
    { name: 'Cabo Verde', code: 'CV', currency: 'CVE' },
    { name: 'Cambodia', code: 'KH', currency: 'KHR' },
    { name: 'Cameroon', code: 'CM', currency: 'CFA' },
    { name: 'Canada', code: 'CA', currency: 'CAD' },
    { name: 'Central African Republic', code: 'CF', currency: 'CFA' },
    { name: 'Chad', code: 'TD', currency: 'CFA' },
    { name: 'Chile', code: 'CL', currency: 'CLP' },
    { name: 'China', code: 'CN', currency: 'CNY' },
    { name: 'Colombia', code: 'CO', currency: 'COP' },
    { name: 'Comoros', code: 'KM', currency: 'COM' },
    { name: 'Congo (Republic)', code: 'CG', currency: 'CDF' },
    { name: 'Congo (Democratic Republic)', code: 'CD', currency: 'CDF' },
    { name: 'Costa Rica', code: 'CR', currency: 'CRC' },
    { name: 'Croatia', code: 'HR', currency: 'HRK' },
    { name: 'Cuba', code: 'CU', currency: 'CUP' },
    { name: 'Cyprus', code: 'CY', currency: 'CYP' },
    { name: 'Czech Republic', code: 'CZ', currency: 'CZK' },
    { name: 'Denmark', code: 'DK', currency: 'DKK' },
    { name: 'Djibouti', code: 'DJ', currency: 'DJF' },
    { name: 'Dominica', code: 'DM', currency: 'XCD' },
    { name: 'Dominican Republic', code: 'DO', currency: 'DOP' },
    { name: 'Ecuador', code: 'EC', currency: 'USD' },
    { name: 'Egypt', code: 'EG', currency: 'EGP' },
    { name: 'El Salvador', code: 'SV', currency: 'SVC' },
    { name: 'Equatorial Guinea', code: 'GQ', currency: 'CFA' },
    { name: 'Eritrea', code: 'ER', currency: 'ERN' },
    { name: 'Estonia', code: 'EE', currency: 'EUR' },
    { name: 'Eswatini', code: 'SZ', currency: 'SZL' },
    { name: 'Ethiopia', code: 'ET', currency: 'ETB' },
    { name: 'Fiji', code: 'FJ', currency: 'FJD' },
    { name: 'Finland', code: 'FI', currency: 'EUR' },
    { name: 'France', code: 'FR', currency: 'EUR' },
    { name: 'Gabon', code: 'GA', currency: 'GAB' },
    { name: 'Gambia', code: 'GM', currency: 'GMD' },
    { name: 'Georgia', code: 'GE', currency: 'GEL' },
    { name: 'Germany', code: 'DE', currency: 'EUR' },
    { name: 'Ghana', code: 'GH', currency: 'GHS' },
    { name: 'Greece', code: 'GR', currency: 'EUR' },
    { name: 'Grenada', code: 'GD', currency: 'XCD' },
    { name: 'Guatemala', code: 'GT', currency: 'GTQ' },
    { name: 'Guinea', code: 'GN', currency: 'GNF' },
    { name: 'Guinea-Bissau', code: 'GW', currency: 'GNF' },
    { name: 'Guyana', code: 'GY', currency: 'GYD' },
    { name: 'Haiti', code: 'HT', currency: 'HTG' },
    { name: 'Honduras', code: 'HN', currency: 'HNL' },
    { name: 'Hungary', code: 'HU', currency: 'HUF' },
    { name: 'Iceland', code: 'IS', currency: 'ISK' },
    { name: 'India', code: 'IN', currency: 'INR' },
    { name: 'Indonesia', code: 'ID', currency: 'IDR' },
    { name: 'Iran', code: 'IR', currency: 'IRR' },
    { name: 'Iraq', code: 'IQ', currency: 'IQD' },
    { name: 'Ireland', code: 'IE', currency: 'EUR' },
    { name: 'Israel', code: 'IL', currency: 'ILS' },
    { name: 'Italy', code: 'IT', currency: 'EUR' },
    { name: 'Jamaica', code: 'JM', currency: 'JMD' },
    { name: 'Japan', code: 'JP', currency: 'JPY' },
    { name: 'Jordan', code: 'JO', currency: 'JOD' },
    { name: 'Kazakhstan', code: 'KZ', currency: 'KZT' },
    { name: 'Kenya', code: 'KE', currency: 'KES' },
    { name: 'Kiribati', code: 'KI', currency: 'AUD' },
    { name: 'Korea (North)', code: 'KP', currency: 'KPW' },
    { name: 'Korea (South)', code: 'KR', currency: 'KRW' },
    { name: 'Kuwait', code: 'KW', currency: 'KWD' },
    { name: 'Kyrgyzstan', code: 'KG', currency: 'KGS' },
    { name: 'Laos', code: 'LA', currency: 'LAK' },
    { name: 'Latvia', code: 'LV', currency: 'EUR' },
    { name: 'Lebanon', code: 'LB', currency: 'LBP' },
    { name: 'Lesotho', code: 'LS', currency: 'LSL' },
    { name: 'Liberia', code: 'LR', currency: 'LRD' },
    { name: 'Libya', code: 'LY', currency: 'LYD' },
    { name: 'Liechtenstein', code: 'LI', currency: 'CHF' },
    { name: 'Lithuania', code: 'LT', currency: 'EUR' },
    { name: 'Luxembourg', code: 'LU', currency: 'EUR' },
    { name: 'Madagascar', code: 'MG', currency: 'MGA' },
    { name: 'Malawi', code: 'MW', currency: 'MWK' },
    { name: 'Malaysia', code: 'MY', currency: 'MYR' },
    { name: 'Maldives', code: 'MV', currency: 'MVR' },
    { name: 'Mali', code: 'ML', currency: 'XOF' },
    { name: 'Malta', code: 'MT', currency: 'EUR' },
    { name: 'Marshall Islands', code: 'MH', currency: 'USD' },
    { name: 'Mauritania', code: 'MR', currency: 'MRO' },
    { name: 'Mauritius', code: 'MU', currency: 'MUR' },
    { name: 'Mexico', code: 'MX', currency: 'MXN' },
    { name: 'Micronesia', code: 'FM', currency: 'USD' },
    { name: 'Moldova', code: 'MD', currency: 'MDL' },
    { name: 'Monaco', code: 'MC', currency: 'EUR' },
    { name: 'Mongolia', code: 'MN', currency: 'MNT' },
    { name: 'Montenegro', code: 'ME', currency: 'EUR' },
    { name: 'Morocco', code: 'MA', currency: 'MAD' },
    { name: 'Mozambique', code: 'MZ', currency: 'MZN' },
    { name: 'Myanmar', code: 'MM', currency: 'MMK' },
    { name: 'Namibia', code: 'NA', currency: 'NAD' },
    { name: 'Nauru', code: 'NR', currency: 'AUD' },
    { name: 'Nepal', code: 'NP', currency: 'NPR' },
    { name: 'Netherlands', code: 'NL', currency: 'NLG' },
    { name: 'New Zealand', code: 'NZ', currency: 'NZD' },
    { name: 'Nicaragua', code: 'NI', currency: 'NIO' },
    { name: 'Niger', code: 'NE', currency: 'NGN' },
    { name: 'Nigeria', code: 'NG', currency: 'NGN' },
    { name: 'North Macedonia', code: 'MK', currency: 'MKD' },
    { name: 'Norway', code: 'NO', currency: 'NOK' },
    { name: 'Oman', code: 'OM', currency: 'OMR' },
    { name: 'Pakistan', code: 'PK', currency: 'PKR' },
    { name: 'Palau', code: 'PW', currency: 'USD' },
    { name: 'Panama', code: 'PA', currency: 'PAB' },
    { name: 'Papua New Guinea', code: 'PG', currency: 'PGK' },
    { name: 'Paraguay', code: 'PY', currency: 'PYG' },
    { name: 'Peru', code: 'PE', currency: 'PEN' },
    { name: 'Philippines', code: 'PH', currency: 'PHP' },
    { name: 'Poland', code: 'PL', currency: 'PLN' },
    { name: 'Portugal', code: 'PT', currency: 'EUR' },
    { name: 'Qatar', code: 'QA', currency: 'QAR' },
    { name: 'Romania', code: 'RO', currency: 'RON' },
    { name: 'Russia', code: 'RU', currency: 'RUB' },
    { name: 'Rwanda', code: 'RW', currency: 'RWF' },
    { name: 'Saint Kitts and Nevis', code: 'KN', currency: 'XCD' },
    { name: 'Saint Lucia', code: 'LC', currency: 'XCD' },
    { name: 'Saint Vincent and the Grenadines', code: 'VC', currency: 'XCD' },
    { name: 'Samoa', code: 'WS', currency: 'WST' },
    { name: 'San Marino', code: 'SM', currency: 'EUR' },
    { name: 'Sao Tome and Principe', code: 'ST', currency: 'STN' },
    { name: 'Saudi Arabia', code: 'SA', currency: 'SAR' },
    { name: 'Senegal', code: 'SN', currency: 'XOF' },
    { name: 'Serbia', code: 'RS', currency: 'RSD' },
    { name: 'Seychelles', code: 'SC', currency: 'SCR' },
    { name: 'Sierra Leone', code: 'SL', currency: 'SLL' },
    { name: 'Singapore', code: 'SG', currency: 'SGD' },
    { name: 'Slovakia', code: 'SK', currency: 'EUR' },
    { name: 'Slovenia', code: 'SI', currency: 'SIT' },
    { name: 'Solomon Islands', code: 'SB', currency: 'SBD' },
    { name: 'Somalia', code: 'SO', currency: 'SOS' },
    { name: 'South Africa', code: 'ZA', currency: 'ZAR' },
    { name: 'South Sudan', code: 'SS', currency: 'SSP' },
    { name: 'Spain', code: 'ES', currency: 'EUR' },
    { name: 'Sri Lanka', code: 'LK', currency: 'LKR' },
    { name: 'Sudan', code: 'SD', currency: 'SDG' },
    { name: 'Suriname', code: 'SR', currency: 'SRD' },
    { name: 'Sweden', code: 'SE', currency: 'SEK' },
    { name: 'Switzerland', code: 'CH', currency: 'CHF' },
    { name: 'Syria', code: 'SY', currency: 'SYP' },
    { name: 'Taiwan', code: 'TW', currency: 'TWD' },
    { name: 'Tajikistan', code: 'TJ', currency: 'TJS' },
    { name: 'Tanzania', code: 'TZ', currency: 'TZS' },
    { name: 'Thailand', code: 'TH', currency: 'THB' },
    { name: 'Timor-Leste', code: 'TL', currency: 'USD' },
    { name: 'Togo', code: 'TG', currency: 'TGX' },
    { name: 'Tonga', code: 'TO', currency: 'TOP' },
    { name: 'Trinidad and Tobago', code: 'TT', currency: 'TTD' },
    { name: 'Tunisia', code: 'TN', currency: 'TND' },
    { name: 'Turkey', code: 'TR', currency: 'TRY' },
    { name: 'Turkmenistan', code: 'TM', currency: 'TMT' },
    { name: 'Tuvalu', code: 'TV', currency: 'AUD' },
    { name: 'Uganda', code: 'UG', currency: 'UGX' },
    { name: 'Ukraine', code: 'UA', currency: 'UAH' },
    { name: 'United Arab Emirates', code: 'AE', currency: 'AED' },
    { name: 'United Kingdom', code: 'GB', currency: 'GBP' },
    { name: 'United States', code: 'US', currency: 'USD' },
    { name: 'Uruguay', code: 'UY', currency: 'UYU' },
    { name: 'Uzbekistan', code: 'UZ', currency: 'UZS' },
    { name: 'Vanuatu', code: 'VU', currency: 'VUV' },
    { name: 'Vatican City', code: 'VA', currency: 'EUR' },
    { name: 'Venezuela', code: 'VE', currency: 'VES' },
    { name: 'Vietnam', code: 'VN', currency: 'VND' },
    { name: 'Yemen', code: 'YE', currency: 'YER' },
    { name: 'Zambia', code: 'ZM', currency: 'ZMW' },
    { name: 'Zimbabwe', code: 'ZW', currency: 'ZWL' },
  ]

  const Navi = useNavigate()
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false) //otp modal
  const [isLoading, setIsLoading] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [role, setRole] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  //-------------sessionStorage

  const email = sessionStorage.getItem('company_mail')

  //-----------------------

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    // Load email from sessionStorage when the component mounts
    const storedEmail = sessionStorage.getItem('company_mail')
    if (storedEmail) {
      setValue('company_mail', storedEmail)
    }
  }, [setValue])

  const onEmailChange = (event) => {
    const email = event.target.value
    sessionStorage.setItem('company_mail', email) // Store email in sessionStorage
  }

  const handleCountryChange = (e) => {
    const selectedCountry = countries.find((country) => country.code === e.target.value)

    if (selectedCountry) {
      setCurrency(selectedCountry.currency)
      setCountry(selectedCountry.name) // Assuming you have a state for country
      sessionStorage.setItem('Country', selectedCountry.name)
      sessionStorage.setItem('Currency', selectedCountry.currency)
    } else {
      setCurrency('')
      setCountry('')
      sessionStorage.removeItem('Country')
      sessionStorage.removeItem('Currency')
    }
  }

  const handleClose = () => setShowModal(false)

  const onSubmit = (data) => {
    console.log(data)
    sessionStorage.setItem('companyname', data.company_name || 'Company Name')
    sessionStorage.setItem('Phone', data.company_mobile || '')
    sessionStorage.setItem('Country', data.country || '')
    sessionStorage.setItem('Currency', data.currency || '')
    setIsLoading(true)
    startResendTimer()
    fetch('https://lunarsenterprises.com:5016/crm/user/registeration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Success:', result)
        setIsLoading(false)
        setModalMessage(result.message || 'An error occurred')

        if (result.status === true) {
          setShowForgotPasswordModal(true)
        } else {
          // Success toast
          // Show modal on failure
          setShowModal(true) // Show modal when result is false
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        setIsLoading(false)
        toast.error('Something went wrong. Please try again.')
        setModalMessage('An error occurred. Please try again.')
        setShowModal(true) // Show modal on error
        setResendDisabled(false)
      })
  }

  // Watch the password field for confirm password validation
  const password = watch('password')

  const handleLoginClick = () => {
    Navi('/')
  }
  const [isOtpSent, setIsOtpSent] = useState(false) // Track OTP status

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [otp, setOtp] = useState('')
  const handleShowForgotPasswordModal = () => setShowForgotPasswordModal(true)
  const handleCloseForgotPasswordModal = () => setShowForgotPasswordModal(false)

  // Function to handle OTP verification
  const Emailchange = sessionStorage.getItem('company_mail')

  const [isLoadingotp, setisLoadingotp] = useState(false)

  const [iserror, setIserror] = useState(false)

  const verifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter the OTP.')
      return
    }
    setisLoadingotp(true)

    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/user/RegisterVerifyOTP',
        {
          email: email,
          otp: otp,
        },
      )

      if (response.data.result === true) {
        toast.success('OTP verified successfully.')
        sessionStorage.setItem('user_id', response.data.user_id)
        sessionStorage.setItem('token', response.data.user_token)
        sessionStorage.setItem('login_status', response.data.login_status)
        Navi('/OraganizationReg')
      } else {
        setIserror({
          type: 'fail',
          message: response.data.message,
        })

        setTimeout(() => {
          setIserror(null)
        }, 3000)
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setisLoadingotp(false)
    }
  }

  //

  return (
    <div className="">
      <ToastContainer />

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <img
              src={Examclination} // Replace with your warning image path
              alt="Warning"
              style={{ width: '30px', marginRight: '10px' }}
            />
            Warning
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showForgotPasswordModal} onHide={handleCloseForgotPasswordModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <img
              src={Passwordimg} // Replace with your warning image path
              alt="Warning"
              style={{ width: '30px', marginRight: '10px' }}
            />
            Verify OTP
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <Form className="" onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="  mb-3">
                <Form.Text className="justify-content-center align-item-center d-flex">
                  We'll send a code to
                </Form.Text>
                <Form.Label className="justify-content-center align-item-center d-flex">
                  {Emailchange || 'Email'}

                  <Form.Text onClick={handleCloseForgotPasswordModal} className="Change">
                    Change
                  </Form.Text>
                </Form.Label>

                <Form.Control
                  type="number"
                  placeholder="Enter OTP "
                  className="me-2"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                 
                  disabled={isOtpSent} // Disable email input after OTP is sent
                />
                <div className=" mt-3 d-flex  justify-content-between align-items-center ">
                  <Button
                    variant="primary"
                    // type="button"
                    // className=" mt-3 d-flex justify-content-center align-items-center "
                    onClick={verifyOtp}
                    disabled={isLoading} // Disable button while OTP is being sent
                  >
                    {isLoadingotp ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{' '}
                        Click Otp...
                      </>
                    ) : (
                      'Verify Otp'
                    )}
                  </Button>
                  {/* <Button variant="primary" type="submit">
                    Resend OTP
                  </Button> */}

                  <Button variant="primary" type="submit" disabled={resendDisabled}>
                    {resendDisabled ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
                  </Button>
                </div>
              </Form.Group>
            </Form>

            {iserror && (
              <Alert
                className="mt-3 text-black"
                variant={iserror.type === 'fail' ? 'success' : ' danger'}
              >
                {iserror.message}
              </Alert>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <div className="container col-12 ">
        <div className="row  ">
          <div className="col-md-6 mt-5 bg_imagecon  ">
            <div className="bg_imagecon ">
              <img src={bg_image} alt="bgs_image" className="bg_image" />
             
              
            </div>
          </div>
          <div className="col-md-6 mt-5 borderr  bg-whitebgf  p-2 ">
            <div>
              <h1 className="welcome-heading">Welcome to Registration</h1>
              <p className="sub-heading">Please enter your details to get started</p>
            </div>
            <div>
              <Form onSubmit={handleSubmit(onSubmit)} className="">
                {/* Company Name */}
                <Form.Group className="mb-2" controlId="formCompanyName">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter company name"
                    {...register('company_name', {
                      required: 'Company name is required',
                      minLength: { value: 3, message: 'Minimum length is 3' },
                      maxLength: { value: 200, message: 'Maximum length is 200' },
                      pattern: {
                        value: /^[A-Za-z\s']+$/,
                        message: 'Only letters and spaces are allowed',
                      },
                    })}
                  />
                  {errors.company_name && (
                    <p className="text-danger">{errors.company_name.message}</p>
                  )}
                </Form.Group>

                {/* User Name */}
                <Form.Group className="mb-2" controlId="formFullName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    {...register('u_name', {
                      required: 'Name is required',
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: 'Only letters, spaces, and apostrophes are allowed',
                      },
                    })}
                  />
                  {errors.u_name && <p className="text-danger">{errors.u_name.message}</p>}
                </Form.Group>

                {/* Company Email */}
                <Form.Group className="mb-2" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    {...register('company_mail', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                        message: 'Invalid email address',
                      },
                    })}
                    onChange={onEmailChange} // Store email in sessionStorage when changed
                  />

                  {errors.company_mail && (
                    <p className="text-danger">{errors.company_mail.message}</p>
                  )}
                </Form.Group>

                {/*  Company Mobile */}
                <Form.Label>Contact Number</Form.Label>
                <Controller
                  name="company_mobile"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Phone number is required',
                    minLength: { value: 7, message: 'Phone number must be at least 5 digits' },
                    maxLength: { value: 15, message: 'Phone number must be at most 15 digits' },
                  }}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      country="in"
                      inputStyle={{ height: '70px', width: '100%' }}
                      placeholder="Enter phone number"
                    />
                  )}
                />

                {errors.company_mobile && (
                  <p className="text-danger">{errors.company_mobile.message}</p>
                )}
                {/* Role */}

                {/* <Form.Group className="mb-2 mt-2">
                  <Form.Label htmlFor="role-select">Select Your Privilege</Form.Label>
                  <Form.Select
                    id="role-select"
                    className="custom-placeholder"
                    // value={role}
                    onChange={(e) => setRole(e.target.value)}
                    {...register('role', {
                      required: 'Role name is required', // Validation message
                    })}
                    aria-invalid={errors.role ? 'true' : 'false'} // Accessibility for validation
                  >
                    <option value="">Select Your Privilege</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="accountant">Accountant</option>
                    <option value="cashier">Cashier</option>
                  </Form.Select>
                  {errors.role && (
                    <Form.Text className="text-danger">{errors.role.message}</Form.Text>
                  )}
                </Form.Group>  */}

                <Form.Group className="mb-2 mt-2" controlId="country-select">
                  <Form.Label>Select Country</Form.Label>
                  <Form.Select
                    {...register('country', { required: 'country is required' })}
                    onChange={handleCountryChange}
                    className="custom-placeholder colorstyle"
                  >
                    <option value="">Select a Country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.country && <p className="text-danger">{errors.country.message}</p>}
                </Form.Group>

                {currency && (
                  <Form.Group className="mt-2" controlId="currency">
                    <Form.Label>Currency</Form.Label>
                    <Form.Control
                      {...register('currency', { required: true })}
                      value={currency}
                      readOnly
                    />
                  </Form.Group>
                )}

                {/* Password */}
                <Form.Group className="mb-2" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={passwordVisible ? 'text' : 'password'}
                      placeholder="Enter password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                          message:
                            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                        },
                      })}
                    />
                    <Button
                      className="btneye"
                      variant="outline-secondary"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                    </Button>
                  </div>
                  {errors.password && <p className="text-danger">{errors.password.message}</p>}
                </Form.Group>

                {/* Confirm Password */}
                <Form.Group className="mb-2" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      placeholder="Confirm password"
                      {...register('confirm_password', {
                        required: 'Confirm password is required',
                        validate: (value) => value === password || 'Passwords do not match',
                      })}
                    />
                    <Button
                      variant="outline-secondary"
                      className=" btneye"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    >
                      <FontAwesomeIcon icon={confirmPasswordVisible ? faEye : faEyeSlash} />
                    </Button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-danger">{errors.confirm_password.message}</p>
                  )}
                </Form.Group>

                {/* Submit Button */}
                <div className="centree  mt-4">
                  <Button
                    variant="primary"
                    type="submit"
                    className=" btnreg d-flex  justify-content-center align-items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Create your account ...
                      </>
                    ) : (
                      'Create your account'
                    )}
                  </Button>
                </div>
              </Form>
            </div>

            <div className="login-cta py-3">
              <p>
                Already have an account?{' '}
                <span className="login-link" onClick={handleLoginClick}>
                  Click to login
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

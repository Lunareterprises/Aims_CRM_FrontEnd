import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Form, Button, Row, Col, Modal, Spinner } from 'react-bootstrap'
import '../OraganizationReg/OraganizationReg.css' // Import the CSS file for styling
import Select from 'react-select'
import Examclination from '../../../assets/images/exclamation.png'
import Tick from '../../../assets/images/Tick.png'

import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const OraganizationReg = () => {
  const [showModal, setShowModal] = useState(false)
  const handleClose = () => setShowModal(false)
  const [modalMessage, setModalMessage] = useState('')

  const company_name = sessionStorage.getItem('companyname')
  const Phone = sessionStorage.getItem('Phone')
  const Country = sessionStorage.getItem('Country')
  const Currency = sessionStorage.getItem('Currency')
  const user_id = sessionStorage.getItem('user_id')
  const token = sessionStorage.getItem('token')

  const industriesOptions = [
    { value: 'Automotive', label: 'Automotive' },
    { value: 'Computer Software', label: 'Computer Software' },
    { value: 'Consumer Goods', label: 'Consumer Goods' },
    { value: 'Consumer Services', label: 'Consumer Services' },
    { value: 'Education Management', label: 'Education Management' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Financial Services', label: 'Financial Services' },
    { value: 'Health, Wellness and Fitness', label: 'Health, Wellness and Fitness' },
    { value: 'Hospital & Health Care', label: 'Hospital & Health Care' },
    { value: 'Hospitality', label: 'Hospitality' },
    { value: 'Information Technology and Services', label: 'Information Technology and Services' },
    { value: 'Leisure, Travel & Tourism', label: 'Leisure, Travel & Tourism' },
    { value: 'Marketing and Advertising', label: 'Marketing and Advertising' },
    { value: 'Media Production', label: 'Media Production' },
    { value: 'Non-Profit Organization Management', label: 'Non-Profit Organization Management' },
    { value: 'Performing Arts', label: 'Performing Arts' },
    { value: 'Publishing', label: 'Publishing' },
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Telecommunications', label: 'Telecommunications' },
  ]

  const [loader, setLoader] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()
  const [selectedTaxType, setSelectedTaxType] = useState('')

  const navigate = useNavigate() // Initialize navigation

  const onSubmit = async (data) => {
    console.log(data)
    setLoader(true)

  
    try {
      const response = await axios.post(
        'https://lunarsenterprises.com:5016/crm/about/organization',
        {
        



        
            Org_name:data.organizationName, 
            industry: data.industry.value,
            Org_location:data.organizationLocation,
            state:data.stateUnionTerritory,
            base_currency: data.baseCurrency,
            fiscal_year:data.fiscalYear,
            language: data.language,
            tax_type:data.taxType,
            gst_num:data.taxNumber,

        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            u_id: user_id,
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
          navigate('/dashboard') // Change to your success page
        }, 3000)
      } else {
        setModalMessage({
          type: 'fail',
          message: response.data.message,
        })
        setShowModal(true)

        setTimeout(() => {
          setShowModal(false)
        }, 3000)
      }
    } 
    
    
    catch (error) {
      console.error(error, 'error')
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

  const handleTaxTypeChange = (event) => {
    const selectedValue = event.target.value
    setSelectedTaxType(selectedValue)
    setValue('taxNumber', '') // Reset the tax number input when tax type changes
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
      <div className="form-container">
        <Form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 form-content shadow-3d bg-white formorg"
          style={{ maxWidth: '600px', margin: 'auto' }}
        >
          <Form.Group controlId="organizationName">
            <Form.Label>Organization Name*</Form.Label>
            <Form.Control
              value={company_name || 'Company Name'}
              type="text"
              placeholder="Enter organization name"
              {...register('organizationName', { required: 'Organization name is required' })}
              readOnly
              className="read-only-input"
            />
            {errors.organizationName && (
              <p className="text-danger">{errors.organizationName.message}</p>
            )}
          </Form.Group>

          <Form.Group controlId="industries" className="mt-2">
            <Form.Label>Industry*</Form.Label>
            <Controller
              name="industry"
              control={control}
              rules={{ required: 'Industry is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={industriesOptions}
                  isClearable
                  isSearchable
                  placeholder="Select or type to add an industry"
                  classNamePrefix="react-select"
                />
              )}
            />
            {errors.industry && <p className="text-danger">{errors.industry.message}</p>}
          </Form.Group>

          <Row>
            <Col>
              <Form.Group controlId="organizationLocation" className="mt-2">
                <Form.Label>Organization Location*</Form.Label>
                <Form.Control
                  {...register('organizationLocation', { required: 'Location is required' })}
                  value={Country}
                  placeholder="India"
                  readOnly
                  className="read-only-input"
                />
                {errors.organizationLocation && (
                  <p className="text-danger">{errors.organizationLocation.message}</p>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="stateUnionTerritory" className="mt-2">
                <Form.Label>State/Union Territory*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter state or union territory"
                  {...register('stateUnionTerritory', {
                    required: 'State/Union Territory is required',
                    pattern: {
                      value: /^[A-Za-z\s]+$/, // Allows only letters and spaces
                      message: 'Only letters are allowed',
                    },
                  })}
                />
                {errors.stateUnionTerritory && (
                  <p className="text-danger">{errors.stateUnionTerritory.message}</p>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="baseCurrency" className="mt-2">
            <Form.Label>Base Currency*</Form.Label>
            <Form.Control
              type="text"
              placeholder="INR - Indian Rupee"
              readOnly
              value={Currency}
              {...register('baseCurrency')}
              className="read-only-input"
            />
          </Form.Group>

          <Form.Group controlId="fiscalYear" className="mt-2">
            <Form.Label>Fiscal Year</Form.Label>
           
             
              <Form.Select as="select" {...register('fiscalYear')}>
                <option value="January - December ">January - December </option>
                <option value="February - January">February - January</option>
                <option value="March - February">March - February</option>
                <option value="April - March">April - March</option>

                <option value="May - April"> May - April</option>
                <option value=" June - May"> June - May</option>
                <option value="July - June"> July - June</option>
                <option value="August - July"> August - July</option>
                <option value="September - August"> September - August</option>
                <option value="October - September"> October - September</option>
                <option value="November - October"> November - October</option>
                <option value="December - November"> December - November</option>
              </Form.Select>
            </Form.Group>
        

          <Form.Group controlId="language" className="mt-2">
            <Form.Label>Language*</Form.Label>
            <Form.Select {...register('language', { required: 'Language is required' })}>
              <option value="English">English</option>
              <option value="Arabic">Arabic</option>
              <option value="German">German (Austria)</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
              <option value="Chinese">Chinese</option>
              <option value="Hindi">Hindi</option>
              <option value="Japanese">Japanese</option>
              <option value="Russian">Russian</option>
              <option value="Portuguese">Portuguese</option>
              {/* Add more languages as needed */}
            </Form.Select>
            {errors.language && <p className="text-danger">{errors.language.message}</p>}
          </Form.Group>

          {/* <Form.Group controlId="timeZone">
          <Form.Label>Time Zone*</Form.Label>
          <Form.Control
            as="select"
            {...register('timeZone', { required: 'Time zone is required' })}
          >
            <option value="GMT 5:30">GMT 5:30 India Standard Time (Asia/Calcutta)</option>
          </Form.Control>
          {errors.timeZone && <p className="text-danger">{errors.timeZone.message}</p>}
        </Form.Group> */}

          <Form.Group controlId="taxType" className="mt-2">
            <Form.Label>Tax Type*</Form.Label>
            <Form.Select
              {...register('taxType', { required: 'Tax type is required' })}
              onChange={handleTaxTypeChange}
            >
              <option value="">Select Tax Type</option>
              <option value="GST">GST</option>
              <option value="VAT">VAT</option>
            </Form.Select>
            {errors.taxType && <p className="text-danger">{errors.taxType.message}</p>}
          </Form.Group>

          {selectedTaxType && (
            <Form.Group controlId="taxNumber">
              <Form.Label>{selectedTaxType} Number*</Form.Label>
              <Form.Control
                       className="text-uppercase"
     
                type="text"
                placeholder={`Enter ${selectedTaxType} number`}
                {...register('taxNumber', {
                  required: `${selectedTaxType} number is required`,
                  minLength: {
                    value: 8,
                    message: `${selectedTaxType} number must be at least 8 characters`,
                  },
                  maxLength: {
                    value: 18,
                    message: `${selectedTaxType} number cannot exceed 18 characters`,
                  },
                  pattern: {
                    value: /^[A-Za-z0-9]+$/, // Only letters and numbers
                    message: 'Only letters and numbers are allowed (no special characters)',
                  },
                })}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '') // Prevents special characters in real-time
                }}
              />
              {errors.taxNumber && <p className="text-danger">{errors.taxNumber.message}</p>}
            </Form.Group>
          )}

          {/* <Form.Group controlId="gstRegistered">
          <Form.Check
            type="switch"
            label="Is this business registered for GST?"
            {...register('gstRegistered')}
          />
        </Form.Group> */}

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
        </Form>
        <div className="image-section"></div>
      </div>
    </>
  )
}

export default OraganizationReg

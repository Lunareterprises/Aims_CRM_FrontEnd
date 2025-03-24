import React, { useState } from 'react'
import './Profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faCog, faGlobe, faSignOutAlt, faPen } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Profile = () => {
  const Navi = useNavigate()
    const { t, i18n } = useTranslation();
  
  const [error, setError] = useState(null)

  const handleImageUpload = async (e) => {
    try {
      const data = new FormData()
      data.append('image', e.target.files[0])

      const response = await axios.post('http://444/imageupload', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.data.result === true) {
        setError({
          type: 'success',
          message: response.data.message,
        })
      } else {
        setError({
          type: 'danger',
          message: response.data.message,
        })
      }
      console.log('Uploaded Image:', response.data)
    } catch (error) {
      console.error('Image upload failed:', error)
      setError({
        type: 'danger',
        message: 'Failed to upload image. Please try again later.',
      })
    }

    // Clear the alert after 3 seconds
    setTimeout(() => setError(null), 3000)
  }

  return (
    <div className="profile-card">
      <div className="profile-image-container">
        <img
          src="https://via.placeholder.com/150" // Placeholder profile image
          alt="Profile"
          className="profile-image"
        />

        {error && (
          <Alert className="mt-3" variant={error.type}>
            {error.message}
          </Alert>
        )}

        <label htmlFor="file-upload" className="edit-icon">
          <FontAwesomeIcon icon={faEdit} />
        </label>
        <input
          type="file"
          id="file-upload"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </div>
      <h3 className="username">John Doe</h3>
      <div className="options-list">
        <div className="option" onClick={() => Navi('/dashboard/Profile/EditProfile')}>
          <FontAwesomeIcon icon={faPen} />

          <span> {t("Edit Profile")}</span>
        </div>

        <div className="option" >
          <FontAwesomeIcon icon={faCog} />
          <span> {t("Settings")}</span>

        </div>
        <div className="option" onClick={() => Navi('/dashboard/Profile/Language')}>
          <FontAwesomeIcon icon={faGlobe} />
          <span> {t("Language")}</span>

        </div>

        <div className="option" onClick={() => Navi('/dashboard/Profile/BulkEmail')}>
          <FontAwesomeIcon icon={faGlobe} />
          <span> {t("Bulk Email")}</span>

        </div>
        <div
          className="option"
          onClick={() => {
            sessionStorage.clear() // Clear all sessionStorage
            // window.location.reload(); // Optionally reload the page or redirect
          }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span> {t("Sign Out")}</span>

        </div>
      </div>
    </div>
  )
}

export default Profile

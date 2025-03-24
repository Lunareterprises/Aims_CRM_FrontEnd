import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import imagedq from '../../../assets/images/Aimslogo.png'

import one from '../../../assets/images/one.jpg'
import two from '../../../assets/images/two.jpg'
import three from '../../../assets/images/three.jpg'

const ImageCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  const images = [
    {
      src: imagedq,
      alt: 'Beautiful Landscape',
      caption: { title: 'Amazing View', description: 'Breathtaking mountain scenery' },
    },
    {
      src: one,
      alt: 'City Skyline',
    },
    {
        src: two,
        alt: 'Beautiful Landscape',
        caption: { title: 'Amazing View', description: 'Breathtaking mountain scenery' },
      },
      {
        src: three,
        alt: 'City Skyline',
      },
    // Add more images as needed
  ]

  useEffect(() => {
    // Auto-slide functionality
    const interval = setInterval(() => {
      if (!animating) {
        nextSlide()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [activeIndex, animating])

  const nextSlide = () => {
    if (animating) return
    setAnimating(true)
    setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    setTimeout(() => setAnimating(false), 700) // Match with transition duration
  }

  const prevSlide = () => {
    if (animating) return
    setAnimating(true)
    setActiveIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
    setTimeout(() => setAnimating(false), 700) // Match with transition duration
  }

  const goToIndex = (index) => {
    if (animating || index === activeIndex) return
    setAnimating(true)
    setActiveIndex(index)
    setTimeout(() => setAnimating(false), 700) // Match with transition duration
  }

  return (
    <div className="carousel-container position-relative">
      <div className="carousel-inner">
        {images?.map((image, index) => (
          <div
            key={index}
            className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: index === activeIndex ? 1 : 0,
              transition: 'opacity 0.7s ease-in-out',
            }}
          >
            <img
              src={image.src}
              alt={image.alt || `Slide ${index + 1}`}
              className="d-block w-100 h-75  object-fit-cover radicus"
            />
            {/* {image?.caption && (
              <div className="carousel-caption d-none d-md-block">
                <h5>{image.caption.title}</h5>
                <p>{image.caption.description}</p>
              </div>
            )} */}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {/* <button className="carousel-control-prev" type="button" onClick={prevSlide}>
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" onClick={nextSlide}>
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button> */}

      {/* Indicators */}
      {/* <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={index === activeIndex ? 'active' : ''}
            onClick={() => goToIndex(index)}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div> */}
    </div>
  )
}

export default ImageCarousel

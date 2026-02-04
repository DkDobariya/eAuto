import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Carousel } from 'bootstrap';

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const carouselElement = document.getElementById('heroCarousel');
    if (carouselElement) {
      // Initialize Bootstrap carousel with 5 second interval and auto ride
      new Carousel(carouselElement, {
        interval: 3000,
        ride: 'carousel',
        pause: false,
        wrap: true,
        touch: true,
      });
    }
  }, []);

  const slides = [
    { id: 1, image: '/img/Bike/main.jpg' },
    { id: 2, image: '/img/Bike/main2.jpg' },
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section position-relative text-white">
        <div
          id="heroCarousel"
          className="carousel slide carousel-fade h-100"
          data-bs-ride="carousel"
          data-bs-interval="1000"
        >
          <div className="carousel-inner h-100">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`carousel-item ${index === 0 ? 'active' : ''}`}
              >
                <div
                  className="hero-slide"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Carousel Controls */}
          {/* <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button> */}
        </div>

        <div className="hero-overlay position-absolute top-0 start-0 w-100 h-100" />
        <div className="hero-content text-center position-absolute top-50 start-50 translate-middle">
          <a
            href="#brands"
            className="btn-shop text-uppercase fw-bold px-4 py-2 rounded"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* BIKE BRANDS */}
      <div className="container my-5" id="brands">
        <div className="row g-4 justify-content-center">
          {/* Bajaj */}
          <BrandCard
            image="/img/Bike/Bajaj.jpg"
            name="Bajaj"
            delay={0}
            link="/bajaj"
          />

          {/* Hero */}
          <BrandCard
            image="/img/Bike/Hero.jpg"
            name="Hero"
            delay={100}
            link="/hero"
          />

          {/* Honda */}
          <BrandCard
            image="/img/Bike/Honda.jpg"
            name="Honda"
            delay={200}
            link="/honda"
          />
        </div>
      </div>
    </>
  );
};

const BrandCard = ({ image, name, delay, link }) => (
  <div className="col-sm-6 col-lg-4" data-aos="fade-up" data-aos-delay={delay}>
    <a href={link} className="text-decoration-none">
      <div className="bike-card text-center p-3 rounded shadow-sm">
        <img
          src={image}
          alt={`${name} Bike`}
          className="bike-image w-100 mb-3 rounded"
          loading="lazy"
        />
        <div className="brand-name fw-semibold fs-5 text-primary">
          {name} <span className="arrow">→</span>
        </div>
      </div>
    </a>
  </div>
);

export default Home;

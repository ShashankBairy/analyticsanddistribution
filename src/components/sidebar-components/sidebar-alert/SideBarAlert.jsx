import React, { useState, useEffect } from "react";
import styles from "./SideBarAlert.module.css";
import bellIcon from "../../../assets/sidebaricons/alert_bellicon.svg";
import leftarrow_icon from "../../../assets/sidebaricons/leftarrow_icon.svg";
import rightarrow_icon from "../../../assets/sidebaricons/rightarrow_icon.svg";
import {slides} from "./AlertSlideContent"
const SideBarAlert = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState("next"); 
  const [animKey, setAnimKey] = useState(0); 

  const goToPreviousSlide = () => {
    setDirection("prev");
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setAnimKey((k) => k + 1);
  };

  const goToNextSlide = () => {
    setDirection("next");
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setAnimKey((k) => k + 1);
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? "next" : "prev");
    setCurrentSlide(index);
    setAnimKey((k) => k + 1);
  };

  //  Auto-slide every _ seconds
  useEffect(() => {
    const id = setInterval(() => {
      setDirection("next");
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setAnimKey((k) => k + 1);
    }, 3000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className={styles.alert_box}>
      <figure>
        <img src={bellIcon} className={styles.icon} />
      </figure>
      <div className={styles.red_text_container}>
        <p className={styles.red_text}>Alert</p>
      </div>

      <div
        key={animKey}
        className={`${styles.swiper_part} ${
          direction === "next" ? styles.slideInRight : styles.slideInLeft
        }`}
      >
        <h1 className={styles.swipe_header_part}>
          {slides[currentSlide].title}
        </h1>
        <p className={styles.swiper_sub_text}>{slides[currentSlide].text}</p>
      </div>

      {/* Custom pagination and arrows */}
      <div className={styles.alert_lower_section}>
        <div className={styles.pagination_slide_container}>
          {/* Left Arrow */}
          <figure
            className={styles.swiper_button_prev}
            onClick={goToPreviousSlide}
          >
            <img src={leftarrow_icon} />
          </figure>

          {/* Pagination Dots */}
          <div className={styles.pagination_dots}>
            {slides.map((_, index) => (
              <span
                key={index}
                className={`${styles.dot} ${
                  currentSlide === index ? styles.activeDot : ""
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <figure className={styles.swiper_button_next} onClick={goToNextSlide}>
            <img src={rightarrow_icon} />
          </figure>
        </div>

        <div className={styles.pagination_fraction}>
          <p className={styles.fraction_values}>
            {currentSlide + 1}/{slides.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideBarAlert;

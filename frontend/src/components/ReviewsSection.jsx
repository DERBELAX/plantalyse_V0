import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../styles/review-slider.css";
import { CarouselArrow } from "./CarouselArrows";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
  fetch("/api/reviews") 
    .then((res) => res.json())
    .then((data) => setReviews(data))
    .catch((err) => console.error("Erreur chargement des avis :", err));
}, []);


  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    autoplay: true,
    speed: 600,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: () => <div></div>,
    appendDots: (dots) => (
      <div className="pt-6">
        <ul className="review-dots flex justify-center gap-4">{dots}</ul>
      </div>
    ),
  };

  return (
    <section className="bg-[#ECEDCA] py-16 px-4">
      <div className="max-w-4xl mx-auto text-center text-white relative">
        {reviews.length === 0 ? (
          <p className="text-gray-800 text-lg">Aucun avis pour le moment.</p>
        ) : (
          <>
            <Slider ref={sliderRef} {...settings}>
              {reviews.map((review, index) => (
                <div key={index} className="px-4">
                  <p className="text-lg mb-2 font-medium opacity-80 text-gray-800">
                    Note : {review.rating} / 5
                  </p>
                  <div className="flex justify-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className="text-yellow-500 text-2xl mx-1"
                      />
                    ))}
                  </div>
                  <p className="text-2xl md:text-3xl font-bold whitespace-pre-line leading-snug text-[#2E3B2B]">
                    {review.content}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {review.userName} 
                  </p>
                </div>
              ))}
            </Slider>


            {/* Flèches */}
            <div className="absolute top-1/2 left-[-3rem] right-[-3rem] flex justify-between items-center px-4 -translate-y-1/2 pointer-events-none">
              <div className="pointer-events-auto">
                <CarouselArrow
                  direction="left"
                  variant="chevron"
                  onClick={() => sliderRef.current?.slickPrev()}
                />
              </div>
              <div className="pointer-events-auto">
                <CarouselArrow
                  direction="right"
                  variant="chevron"
                  onClick={() => sliderRef.current?.slickNext()}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;

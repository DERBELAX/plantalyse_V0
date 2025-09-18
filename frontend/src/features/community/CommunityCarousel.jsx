import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/community-carousel.css";

import { NextArrow, PrevArrow } from "../../components/CarouselArrows";

const CommunityCarousel = ({
  backgroundColor = "bg-white",
  titleColor = "text-[#2E3B2B]",
  accentColor = "text-[#2E3B2B]",
}) => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/community/posts")
      .then((res) => {
        const postsWithImages = res.data.filter((post) => post.image);
        setImages(postsWithImages);
      })
      .catch((err) =>
        console.error("Erreur chargement images carrousel", err)
      );
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    customPaging: () => <div className={`dot-tiret ${accentColor}`}>—</div>,
    appendDots: (dots) => (
      <div className="mt-6">
        <ul className="flex justify-center gap-4">{dots}</ul>
      </div>
    ),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className={`${backgroundColor} py-16 px-6`}>
      <div className="max-w-7xl mx-auto">
       <h3
        className="text-3xl font-bold mb-4 text-[#2E3B2B]"
        onClick={() => navigate("/community")}
      >
        Rejoins Notre Communauté !
      </h3>


        <div className="relative">
     <Slider {...settings}>
  {images.map((post) => (
    <div
      key={post.id}
      className="px-2" 
      onClick={() => navigate("/community")}
    >
      <img
        src={`${process.env.REACT_APP_API_URL}${post.image}`}
        alt={post.title}
        className="h-80 w-full object-cover rounded-lg shadow"
      />
      <p className="text-center mt-2 font-semibold text-[#2E3B2B] hover:text-green-600 transition">
        {post.title}
      </p>
    </div>
  ))}
</Slider>

        </div>
      </div>
    </section>
  );
};

export default CommunityCarousel;

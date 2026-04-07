import React from "react";
import Image1 from "../assets/women.png";
import Image2 from "../assets/shopping.png";
import Image3 from "../assets/sale.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { useState } from "react";





const ImageList = [
  {
    id: 1,
    img: Image1,
    badge: " Limited Offer",
    title: "Upto 50% off on All Men's Wear",
    description:
      "Lorem  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    img: Image2,
    badge: " Limited Offer",
    title: "30% off on All Women's Wear",
    description:
      "Lorem consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    img: Image3,
    badge: " Limited Offer",
    title: "70% off on All Products Sale",
    description:
      "Lorem consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bgColor: "bg-blue-100",
    },
];

const Hero = ({ handleOrderPopup }) => {

    const [activeSlide, setActiveSlide] = useState(0);
  const setting = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    beforeChange: (current, next) => setActiveSlide(next),
  };

  return (
    <div className="relative overflow-hidden min-h-137.5 sm:min-h-[650px] flex items-center bg-gray-300 z-10">
{/* bg design */}

      <div className="absolute -top-1/2 right-0 h-[700px] w-[700px] bg-orange-300 rounded-3xl rotate-45 -z-10" />
      <div className="container mx-auto px-4 relative ">
        <Slider {...setting}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center ">
                {/* Text Section */}

                <div className="flex flex-col gap-4 text-center sm:text-left order-2 sm:order-1 ">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.0 }}
                  >
                    <span className="text-sm bg-red-500 text-white px-3 py-1 rounded-full w-fit">
                      {data.badge}
                    </span>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold">
                      {data.title}
                    </h1>

                    <p className="text-sm text-gray-600 max-w-md">
                      {data.description}
                    </p>

                    <div>
                      <button className="bg-blue-300 text-black px-6 py-2 rounded-full hover:scale-105 duration-200">
                        Order Now
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Image */}

                <div className="order-1 sm:order-2 flex justify-center items-center">
                  <div className="h-[300px] sm:h-[450px] w-full flex justify-center items-center">
                    <img
                      src={data.img}
                      alt="hero"
                      className="max-h-full max-w-full object-contain drop-shadow-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;

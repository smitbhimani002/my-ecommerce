import { color } from "framer-motion";
import React from "react";
import img1 from "../assets/wphoto/women1.png";
import img2 from "../assets/wphoto/women2.jpg";
import img3 from "../assets/wphoto/women3.jpg";
import img4 from "../assets/wphoto/women4.jpg";
import img5 from "../assets/wphoto/women2.jpg";

// import FaStar from "react-icons/fa6";

const ProductData = [
  {
    id: 1,
    img: img1,
    title: "whomen Ethanic",
    rating: 5.0,
    color: "red",
    aosDelay: "0",
  },

  {
    id: 2,
    img: img2,
    title: "whomwn western",
    rating: 4.8,
    color: "blue",
    aosDelay: "200",
  },

  {
    id: 3,
    img: img3,
    title: "googles",
    rating: 4.6,
    color: "white",
    aosDelay: "400",
  },

  {
    id: 4,
    img: img4,
    title: "Printed t-Shirt",
    rating: 4.0,
    color: "geeen",
    aosDelay: "600",
  },

  {
    id: 5,
    img: img5,
    title: "fashin t-Shirt",
    rating: 4.7,
    color: "yellow",
    aosDelay: "800",
  },
];

function Product() {
  return (
    <div className="mt-10 mb-12">
      <div className="container">
        {/* header section  */}
        <div className="text-center mb-10 max-w-[600px]  mx-auto">
          <p data-aos="fade-up" className="    text-orange-300 font-medium ">
            Top Selleing oroduct{" "}
          </p>
          <h1 data-aos="fade-up" className="  font-bold text-3xl">
            PRODUCT
          </h1>
          <p data-aos="fade-up" className="   text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore iure
            fuga nulla dicta omnis vel ducimus.
          </p>
        </div>
        {/* body section  */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
            {ProductData.map((data) => (
              <div
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                key={data.id}
                className="space-y-3"
              >
                <img
                  src={data.img}
                  alt=""
                  className="h-[230px] w-[180px] object-cover rounded-2xl"
                />
                <div>
                  <h3>{data.title}</h3>
                  <p>{data.color}</p>
                  {/* <div><FaStar/></div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;

import React from "react";
import img1 from "../assets/shirt.png";
import img2 from "../assets/shirt2.png";
import img3 from "../assets/shirt3.png";
const ProductData = [
  {
    id: 1,
    title:"Casual Weare",
    img: img1,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut esse ",
  },
  {
    id: 2,
    title:"Printed Shirt",
    img: img2,
    description:
      " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut esse ",
  },
  {
    id: 3,
    title: "Women shirt",
    img: img3,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut esse ",
  },
];

const TopProduct = () => {
  return (
    <div>
      <div className="container">
        {/* text */}
        <div className="text-center mb-25 ">
          <p data-aos="fade-up" className="    text-orange-300 font-medium ">
            Top Reted product for You
          </p>
          <h1 data-aos="fade-up" className="  font-bold text-3xl">
            best PRODUCT
          </h1>
          <p data-aos="fade-up" className="   text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore iure
            fuga nulla dicta omnis vel ducimus.
          </p>
        </div>

        {/* img */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-35 md:gap-22 justify-items-center ">
          {ProductData.map((data) => (
            <div
              className="rounded-2xl bg-white  hover:bg-black hover:text-white
                             relative shadow-xl duration-700 max-w-[300px] group"
            >
              <div className="max-h-[120px] ">
                <img
                  src={data.img}
                  alt=""
                  className=" max-h-[200px] mx-auto block trasfor -translate-y-20 group-hover:scale-110 duration-300 drop-shadow-2xl"
                />
              </div>
              <div className="text-center space-y-5">
                <h1>{data.title}</h1>
                <p className=" text-gray-400 group-hover:text-white">
                  {data.description}
                </p>
                <button className="bg-blue-500 mb-3 rounded-xl p-2 group-hover:bg-white group-hover:text-blue-400">
                  order now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProduct;

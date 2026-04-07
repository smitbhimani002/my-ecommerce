import React from "react";
import img1 from "../assets/wphoto/women2.jpg";
import { GrSecure } from "react-icons/gr";
import { IoFastFoodSharp } from "react-icons/io5";
import { SiContactlesspayment } from "react-icons/si";
import { BiSolidOffer } from "react-icons/bi";

const Banner = () => {
  return (
    <div className=" min-h-[550px] flex justify-center items-center py-12 sm:py-0">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-6">
          <div data-aos="zoom-in">
            <img
              className="drop-shadow-2xl max-w-[400px] h-[350px] mx-auto w-full"
              src={img1}
              alt=""
            />
          </div>
          <div className="flex justify-center flex-col gap-5">
            <h1 className="font-bold text-4xl"> Winter sell up 50% off </h1>
            <p className="text-gray-300 text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit amet
              consectetur adipisicing elit. Vero, recusandae?
            </p>
            <div data-aos="fade-up" className="flex flex-col gap-5">
              <div className="flex gap-7 items-center">
                <GrSecure className="h-10 w-11 rounded-full text-xl p-2 bg-violet-100 " />
                <h1 className="font-medium text-2xl">Quality Product</h1>
              </div>
              <div className="flex gap-7 items-center">
                <IoFastFoodSharp className="h-10 w-11 rounded-full text-xl p-2 bg-violet-100 " />
                <h1 className="font-medium  text-2xl">Faast Delivery</h1>
              </div>
              <div className="flex gap-7 items-center">
                <SiContactlesspayment className="h-10 w-11 rounded-full text-xl p-2 bg-violet-100 " />
                <h1 className="font-medium  text-2xl"> Easy Payment Method</h1>
              </div>
              <div className="flex gap-7 items-center">
                <BiSolidOffer className="h-10 w-11 rounded-full text-xl p-2 bg-violet-100 " />
                <h1 className="font-medium  text-2xl"> Get Offer </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;

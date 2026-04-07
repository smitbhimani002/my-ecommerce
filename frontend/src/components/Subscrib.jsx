import React from 'react'
import img1 from "../assets/orange-pattern.jpg"

const Bannerimg = {
backgroundImage: `url(${img1})`,
backgroundPosition: "center",
backgroundRepeat:"no-repeat",
backgroundSize: "cover",
height:"100%",
width:"100%",

};





const Subscrib = () => {
  return (
    <div
      data-aos="zoom-in"
      className=" text-white bg-gray-500 mb-12 "
      style={Bannerimg}
    >
      <div className="container backdrop-blur-sm py-8 ">
        <div className='space-y-4 max-w-xl mx-auto ' >
          <h1 className="text-center sm:text-left text-2xl sm:text-4xl">
            Get Notifid About Product
          </h1>
          <input
            type="text"
            placeholder="enter your email "
            // className="p-3 w-full placeholder-white focus:bg-white focus:text-black "
            className="
    bg-transparent
    text-white
    placeholder-white/70
    border border-white
    px-4 py-2
    outline-none
    focus:bg-white
    focus:text-black
    focus:placeholder-gray-400
    transition
  "
          />
        </div>
      </div>
    </div>
  );
}

export default Subscrib

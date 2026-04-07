import React from "react";
import img1 from "../assets/footer-pattern.jpg";
import { div, li } from "framer-motion/client";
import logo from "../assets/Logo.png";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaMobileAlt } from "react-icons/fa";
const Bannerimg = {
  backgroundImage: `url(${img1})`,
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const FooterLink = [
  {
    title: "Home",
    link: "/#",
  },
  {
    title: "About",
    link: "/#",
  },
  {
    title: "Content",
    link: "/#",
  },
  {
    title: "blog",
    link: "/#",
  },
];

const Footern = () => {
  return (
    <div style={Bannerimg} className=" pb-45 text-white">
      <div className="container">
        <div className="grid md:grid-cols-3 pt-5">
          <div className="px-4 py-8">
            <h1 className="flex items-center font-bold">
              {" "}
              <img src={logo} alt="" className="max-w-12.5" />
              Shopsy
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum
              quas dolores necessitatibus, quasi iure dolorem!
            </p>
          </div>

          {/* links */}
          <div>
            <div className=" pl- grid grid-cols-2 sm:grid-cols-3 mb-8 ">
              <div className="py-8 px-4   ">
                <h1 className="font-bold text-xl mb-4 ">Important Links</h1>
                <ul className="flex gap-4">
                  {FooterLink.map((link) => (
                    <li
                      key={link.title}
                      className="  hover:text-blue-400   cursor-pointer text-gray-200  text-md"
                    >
                      <span>{link.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* social media */}
          <div className="flex flex-col gap-2 pl-4">
            <div className="flex content-start space-x-2">
              <a href="#">
                <FaInstagram className="text-3xl" />
              </a>
              <a href="#">
                <FaFacebook className="text-3xl" />
              </a>
              <a href="#">
                <FaLinkedin className="text-3xl" />
              </a>
            </div>
            {/* so2 */}

            <div className="flex gap-5 items-center">
              <FaLocationDot />
              <p>mMorbi,Gujarat</p>
            </div>
            <div className="flex gap-5 items-center mt-3">
              <FaMobileAlt />
              <p>+91 123456789</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footern;

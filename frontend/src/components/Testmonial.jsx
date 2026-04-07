import React from "react";
import Slider from "react-slick";
const TestimonialData = [
  {
    id: 1,
    name: "alex roy",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Satya liya",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "bob ",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    img: "https://picsum.photos/104/104",
  },
  {
    id: 4,
    name: "roman pauwl",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    img: "https://picsum.photos/103/103",
  },
];

const Testmonial = () => {
  var setting = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToScroll: 1,
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
  };

  return (
    <div className="y-10 mb-20">
      <div className="container">
        <div className="text-center mb-10 max-w-[600px]  mx-auto">
          <p data-aos="fade-up" className="    text-orange-300 font-medium ">
            What our customer Say !
          </p>
          <h1 data-aos="fade-up" className="  font-bold text-3xl">
            Testimonial
          </h1>
          <p data-aos="fade-up" className="   text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore iure
            fuga nulla dicta omnis vel ducimus.
          </p>
        </div>
        <div className="">
          <Slider {...setting}>
            {TestimonialData.map((data) => (
              <div
                key={data.id}
                className="flex flex-col gap-8  py-8 px-10 shadow-lg"
              >
                <div className="h-13 w-13">
                  <img src={data.img} className="rounded-full " alt="" />
                </div>
                <div>
                    <p className="text-gray-300">{data.text}</p>
                    <h1 className="font-bold">{data.name}</h1>
                </div>
                
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testmonial;

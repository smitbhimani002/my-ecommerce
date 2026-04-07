import React from "react";

const AboutUs = () => {
  return (
    <div className="px-6 md:px-16 py-10">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-8">About Us</h1>

      {/* Intro */}
      <div className="mb-10 text-center">
        <p className="text-gray-600 max-w-2xl mx-auto">
          Welcome to <span className="font-semibold">Shopsy</span> — your
          one-stop destination for fashion, electronics, and more. We provide
          high-quality products at affordable prices with a smooth shopping
          experience.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="p-6 shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
          <p className="text-gray-600">
            To deliver quality products with the best prices and ensure customer
            satisfaction through fast delivery and trusted service.
          </p>
        </div>

        <div className="p-6 shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
          <p className="text-gray-600">
            To become one of the leading e-commerce platforms by providing
            innovation, reliability, and excellent customer support.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Why Choose Us?
        </h2>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="p-5 shadow rounded-xl">
            <h3 className="font-semibold">Affordable Prices</h3>
            <p className="text-gray-600 text-sm">
              Best deals and discounts for every customer.
            </p>
          </div>

          <div className="p-5 shadow rounded-xl">
            <h3 className="font-semibold">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">
              Quick and reliable delivery at your doorstep.
            </p>
          </div>

          <div className="p-5 shadow rounded-xl">
            <h3 className="font-semibold">24/7 Support</h3>
            <p className="text-gray-600 text-sm">
              We are always here to help you anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Location with Map */}
      <div>
        <h2 className="text-2xl font-semibold text-center mb-6">
          Our Location
        </h2>

        <div className="w-full h-[400px] rounded-xl overflow-hidden shadow">
          <iframe
            title="location"
            width="100%"
            height="100%"
            frameBorder="0"
            
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117530.98425331879!2d72.4988582!3d22.9927906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b31358fff27%3A0x8555186f45683b7a!2sCrabby%20Hunt%20%7C%20Genuine%20Leather%20Belt!5e0!3m2!1sen!2sin!4v1775557083717!5m2!1sen!2sin" >
          </iframe>



        </div>
      </div>
    </div>
  );
};

export default AboutUs;

import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { useState } from "react";

const ProductGrid = ({
  title,
  products = [],
  showSize = false,
  showcolor = false,
  currency = "₹",
}) => {
  const { addToCart } = useCart();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedColors, setSelectedColors] = useState({});

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-10">{title}</h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-xl p-4 flex flex-col hover:scale-105 duration-300"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-40 mx-auto mb-4 object-contain"
              />

              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-gray-700 text-sm">{item.description}</p>

              {/* Show Available Sizes */}
              {showSize && item.variants && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Select Size:</p>

                  <div className="flex gap-2 mt-1">
                    {[...new Set(item.variants.map((v) => v.size))]
                      .filter((size) =>
                        item.variants.some(
                          (v) => v.size === size && v.stock > 0,
                        ),
                      )
                      .map((size, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedSizes((prev) => ({
                              ...prev,
                              [item._id]: size,
                            }));

                            // 🔥 Reset color when size changes
                            setSelectedColors((prev) => ({
                              ...prev,
                              [item._id]: null,
                            }));
                          }}
                          className={`px-2 py-1 text-xs rounded-lg border ${
                            selectedSizes[item._id] === size
                              ? "bg-orange-500 text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* color */}
              {showcolor && item.variants && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Select Color:</p>

                  <div className="flex mt-1 gap-2">
                    {[
                      ...new Set(
                        item.variants
                          .filter((v) => {
                            const selectedSize = selectedSizes[item._id];

                            // If size selected → show only matching colors
                            if (selectedSize) {
                              return v.size === selectedSize && v.stock > 0;
                            }

                            // If no size selected → show all colors
                            return v.stock > 0;
                          })
                          .map((v) => v.color),
                      ),
                    ].map((c, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setSelectedColors((prev) => ({
                            ...prev,
                            [item._id]: c,
                          }))
                        }
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border-2 ${
                          selectedColors[item._id] === c
                            ? "border-orange-500"
                            : "border-gray-300"
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>
              )}
              <p className="font-bold mt-2">
                {currency}
                {item.price}
              </p>

              <button
                onClick={() => {
                  if (showSize && !selectedSizes[item._id]) {
                    toast.error("Please select size");
                    return;
                  }
                  if (showcolor && !selectedColors[item._id]) {
                    toast.error("Please select color");
                    return;
                  }

                  addToCart({
                    _id: item._id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    size: selectedSizes[item._id],
                    color: selectedColors[item._id],
                  });
                  toast.success("Product added successfully ");
                }}
                className="mt-auto bg-orange-500 text-white px-3 py-2 rounded-2xl w-full hover:bg-orange-600"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;

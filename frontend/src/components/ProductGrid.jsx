import { useCart } from "../context/CartContext";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductGrid = ({
  title,
  products = [],
  showSize = false,
  showcolor = false,
  currency = "₹",
}) => {
  const navigate = useNavigate();
  const { toggleWishlist, isProductInWishlist, wishlistLoading } = useCart();

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
              className="bg-white rounded-2xl shadow-xl p-4 flex flex-col hover:scale-105 duration-300 relative"
            >
              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(item._id)}
                disabled={wishlistLoading}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                title={isProductInWishlist(item._id) ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isProductInWishlist(item._id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                />
              </button>

              <img
                src={item.image}
                alt={item.name}
                onClick={() => navigate(`/product/${item._id}`)}
                className="h-40 mx-auto mb-4 object-contain cursor-pointer hover:scale-105 transition-transform"
              />

              <h2 
                onClick={() => navigate(`/product/${item._id}`)}
                className="font-semibold cursor-pointer hover:text-orange-500 transition-colors"
              >
                {item.name}
              </h2>
              <p className="text-gray-700 text-sm">{item.description}</p>

              <p className="font-bold mt-2">
                {currency}
                {item.price}
              </p>

              <button
                onClick={() => navigate(`/product/${item._id}`)}
                className="mt-auto bg-orange-500 text-white px-3 py-2 rounded-2xl w-full hover:bg-orange-600"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;

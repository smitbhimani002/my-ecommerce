import { useCart } from "../context/CartContext";
import { useState } from "react";
import {
  Heart,
  Trash2,
  ShoppingCart as ShoppingCartIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";

const Wishlist = () => {
  const {
    wishlist,
    wishlistLoading,
    toggleWishlist,
    addToCart,
  } = useCart();
  const [addingToCart, setAddingToCart] = useState(null);

  const handleAddToCart = async (product) => {
    setAddingToCart(product._id);
    try {
      await addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: "NA",
        color: "NA",
      });
    } finally {
      setAddingToCart(null);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">My Wishlist</h1>
          <p className="text-gray-500 mb-12">Your saved items will appear here</p>

          <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-2xl shadow-sm border border-gray-100">
            <Heart className="w-24 h-24 text-gray-200 mb-4" strokeWidth={1.5} />
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">No items yet</h2>
            <p className="text-gray-400 text-center max-w-md">
              Start saving your favorite products! Click the heart icon on any product to add it to your wishlist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">My Wishlist</h1>
          <p className="text-gray-500">
            {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleWishlist(product._id)}
                  disabled={wishlistLoading}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  title="Remove from Wishlist"
                >
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <p className="text-xs text-gray-500 font-medium">{product.category}</p>
                <h3 className="font-semibold text-gray-800 line-clamp-2 mt-1 h-14">
                  {product.name}
                </h3>

                {product.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 mt-2">
                    {product.description}
                  </p>
                )}

                <p className="text-red-600 font-bold text-lg mt-3">₹{product.price}</p>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart === product._id || wishlistLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
                  >
                    {addingToCart === product._id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCartIcon className="w-4 h-4" />
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    disabled={wishlistLoading}
                    className="p-2.5 border border-red-200 hover:bg-red-50 text-red-500 rounded-lg transition-colors disabled:opacity-50"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

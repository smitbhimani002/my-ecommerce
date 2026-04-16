import { useCart } from "../context/CartContext";
import { Trash2, Heart, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const Settings = () => {
  const { wishlist, wishlistLoading, toggleWishlist, addToCart } = useCart();

  const [addingToCart, setAddingToCart] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [productDetails, setProductDetails] = useState({});
  const [loadingProducts, setLoadingProducts] = useState({});

  // Fetch product details with variants
  useEffect(() => {
    const fetchProductDetails = async () => {
      for (const product of wishlist) {
        if (!productDetails[product._id]) {
          try {
            setLoadingProducts((prev) => ({
              ...prev,
              [product._id]: true,
            }));
            const res = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/api/admin/product/${product._id}`,
            );
            setProductDetails((prev) => ({
              ...prev,
              [product._id]: res.data.product,
            }));
          } catch (error) {
            console.log("Error fetching product details:", error);
          } finally {
            setLoadingProducts((prev) => ({
              ...prev,
              [product._id]: false,
            }));
          }
        }
      }
    };

    if (wishlist.length > 0) {
      fetchProductDetails();
    }
  }, [wishlist, productDetails]);

  const handleAddToCart = async (product) => {
    const details = productDetails[product._id];
    const options = selectedOptions[product._id] || {};

    // Auto-select first available size and color if not selected
    let size = options.size;
    let color = options.color;

    if (!size && details?.variants?.length > 0) {
      // Find first size with stock > 0
      const firstInStock = details.variants.find((v) => v.stock > 0);
      if (firstInStock) {
        size = firstInStock.size;
      }
    }

    if (!color && size && details?.variants?.length > 0) {
      // Find first color with stock > 0 for selected size
      const firstColorInStock = details.variants.find(
        (v) => v.size === size && v.stock > 0,
      );
      if (firstColorInStock) {
        color = firstColorInStock.color;
      }
    }

    if (!size || !color) {
      toast.error("Product is out of stock");
      return;
    }

    // Check if selected variant is in stock
    if (isOutOfStock(product, size, color)) {
      toast.error("Selected variant is out of stock");
      return;
    }

    setAddingToCart(product._id);
    try {
      const productWithOptions = {
        ...product,
        size,
        color,
      };
      await addToCart(productWithOptions);
      toast.success("Added to cart!");
      setSelectedOptions((prev) => ({ ...prev, [product._id]: {} }));
    } catch (error) {
      toast.error("Failed to add to cart");
      console.log(error);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleOptionChange = (productId, optionType, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [optionType]: value,
      },
    }));
  };

  const getAvailableSizes = (product) => {
    const details = productDetails[product._id];
    if (!details?.variants) return [];
    // Only return sizes with stock > 0
    return [
      ...new Set(
        details.variants.filter((v) => v.stock > 0).map((v) => v.size),
      ),
    ];
  };

  const getAvailableColors = (product, selectedSize) => {
    const details = productDetails[product._id];
    if (!details?.variants) return [];
    if (selectedSize) {
      // Only return colors with stock > 0 for selected size
      return [
        ...new Set(
          details.variants
            .filter((v) => v.size === selectedSize && v.stock > 0)
            .map((v) => v.color),
        ),
      ];
    }
    // Only return colors with stock > 0
    return [
      ...new Set(
        details.variants.filter((v) => v.stock > 0).map((v) => v.color),
      ),
    ];
  };

  const isOutOfStock = (product, size, color) => {
    const details = productDetails[product._id];
    if (!details?.variants) return true;
    const variant = details.variants.find(
      (v) => v.size === size && v.color === color,
    );
    return !variant || variant.stock === 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and saved items</p>
        </div>

        {/* Wishlist Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-red-50 to-pink-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div className="text-left">
                <h2 className="font-semibold text-gray-800 text-lg">
                  Saved for Later
                </h2>
                <p className="text-sm text-gray-500">
                  {wishlist.length} item{wishlist.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {wishlist.length === 0 ? (
            <div className="p-12 text-center">
              <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No Saved Items
              </h3>
              <p className="text-gray-500 mb-6">
                Start adding products to your wishlist to see them here
              </p>
              <Link
                to="/"
                className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((product) => (
                  <div
                    key={product._id}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                  >
                    {/* Product Image */}
                    <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <button
                        onClick={() => toggleWishlist(product._id)}
                        disabled={wishlistLoading}
                        className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                        {product.name}
                      </h3>

                      {product.category && (
                        <p className="text-xs text-gray-500 mb-3">
                          {product.category}
                        </p>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <p className="text-2xl font-bold text-red-600">
                          ₹{product.price}
                        </p>
                        {product.originalPrice && (
                          <p className="text-sm text-gray-400 line-through">
                            ₹{product.originalPrice}
                          </p>
                        )}
                      </div>

                      {/* Loading Product Details */}
                      {loadingProducts[product._id] ? (
                        <div className="text-center py-4">
                          <Loader2 className="w-5 h-5 animate-spin mx-auto text-orange-500" />
                        </div>
                      ) : (
                        <>
                          {/* Size Selection */}
                          {getAvailableSizes(product).length > 0 ? (
                            <div className="mb-3">
                              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                                Available Sizes
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {getAvailableSizes(product).map((size) => (
                                  <button
                                    key={size}
                                    onClick={() =>
                                      handleOptionChange(
                                        product._id,
                                        "size",
                                        size,
                                      )
                                    }
                                    className={`px-3 py-1 text-xs font-medium rounded-lg border-2 transition-all ${
                                      selectedOptions[product._id]?.size ===
                                      size
                                        ? "bg-orange-500 text-white border-orange-500"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-orange-500"
                                    }`}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-xs font-semibold text-red-600">
                                ❌ Out of Stock
                              </p>
                            </div>
                          )}

                          {/* Color Selection */}
                          {getAvailableColors(
                            product,
                            selectedOptions[product._id]?.size,
                          ).length > 0 &&
                            selectedOptions[product._id]?.size && (
                              <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                                  Available Colors
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {getAvailableColors(
                                    product,
                                    selectedOptions[product._id]?.size,
                                  ).map((color) => (
                                    <button
                                      key={color}
                                      onClick={() =>
                                        handleOptionChange(
                                          product._id,
                                          "color",
                                          color,
                                        )
                                      }
                                      className={`px-3 py-1 text-xs font-medium rounded-lg border-2 transition-all ${
                                        selectedOptions[product._id]?.color ===
                                        color
                                          ? "bg-orange-500 text-white border-orange-500"
                                          : "bg-white text-gray-700 border-gray-300 hover:border-orange-500"
                                      }`}
                                    >
                                      {color}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                        </>
                      )}

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={
                          addingToCart === product._id ||
                          getAvailableSizes(product).length === 0
                        }
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-5 h-5" />
                        {addingToCart === product._id
                          ? "Adding..."
                          : getAvailableSizes(product).length === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

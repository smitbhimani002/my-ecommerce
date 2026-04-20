import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Heart, ChevronLeft, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isProductInWishlist, wishlistLoading } =
    useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [mainImage, setMainImage] = useState(null);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/product/${id}`,
        );
        const productData = res.data.product;
        setProduct(productData);
        setMainImage(productData.image);
      } catch (error) {
        console.log("Error fetching product:", error);
        toast.error("Product not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // Get unique sizes with stock
  const getAvailableSizes = () => {
    if (!product?.variants) return [];
    return [
      ...new Set(
        product.variants.filter((v) => v.stock > 0).map((v) => v.size),
      ),
    ];
  };

  // Get unique colors for selected size or all colors
  const getAvailableColors = () => {
    if (!product?.variants) return [];
    if (selectedSize) {
      return [
        ...new Set(
          product.variants
            .filter((v) => v.size === selectedSize && v.stock > 0)
            .map((v) => v.color),
        ),
      ];
    }
    return [
      ...new Set(
        product.variants.filter((v) => v.stock > 0).map((v) => v.color),
      ),
    ];
  };

  // Check if variant is in stock
  const isVariantInStock = (size, color) => {
    if (!product?.variants) return false;
    return product.variants.some(
      (v) => v.size === size && v.color === color && v.stock > 0,
    );
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }
    if (!isVariantInStock(selectedSize, selectedColor)) {
      toast.error("Selected variant is out of stock");
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        color: selectedColor,
      });
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
      console.log(error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6 font-medium"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left - Images */}
            <div>
              {/* Main Image */}
              <div className="mb-4 bg-gray-100 rounded-xl p-4 flex items-center justify-center h-80">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="h-full object-contain"
                />
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product._id)}
                disabled={wishlistLoading}
                className="w-full flex items-center justify-center gap-2 mt-4 py-3 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-all disabled:opacity-50"
                title={
                  isProductInWishlist(product._id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
                }
              >
                <Heart
                  size={20}
                  className={
                    isProductInWishlist(product._id)
                      ? "fill-red-500 text-red-500"
                      : ""
                  }
                />
                {isProductInWishlist(product._id)
                  ? "Saved to Wishlist"
                  : "Save to Wishlist"}
              </button>
            </div>

            {/* Right - Details */}
            <div>
              {/* Product Name */}
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

              {/* Price */}
              <p className="text-2xl font-bold text-orange-500 mb-4">
                ₹{product.price}
              </p>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Category */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-gray-800 font-semibold">
                  {product.category}
                </p>
              </div>

              {/* Stock Status */}
              <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  ✓ In Stock - {product.stock || "Available"}
                </p>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <label className="block text-sm font-bold mb-3">Size</label>
                <div className="flex gap-2 flex-wrap">
                  {getAvailableSizes().length > 0 ? (
                    getAvailableSizes().map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setSelectedColor(null);
                        }}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                          selectedSize === size
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-gray-800 border-gray-300 hover:border-orange-500"
                        }`}
                      >
                        {size}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500">No sizes available</p>
                  )}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-8">
                <label className="block text-sm font-bold mb-3">Color</label>
                <div className="flex gap-3 flex-wrap">
                  {getAvailableColors().length > 0 ? (
                    getAvailableColors().map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        style={{
                          backgroundColor: color,
                          opacity: selectedColor === color ? 1 : 0.7,
                        }}
                        className={`w-10 h-10 rounded-full border-3 transition-all ${
                          selectedColor === color
                            ? "border-gray-800 scale-110"
                            : "border-gray-300 hover:opacity-100"
                        }`}
                        title={color}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500">Select a size first</p>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !selectedSize || !selectedColor}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {addingToCart ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>

            
            </div>
          </div>

          {/* Variants Table */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-bold text-lg mb-4">Available Variants</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Size</th>
                      <th className="px-4 py-2 text-left">Color</th>
                      <th className="px-4 py-2 text-left">Stock</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((variant, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">{variant.size}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              style={{ backgroundColor: variant.color }}
                              className="w-6 h-6 rounded-full border border-gray-300"
                            />
                            {variant.color}
                          </div>
                        </td>
                        <td className="px-4 py-3">{variant.stock}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              variant.stock > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {variant.stock > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

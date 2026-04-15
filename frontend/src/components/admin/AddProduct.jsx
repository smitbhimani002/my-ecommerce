import { useState, useEffect } from "react";
import axios from "axios";
import { s } from "framer-motion/client";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("process.env.BASE_URL/api/admin/categories")
      .then((res) => setCategories(res.data.categories))
      .catch((error) => console.log(error));
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    color: [],
    totalStock: "",
  });

  const [variants, setVariants] = useState([
    { size: "S", color: "red", stock: 0 },
  ]);

  // Handle normal inputs
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = field === "stock" ? Number(value) : value;
    setVariants(updated);
  };

  const addVariantField = () => {
    setVariants([...variants, { size: "M", color: "red", stock: 0 }]);
  };

  const removeVariantField = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
  };

  const totalStock = variants.reduce((sum, item) => sum + item.stock, 0);

  // categort check

  const isClothingCategory =
    formData.category === "Mens Wear" || formData.category === "Kids Wear";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("image", formData.image);
      // data.append("variants", JSON.stringify(variants));

      // ✅ NEW LOGIC
      if (isClothingCategory) {
        data.append("variants", JSON.stringify(variants));
      } else {
        data.append("totalStock", formData.totalStock);
      }

      // data.append("totalStock", JSON.stringify(formData.color));

      await axios.post("process.env.BASE_URL/api/admin/add-product", data, {
        withCredentials: true,
      });

      console.log("process.env.BASE_URL/api/admin/add-product");
      alert("Product Added Successfully ");

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
        color: "",
        totalStock: "", // ✅ ADD THIS
      });

      setVariants([{ size: "S", color: "red", stock: 0 }]);
    } catch (error) {
      console.error(error);
      alert("Something went wrong ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>

      <div className="bg-white rounded-xl shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <input
            name="name"
            value={formData.name}
            placeholder="Product Name"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            placeholder="Description"
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          {/* Price */}
          <input
            name="price"
            type="number"
            min="0"
            value={formData.price}
            placeholder="Price"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          {/* category */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">Select Category</option>

            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Size , color and Stock Section */}

          {/* ================= CLOTHING CATEGORY ================= */}
          {isClothingCategory && (
            <div>
              <h3 className="font-semibold mb-2">Variants</h3>

              {variants.map((item, index) => (
                <div key={index} className="flex gap-3 mb-2">
                  {/* ✅ SAME SIZE OPTIONS (NO CHANGE) */}
                  <select
                    value={item.size}
                    onChange={(e) =>
                      handleVariantChange(index, "size", e.target.value)
                    }
                    className="border px-3 py-2 rounded-lg"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>

                  {/* ✅ SAME COLOR OPTIONS (NO CHANGE) */}
                  <select
                    value={item.color}
                    onChange={(e) =>
                      handleVariantChange(index, "color", e.target.value)
                    }
                    className="border px-3 py-2 rounded-lg"
                  >
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="black">Black</option>
                    <option value="white">White</option>
                    <option value="green">Green</option>
                  </select>

                  {/* STOCK */}
                  <input
                    type="number"
                    min="0"
                    value={item.stock}
                    placeholder="Stock"
                    onChange={(e) =>
                      handleVariantChange(index, "stock", e.target.value)
                    }
                    className="border px-3 py-2 rounded-lg w-24"
                  />

                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariantField(index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addVariantField}
                className="text-blue-600"
              >
                + Add Variant
              </button>

              <div className="mt-2 font-semibold">
                Total Stock: {totalStock}
              </div>
            </div>
          )}

          {/*  NON-CLOTHING CATEGORY  */}
          {!isClothingCategory && (
            <div>
              <input
                type="number"
                name="totalStock"
                min="0"
                value={formData.totalStock}
                placeholder="Enter Stock"
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          )}

          {/* oldcode */}
          {/* <div>
            <h3 className="font-semibold mb-2">Variants</h3>

            {variants.map((item, index) => (
              <div key={index} className="flex gap-3 mb-2">
              
                <select
                  value={item.size}
                  onChange={(e) =>
                    handleVariantChange(index, "size", e.target.value)
                  }
                  className="border px-3 py-2 rounded-lg"
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>

              
                <select
                  value={item.color}
                  onChange={(e) =>
                    handleVariantChange(index, "color", e.target.value)
                  }
                  className="border px-3 py-2 rounded-lg"
                >
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="black">Black</option>
                  <option value="white">White</option>
                  <option value="green">Green</option>
                </select>

                
                <input
                  type="number"
                  value={item.stock}
                  placeholder="Stock"
                  onChange={(e) =>
                    handleVariantChange(index, "stock", e.target.value)
                  }
                  className="border px-3 py-2 rounded-lg w-24"
                />

                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariantField(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addVariantField}
              className="text-blue-600"
            >
              + Add Variant
            </button>

            <div className="mt-2 font-semibold">Total Stock: {totalStock}</div>
          </div> */}

          {/* Image */}
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg w-full"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    totalStock: "",
  });

  const [variants, setVariants] = useState([]);

  const isClothingCategory =
    formData.category === "Mens Wear" || formData.category === "Kids Wear";

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/admin/product/${id}`,
        { withCredentials: true },
      );

      const product = res.data.product;
      if (!product) return;

      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: null,
        totalStock: product.totalStock || "",
      });

      setVariants(product.variants || []);
    };

    fetchProduct();
  }, [id]);

  // INPUT CHANGE
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  //VARIANT CHANGE
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = field === "stock" ? Number(value) : value;
    setVariants(updated);
  };

  // ADD / REMOVE VARIANT
  const addVariantField = () => {
    setVariants([...variants, { size: "M", color: "red", stock: 0 }]);
  };

  const removeVariantField = (index) => {
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
  };

  //  total stock from variants
  const totalStockFromVariants = variants.reduce(
    (sum, item) => sum + item.stock,
    0,
  );

  // ================= UPDATE PRODUCT =================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);

      if (isClothingCategory) {
        data.append("variants", JSON.stringify(variants));
      } else {
        data.append("totalStock", formData.totalStock);
      }

      // optional image update
      if (formData.image) {
        data.append("image", formData.image);
      }

      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/admin/product/${id}`, data, {
        withCredentials: true,
      });

      alert("Product Updated Successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

      <div className="bg-white rounded-xl shadow p-6 max-w-2xl">
        <form onSubmit={handleUpdate} className="space-y-5">
          {/* NAME */}
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* PRICE */}
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* CATEGORY */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="Mens Wear">Mens Wear</option>
            <option value="Kids Wear">Kids Wear</option>
            <option value="Electronics">Electronics</option>
            <option value="Beauty">Beauty</option>
          </select>

          {/*CLOTHING  */}
          {isClothingCategory && (
            <div>
              <h3 className="font-semibold mb-2">Variants</h3>

              {variants.map((item, index) => (
                <div key={index} className="flex gap-3 mb-2">
                  {/* SIZE */}
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

                  {/* COLOR */}
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
                  </select>

                  {/* STOCK */}
                  <input
                    type="number"
                    min="0"
                    value={item.stock}
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
                Total Stock: {totalStockFromVariants}
              </div>
            </div>
          )}

          {/*NON-CLOTHING */}
          {!isClothingCategory && (
            <input
              type="number"
              min="0"
              name="totalStock"
              value={formData.totalStock}
              placeholder="Enter Stock"
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          )}

          {/* IMAGE */}
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg w-full"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;

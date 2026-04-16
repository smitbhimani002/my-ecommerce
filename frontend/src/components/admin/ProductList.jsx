import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/categories`);

    setCategories(res.data.categories);
  };
  const fetchProducts = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/admin/getproducts?page=${page}&limit=6&category=${filterStatus}&search=${search}`,
      { withCredentials: true },
    );

    setProducts(res.data.products);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    fetchProducts();
  }, [page, filterStatus, search]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/admin/product/${id}`, {
      withCredentials: true,
    });

    alert("Product Deleted Successfully");
    fetchProducts();
  };

  // stock calculation
  const getTotalStock = (variants) => {
    return variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
  };

  return (
    <div>
      {/* FILTER + SEARCH */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border px-4 py-2 rounded-lg shadow-sm"
        />

        <select
          className="w-full md:w-1/4 border px-4 py-2 rounded-lg shadow-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-2xl font-bold mb-6">Manage Products</h2>

      {/* PRODUCTS */}
      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => {
          const totalStock = getTotalStock(product.variants);

          return (
            <div key={product._id} className="bg-white p-4 rounded-xl shadow">
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-full object-cover rounded-lg"
              />

              <h3 className="font-bold mt-3">{product.name}</h3>
              <p className="text-gray-600">₹ {product.price}</p>

              {totalStock === 0 ? (
                <span className="text-red-600 text-sm">Out of Stock</span>
              ) : totalStock < 5 ? (
                <span className="text-yellow-600 text-sm">Low Stock</span>
              ) : (
                <span className="text-green-600 text-sm">In Stock</span>
              )}

              <div className="flex justify-between mt-4">
                <Link
                  to={`/admin/edit/${product._id}`}
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION BUTTONS  */}

      <div className="flex justify-center gap-3 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Prev
        </button>

        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No products found
        </p>
      )}
    </div>
  );
};

export default ProductList;

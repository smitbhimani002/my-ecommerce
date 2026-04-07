import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect } from "react";
import Chart from "react-apexcharts";


export default function AddCategory() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [chartData, setChartData] = useState([]);
  const [totalStock, setTotalStock] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/admin/categories")
      .then((res) => {
        console.log(res.data);
        setCategories(res.data.categories);
      })
      .catch((err) => console.log(err));
  }, []);



  useEffect(() => {
    axios
      .get("http://localhost:3000/api/admin/category-chart")
      .then((res) => {
        setChartData(res.data.categories);
        setTotalStock(res.data.total);
      })
      .catch((err) => console.log(err));
  }, []);

  const series = chartData.map((item) => item.count);
  const labels = chartData.map((item) => item.name);


  const options = {
    chart: {
      type: "donut",
    },
    labels: labels,
    colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"],
    legend: {
      position: "top",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Product",
              formatter: () => totalStock,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} products`,
      },
    },
  };

  const deleteCategory = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete category",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    await axios.delete(`http://localhost:3000/api/admin/category/${id}`, {
      withCredentials: true,
    });

    setCategories(categories.filter((c) => c._id !== id));
  };

  const updateCategory = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/api/admin/category/${id}`,
        { name: editName },
        { withCredentials: true },
      );

      setCategories(
        categories.map((c) => (c._id === id ? { ...c, name: editName } : c)),
      );

      setEditId(null);
      setEditName("");

      Swal.fire({
        icon: "success",
        title: "Category updated",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Error",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/admin/category",
        { name },
        { withCredentials: true },
      );

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Category added",
        showConfirmButton: false,
        timer: 2000,
      });

      setName("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response?.data?.message || "Error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Category Management
      </h1>

      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Add Category Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Add New Category
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Category Name</label>
              <input
                type="text"
                placeholder="enter category"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 border px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition">
              Add Category
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-linear-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-md flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-2">Total Categories</h2>
          <p className="text-4xl font-bold">{categories.length}</p>
        </div>
      </div>

      {/* Category List */}
      <div className="mt-10 bg-white p-6 rounded-2xl shadow-md border">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          All Categories
        </h3>

        {categories.length === 0 ? (
          <p className="text-gray-400 text-sm">No categories found</p>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg mb-2"
              >
                {editId === cat._id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  <span>{cat.name}</span>
                )}

                <div className="flex gap-3">
                  {editId === cat._id ? (
                    <button
                      onClick={() => updateCategory(cat._id)}
                      className="text-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditId(cat._id);
                        setEditName(cat.name);
                      }}
                      className="text-blue-500"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md border mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Category Product Overview
        </h2>

        {chartData.length === 0 ? (
          <p className="text-gray-400">No data available</p>
        ) : (
          <Chart options={options} series={series} type="donut" height={320} />
        )}
      </div>
    </div>
  );
}




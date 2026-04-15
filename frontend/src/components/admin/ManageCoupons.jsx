import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Ticket,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  X,
  Calendar,
  Percent,
  DollarSign,
  Users,
  ChevronDown,
  ChevronUp,
  Tag,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
} from "lucide-react";

const API = "process.env.BASE_URL/api/coupons";
export default function ManageCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const emptyForm = {
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minimumOrderAmount: "",
    maximumDiscount: "",
    usageLimit: "",
    perUserLimit: "1",
    startDate: "",
    endDate: "",
    isActive: true,
  };

  const [form, setForm] = useState(emptyForm);

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API, { withCredentials: true });
      setCoupons(res.data.coupons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditMode(false);
    setEditId(null);
    setShowForm(false);
  };

  // Create or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      discountValue: Number(form.discountValue),
      minimumOrderAmount: form.minimumOrderAmount
        ? Number(form.minimumOrderAmount)
        : 0,
      maximumDiscount: form.maximumDiscount
        ? Number(form.maximumDiscount)
        : null,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      perUserLimit: form.perUserLimit ? Number(form.perUserLimit) : 1,
    };

    try {
      if (editMode) {
        await axios.put(`${API}/${editId}`, payload, { withCredentials: true });
        Swal.fire({
          icon: "success",
          title: "Coupon updated!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await axios.post(API, payload, { withCredentials: true });
        Swal.fire({
          icon: "success",
          title: "Coupon created!",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      resetForm();
      fetchCoupons();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  // Delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this coupon?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API}/${id}`, { withCredentials: true });
      setCoupons(coupons.filter((c) => c._id !== id));
      Swal.fire({
        icon: "success",
        title: "Coupon deleted",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Error deleting coupon",
      });
    }
  };

  // Toggle enable/disable
  const handleToggle = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to change coupon status",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await axios.patch(
        `${API}/${id}/toggle`,
        {},
        { withCredentials: true },
      );
      setCoupons(coupons.map((c) => (c._id === id ? res.data.coupon : c)));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Error toggling coupon",
      });
    }
  };

  // Edit mode
  const startEdit = (coupon) => {
    setForm({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumOrderAmount: coupon.minimumOrderAmount || "",
      maximumDiscount: coupon.maximumDiscount || "",
      usageLimit: coupon.usageLimit || "",
      perUserLimit: coupon.perUserLimit || 1,
      startDate: coupon.startDate?.slice(0, 16),
      endDate: coupon.endDate?.slice(0, 16),
      isActive: coupon.isActive,
    });
    setEditMode(true);
    setEditId(coupon._id);
    setShowForm(true);
  };

  // Copy code
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Code copied!",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  // Filter & search
  const filteredCoupons = coupons.filter((c) => {
    const matchSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === "active") {
      return (
        matchSearch &&
        c.isActive &&
        new Date(c.startDate) <= new Date() &&
        new Date(c.endDate) >= new Date()
      );
    }
    if (filterStatus === "inactive") return matchSearch && !c.isActive;
    if (filterStatus === "expired")
      return matchSearch && new Date(c.endDate) < new Date();
    return matchSearch;
  });

  // Stats
  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const expiredCoupons = coupons.filter(
    (c) => new Date(c.endDate) < new Date(),
  ).length;
  const totalUsed = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  const getCouponStatus = (coupon) => {
    const now = new Date();
    if (!coupon.isActive)
      return {
        label: "Disabled",
        color: "bg-gray-100 text-gray-600",
        dot: "bg-gray-400",
      };
    if (now > new Date(coupon.endDate))
      return {
        label: "Expired",
        color: "bg-red-50 text-red-600",
        dot: "bg-red-400",
      };
    if (now < new Date(coupon.startDate))
      return {
        label: "Scheduled",
        color: "bg-blue-50 text-blue-600",
        dot: "bg-blue-400",
      };
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      return {
        label: "Limit Reached",
        color: "bg-amber-50 text-amber-600",
        dot: "bg-amber-400",
      };
    return {
      label: "Active",
      color: "bg-emerald-50 text-emerald-600",
      dot: "bg-emerald-400",
    };
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/80 p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            Coupon Management
          </h1>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 cursor-pointer"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "New Coupon"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Total
              </p>
              <p className="text-xl font-bold text-gray-800">
                {coupons.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Active
              </p>
              <p className="text-xl font-bold text-gray-800">{activeCoupons}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Expired
              </p>
              <p className="text-xl font-bold text-gray-800">
                {expiredCoupons}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Total Used
              </p>
              <p className="text-xl font-bold text-gray-800">{totalUsed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xlshadow-lg border border-gray-100 p-6 mb-6 animate-in slide-in-from-top duration-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
            {editMode ? (
              <Pencil className="w-5 h-5 text-indigo-600" />
            ) : (
              <Plus className="w-5 h-5 text-indigo-600" />
            )}
            {editMode ? "Update Coupon" : "Create New Coupon"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  name="code"
                  placeholder="e.g. SUMMER2025"
                  value={form.code}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase font-mono text-lg tracking-wider"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder="e.g. Summer sale 20% off"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 2 - Discount Type & Value */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Discount Type *
                </label>
                <select
                  name="discountType"
                  value={form.discountType}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Discount Value *{" "}
                  {form.discountType === "percentage" ? "(%)" : "(₹)"}
                </label>
                <input
                  type="number"
                  name="discountValue"
                  placeholder={
                    form.discountType === "percentage" ? "e.g. 20" : "e.g. 500"
                  }
                  value={form.discountValue}
                  onChange={handleChange}
                  required
                  min="1"
                  max={form.discountType === "percentage" ? "100" : undefined}
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Max Discount Cap (₹)
                </label>
                <input
                  type="number"
                  name="maximumDiscount"
                  placeholder="Optional"
                  value={form.maximumDiscount}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 3 - Conditions */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Min Order Amount (₹)
                </label>
                <input
                  type="number"
                  name="minimumOrderAmount"
                  placeholder="e.g. 500"
                  value={form.minimumOrderAmount}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Total Usage Limit
                </label>
                <input
                  type="number"
                  name="usageLimit"
                  placeholder="Unlimited"
                  value={form.usageLimit}
                  onChange={handleChange}
                  min="1"
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Per User Limit
                </label>
                <input
                  type="number"
                  name="perUserLimit"
                  placeholder="1"
                  value={form.perUserLimit}
                  onChange={handleChange}
                  min="1"
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 4 - Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  <Calendar className="w-4 h-4 inline mr-1" /> Start Date *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  <Calendar className="w-4 h-4 inline mr-1" /> End Date *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
              <span className="text-sm font-medium text-gray-700">
                {form.isActive ? "Coupon is Active" : "Coupon is Disabled"}
              </span>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-indigo-200 cursor-pointer"
              >
                {editMode ? "Update Coupon" : "Create Coupon"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search coupons by code or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "inactive", "expired"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all cursor-pointer ${
                  filterStatus === status
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Coupons List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Ticket className="w-14 h-14 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">No coupons found</p>
          <p className="text-gray-400 text-sm mt-1">
            Create your first coupon to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCoupons.map((coupon) => {
            const status = getCouponStatus(coupon);
            const isExpanded = expandedId === coupon._id;

            return (
              <div
                key={coupon._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Main Row */}
                <div className="p-4 md:p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Coupon Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          coupon.discountType === "percentage"
                            ? "bg-linear-to-br from-indigo-500 to-purple-600"
                            : "bg-linear-to-br from-emerald-500 to-teal-600"
                        }`}
                      >
                        {coupon.discountType === "percentage" ? (
                          <Percent className="w-6 h-6 text-white" />
                        ) : (
                          <DollarSign className="w-6 h-6 text-white" />
                        )}
                      </div>

                      {/* Code & Description */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-lg text-gray-800 tracking-wider">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => copyCode(coupon.code)}
                            className="text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${status.color}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                            ></span>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate max-w-md mt-0.5">
                          {coupon.description || "No description"}
                        </p>
                      </div>
                    </div>

                    {/* Discount Badge */}
                    <div className="hidden md:flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `$${coupon.discountValue}`}
                        </p>
                        <p className="text-xs text-gray-400">
                          {coupon.discountType === "percentage"
                            ? "off"
                            : "flat discount"}
                        </p>
                      </div>

                      <div className="text-center px-4 border-l border-gray-100">
                        <p className="text-lg font-semibold text-gray-700">
                          {coupon.usedCount}
                        </p>
                        <p className="text-xs text-gray-400">
                          / {coupon.usageLimit || "∞"} used
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleToggle(coupon._id)}
                        title={
                          coupon.isActive ? "Disable coupon" : "Enable coupon"
                        }
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                          coupon.isActive
                            ? "text-emerald-600 hover:bg-emerald-50"
                            : "text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        {coupon.isActive ? (
                          <ToggleRight className="w-6 h-6" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
                      </button>
                      <button
                        onClick={() => startEdit(coupon)}
                        className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : coupon._id)
                        }
                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                          Min Order
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          ₹{coupon.minimumOrderAmount || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                          Max Discount
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          {coupon.maximumDiscount
                            ? `₹${coupon.maximumDiscount}`
                            : "No limit"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                          Per User Limit
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          {coupon.perUserLimit || 1}x
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                          Usage
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${coupon.usageLimit ? Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100) : 0}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {coupon.usedCount}/{coupon.usageLimit || "∞"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">Start</p>
                          <p className="text-sm text-gray-700">
                            {formatDate(coupon.startDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">End</p>
                          <p className="text-sm text-gray-700">
                            {formatDate(coupon.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

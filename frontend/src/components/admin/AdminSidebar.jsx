import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white p-5">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

      <ul className="space-y-4">
        <li>
          <Link to="/admin/addProduct" className="hover:text-orange-400">
            Add Product
          </Link>
        </li>

        <li>
          <Link to="/admin/products" className="hover:text-orange-400">
            Manage Products
          </Link>
        </li>
        <li>
          <Link to="/admin/order" className="hover:text-orange-400">
            manage orders
          </Link>
        </li>
        <li>
          <Link to="analitics" className="hover:text-orange-400">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/manageCategory" className="hover:text-orange-400">
            category manage
          </Link>
        </li>
        <li>
          <Link to="/admin/coupons" className="hover:text-orange-400">
            Manage Coupons
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;

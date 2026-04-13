import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-lg">
          <Link to={"/"}>My FMCG App</Link>
        </div>
        <div className="space-x-6">
          <Link
            to="/products"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Products
          </Link>
          <Link
            to="/suppliers"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Suppliers
          </Link>
        </div>
      </div>
    </nav>
  );
}

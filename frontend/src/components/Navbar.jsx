import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  // Decide which links to show based on current path
  let links = [];
  if (location.pathname === "/products") {
    links = [
      { to: "/", label: "Home" },
      { to: "/suppliers", label: "Suppliers" },
    ];
  } else if (location.pathname === "/suppliers") {
    links = [
      { to: "/", label: "Home" },
      { to: "/products", label: "Products" },
    ];
  } else {
    // Home page
    links = [
      { to: "/products", label: "Products" },
      { to: "/suppliers", label: "Suppliers" },
    ];
  }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-lg">
          <Link to={"/"}>My FMCG App</Link>
        </div>
        <div className="space-x-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

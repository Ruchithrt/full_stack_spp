import React, { useEffect, useState } from "react";

export default function Product() {
  const [products, setProducts] = useState([]);

  // Fetch products from backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/get_product") // adjust URL to your FastAPI route
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmed) return; // stop if user cancels

    await fetch(`http://127.0.0.1:8000/delete_product/${id}`, {
      method: "DELETE",
    });
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleUpdate = async (id) => {
    // Example: update product name
    await fetch(`http://127.0.0.1:8000/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Updated Product" }),
    });
    // Refresh list
    const updated = await fetch("http://127.0.0.1:8000/products").then((res) =>
      res.json(),
    );
    setProducts(updated);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md">
          Add Product
        </button>
      </div>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Quantity Instock</th>
            <th className="px-4 py-2 border">Quantity Sold</th>
            <th className="px-4 py-2 border">Price (In Rs)</th>
            <th className="px-4 py-2 border">Supplier</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-2 border">{p.id}</td>
              <td className="px-4 py-2 border">{p.name}</td>
              <td className="px-4 py-2 border">{p.quantity_instock}</td>
              <td className="px-4 py-2 border">{p.quantity_sold}</td>
              <td className="px-4 py-2 border">{p.price}</td>
              <td className="px-4 py-2 border">{p.supplier_id}</td>

              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => handleUpdate(p.id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React, { useEffect, useState } from "react";

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/get_supplier")
      .then((res) => res.json())
      .then((data) => setSuppliers(data));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:8000/suppliers/${id}`, { method: "DELETE" });
    setSuppliers(suppliers.filter((s) => s.id !== id));
  };

  const handleUpdate = async (id) => {
    await fetch(`http://127.0.0.1:8000/suppliers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Updated Supplier" }),
    });
    const updated = await fetch("http://127.0.0.1:8000/suppliers").then((res) =>
      res.json(),
    );
    setSuppliers(updated);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Suppliers</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md">
          Add Supplier
        </button>
      </div>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Distribution Name</th>
            <th className="px-4 py-2 border">Owner</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Phone No</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.id}>
              <td className="px-4 py-2 border">{s.id}</td>
              <td className="px-4 py-2 border">{s.company}</td>
              <td className="px-4 py-2 border">{s.name}</td>
              <td className="px-4 py-2 border">{s.email}</td>
              <td className="px-4 py-2 border">{s.phone}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => handleUpdate(s.id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
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

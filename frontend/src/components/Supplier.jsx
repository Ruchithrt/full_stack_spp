import React, { useEffect, useState } from "react";

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    company: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/get_supplier")
      .then((res) => res.json())
      .then((data) => setSuppliers(data));
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?",
    );
    if (!confirmed) return;
    await fetch(`http://127.0.0.1:8000/delete_suppliers/${id}`, {
      method: "DELETE",
    });
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

  const handleAddSupplier = async () => {
    // Validations
    if (
      !formData.name ||
      !formData.company ||
      !formData.email ||
      !formData.phone
    ) {
      alert("All fields are required!");
      return;
    }
    if (
      formData.name.length > 35 ||
      formData.company.length > 30 ||
      formData.email.length > 30
    ) {
      alert("Name, company, and email must be within allowed length.");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    // Call backend
    const res = await fetch("http://127.0.0.1:8000/add_supplier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const newSupplier = await res.json();
      setSuppliers([...suppliers, newSupplier]); // add to list
      setShowModal(false); // close modal
      setFormData({ name: "", company: "", email: "", phone: "" }); // reset form
    } else {
      alert("Failed to add supplier.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Suppliers</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          Add Supplier
        </button>
      </div>

      {/* Table */}
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

      {/* Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add New Supplier</h2>
            <input
              type="text"
              placeholder="Product Id"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Owner Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Phone (10 digits)"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSupplier}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

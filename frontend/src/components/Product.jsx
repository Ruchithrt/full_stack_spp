import React, { useEffect, useState } from "react";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    quantity_instock: "",
    quantity_sold: "",
    price: "",
    supplierId: "",
  });
  const [updateFormData, setUpdateFormData] = useState({
    id: "",
    name: "",
    quantity_instock: "",
    quantity_sold: "",
    price: "",
    supplierId: "",
  });

  // Fetch products and suppliers
  useEffect(() => {
    fetch("http://127.0.0.1:8000/get_product")
      .then((res) => res.json())
      .then((data) => setProducts(data));

    fetch("http://127.0.0.1:8000/get_supplier")
      .then((res) => res.json())
      .then((data) => setSuppliers(data));
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmed) return;

    await fetch(`http://127.0.0.1:8000/delete_product/${id}`, {
      method: "DELETE",
    });
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleOpenUpdateModal = (product) => {
    setSelectedProductId(product.id);
    setUpdateFormData({
      id: product.id,
      name: product.name,
      quantity_instock: product.quantity_instock,
      quantity_sold: product.quantity_sold,
      price: product.price,
      supplierId: product.supplier?.id || "",
    });
    setShowUpdateModal(true);
  };

  const handleUpdateProduct = async () => {
    if (
      !updateFormData.name ||
      !updateFormData.quantity_instock ||
      !updateFormData.quantity_sold ||
      !updateFormData.price ||
      !updateFormData.supplierId
    ) {
      alert("All fields are required!");
      return;
    }

    const supplier = suppliers.find(
      (s) => s.id === parseInt(updateFormData.supplierId),
    );
    if (!supplier) {
      alert("Supplier not found!");
      return;
    }

    const payload = {
      id: parseInt(updateFormData.id),
      name: updateFormData.name,
      quantity_instock: parseInt(updateFormData.quantity_instock),
      quantity_sold: parseInt(updateFormData.quantity_sold),
      price: parseFloat(updateFormData.price),
      revenue:
        parseInt(updateFormData.quantity_sold) *
        parseFloat(updateFormData.price),
      supplier: supplier,
    };

    const res = await fetch(
      `http://127.0.0.1:8000/update_product/${selectedProductId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (res.ok) {
      const updatedProduct = await res.json();
      setProducts(
        products.map((p) => (p.id === selectedProductId ? updatedProduct : p)),
      );
      setShowUpdateModal(false);
      setSelectedProductId(null);
      setUpdateFormData({
        id: "",
        name: "",
        quantity_instock: "",
        quantity_sold: "",
        price: "",
        supplierId: "",
      });
    } else {
      alert("Failed to update product.");
    }
  };

  const handleAddProduct = async () => {
    if (
      !formData.id ||
      !formData.name ||
      !formData.quantity_instock ||
      !formData.quantity_sold ||
      !formData.price ||
      !formData.supplierId
    ) {
      alert("All fields are required!");
      return;
    }

    const supplier = suppliers.find(
      (s) => s.id === parseInt(formData.supplierId),
    );
    if (!supplier) {
      alert("Supplier not found!");
      return;
    }

    const payload = {
      id: parseInt(formData.id),
      name: formData.name,
      quantity_instock: parseInt(formData.quantity_instock),
      quantity_sold: parseInt(formData.quantity_sold),
      price: parseFloat(formData.price),
      revenue: parseInt(formData.quantity_sold) * parseFloat(formData.price),
      supplier: supplier,
    };

    const res = await fetch("http://127.0.0.1:8000/add_product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const newProduct = await res.json();
      setProducts([...products, newProduct]);
      setShowModal(false);
      setFormData({
        id: "",
        name: "",
        quantity_instock: "",
        quantity_sold: "",
        price: "",
        supplierId: "",
      });
    } else {
      alert("Failed to add product.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          Add Product
        </button>
      </div>

      {/* Table */}
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
              <td className="px-4 py-2 border">
                {p.supplier?.company || p.supplier_id}
              </td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => handleOpenUpdateModal(p)}
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

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add New Product</h2>
            <input
              type="number"
              placeholder="Product ID"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Quantity In Stock"
              value={formData.quantity_instock}
              onChange={(e) =>
                setFormData({ ...formData, quantity_instock: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Quantity Sold"
              value={formData.quantity_sold}
              onChange={(e) =>
                setFormData({ ...formData, quantity_sold: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Price (Rs)"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <select
              value={formData.supplierId}
              onChange={(e) =>
                setFormData({ ...formData, supplierId: e.target.value })
              }
              className="border p-2 w-full mb-4"
            >
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.company} ({s.name})
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Product Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Update Product</h2>
            <input
              type="number"
              placeholder="Product ID"
              value={updateFormData.id}
              disabled
              className="border p-2 w-full mb-2 bg-gray-100 cursor-not-allowed"
            />
            <input
              type="text"
              placeholder="Product Name"
              value={updateFormData.name}
              onChange={(e) =>
                setUpdateFormData({ ...updateFormData, name: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Quantity In Stock"
              value={updateFormData.quantity_instock}
              onChange={(e) =>
                setUpdateFormData({
                  ...updateFormData,
                  quantity_instock: e.target.value,
                })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Quantity Sold"
              value={updateFormData.quantity_sold}
              onChange={(e) =>
                setUpdateFormData({
                  ...updateFormData,
                  quantity_sold: e.target.value,
                })
              }
              className="border p-2 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Price (Rs)"
              value={updateFormData.price}
              onChange={(e) =>
                setUpdateFormData({ ...updateFormData, price: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />
            <select
              value={updateFormData.supplierId}
              onChange={(e) =>
                setUpdateFormData({
                  ...updateFormData,
                  supplierId: e.target.value,
                })
              }
              className="border p-2 w-full mb-4"
            >
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.company} ({s.name})
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedProductId(null);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";

const PRODUCT_URL = "http://localhost:8000/products"; // product service
const SUPPLIER_URL = "http://localhost:8000/suppliers"; // supplier service

export default function Product() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const emptyForm = {
    name: "",
    quantity_instock: "",
    quantity_sold: "",
    price: "",
    supplierId: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [updateFormData, setUpdateFormData] = useState(emptyForm);

  useEffect(() => {
    fetch(`${PRODUCT_URL}/`) // GET /products/
      .then((res) => res.json())
      .then((data) => setProducts(data));

    fetch(`${SUPPLIER_URL}/`) // GET /suppliers/
      .then((res) => res.json())
      .then((data) => setSuppliers(data));
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmed) return;
    await fetch(`${PRODUCT_URL}/${id}`, { method: "DELETE" }); // DELETE /products/{id}
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleOpenUpdateModal = (product) => {
    setSelectedProductId(product.id);
    setUpdateFormData({
      name: product.name,
      quantity_instock: product.quantity_instock,
      quantity_sold: product.quantity_sold,
      price: product.price,
      supplierId: product.supplier_id,
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

    const payload = {
      name: updateFormData.name,
      quantity_instock: parseInt(updateFormData.quantity_instock),
      quantity_sold: parseInt(updateFormData.quantity_sold),
      price: parseFloat(updateFormData.price),
      supplier_id: parseInt(updateFormData.supplierId), // ← flat int, no nested object
    };

    const res = await fetch(`${PRODUCT_URL}/${selectedProductId}`, {
      // PUT /products/{id}
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const updatedProduct = await res.json();
      setProducts(
        products.map((p) => (p.id === selectedProductId ? updatedProduct : p)),
      );
      setShowUpdateModal(false);
      setSelectedProductId(null);
      setUpdateFormData(emptyForm);
    } else {
      alert("Failed to update product.");
    }
  };

  const handleAddProduct = async () => {
    if (
      !formData.name ||
      !formData.quantity_instock ||
      !formData.quantity_sold ||
      !formData.price ||
      !formData.supplierId
    ) {
      alert("All fields are required!");
      return;
    }

    const payload = {
      // matches ProductCreate exactly
      name: formData.name,
      quantity_instock: parseInt(formData.quantity_instock),
      quantity_sold: parseInt(formData.quantity_sold),
      price: parseFloat(formData.price),
      supplier_id: parseInt(formData.supplierId),
    };

    const res = await fetch(`${PRODUCT_URL}/`, {
      // POST /products/
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const newProduct = await res.json();
      setProducts([...products, newProduct]);
      setShowModal(false);
      setFormData(emptyForm);
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

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Quantity Instock</th>
            <th className="px-4 py-2 border">Quantity Sold</th>
            <th className="px-4 py-2 border">Price (In Rs)</th>
            <th className="px-4 py-2 border">Revenue</th>
            <th className="px-4 py-2 border">Supplier ID</th>
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
              <td className="px-4 py-2 border">{p.revenue}</td>
              <td className="px-4 py-2 border">{p.supplier_id}</td>{" "}
              {/* ← flat field now */}
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
            {/* ← Product ID input removed entirely */}
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
              value={selectedProductId} // ← read from selectedProductId, not formData
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

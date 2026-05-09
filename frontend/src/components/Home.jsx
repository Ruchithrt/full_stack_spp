import React, { useEffect, useState } from "react";

export default function Home() {
  const [productCount, setProductCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);

  useEffect(() => {
    // Fetch products
    fetch("http://127.0.0.1:8000/get_product")
      .then((res) => res.json())
      .then((data) => setProductCount(data.length));

    // Fetch suppliers
    fetch("http://127.0.0.1:8000/get_supplier")
      .then((res) => res.json())
      .then((data) => setSupplierCount(data.length));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">FMCG Dashboard</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p className="text-3xl font-bold text-blue-700">{productCount}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Suppliers</h2>
          <p className="text-3xl font-bold text-green-700">{supplierCount}</p>
        </div>
      </div>
    </div>
  );
}

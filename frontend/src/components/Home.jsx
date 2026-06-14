import React, { useEffect, useState } from "react";

const ANALYTICS_URL = "http://localhost:8000/analytics"; // ← one URL now

export default function Home() {
  const [analytics, setAnalytics] = useState({
    total_products: 0,
    total_suppliers: 0,
    total_revenue: 0,
    total_quantity_sold: 0,
    low_stock_products: [],
    recent_events: [],
  });

  useEffect(() => {
    fetch(`${ANALYTICS_URL}/`)
      .then((res) => res.json())
      .then((data) => setAnalytics(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">FMCG Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p className="text-3xl font-bold text-blue-700">
            {analytics.total_products}
          </p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Suppliers</h2>
          <p className="text-3xl font-bold text-green-700">
            {analytics.total_suppliers}
          </p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-3xl font-bold text-purple-700">
            ₹{analytics.total_revenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Quantity Sold</h2>
          <p className="text-3xl font-bold text-yellow-700">
            {analytics.total_quantity_sold}
          </p>
        </div>
      </div>

      {/* Low stock alerts — only shows if there are any */}
      {analytics.low_stock_products.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-red-600">
            ⚠ Low Stock Alerts ({analytics.low_stock_products.length})
          </h2>
          <table className="min-w-full border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-red-50">
                <th className="px-4 py-2 border text-left">Product ID</th>
                <th className="px-4 py-2 border text-left">Name</th>
                <th className="px-4 py-2 border text-left">Qty In Stock</th>
              </tr>
            </thead>
            <tbody>
              {analytics.low_stock_products.map((p) => (
                <tr key={p.product_id}>
                  <td className="px-4 py-2 border">{p.product_id}</td>
                  <td className="px-4 py-2 border">{p.name}</td>
                  <td className="px-4 py-2 border font-bold text-red-600">
                    {p.quantity_instock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recent activity feed — only shows if there are any */}
      {analytics.recent_events.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">Recent Activity</h2>
          <div className="space-y-2">
            {analytics.recent_events.map((e, i) => (
              <div
                key={i}
                className="bg-gray-50 border rounded px-4 py-2 text-sm flex items-center gap-2"
              >
                <span className="font-semibold text-indigo-600">
                  {e.event_type}
                </span>
                <span className="text-gray-400">→</span>
                <span>
                  {e.entity_name && e.entity_name}
                  {e.entity_company && ` (${e.entity_company})`}
                </span>
                <span className="ml-auto text-xs text-gray-400">{e.topic}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

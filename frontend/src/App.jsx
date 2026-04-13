import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

const Home = () => <h1 className="p-4">Welcome to FMCG Dashboard</h1>;
const Products = () => <h1 className="p-4">Products Page</h1>;
const Suppliers = () => <h1 className="p-4">Suppliers Page</h1>;

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/suppliers" element={<Suppliers />} />
      </Routes>
    </div>
  );
};

export default App;

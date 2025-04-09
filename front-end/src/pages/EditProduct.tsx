import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/AddProducts.css";
import logoPlaceholder from "../assets/coffee-add-logo.png";

interface Product {
  id: number;
  product_name: string;
  price: number;
  description: string;
  category: string;
  quantity: number; // ✅ NEW
  created_at: string;
}

const EditProduct: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { product: Product } | null;
  const initialProduct = state?.product || {
    id: 0,
    product_name: "",
    price: 0,
    description: "",
    category: "",
    quantity: 0,
    created_at: ""
  };

  const [name, setName] = useState(initialProduct.product_name);
  const [price, setPrice] = useState(String(initialProduct.price));
  const [description, setDescription] = useState(initialProduct.description);
  const [category, setCategory] = useState(initialProduct.category);
  const [quantity, setQuantity] = useState(String(initialProduct.quantity));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = () => {
    setName(initialProduct.product_name);
    setPrice(String(initialProduct.price));
    setDescription(initialProduct.description);
    setCategory(initialProduct.category);
    setQuantity(String(initialProduct.quantity));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedProduct = {
      product_name: name,
      price: parseFloat(price),
      description,
      category,
      quantity: parseInt(quantity, 10), // ✅ Include quantity
    };

    const PRODUCTS_BASE_URL = import.meta.env.VITE_PRODUCTS_BASE_URL;
    fetch(`${PRODUCTS_BASE_URL}/api/edit-product/${initialProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update product");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Product updated successfully!", data);
        setIsSubmitting(false);
        alert("Product updated successfully!");
        navigate("/"); // ✅ Redirect to homepage
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="add-product-container">
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group-top-section">
          <div className="form-group image-upload-group">
            <img
              src={logoPlaceholder}
              alt="Product Logo"
              className="upload-logo"
            />
            <button type="button" className="add-image-button" disabled>
              Add Image
            </button>
          </div>
          <div className="form-group-right-side">
            <div className="form-group">
              <label htmlFor="name">Product Name:</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price:</label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="Hot Drinks">Hot Drinks</option>
            <option value="Cold Drinks">Cold Drinks</option>
            <option value="Blended">Blended</option>
            <option value="Specialty">Specialty</option>
          </select>
        </div>

        {/* ✅ Quantity Field */}
        <div className="form-group">
          <label htmlFor="quantity">Quantity in Stock:</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="0"
            step="1"
          />
        </div>

        <div className="form-buttons">
          <button type="button" onClick={handleReset}>
            Reset
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;

import React, { useState } from "react";
import "../styles/AddProducts.css";
import logoPlaceholder from "../assets/coffee-add-logo.png";

const AddProducts: React.FC = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = () => {
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newProduct = {
      product_name: name,
      price: parseFloat(price),
      description,
      category,
    };

    console.log("Submitting new product:", newProduct);

    const PRODUCTS_BASE_URL = import.meta.env.VITE_PRODUCTS_BASE_URL;
    fetch(`${PRODUCTS_BASE_URL}/api/create-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create product");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Product created successfully!", data);
        setIsSubmitting(false);
        handleReset();
      })
      .catch((error) => {
        console.error("Error creating product:", error);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="add-product-container">
      <h1>Add New Product</h1>
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

        <div className="form-buttons">
          <button type="button" onClick={handleReset}>
            Reset
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;

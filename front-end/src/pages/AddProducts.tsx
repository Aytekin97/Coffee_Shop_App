import React, { useState } from "react";
import "../styles/AddProducts.css";
import logoPlaceholder from "../assets/coffee-add-logo.png";

const AddProducts: React.FC = () => {
  // Form field state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [glutenFree, setGlutenFree] = useState(false);
  const [plantBased, setPlantBased] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset the form fields
  const handleReset = () => {
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setGlutenFree(false);
    setPlantBased(false);
  };

  // Handle form submission and create a new product
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare the product payload with the correct field names
    const newProduct = {
      product_name: name,  // map local 'name' to backend field 'product_name'
      price: parseFloat(price),
      description,
      category,
    };

    console.log("Submitting new product:", newProduct);

    // Build the URL using the environment variable
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
        // Optionally, clear the form after successful submission.
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
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={glutenFree}
              onChange={(e) => setGlutenFree(e.target.checked)}
            />
            Gluten Free
          </label>
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={plantBased}
              onChange={(e) => setPlantBased(e.target.checked)}
            />
            Plant Based
          </label>
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

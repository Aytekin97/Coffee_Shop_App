import React, { useState } from "react";
import "../styles/AddProducts.css";

const AddProducts: React.FC = () => {
  // Define state for form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to reset the form fields
  const handleReset = () => {
    setName("");
    setPrice("");
    setDescription("");
    setImageUrl("");
    setCategory("");
  };

  // Function to simulate the submit action
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create the new product object
    const newProduct = {
      name,
      price: parseFloat(price),
      description,
      imageUrl,
      category,
    };

    console.log("Submitting new product:", newProduct);

    // TODO: Replace this simulated timeout with an actual backend API call.
    // Example:
    // fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(newProduct),
    // })
    //   .then((res) => res.json())
    //   .then((data) => console.log("Product created:", data))
    //   .catch((error) => console.error("Error creating product:", error))
    //   .finally(() => setIsSubmitting(false));

    // Simulate backend call delay
    setTimeout(() => {
      setIsSubmitting(false);
      console.log("Product created successfully!");
      // Optionally reset the form after successful submission
      // handleReset();
    }, 1000);
  };

  return (
    <div className="add-product-container">
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit} className="add-product-form">
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
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            id="imageUrl"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
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

import React, { useState } from "react";
import "../styles/AddProducts.css";
// Replace this with your actual logo placeholder image path
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

  // Simulate form submission for creating a new product
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newProduct = {
      name,
      price: parseFloat(price),
      description,
      category,
      glutenFree,
      plantBased,
    };

    console.log("Submitting new product:", newProduct);

    // Replace with your actual backend call when ready.
    setTimeout(() => {
      setIsSubmitting(false);
      console.log("Product created successfully!");
      // Optionally, clear the form after submission.
      // handleReset();
    }, 1000);
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

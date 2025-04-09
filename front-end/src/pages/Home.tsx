import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../context/AuthContext';
import '../styles/Home.css';

const PRODUCTS_BASE_URL = import.meta.env.VITE_PRODUCTS_BASE_URL;
const ORDERS_BASE_URL = import.meta.env.VITE_ORDERS_BASE_URL;

interface CoffeeItem {
  id: number;
  product_name: string;
  price: number;
  description: string;
  category: string;
  created_at: string;
}

interface BasketItem {
  id: number;
  quantity: number;
}

const Home: React.FC = () => {
  // State to hold the fetched products and basket items.
  const [coffeeItems, setCoffeeItems] = useState<CoffeeItem[]>([]);
  const [basket, setBasket] = useState<BasketItem[]>([]);

  const authContext = useContext<AuthContextType | undefined>(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }
  const { user } = authContext;

  // Fetch products from the product-services endpoint on page load.
  useEffect(() => {
    fetch(`${PRODUCTS_BASE_URL}/api/get-products`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => {
        // Map returned product data to match the CoffeeItem interface.
        const items = data.map((prod: any) => ({
          id: prod.id,
          product_name: prod.product_name,
          price: prod.price,
          description: prod.description,
          category: prod.category,
          created_at: prod.created_at,
        }));
        setCoffeeItems(items);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Add a product to the basket. If it already exists, increment its quantity.
  const addToBasket = (item: CoffeeItem) => {
    setBasket((prevBasket) => {
      const existingItem = prevBasket.find((b) => b.id === item.id);
      if (existingItem) {
        return prevBasket.map((b) =>
          b.id === item.id ? { ...b, quantity: b.quantity + 1 } : b
        );
      } else {
        return [...prevBasket, { id: item.id, quantity: 1 }];
      }
    });
  };

  // Clear the basket.
  const handleCancel = () => {
    setBasket([]);
  };

  // When Order is clicked, send a request to create a new order.
  const handleOrder = () => {
    // Convert basket items to a product_ids list.
    const product_ids = basket.flatMap((item) =>
      Array(item.quantity).fill(item.id)
    );

    // Use the logged-in user's id as the order's user_id.
    const orderPayload = {
      user_id: user?.id,
      product_ids,
    };

    console.log('Order payload:', JSON.stringify(orderPayload, null, 2));

    // Send POST request to order-services app.
    fetch(`${ORDERS_BASE_URL}/api/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create order");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Order success:", data);
        // Optionally clear the basket after successful order creation.
        setBasket([]);
      })
      .catch((error) => {
        console.error("Error creating order:", error);
      });
  };

  return (
    <div className="home-container">
      <h1>Coffee Shop Menu</h1>
      {coffeeItems.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        <ul className="menu-list">
          {coffeeItems.map((item) => (
            <li key={item.id}>
              <div className="product-details">
                <strong>{item.product_name}</strong> 
                <p><em><strong>Description:</strong></em> {item.description}</p>
                <p><em><strong>Category:</strong></em> {item.category}</p>
                <p><em><strong>Price:</strong></em> ${item.price.toFixed(2)}</p>
              </div>
              <button onClick={() => addToBasket(item)}>
                Add to Basket
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>Your Basket</h2>
      {basket.length === 0 ? (
        <p>No items in your basket.</p>
      ) : (
        <>
          <ul className="basket-list">
            {basket.map((bItem) => {
              const details = coffeeItems.find((coffee) => coffee.id === bItem.id);
              // Calculate the line subtotal for this basket item
              const lineSubtotal = details ? details.price * bItem.quantity : 0;
              return (
                <li key={bItem.id} className="basket-item">
                  <span className="basket-item-name">
                    {details?.product_name} x {bItem.quantity}
                  </span>
                  <span className="basket-item-subtotal">
                    ${lineSubtotal.toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="basket-summary">
            <p>
              <strong>Subtotal:</strong> $
              {basket
                .reduce((acc, item) => {
                  const product = coffeeItems.find((p) => p.id === item.id);
                  return acc + (product ? product.price * item.quantity : 0);
                }, 0)
                .toFixed(2)}
            </p>
            <p>
              <strong>Tax (13%):</strong> $
              {(
                basket.reduce((acc, item) => {
                  const product = coffeeItems.find((p) => p.id === item.id);
                  return acc + (product ? product.price * item.quantity : 0);
                }, 0) * 0.13
              ).toFixed(2)}
            </p>
            <p>
              <strong>Total:</strong> $
              {(
                basket.reduce((acc, item) => {
                  const product = coffeeItems.find((p) => p.id === item.id);
                  return acc + (product ? product.price * item.quantity : 0);
                }, 0) * 1.13
              ).toFixed(2)}
            </p>
          </div>
        </>
      )}


      <div className="button-group">
        <button onClick={handleCancel} className="cancel-btn">
          Cancel
        </button>
        <button onClick={handleOrder} className="order-btn">
          Order
        </button>
      </div>
    </div>
  );
};

export default Home;

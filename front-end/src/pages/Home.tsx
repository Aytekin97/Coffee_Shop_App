import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../context/AuthContext';
import '../styles/Home.css';

const PRODUCTS_BASE_URL = import.meta.env.VITE_PRODUCTS_BASE_URL;
const ORDERS_BASE_URL = import.meta.env.VITE_ORDERS_BASE_URL;
interface CoffeeItem {
  id: number;
  name: string;
  price: number;
}

interface BasketItem {
  id: number;
  quantity: number;
}

const Home: React.FC = () => {
  // Replace the static list with an empty array,
  // then update it after fetching from the product service.
  const [coffeeItems, setCoffeeItems] = useState<CoffeeItem[]>([]);
  const [basket, setBasket] = useState<BasketItem[]>([]);

  const authContext = useContext<AuthContextType | undefined>(AuthContext);
  
    if (!authContext) {
      throw new Error('AuthContext must be used within an AuthProvider');
    }
  
    const { user } = authContext;

  // Fetch products from the product-services endpoint on page load
  useEffect(() => {
    fetch(`${PRODUCTS_BASE_URL}/api/get-products`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => {
        // data is an array of products; map them into your CoffeeItem interface
        // assuming product-service returns a list of products with field `product_name`
        const items = data.map((prod: any) => ({
          id: prod.id,
          name: prod.product_name,
          price: prod.price
        }));
        setCoffeeItems(items);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Add coffee item to the basket. If it exists, increment its quantity.
  const addToBasket = (item: CoffeeItem) => {
    setBasket((prevBasket) => {
      const existingItem = prevBasket.find((b) => b.id === item.id);
      if (existingItem) {
        // Increase quantity if item is already in the basket
        return prevBasket.map((b) =>
          b.id === item.id ? { ...b, quantity: b.quantity + 1 } : b
        );
      } else {
        // Add new item to the basket
        return [...prevBasket, { id: item.id, quantity: 1 }];
      }
    });
  };

  // Clear the basket
  const handleCancel = () => {
    setBasket([]);
  };

  // When Order is clicked, send a request to the order-services to create an order.
  const handleOrder = () => {
    // Convert basket items to a product_ids list.
    // For each basket item, if quantity > 1, include the product id multiple times.
    const product_ids = basket.flatMap(item =>
      Array(item.quantity).fill(item.id)
    );
    
    // Hardcode a user_id for demonstration (you may get this from login state)
    const orderPayload = {
      user_id: user?.id,
      product_ids
    };
    
    console.log('Order payload:', JSON.stringify(orderPayload, null, 2));
    
    // Send POST request to order-services app (assumed running at port 8002)
    fetch(`${ORDERS_BASE_URL}/api/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create order");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Order success:", data);
        // Optionally, clear basket after successful order creation.
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
              <span>
                {item.name} (${item.price.toFixed(2)})
              </span>
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
        <ul className="basket-list">
          {basket.map((bItem) => {
            const details = coffeeItems.find(
              (coffee) => coffee.id === bItem.id
            );
            return (
              <li key={bItem.id}>
                {details?.name} x {bItem.quantity}
              </li>
            );
          })}
        </ul>
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

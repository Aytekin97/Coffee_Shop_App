import React, { useState, useEffect } from 'react';
import "../styles/MyOrders.css"

// Define interfaces to match the expected response structure from the backend.
interface Product {
  id: number;
  product_name: string;
  price: number;
  description: string;
  category: string;
  created_at: string; // Using string here for simplicity
}

interface OrderItem {
  id: number;
  product: Product;
}

interface Order {
  id: number;
  created_at: string;
  order_items: OrderItem[];
  // If your schema returns a "total" field, include it here.
  total?: number;
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // In a real application, get user_id from context, props, or routing.
  const user_id = 1;

  useEffect(() => {
    // Read the orders base URL from your environment variable
    const ORDERS_BASE_URL = import.meta.env.VITE_ORDERS_BASE_URL;
    fetch(`${ORDERS_BASE_URL}/api/get-orders?user_id=${user_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        return res.json();
      })
      .then((data) => {
        // Expecting the data to be structured as: { orders: [ ... ] }
        setOrders(data.orders);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, [user_id]);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="my-orders-container">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.id} className="order-item">
              <h2>Order #{order.id}</h2>
              <p>Date: {order.created_at}</p>
              <ul className="order-items">
                {order.order_items && order.order_items.map((item) => (
                  <li key={item.id}>
                    {item.product.product_name} x 1
                  </li>
                ))}
              </ul>
              {order.total !== undefined && (
                <p>Total: ${order.total.toFixed(2)}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;

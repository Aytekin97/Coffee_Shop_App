import React, { useState, useEffect } from 'react';
import "../styles/MyOrders.css"

// Define an Order interface with sample properties.
// Feel free to extend this interface based on your real order data.
interface Order {
  id: number;
  date: string;
  items: {
    id: number;
    name: string;
    quantity: number;
  }[];
  total: number;
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // In a real application, you might get user_id from context, props, or routing.
  const user_id = 1;

  useEffect(() => {
    // In a real app, replace this with an actual fetch call, e.g.:
    // fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders?user_id=${user_id}`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setOrders(data);
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching orders:", error);
    //     setLoading(false);
    //   });

    // For now, simulate an API call with setTimeout
    const fetchOrders = async () => {
      try {
        // Simulated order data
        const data: Order[] = [
          {
            id: 101,
            date: "2025-04-07",
            items: [
              { id: 1, name: "Espresso", quantity: 2 },
              { id: 2, name: "Latte", quantity: 1 }
            ],
            total: 7.0,
          },
          {
            id: 102,
            date: "2025-04-06",
            items: [
              { id: 3, name: "Cappuccino", quantity: 1 }
            ],
            total: 3.5,
          }
        ];
        // Simulate network delay
        setTimeout(() => {
          setOrders(data);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch orders: ", error);
        setLoading(false);
      }
    };

    fetchOrders();
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
              <p>Date: {order.date}</p>
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} x {item.quantity}
                  </li>
                ))}
              </ul>
              <p>Total: ${order.total.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;

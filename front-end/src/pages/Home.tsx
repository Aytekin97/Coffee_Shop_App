import React, { useState } from 'react';

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
  // Static list of coffee shop items
  const coffeeItems: CoffeeItem[] = [
    { id: 1, name: 'Espresso', price: 2.0 },
    { id: 2, name: 'Latte', price: 3.0 },
    { id: 3, name: 'Cappuccino', price: 3.5 },
    { id: 4, name: 'Mocha', price: 3.75 },
  ];

  // State to hold the user's basket; initially empty
  const [basket, setBasket] = useState<BasketItem[]>([]);

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

  // Simulate order button click.
  // Here, we create a JSON payload with the id and quantity for each item.
  // Replace console.log with an actual backend call if needed.
  const handleOrder = () => {
    const orderPayload = basket.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));
    console.log('Order payload:', JSON.stringify(orderPayload, null, 2));

    // For a real API, you might do:
    // fetch('https://your-backend-endpoint/orders', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(orderPayload),
    // })
    //   .then((response) => response.json())
    //   .then((data) => console.log('Order success:', data))
    //   .catch((error) => console.error('Error:', error));
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Coffee Shop Menu</h1>
      <ul>
        {coffeeItems.map((item) => (
          <li key={item.id} style={{ marginBottom: '0.5rem' }}>
            <span>
              {item.name} (${item.price.toFixed(2)})
            </span>
            <button
              style={{ marginLeft: '1rem' }}
              onClick={() => addToBasket(item)}
            >
              Add to Basket
            </button>
          </li>
        ))}
      </ul>

      <h2>Your Basket</h2>
      {basket.length === 0 ? (
        <p>No items in your basket.</p>
      ) : (
        <ul>
          {basket.map((bItem) => {
            // Find the coffee item details (optional, for display purposes)
            const details = coffeeItems.find((coffee) => coffee.id === bItem.id);
            return (
              <li key={bItem.id}>
                {details?.name} x {bItem.quantity}
              </li>
            );
          })}
        </ul>
      )}

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleCancel} style={{ marginRight: '1rem' }}>
          Cancel
        </button>
        <button onClick={handleOrder}>Order</button>
      </div>
    </div>
  );
};

export default Home;

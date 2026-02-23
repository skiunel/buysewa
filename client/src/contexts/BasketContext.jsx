import { useState, createContext, useContext, useEffect } from 'react';

const BasketContext = createContext();

const defaultBasket = JSON.parse(localStorage.getItem('basket')) || [];

const BasketProvider = ({ children }) => {
  const [items, setItems] = useState(defaultBasket);

  useEffect(() => {
    localStorage.setItem('basket', JSON.stringify(items));
  }, [items]);

  const addToBasket = (data) => {
    const exists = items.find((item) => item._id === data._id);
    if (exists) {
      const filtered = items.filter((item) => item._id !== data._id);
      setItems(filtered);
    } else {
      setItems((prev) => [data, ...prev]);
    }
  };

  const removeFromBasket = (item_id) => {
    setItems(items.filter((item) => item._id !== item_id));
  };

  const emptyBasket = () => setItems([]);

  return (
    <BasketContext.Provider value={{ items, setItems, addToBasket, removeFromBasket, emptyBasket }}>
      {children}
    </BasketContext.Provider>
  );
};

const useBasket = () => useContext(BasketContext);
export { BasketProvider, useBasket };

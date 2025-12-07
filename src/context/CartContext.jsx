import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Vi sparar varukorgen i localStorage så den finns kvar om man laddar om sidan
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Spara till localStorage varje gång varukorgen ändras
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Lägg till produkt
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Om den redan finns, öka antal
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Annars lägg till ny
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Ta bort produkt
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Töm varukorg (efter köp)
  const clearCart = () => setCart([]);

  // Räkna ut totalt antal varor (för badge i menyn)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Räkna ut totalsumma
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};
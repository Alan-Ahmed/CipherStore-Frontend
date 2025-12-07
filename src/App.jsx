import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react'; // Tog bort 'Lock' ikonen då den inte används i menyn längre
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import SuccessPage from './pages/SuccessPage';
import { useCart } from './context/CartContext';

// Navbar-komponent
const Navbar = () => {
  const { totalItems } = useCart();

  return (
    <nav className="border-b border-cyber-gray bg-cyber-dark/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Klickbar till startsidan */}
          <Link to="/" className="text-2xl font-mono font-bold text-cyber-blue tracking-tighter hover:text-white transition-colors">
            CIPHER_STORE
          </Link>

          {/* Menylänkar */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="hover:text-cyber-blue font-mono transition-colors">Produkter</Link>
            
            {/* HÄR TOG VI BORT ADMIN-LÄNKEN.
               Admin-sidan finns fortfarande kvar på /admin, 
               men man måste skriva det i adressfältet manuellt.
            */}
            
            {/* Varukorgsikon med badge */}
            <Link to="/checkout" className="relative p-2 hover:bg-cyber-gray rounded-full group transition-colors">
              <ShoppingCart className="text-cyber-green group-hover:text-white" size={24} />
              
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyber-green text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-cyber-black text-gray-200 font-sans">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            
            {/* Routen finns kvar, så du kan skriva /admin i webbläsaren */}
            <Route path="/admin" element={<AdminPage />} />
            
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
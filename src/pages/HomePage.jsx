import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import api from '../api/axios';
import { Loader, ShoppingCart, ArrowRight } from 'lucide-react';

// --- HÄR PEKAR VI PÅ DINA EXAKTA FILNAMN ---
const getProductImage = (name) => {
  if (!name) return "https://via.placeholder.com/400x300?text=No+Image";
  
  const lowerName = name.toLowerCase();

  // 1. YubiKey (Filnamn: yubikey.jpg)
  if (lowerName.includes("yubi")) {
    return "/images/yubikey.jpg"; 
  }
  
  // 2. Faraday Bag (Filnamn: faradaybag.jpg)
  if (lowerName.includes("faraday") || lowerName.includes("bag")) {
    return "/images/faradaybag.jpg";
  }
  
  // 3. Webcam Cover (Filnamn: webcamcover.jpg)
  if (lowerName.includes("webcam") || lowerName.includes("cover")) {
    return "/images/webcamcover.jpg"; 
  }

  // Fallback
  return "https://via.placeholder.com/400x300?text=CipherStore";
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products?category=${categoryFilter}`);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Kunde inte hämta produkter.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryFilter]);

  if (loading) return <div className="flex justify-center mt-20"><Loader className="animate-spin text-cyber-blue" size={48} /></div>;
  if (error) return <div className="text-center text-red-500 mt-20">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-mono text-cyber-blue font-bold">PRODUKTER</h1>
        
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-black border border-cyber-blue text-cyber-blue px-4 py-2 rounded font-mono focus:outline-none focus:ring-1 focus:ring-cyber-blue"
        >
          <option value="">ALLA KATEGORIER</option>
          <option value="Hardware">HARDWARE</option>
          <option value="Privacy">PRIVACY</option>
          <option value="Network">NETWORK</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all group">
            
            <Link to={`/product/${product.id}`} className="block overflow-hidden relative">
              <img 
                src={getProductImage(product.name)} 
                alt={product.name} 
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-mono font-bold flex items-center gap-2 border border-white px-4 py-2 rounded backdrop-blur-sm">
                      LÄS MER <ArrowRight size={16} />
                  </span>
              </div>
            </Link>

            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-2 font-mono">{product.name}</h2>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-2xl font-bold text-green-400 font-mono">{product.price} SEK</span>
                
                <Link to={`/product/${product.id}`} className="bg-cyber-blue text-black p-3 rounded-full hover:bg-white transition-colors">
                   <ShoppingCart size={20} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-20 font-mono">Inga produkter hittades i denna kategori.</div>
      )}
    </div>
  );
};

export default HomePage;
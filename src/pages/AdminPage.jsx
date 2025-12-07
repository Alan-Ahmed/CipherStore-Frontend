import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Lock, Package, LogOut, ShoppingBag, Save, X, Check, Truck, Box } from 'lucide-react';

const AdminPage = () => {
  // --- STATE ---
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' eller 'products'
  
  // Login State
  const [credentials, setCredentials] = useState({ username: '', password: '', twoFactorCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data State
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // State för lageruppdatering
  const [stockUpdates, setStockUpdates] = useState({}); 

  // --- EFFEKTER ---
  useEffect(() => {
    if (token) {
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'products') fetchProducts();
    }
  }, [token, activeTab]);

  // --- FUNKTIONER ---

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      const jwt = response.data.token;
      localStorage.setItem('token', jwt);
      setToken(jwt);
    } catch (err) {
      setError('Åtkomst nekat. Kontrollera uppgifter.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) { if (err.response?.status === 401) handleLogout(); }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) { console.error("Kunde inte hämta produkter"); }
  };

  const fetchOrderDetails = async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      setSelectedOrder(response.data);
    } catch (err) { console.error("Fel vid hämtning av orderdetaljer"); }
  };

  const updateStatus = async (orderId, newStatus, e) => {
    e.stopPropagation();
    if(!confirm(`Ändra status till ${newStatus}?`)) return;
    try {
      await api.put(`/orders/${orderId}/status?status=${newStatus}`);
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({...prev, status: newStatus}));
      }
    } catch (err) { alert("Fel vid uppdatering."); }
  };

  // --- FIXAD FUNKTION: Uppdatera Lager ---
  const handleStockChange = (productId, value) => {
    // Om rutan töms, sätt state till tom sträng istället för NaN
    if (value === '') {
        setStockUpdates(prev => ({ ...prev, [productId]: '' }));
        return;
    }

    const parsed = parseInt(value, 10);
    // Uppdatera bara om det är ett giltigt nummer
    if (!isNaN(parsed)) {
        setStockUpdates(prev => ({ ...prev, [productId]: parsed }));
    }
  };

  const saveStock = async (productId) => {
    const newQuantity = stockUpdates[productId];
    // Säkerhetskoll så vi inte skickar tom sträng eller ogiltiga värden
    if (newQuantity === '' || newQuantity === undefined) return;

    try {
      await api.put(`/products/${productId}/stock`, newQuantity, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert(`Lager uppdaterat till ${newQuantity}`);
      fetchProducts(); 
      setStockUpdates(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    } catch (err) {
      alert("Kunde inte uppdatera lager.");
    }
  };

  // --- VY 1: INLOGGNING ---
  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-black">
        <div className="w-full max-w-md p-8 bg-gray-900 border border-red-500 rounded shadow-[0_0_20px_rgba(255,0,60,0.3)]">
          <h1 className="text-3xl text-red-500 font-mono mb-6 text-center font-bold flex justify-center items-center gap-2">
            <Lock /> ADMIN ACCESS
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Användarnamn" className="w-full bg-black border border-gray-600 text-white p-3 rounded font-mono" onChange={e => setCredentials({...credentials, username: e.target.value})} />
            <input type="password" placeholder="Lösenord" className="w-full bg-black border border-gray-600 text-white p-3 rounded font-mono" onChange={e => setCredentials({...credentials, password: e.target.value})} />
            <input type="text" placeholder="2FA Kod" maxLength="6" className="w-full bg-black border border-cyan-500 text-cyan-400 p-3 rounded font-mono text-center tracking-widest" onChange={e => setCredentials({...credentials, twoFactorCode: e.target.value})} />
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button disabled={loading} className="w-full bg-red-600 text-black font-bold py-3 rounded hover:bg-white transition-colors font-mono">{loading ? "..." : "LOGIN"}</button>
          </form>
        </div>
      </div>
    );
  }

  // --- VY 2: DASHBOARD ---
  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen bg-black">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl text-cyan-400 font-mono font-bold glow-text">ADMIN CONTROL</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 border border-red-500 px-4 py-2 rounded hover:bg-red-600 hover:text-black transition-colors">
          <LogOut size={20} /> LOGGA UT
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-3 rounded font-bold font-mono transition-all ${activeTab === 'orders' ? 'bg-cyan-500 text-black shadow-neon-blue' : 'bg-gray-900 text-gray-500 border border-gray-700 hover:text-white'}`}
        >
          <Package size={20} /> ORDRAR
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-6 py-3 rounded font-bold font-mono transition-all ${activeTab === 'products' ? 'bg-purple-500 text-black shadow-neon-purple' : 'bg-gray-900 text-gray-500 border border-gray-700 hover:text-white'}`}
        >
          <ShoppingBag size={20} /> PRODUKTER & LAGER
        </button>
      </div>

      {/* --- FLIK: ORDRAR --- */}
      {activeTab === 'orders' && (
        <div className="bg-gray-900 border border-gray-800 rounded overflow-hidden">
          <table className="w-full text-left text-gray-300 font-mono">
            <thead className="bg-black text-cyan-400 border-b border-gray-700">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">DATUM</th>
                <th className="p-4">KUND</th>
                <th className="p-4">BELOPP</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ÅTGÄRD</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} onClick={() => fetchOrderDetails(order.id)} className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer">
                  <td className="p-4 font-bold">#{order.orderNumber}</td>
                  <td className="p-4 text-sm">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="p-4">{order.customerEmail}</td>
                  <td className="p-4 text-green-400">{order.totalAmount} kr</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${order.status === 'Paid' ? 'border-green-500 text-green-400' : 'border-gray-500 text-gray-400'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    {order.status === 'New' && <button onClick={(e) => updateStatus(order.id, 'Paid', e)} className="bg-green-500 text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Check size={14}/> MARKERA BETALD</button>}
                    {order.status === 'Paid' && <button onClick={(e) => updateStatus(order.id, 'Packed', e)} className="bg-orange-500 text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Box size={14}/> PACKAD</button>}
                    {order.status === 'Packed' && <button onClick={(e) => updateStatus(order.id, 'Shipped', e)} className="bg-cyan-400 text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Truck size={14}/> SKICKA</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="p-8 text-center text-gray-500">Inga ordrar.</div>}
        </div>
      )}

      {/* --- FLIK: PRODUKTER --- */}
      {activeTab === 'products' && (
        <div className="bg-gray-900 border border-purple-500/30 rounded overflow-hidden">
          <table className="w-full text-left text-gray-300 font-mono">
            <thead className="bg-black text-purple-400 border-b border-gray-700">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">PRODUKTNAMN</th>
                <th className="p-4">PRIS</th>
                <th className="p-4">NUVARANDE LAGER</th>
                <th className="p-4">ÄNDRA LAGER</th>
                <th className="p-4 text-right">SPARA</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="p-4 text-gray-500">#{product.id}</td>
                  <td className="p-4 font-bold text-white">{product.name}</td>
                  <td className="p-4 text-green-400">{product.price} kr</td>
                  <td className="p-4">
                    <span className={`font-bold ${product.stockQuantity === 0 ? 'text-red-500' : product.stockQuantity < 5 ? 'text-yellow-500' : 'text-blue-400'}`}>
                      {product.stockQuantity} st
                    </span>
                  </td>
                  <td className="p-4">
                    <input 
                      type="number" 
                      placeholder={product.stockQuantity}
                      // Om värdet är undefined (ej ändrat) visa tomt sträng för placeholder effekten, annars visa värdet
                      value={stockUpdates[product.id] !== undefined ? stockUpdates[product.id] : ''}
                      onChange={(e) => handleStockChange(product.id, e.target.value)}
                      className="w-24 bg-black border border-gray-600 text-white p-2 rounded focus:border-purple-500 outline-none text-center"
                    />
                  </td>
                  <td className="p-4 text-right">
                    {/* Visa bara knappen om vi har skrivit något giltigt (inte tom sträng) */}
                    {stockUpdates[product.id] !== undefined && stockUpdates[product.id] !== '' && (
                      <button 
                        onClick={() => saveStock(product.id)}
                        className="bg-purple-500 hover:bg-white text-black px-4 py-2 rounded font-bold flex items-center gap-2 ml-auto"
                      >
                        <Save size={16} /> SPARA
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <div className="p-8 text-center text-gray-500">Inga produkter hittades.</div>}
        </div>
      )}

      {/* --- POPUP FÖR ORDRAR --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border-2 border-cyan-500 rounded-lg max-w-lg w-full relative font-mono text-gray-300">
                <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={24} /></button>
                <div className="p-6">
                    <h2 className="text-2xl text-cyan-400 font-bold mb-4">ORDER #{selectedOrder.id}</h2>
                    <div className="space-y-2">
                        <p><span className="text-cyan-600">Kund:</span> {selectedOrder.customerName}</p>
                        <p><span className="text-cyan-600">Adress:</span> {selectedOrder.shippingAddress}</p>
                        <div className="border-t border-gray-700 my-4 pt-4">
                            <h3 className="text-white font-bold mb-2">Produkter:</h3>
                            {selectedOrder.items?.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span>{item.productName} (x{item.quantity})</span>
                                    <span>{item.unitPrice} kr</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-right text-xl text-green-400 font-bold pt-4">Totalt: {selectedOrder.totalAmount} kr</p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
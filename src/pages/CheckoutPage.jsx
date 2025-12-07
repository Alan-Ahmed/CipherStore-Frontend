import { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import { Trash2, CreditCard, Loader, CheckCircle } from 'lucide-react';

const CheckoutPage = () => {
  const { cart, removeFromCart, totalAmount, clearCart } = useCart();
  
  // State för formuläret
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    shippingAddress: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Hantera inmatning i fälten
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Skicka order till Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Mappa om varukorgen TILL DET FORMAT C# BEHÖVER
    const orderPayload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      shippingAddress: formData.shippingAddress,
      
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        
        productName: item.name, 
        unitPrice: item.price 
      }))
    };

    try {
        // *** HÄR ÄR FIXEN: Vi anropar /checkout för att starta Stripe Session ***
        const response = await api.post('/checkout', orderPayload); 
      
        // 1. Kolla om Backend skickade en omdirigerings-URL
        if (response.data.redirectUrl) {
            // Skickar användaren till Stripes betalningssida
            window.location.href = response.data.redirectUrl;
            return; // Avslutar funktionen
        }

        // Om koden hamnar här (ingen omdirigering), betyder det att betalningen misslyckades
        // eller att Backend inte kunde skapa sessionen.
        setSuccess(true); // Om du vill visa bekräftelse utan betalning (ej rekommenderat)
        clearCart(); 
    } catch (err) {
      console.error("API Error:", err.response?.data);
      // Försök hämta felmeddelandet från Backend (t.ex. vid lagerbrist eller konfigurationsfel)
      setError(err.response?.data?.Error || "Kunde inte lägga ordern. Kontrollera uppgifterna."); 
    } finally {
      setLoading(false);
    }
  };

  // VY: Om varukorgen är tom (och ingen order lagd)
  if (cart.length === 0 && !success) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-cyber-blue font-mono mb-4">VARUKORGEN ÄR TOM</h2>
        <p className="text-gray-500">Gå och hacka lite hårdvara först.</p>
      </div>
    );
  }

  // VY: Om ordern lyckades (Orderbekräftelse)
  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-cyber-dark border border-cyber-green rounded text-center shadow-neon-green">
        <CheckCircle className="text-cyber-green mx-auto mb-4" size={64} />
        <h1 className="text-3xl text-cyber-green font-mono mb-4">ORDER BEKRÄFTAD</h1>
        <p className="text-gray-300 mb-6">Dina varor förbereds för diskret leverans.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="text-cyber-blue hover:text-white underline font-mono"
        >
          Tillbaka till butiken
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      
      {/* VÄNSTER: Varukorgslista */}
      <div>
        <h1 className="text-3xl text-cyber-blue font-mono mb-8 font-bold">DIN VARUKORG</h1>
        <div className="space-y-4 mb-8">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-cyber-dark border border-cyber-gray p-4 rounded">
              <div>
                <h3 className="text-cyber-blue font-bold font-mono">{item.name}</h3>
                <p className="text-sm text-gray-400 font-mono">
                  {item.quantity} st x {item.price} kr
                </p>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-cyber-red hover:text-white">
                <Trash2 size={20} />
              </button>
              </div>
          ))}
        </div>
        
        <div className="flex justify-between text-xl font-bold font-mono text-cyber-green border-t border-cyber-gray pt-4">
          <span>TOTALT ATT BETALA:</span>
          <span>{totalAmount} SEK</span>
        </div>
        
      </div>

      {/* HÖGER: Formulär (Kassa) */}
      <div className="bg-cyber-dark border border-cyber-blue p-8 rounded h-fit shadow-neon-blue">
        <h2 className="text-2xl text-white font-mono mb-6 flex items-center gap-2">
          <CreditCard className="text-cyber-blue" /> LEVERANSINFO
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-cyber-blue text-sm font-mono mb-1">NAMN (ELLER ALIAS)</label>
            <input 
              required
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              type="text" 
              className="w-full bg-black border border-cyber-gray text-white p-3 rounded focus:border-cyber-blue focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-cyber-blue text-sm font-mono mb-1">E-POST (PGP OK)</label>
            <input 
              required
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              type="email" 
              className="w-full bg-black border border-cyber-gray text-white p-3 rounded focus:border-cyber-blue focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-cyber-blue text-sm font-mono mb-1">LEVERANSADRESS</label>
            <textarea 
              required
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              rows="3"
              className="w-full bg-black border border-cyber-gray text-white p-3 rounded focus:border-cyber-blue focus:outline-none font-mono"
            ></textarea>
          </div>

          {error && <div className="text-cyber-red text-sm font-bold">{error}</div>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-cyber-green text-black font-bold py-4 rounded hover:bg-white transition-colors font-mono mt-4 disabled:opacity-50 flex justify-center"
          >
            {loading ? <Loader className="animate-spin" /> : "BEKRÄFTA ORDER"}
          </button>
        </form>
      </div>

    </div>
  );
};

export default CheckoutPage;
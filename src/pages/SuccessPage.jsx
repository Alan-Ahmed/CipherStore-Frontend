import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CheckCircle, Loader, XCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [orderId, setOrderId] = useState(null);    // State för att spara ordernumret

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const verifyPayment = async () => {
      try {
        // Anropa backend
        const response = await api.get(`/checkout/verify?sessionId=${sessionId}`);
        
        // Spara ordernumret om det finns i svaret
        if (response.data.orderId) {
            setOrderId(response.data.orderId);
        }

        setStatus('success');
        clearCart(); 
      } catch (err) {
        console.error("Verifiering misslyckades", err);
        setStatus('error');
      }
    };

    // Körs bara en gång
    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-black font-mono">
      <div className="max-w-md w-full p-8 bg-gray-900 border border-cyber-green rounded text-center shadow-[0_0_30px_rgba(0,255,100,0.2)]">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader size={48} className="text-cyber-green animate-spin mb-4" />
            <h2 className="text-xl text-white">Verifierar order...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="bg-green-900/30 p-4 rounded-full mb-6 border border-green-500">
                <CheckCircle size={64} className="text-cyber-green" />
            </div>
            
            <h1 className="text-3xl text-white font-bold mb-2">TACK FÖR DIN ORDER!</h1>
            <p className="text-gray-400 mb-6">Din betalning är godkänd och ordern behandlas.</p>

            {/* HÄR VISAS ORDERNUMRET */}
            {orderId && (
                <div className="bg-black border border-gray-700 p-4 rounded w-full mb-8">
                    <p className="text-gray-500 text-xs mb-1 uppercase tracking-widest">Ditt Ordernummer</p>
                    <p className="text-2xl text-cyber-blue font-bold">#{orderId}</p>
                </div>
            )}

            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-8 py-3 bg-cyber-green text-black font-bold rounded hover:bg-white transition-colors"
            >
              <ShoppingBag size={20} /> FORTSÄTT HANDLA
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle size={64} className="text-red-500 mb-4" />
            <h1 className="text-2xl text-red-500 font-bold mb-2">FEL VID VERIFIERING</h1>
            <p className="text-gray-400 mb-6">Kontakta support om pengar dragits.</p>
            <button 
              onClick={() => navigate('/')}
              className="text-gray-500 underline hover:text-white"
            >
              Gå tillbaka
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
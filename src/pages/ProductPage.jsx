import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { Loader, ArrowLeft, Minus, Plus, ShoppingCart, ShieldCheck } from 'lucide-react';

// --- SAMMA FILNAMN HÄR ---
const getProductImage = (name) => {
  if (!name) return "https://via.placeholder.com/600x600?text=No+Image";
  
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

  return "https://via.placeholder.com/600x600?text=CipherStore";
};

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Produkt hittades inte");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const increaseQty = () => {
    if (product && quantity < product.stockQuantity) {
        setQuantity(prev => prev + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
        setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
        addToCart(product);
    }
    
    alert(`${quantity} st ${product.name} har lagts i varukorgen.`);
  };

  if (loading) return <div className="flex justify-center mt-20"><Loader className="animate-spin text-cyber-blue" size={48} /></div>;
  if (!product) return <div className="text-center text-red-500 mt-20 font-mono text-xl">Produkten hittades inte.</div>;

  const isOutOfStock = product.stockQuantity <= 0;
  
  const currentImage = getProductImage(product.name);

  return (
    <div className="max-w-6xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 font-mono transition-colors">
        <ArrowLeft size={20} /> TILLBAKA
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-gray-900/50 p-8 rounded-lg border border-gray-800 shadow-lg">
        
        {/* VÄNSTER: BILD */}
        <div className="relative group">
           <img 
            src={currentImage} 
            alt={product.name} 
            className="w-full rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-gray-700 object-cover aspect-square" 
           />
           {!isOutOfStock && (
             <div className="absolute top-4 right-4 bg-black/90 text-green-400 border border-green-500 px-3 py-1 rounded font-mono text-sm flex items-center gap-2 backdrop-blur-sm">
                <ShieldCheck size={16} /> {product.stockQuantity} I LAGER
             </div>
           )}
        </div>

        {/* HÖGER: INFO & KÖP */}
        <div className="flex flex-col justify-center">
           <h1 className="text-4xl font-bold text-white font-mono mb-2">{product.name}</h1>
           <span className="text-cyber-blue text-sm font-mono mb-6 tracking-widest uppercase bg-gray-800 w-fit px-2 py-1 rounded">
             {product.category || 'Okategoriserad'}
           </span>
           
           <div className="text-3xl font-bold text-green-400 font-mono mb-6">
             {product.price} SEK
           </div>

           <div className="mb-8 text-gray-300 leading-relaxed border-l-2 border-cyber-blue pl-4">
             <h3 className="text-white font-bold mb-2 font-mono text-sm uppercase">Beskrivning</h3>
             <p>{product.description || "Ingen beskrivning tillgänglig."}</p>
           </div>

           {!isOutOfStock && (
             <div className="flex items-center gap-4 mb-6">
               <label className="font-mono text-gray-400 text-sm">ANTAL:</label>
               <div className="flex items-center bg-black border border-gray-600 rounded">
                 <button 
                    onClick={decreaseQty} 
                    className="p-3 hover:text-cyber-blue transition-colors disabled:opacity-30 disabled:cursor-not-allowed" 
                    disabled={quantity <= 1}
                 >
                    <Minus size={16} />
                 </button>
                 <span className="w-12 text-center font-mono font-bold text-white select-none">{quantity}</span>
                 <button 
                    onClick={increaseQty} 
                    className="p-3 hover:text-cyber-blue transition-colors disabled:opacity-30 disabled:cursor-not-allowed" 
                    disabled={quantity >= product.stockQuantity}
                 >
                    <Plus size={16} />
                 </button>
               </div>
               <span className="text-xs text-gray-500 font-mono">Max: {product.stockQuantity}</span>
             </div>
           )}

           <button
             onClick={handleAddToCart}
             disabled={isOutOfStock}
             className={`w-full py-4 rounded font-bold font-mono text-lg flex justify-center items-center gap-2 transition-all duration-300
               ${isOutOfStock 
                 ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700" 
                 : "bg-cyber-blue text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
               }`}
           >
             {isOutOfStock ? (
               "SLUT I LAGER"
             ) : (
               <>
                 <ShoppingCart size={24} /> LÄGG I VARUKORG ({quantity} st)
               </>
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
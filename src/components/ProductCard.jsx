import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="bg-cyber-dark border border-cyber-gray rounded-lg overflow-hidden flex flex-col hover:shadow-neon-blue transition-all duration-300 h-full">
      
      {/* Bild-ruta */}
      <div className="h-48 bg-black/50 flex items-center justify-center border-b border-cyber-gray">
        <span className="text-cyber-gray font-mono text-xl">IMG_NA</span>
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-cyber-red text-black text-xs font-bold px-2 py-1 rounded">
            SLUT
          </div>
        )}
      </div>

      {/* Text */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-cyber-blue font-mono mb-2 truncate">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-auto flex justify-between items-center">
          <span className="text-cyber-green font-mono text-lg">{product.price} kr</span>
          
          {isOutOfStock ? (
            <button disabled className="text-gray-500 font-mono text-sm cursor-not-allowed">SLUT I LAGER</button>
          ) : (
            <Link to={`/product/${product.id}`} className="text-cyber-black bg-cyber-blue px-3 py-1 rounded font-bold text-sm hover:bg-white flex gap-2">
              <ShoppingCart size={16}/> KÖP
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
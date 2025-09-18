import { useCart } from "../cart/CartContext";
import { useNavigate } from "react-router-dom"; 

const formatPrice = (price) => {
  return price ? `${price.toFixed(2)} €` : "";
};

const ProductCard = ({ name, price, image, description }) => {
  const { dispatch } = useCart();
  const navigate = useNavigate(); 

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: { name, price, image, description, shipping: 7.24, tax: 2.24 },
    });

    navigate("/cart"); 
  };

  return (
    <div className="bg-[#f5f3eb] rounded-md shadow overflow-hidden">
      <img src={image} alt={`Produit : ${name}`} className="w-full h-64 object-cover" />
      <div className="p-4">
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <div className="text-sm mt-1">
          <span className="text-green-700 font-bold mr-2">{formatPrice(price)}</span>
        </div>
        
      
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
        >
          Acheter
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext";

const BestSellers = ({ products = [] }) => {
  const { dispatch } = useCart(); 
  const navigate = useNavigate();

  if (!Array.isArray(products)) return null;

  const handleAddToCart = (product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] ? `${process.env.REACT_APP_API_URL}${product.images[0]}` : "/default.jpg",
        description: product.description || "",
      },
    });

    navigate("/cart"); 
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);

  return (
    <section className="bg-[#f5f3eb] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold mb-4 text-[#2E3B2B]">Nos Meilleures Ventes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
              
              <img
                src={product.images?.[0] ? `${process.env.REACT_APP_API_URL}${product.images[0]}` : "/default.jpg"}
                alt={product.name}
                className="w-full h-64 object-cover"
              />

              <div className="p-4">
                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                <div className="text-sm mt-1">
                  <span className="text-green-700 font-bold mr-2">
                    {formatPrice(product.price)}
                  </span>
                  {product.tag && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      {product.tag}
                    </span>
                  )}
                </div>
                <button
                  className="mt-4 w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
                  onClick={() => handleAddToCart(product)}
                >
                  Acheter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;

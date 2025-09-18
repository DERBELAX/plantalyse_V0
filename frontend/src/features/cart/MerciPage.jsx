import React from "react";
import { useLocation, Link } from "react-router-dom";


const MerciPage = () => {
  const location = useLocation();
  const order = location.state;

  if (!order) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Aucune commande à afficher.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen py-16 px-4 bg-[#f5f5f0]">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Merci pour votre commande ! 🎉</h2>

          <p className="mb-2 text-gray-700">
            Commande n° <strong>{order.orderId}</strong>
          </p>
          <p className="mb-4 text-gray-700">
            Statut : <strong>{order.status}</strong>
          </p>

          <h3 className="font-semibold mb-2 text-[#2E3B2B]">Détail de la commande :</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
            {order.items.map((item, index) => (
              <li key={index}>
                {item.quantity} × {item.plantName} — {item.unitPrice.toFixed(2)} € l’unité
              </li>
            ))}
          </ul>

          <div className="mt-6 text-center">
            <Link to="/" className="text-green-700 hover:underline">
              Retour à l’accueil
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MerciPage;

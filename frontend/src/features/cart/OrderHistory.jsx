import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

const OrderHistory = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const res = await axios.get("/api/orders/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          console.error("La réponse des commandes n'est pas un tableau :", res.data);
          setOrders([]);
        }
      } catch (err) {
        console.error("Erreur chargement historique commandes", err);
        setError("Erreur lors du chargement de vos commandes.");
      }
      
    };

    fetchUserOrders();
  }, [token]);

  const handleReorder = async (order) => {
    try {
const cartItems = order.items.map((item) => {
   console.log("🔍 Item complet:", item);
   order.items?.forEach(item => console.log("📦 Item reçu:", item));

  return {
    plantId: item.plantId,  // ✅ c'est le bon ID à envoyer

    quantity: item.quantity,
    unite_price: item.unite_price,
  };
});


console.log("📦 Envoi de commande :", cartItems);
console.log("📬 Vers:", "/api/orders/from-cart");

await axios.post(
  "/api/orders/from-cart",
  cartItems,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);

      alert("Commande repassée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la commande", err);
      alert("Erreur lors de la commande : " + (err.response?.data || "Une erreur est survenue."));
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  if (!Array.isArray(orders) || orders.length === 0) {
    return <p>Vous n'avez pas encore passé de commande.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Historique des commandes</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Commande</th>
            <th className="p-2">Date</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Articles</th>
            <th className="p-2">Prix</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t align-top">
              <td className="p-2 font-medium">Commande n°{order.id}</td>
              <td className="p-2">
                {new Date(order.createdat || order.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2">{order.status}</td>
              <td className="p-2">
                {order.items?.map((item, i) => (
                  <div key={i} className="text-sm flex justify-between">
                    <span>{item.quantity} × {item.plantName}</span>
                    <span>{item.unite_price.toFixed(2)} €</span>
                  </div>
                ))}
              </td>
              <td className="p-2 font-semibold">
                {order.items?.reduce((total, item) => total + item.unite_price * item.quantity, 0).toFixed(2)} €
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleReorder(order)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Racheter
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;

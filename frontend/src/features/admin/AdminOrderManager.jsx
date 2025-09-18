import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

const AdminOrderManager = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("TOUS");

  const fetchOrders = React.useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Erreur chargement commandes", err);
    }
  }, [token]);

  const validateOrder = async (id) => {
    try {
      await axios.put(`/api/admin/orders/${id}/validate`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) {
      console.error("Erreur validation", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(
    (order) => statusFilter === "TOUS" || order.status === statusFilter
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Commandes clients</h2>

      {/* Filtrage */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filtrer par statut :</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="TOUS">Tous</option>
          <option value="EN_ATTENTE">En attente</option>
          <option value="Validée">Validée</option>
        </select>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Client</th>
            <th className="p-2">Date</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <React.Fragment key={order.id}>
              <tr className="border-t">
                <td className="p-2">{order.id}</td>
                <td className="p-2">
                  <div className="font-semibold">{order.userName || "?"}</div>
                  <div className="text-sm text-gray-500">{order.userEmail}</div>
                </td>
                <td className="p-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2">{order.status}</td>
                <td className="p-2">
                  {order.status !== "Validée" && (
                    <button
                      onClick={() => validateOrder(order.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Valider
                    </button>
                  )}
                </td>
              </tr>

              {/* Affichage des articles */}
              <tr className="bg-gray-50 text-sm text-gray-700">
                <td colSpan="5" className="p-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b py-1">
                      <span>{item.quantity} × {item.plantName}</span>
                      <span>{item.unite_price.toFixed(2)} €</span>
                    </div>
                  ))}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderManager;

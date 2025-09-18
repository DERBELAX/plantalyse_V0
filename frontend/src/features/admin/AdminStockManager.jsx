import React, { useEffect, useState } from "react";
import axios from "axios";


function AdminStockAManager() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get("/api/plants");
        setPlants(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des plantes :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  return (
   <>
      

      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-800">Stock des plantes</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2 text-left border">Nom</th>
                  <th className="px-4 py-2 text-left border">Catégorie</th>
                  <th className="px-4 py-2 text-left border">Stock</th>
                </tr>
              </thead>
              <tbody>
                {plants.map((plant) => (
                  <tr key={plant.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 border">{plant.name}</td>
                    <td className="px-4 py-2 border">
                      {plant.category?.name || <span className="text-gray-500 italic">Non catégorisé</span>}

                    </td>
                    <td
                      className={`px-4 py-2 border ${
                        plant.stock <= 3 ? "text-red-600 font-bold" : ""
                      }`}
                    >
                      {plant.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  </>
  );
}

export default AdminStockAManager;

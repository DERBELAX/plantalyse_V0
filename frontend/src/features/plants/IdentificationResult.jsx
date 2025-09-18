import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";

const IdentificationResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rawResults = location.state?.results || [];

  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchDescriptions = async () => {
      const enrichedResults = await Promise.all(
        rawResults.map(async (item) => {
          const query = item.scientificName || item.name;
          const langFallbacks = ["fr", "en"];

          for (const lang of langFallbacks) {
            try {
              const res = await axios.get(
                `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
              );
              if (res.data.extract) {
                return { ...item, description: res.data.extract };
              }
            } catch {
              continue;
            }
          }

          return { ...item, description: "Aucune description trouvée." };
        })
      );

      setResults(enrichedResults);
    };

    fetchDescriptions();
  }, [rawResults]);

  const handleSearchInStore = (plantName) => {
    navigate(`/products?search=${encodeURIComponent(plantName.toLowerCase())}`);
  };

  if (results.length === 0) {
    return (
      <>
        <div className="p-6 text-center text-red-500">Aucun résultat trouvé.</div>
      </>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-green-800">Résultats d'identification</h2>
        <div className="grid gap-6">
          {results.map((item, idx) => (
            <div key={idx} className="border p-4 rounded shadow bg-white">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded border"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-700">{item.name}</h3>
                  <p className="text-sm text-gray-600 italic">
                    Confiance : {(item.confidence * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm mt-2">
                    📖 <span className="font-medium">Nom scientifique :</span>{" "}
                    {item.scientificName || "Inconnu"}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    🧬 <em>{item.description}</em>
                  </p>

                  {item.scientificName && (
                    <p className="text-sm mt-2">
                      🔗{" "}
                      <a
                        href={`https://fr.wikipedia.org/wiki/${encodeURIComponent(item.scientificName)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Voir plus sur Wikipédia
                      </a>
                    </p>
                  )}

                  <div className="mt-4 flex gap-4 flex-wrap">
                    <button
                      onClick={() => handleSearchInStore(item.name)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Rechercher dans la boutique
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded cursor-not-allowed"
                      disabled
                    >
                      Ajouter à mes plantes (à venir)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default IdentificationResults;

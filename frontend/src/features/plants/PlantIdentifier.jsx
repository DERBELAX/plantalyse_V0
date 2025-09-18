import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlantIdentifier = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !image.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image valide.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    setLoading(true);

    try {
      const res = await axios.post("/api/identify", formData);
      const suggestions = res.data?.suggestions || [];

      const enriched = suggestions.slice(0, 3).map((s) => ({
        name: s.plant_details.common_names?.[0] || s.plant_name,
        scientificName: s.plant_details.scientific_name || "",
        confidence: s.probability || 0,
        imageUrl: res.data.images?.[0]?.url || "/placeholder.jpg",
      }));

      navigate("/identification-results", { state: { results: enriched } });
    } catch (err) {
      console.error("Erreur identification plante", err);
      alert("Échec de l’identification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-6 border rounded-lg shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-green-800">Identifier une plante par photo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="block w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Analyse en cours..." : "Identifier"}
        </button>
      </form>
    </div>
  );
};

export default PlantIdentifier;

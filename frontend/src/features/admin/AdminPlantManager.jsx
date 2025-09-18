import { useState, useEffect, useContext, useCallback, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

const AdminPlantManager = () => {
  const { token } = useContext(AuthContext);
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState(null);
  const fileInputRef = useRef();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [existingImages, setExistingImages] = useState([]);

  const [newPlant, setNewPlant] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    entretien: "",
    frequenceArrosage: "",
    images: [],
    category: { id_category: "1" },
  });

  const fetchPlants = useCallback(async () => {
    try {
      const res = await axios.get("/api/plants");
      setPlants(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des plantes :", err);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des catégories :", err);
    }
  }, [token]);

  useEffect(() => {
    fetchPlants();
    fetchCategories();
  }, [fetchPlants, fetchCategories]);

  const resetForm = () => {
    setSelectedPlantId(null);
    setNewPlant({
      name: "",
      description: "",
      price: "",
      stock: "",
      entretien: "",
      frequenceArrosage: "",
      images: [],
      category: { id_category: "1" },
    });
    setExistingImages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "category") {
      setNewPlant((prev) => ({ ...prev, category: { id_category: value } }));
    } else if (name === "images") {
      const newFiles = Array.from(files);
      setNewPlant((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }));
    } else {
      setNewPlant((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setNewPlant((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("✅ submit triggered");

    if (!selectedPlantId && newPlant.images.length === 0) {
      alert("Veuillez ajouter au moins une image.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    Object.entries(newPlant).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => formData.append("images", file));
      } else if (key === "category") {
        formData.append("categoryId", value.id_category);
      } else {
        formData.append(key, value);
      }
    });

    existingImages.forEach((imgPath) => {
      formData.append("existingImages", imgPath);
    });

    try {
      if (selectedPlantId) {
        await axios.put(`/api/admin/plants/${selectedPlantId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMessage("Plante mise à jour avec succès !");
      } else {
        await axios.post("/api/admin/plants", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMessage("Plante ajoutée avec succès !");
      }
      resetForm();
      fetchPlants();
    } catch (err) {
      console.error("Erreur :", err);
      setMessage("Échec de l'opération.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plant) => {
    setSelectedPlantId(plant.id);
    setNewPlant({
      name: plant.name,
      description: plant.description,
      price: plant.price,
      stock: plant.stock,
      entretien: plant.entretien || "",
      frequenceArrosage: plant.frequenceArrosage || "",
      images: [],
      category: { id_category: plant.category?.id_category || "1" },
    });
    setExistingImages(plant.images || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette plante ?")) return;
    try {
      await axios.delete(`/api/admin/plants/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPlants();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const filteredAndSortedPlants = plants
    .filter((plant) =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = sortBy === "name" ? a.name.toLowerCase() : Number(a[sortBy]);
      const bVal = sortBy === "name" ? b.name.toLowerCase() : Number(b[sortBy]);
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {selectedPlantId ? "Modifier une plante" : "Ajouter une plante"}
      </h2>

      {message && (
        <div className="mb-4 p-2 text-center bg-gray-100 rounded shadow">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <input name="name" placeholder="Nom" value={newPlant.name} onChange={handleInputChange} required />
        <textarea name="description" placeholder="Description" value={newPlant.description} onChange={handleInputChange} required />
        <input name="price" type="number" placeholder="Prix" value={newPlant.price} onChange={handleInputChange} required />
        <input name="stock" type="number" placeholder="Stock" value={newPlant.stock} onChange={handleInputChange} required />
        <textarea name="entretien" placeholder="Entretien (ex: lumière, humidité...)" value={newPlant.entretien} onChange={handleInputChange} required />
        <input name="frequenceArrosage" type="number" placeholder="Fréquence d'arrosage (en jours)" value={newPlant.frequenceArrosage} onChange={handleInputChange} required />
        <input name="images" type="file" accept="image/*" multiple onChange={handleInputChange} ref={fileInputRef} />

        {newPlant.images.length > 0 && (
          <ul className="col-span-full text-sm text-gray-700 space-y-1">
            {newPlant.images.map((file, idx) => (
              <li key={idx} className="flex items-center justify-between">
                {file.name}
                <button type="button" onClick={() => handleRemoveImage(idx)} className="text-red-500">✖</button>
              </li>
            ))}
          </ul>
        )}

        {existingImages.length > 0 && (
          <div className="col-span-full mt-2">
            <p className="text-sm font-medium mb-1">Images existantes :</p>
            <ul className="space-y-1">
              {existingImages.map((url, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <img src={`${process.env.REACT_APP_API_URL}${url}`} alt={`img-${idx}`} className="h-10 w-10 object-cover" />
                  <button type="button" onClick={() => handleRemoveExistingImage(idx)} className="text-red-500">✖</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <select name="category" value={newPlant.category.id_category} onChange={handleInputChange} required>
          <option value="">Choisir une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id_category} value={cat.id_category}>{cat.name}</option>
          ))}
        </select>

        <div className="col-span-full flex gap-2">
          <button type="submit" disabled={loading} className="bg-green-700 text-white px-4 py-2 rounded">
            {selectedPlantId ? "Mettre à jour" : "Ajouter"}
          </button>
          {selectedPlantId && (
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <input type="text" placeholder="Rechercher une plante..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-1/2 border px-3 py-2 rounded" />
        <div className="flex items-center gap-2">
          <label htmlFor="sortBy">Trier par :</label>
          <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border px-2 py-1 rounded">
            <option value="name">Nom</option>
            <option value="price">Prix</option>
            <option value="stock">Stock</option>
          </select>
          <button onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}>
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {filteredAndSortedPlants.map((plant) => (
          <div key={plant.id} className="bg-white shadow p-4 rounded">
            {plant.images?.map((url, idx) => (
              <img key={idx} src={`${process.env.REACT_APP_API_URL}${url}`} alt={`${plant.name} ${idx}`} className="h-40 w-full object-cover mb-2" />
            ))}
            <h3 className="font-bold">{plant.name}</h3>
            <p>{plant.description}</p>
            <p className="text-green-700">{plant.price} €</p>
            <p>Stock : {plant.stock}</p>
            <p>Entretien : {plant.entretien}</p>
            <p>Arrosage : tous les {plant.frequenceArrosage} jours</p>
            <p>Catégorie : {plant.category?.name}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(plant)} className="bg-blue-600 text-white px-3 py-1 rounded">Modifier</button>
              <button onClick={() => handleDelete(plant.id)} className="bg-red-600 text-white px-3 py-1 rounded">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPlantManager;

import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

const AdminCategoryManager = ({ onCategoriesLoaded }) => {
  const { token } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data);
      if (onCategoriesLoaded) onCategoriesLoaded(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des catégories :", err);
    }
  }, [onCategoriesLoaded]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await axios.post(
        "/api/admin/categories",
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("Erreur lors de l'ajout de catégorie :", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      await axios.delete(`/api/admin/categories/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const handleEdit = (category) => {
    setEditCategoryId(category.id_category);
    setEditCategoryName(category.name);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editCategoryName.trim()) return;

    try {
      await axios.put(
        `/api/admin/categories/${editCategoryId}`,
        { name: editCategoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditCategoryId(null);
      setEditCategoryName("");
      fetchCategories();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  return (
    <div className="mb-6">
      {/* Formulaire d'ajout */}
      <form onSubmit={handleAddCategory} className="flex gap-4 items-center mb-4">
        <input
          type="text"
          placeholder="Nouvelle catégorie"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="p-2 border rounded w-full"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Ajouter
        </button>
      </form>

      {/* Liste des catégories */}
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.id_category} className="flex items-center gap-2">
            {editCategoryId === cat.id_category ? (
              <>
                <input
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className="p-1 border rounded"
                />
                <button onClick={handleUpdate} className="text-green-600">✔</button>
                <button onClick={() => setEditCategoryId(null)} className="text-gray-500">✖</button>
              </>
            ) : (
              <>
                <span className="flex-1">{cat.name}</span>
                <button onClick={() => handleEdit(cat)} className="text-blue-600">Modifier</button>
                <button onClick={() => handleDelete(cat.id_category)} className="text-red-600">Supprimer</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCategoryManager;

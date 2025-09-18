import React, { useState, useEffect } from "react";
import axios from "axios";

const PlantForm = ({ plant, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    type: "",
    image: "",
    category: null
  });

  useEffect(() => {
    if (plant) setForm(plant);
  }, [plant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = plant ? "put" : "post";
    const url = plant
      ? `/api/plants/${plant.id}`
      : "/api/plants";

    axios[method](url, form)
      .then(res => {
        alert("Plante enregistrée !");
        if (onSave) onSave(res.data);
      })
      .catch(() => alert("Erreur lors de l'enregistrement"));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Nom" required className="w-full border p-2" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border p-2" />
      <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Prix" className="w-full border p-2" />
      <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" className="w-full border p-2" />
      <input name="type" value={form.type} onChange={handleChange} placeholder="Type (ex: intérieur)" className="w-full border p-2" />
      <input name="image" value={form.image} onChange={handleChange} placeholder="URL image" className="w-full border p-2" />

      <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded">
        {plant ? "Modifier" : "Ajouter"} la plante
      </button>
    </form>
  );
};

export default PlantForm;

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

const AdminBlogManager = () => {
  const { token } = useContext(AuthContext);

  const [blogs, setBlogs] = useState([]);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/api/admin/blogs", {
        //headers: { Authorization: `Bearer ${token}` },
         credentials: 'include'
      });
      setBlogs(res.data);
    } catch (err) {
      console.error("Erreur chargement blogs", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlants = async () => {
    try {
      const res = await axios.get("/api/plants");
      setPlants(res.data);
    } catch (err) {
      console.error("Erreur chargement plantes", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchPlants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || (!imageFile && !editId)) {
      alert("Tous les champs sont requis.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);
    selectedPlants.forEach((id) => formData.append("plantIds", id));

    const url = editId
      ? `/api/admin/blogs/${editId}`
      : "/api/admin/blogs";

    const method = editId ? "put" : "post";

    try {
      await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(editId ? "Blog modifié" : "Blog créé");
      resetForm();
      fetchBlogs();
    } catch (err) {
      console.error("Erreur lors de la soumission", err);
      alert("Échec de la soumission");
    }
  };

  const handleEdit = (blog) => {
    setTitle(blog.title);
    setDescription(blog.description);
    setImageFile(null);
    setImagePreview(`${process.env.REACT_APP_API_URL}${blog.image}`);
    setSelectedPlants(blog.plants ? blog.plants.map((p) => p.id) : []);
    setEditId(blog.id_blog);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce blog ?")) return;

    try {
      await axios.delete(`/api/admin/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
    } catch (err) {
      console.error("Erreur suppression", err);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
    setSelectedPlants([]);
    setEditId(null);
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-4 space-y-4"
      >
        <h2 className="text-xl font-semibold">
          {editId ? "Modifier un blog" : "Créer un blog"}
        </h2>

        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Contenu"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          rows={4}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setImageFile(file);
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImagePreview(reader.result);
              };
              reader.readAsDataURL(file);
            } else {
              setImagePreview(null);
            }
          }}
          className="w-full border p-2 rounded"
          required={!editId}
        />

        {imagePreview && (
          <div>
            <img
              src={imagePreview}
              alt="Aperçu"
              className="w-full h-48 object-cover rounded border"
            />
            <p className="text-sm text-gray-500 italic">
              Aperçu de l’image {editId ? "actuelle/modifiée" : "sélectionnée"}
            </p>
          </div>
        )}

        <select
          multiple
          value={selectedPlants}
          onChange={(e) =>
            setSelectedPlants(
              Array.from(e.target.selectedOptions, (opt) =>
                parseInt(opt.value)
              )
            )
          }
          className="w-full border p-2 rounded"
        >
          {plants.map((plant) => (
            <option key={plant.id} value={plant.id}>
              {plant.name}
            </option>
          ))}
        </select>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editId ? "Modifier" : "Publier"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Annuler la modification
            </button>
          )}
        </div>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {blogs.map((blog) => (
          <div
            key={blog.id_blog}
            className="bg-white shadow rounded overflow-hidden"
          >
            <img
              src={`${process.env.REACT_APP_API_URL}${blog.image}`}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{blog.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Par {blog.user?.email} •{" "}
                {new Date(blog.createdat).toLocaleDateString()}
              </p>
              {blog.plants && blog.plants.length > 0 ? (
                <p className="text-sm text-gray-700">
                  Plantes associées :{" "}
                  {blog.plants.map((plant) => plant.name).join(", ")}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Aucune plante liée
                </p>
              )}
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleEdit(blog)}
                  className="text-blue-600"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(blog.id_blog)}
                  className="text-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogManager;

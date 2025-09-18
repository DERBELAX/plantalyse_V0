import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext"; 

const PostForm = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);
      await axios.post("/api/community/posts/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setTitle("");
      setDescription("");
      setImage(null);
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error("Erreur création post", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-3">Créer un post</h2>
      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        className="w-full border p-2 mb-3 rounded"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-3"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Publication..." : "Publier"}
      </button>
    </form>
  );
};

export default PostForm;

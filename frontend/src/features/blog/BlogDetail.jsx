import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";


const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/blogs/${id}`)
      .then((res) => setBlog(res.data))
      .catch(() => setError(true));
  }, [id]);

  if (error) return <p className="p-4 text-red-600">Erreur de chargement.</p>;
  if (!blog) return <p className="p-4">Chargement...</p>;

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-4 bg-white rounded shadow">
        <img
          src={`${process.env.REACT_APP_API_URL}${blog.image}`}
          alt={blog.title}
          className="w-full h-64 object-cover rounded"
          onError={(e) => (e.target.src = "/default.jpg")}
        />
        <h1 className="text-2xl font-bold">{blog.title}</h1>
        <p className="text-gray-600 text-sm mb-2">
          Par {blog.userEmail} •{" "}
          {blog.createdat ? new Date(blog.createdat).toLocaleDateString() : ""}
        </p>
        <p>{blog.description}</p>

        {/* Plantes associées */}
        <h2 className="text-xl font-semibold mt-8">Plantes associées</h2>
        {blog.plants && blog.plants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {blog.plants.map((plant) => (
              <Link
                to={`/product/${plant.id || plant.id_plante}`}
                key={plant.id || plant.id_plante}
                className="border rounded p-3 shadow hover:shadow-lg transition"
              >
                <img src={ plant.mainImage
                    ? `${process.env.REACT_APP_API_URL}${plant.mainImage}`
                    : "/default.jpg"
                }
                  alt={plant.name}
                  className="w-full h-40 object-cover rounded mb-2"
                  onError={(e) => (e.target.src = "/default.jpg")}
                />
                <h3 className="text-lg font-medium">{plant.name}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <p className="italic text-gray-500">Aucune plante associée</p>
        )}
      </div>
    </>
  );
};

export default BlogDetail;

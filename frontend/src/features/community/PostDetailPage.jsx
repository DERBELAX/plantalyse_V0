import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";


const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [content, setContent] = useState("");
  const { isAuthenticated, token } = useAuth();

  const fetchPost = () => {
    axios.get(`/api/community/posts`)
      .then(res => {
        const found = res.data.find(p => p.id === parseInt(id));
        setPost(found);
      })
      .catch(err => console.error("Erreur chargement post", err));
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    axios.post("/api/community/comments", {
      postId: post.id,
      content,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setContent("");
      fetchPost();
    }).catch(err => console.error("Erreur ajout commentaire", err));
  };

  const handleLike = () => {
    axios.post(`/api/community/likes/${post.id}/toggle`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => fetchPost())
      .catch(err => console.error("Erreur toggle like", err));
  };

  if (!post) return <><div className="text-center py-10">Chargement...</div></>;

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-10">
        {post.image && (
          <img
            src={`${process.env.REACT_APP_API_URL}${post.image}`}
            alt={post.title}
            className="w-full h-80 object-cover rounded-lg mb-6"
          />
        )}
        <h1 className="text-3xl font-bold text-green-800 mb-2">{post.title}</h1>
        <p className="text-gray-600 mb-4">Par {post.firstname} {post.lastname}</p>
        <p className="text-lg text-gray-800 mb-6">{post.description}</p>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ❤️ J'aime ({post.likeCount || 0})
          </button>
          <span className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Commentaires</h2>

          {post.comments?.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((c) => (
                <div key={c.id} className="bg-gray-100 p-3 rounded">
                  <p className="text-sm">
                    <strong className="text-green-800">{c.firstname}</strong> : {c.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucun commentaire pour le moment.</p>
          )}

          {isAuthenticated && (
            <form onSubmit={handleCommentSubmit} className="mt-6">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-green-500"
                placeholder="Écris un commentaire..."
              />
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Publier
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default PostDetailPage;
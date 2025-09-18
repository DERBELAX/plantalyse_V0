// CommunityPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import PostModal from "./PostModal";
import PostForm from "./PostForm";
import { useAuth } from "../auth/AuthContext";
import "../../styles/community.css";


const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const { token, isAuthenticated } = useAuth();

  const fetchPosts = React.useCallback(() => {
    axios
      .get("/api/community/posts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Erreur chargement posts", err));
  }, [token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const toggleLike = (postId) => {
    axios
      .post(
        `/api/community/likes/${postId}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => fetchPosts())
      .catch((err) => console.error("Erreur toggle like", err));
  };


  return (
      <>

    <div className="px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">🌿 Notre Communauté</h1>

      {isAuthenticated && (
        <>
          <div className="text-right mb-6">
            <button
              onClick={() => setShowPostForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              ➕ Créer un post
            </button>
          </div>

          {showPostForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-xl relative">
                <button
                  onClick={() => setShowPostForm(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
                >
                  ✕
                </button>
                <PostForm
                  onPostCreated={() => {
                    fetchPosts();
                    setShowPostForm(false);
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="relative group cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <img
              src={`${process.env.REACT_APP_API_URL}${post.image}`}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="overlay group-hover:opacity-100">
              <span className="icon">
                <button
                  className="focus:outline-none"
                  onClick={e => {
                    e.stopPropagation();
                    toggleLike(post.id);
                  }}
                  aria-label="Like post"
                  title="Like post"
                >
                  ❤️ {post.likeCount || 0}
                </button>
              </span>
              <span className="icon">💬 {post.comments?.length || 0}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onRefresh={fetchPosts}
        />
      )}
    </div>
</>
  );
};

export default CommunityPage;

import React, { useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const PostModal = ({ post, onClose, onRefresh }) => {
  const [comment, setComment] = useState("");
  const { token, isAuthenticated } = useAuth();

  const handleLike = () => {
    axios
      .post(`/api/community/likes/${post.id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => onRefresh());
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    axios
      .post(
        "/api/community/comments",
        { postId: post.id, content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setComment("");
        onRefresh();
      });
  };

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={`${process.env.REACT_APP_API_URL}${post.image}`}
          alt={post.title}
          className="modal-img"
        />
        <div className="modal-details">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="text-sm text-gray-600">{post.description}</p>

          <div className="flex gap-4 items-center mt-2">
            <button onClick={handleLike} className="hover:text-red-500">❤️</button>
            <span>{post.likeCount || 0}</span>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Commentaires</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {post.comments?.map((c) => (
                <div key={c.id} className="text-sm">
                  <strong>{c.firstname}</strong>: {c.content}
                </div>
              ))}
            </div>
          </div>

          {isAuthenticated && (
            <form onSubmit={handleComment} className="mt-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="w-full border p-2 rounded"
              />
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PostModal;

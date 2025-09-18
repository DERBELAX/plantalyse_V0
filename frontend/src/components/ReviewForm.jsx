// src/components/ReviewForm.jsx
import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";

const ReviewForm = ({ plantId, onReviewSubmitted }) => {
  const { token } = useAuth();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plantId, content, rating }),
      });

      if (res.ok) {
        setSuccess(true);
        setContent("");
        setRating(5);
        onReviewSubmitted(); // pour recharger les avis
      } else {
        const msg = await res.text();
        setError(msg || "Erreur lors de l'envoi.");
      }
    } catch (err) {
      setError("Erreur serveur.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <h3 className="text-lg font-semibold">Laisser un avis</h3>
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">Merci pour votre avis !</p>}
      <textarea
        className="w-full border p-2"
        rows={4}
        placeholder="Votre avis..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div>
        Note :
        <select
          className="ml-2 border"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} ⭐</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
      >
        Envoyer
      </button>
    </form>
  );
};

export default ReviewForm;

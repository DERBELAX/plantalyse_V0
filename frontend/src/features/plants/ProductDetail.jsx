import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/ProductDetail.module.css";
import { NextArrow, PrevArrow } from "../../components/CarouselArrows";
import { useCart } from "../cart/CartContext";
import { useAuth } from "../auth/AuthContext";
import ReviewForm from "../../components/ReviewForm";

const ProductDetail = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [allPlants, setAllPlants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { isAuthenticated } = useAuth();

  const fetchReviews = useCallback(() => {
    axios.get(`/api/reviews/plant/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error("Erreur chargement avis", err));
  }, [id]);

  useEffect(() => {
    setPlant(null);
    setActiveImageIndex(0);
    setError(false);
    window.scrollTo(0, 0);

    axios.get(`/api/plants/${id}`)
      .then(res => setPlant(res.data))
      .catch(() => setError(true));

    axios.get('/api/plants')
      .then(res => setAllPlants(res.data));

    fetchReviews();
  }, [id, fetchReviews]);

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: plant.id,
        name: plant.name,
        price: plant.price,
        image: plant.images?.[0] ? `${process.env.REACT_APP_API_URL}${plant.images[0]}` : "/default.jpg",
        description: plant.description,
        quantity: 1,
      },
    });
    navigate("/cart");
  };

  if (error) return <p className="text-red-500 p-4">Erreur lors du chargement du produit.</p>;
  if (!plant) return <p className="p-4">Chargement...</p>;

  const similarPlants = allPlants.filter(
    p => p.id !== plant.id && p.category?.id === plant.category?.id
  ).slice(0, 3);

  return (
    <>
      <div className={styles.grid}>
        {/* Colonne gauche : images */}
        <div className={styles.leftColumn}>
          {plant.images?.length > 0 && (
            <div className={styles.carouselWrapper}>
              <PrevArrow onClick={() =>
                setActiveImageIndex(prev =>
                  prev === 0 ? plant.images.length - 1 : prev - 1
                )}
              />
              <img
                src={`${process.env.REACT_APP_API_URL}${plant.images[activeImageIndex]}`}
                alt={plant.name}
                className={styles.mainImage}
              />
              <NextArrow onClick={() =>
                setActiveImageIndex(prev =>
                  prev === plant.images.length - 1 ? 0 : prev + 1
                )}
              />
            </div>
          )}

          {plant.images?.length > 1 && (
            <div className={styles.thumbnailGallery}>
              {plant.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`${process.env.REACT_APP_API_URL}${img}`}
                  alt={`${plant.name} ${idx}`}
                  className={`${styles.thumbnail} ${idx === activeImageIndex ? styles.activeThumbnail : ""}`}
                  onClick={() => setActiveImageIndex(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Colonne droite : infos */}
        <div className={styles.rightColumn}>
          <h1 className={styles.title}>{plant.name}</h1>
          <p className={styles.description}>{plant.description}</p>
          <p className={styles.price}>{plant.price.toFixed(2)} €</p>
          <p><strong>Entretien :</strong> {plant.entretien}</p>
          <p><strong>Fréquence d’arrosage :</strong> {plant.frequenceArrosage} fois/semaine</p>
         {plant.stock <= 0 ? (
            <p className="text-gray-400 italic mt-2">Bientôt disponible</p>
          ) : plant.stock === 1 ? (
            <p className="text-gray-500 italic mt-2">Dernière unité</p>
          ) : null}

          <button
              className={`${styles.addButton} ${plant.stock <= 0 ? styles.disabledButton : ''}`}
              onClick={handleAddToCart}
              disabled={plant.stock <= 0}
            >
              {plant.stock <= 0 ? 'Indisponible' : 'Ajouter au panier'}
          </button>

        </div>
      </div>

      {/* Avis clients */}
      <div className="max-w-4xl mx-auto my-10 px-4">
        <h2 className="text-2xl font-bold mb-4">Avis clients</h2>
        {reviews.length === 0 ? (
          <p>Aucun avis pour cette plante.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review, idx) => (
              <li key={idx} className="border p-4 rounded shadow-sm">
                <div className="flex justify-between">
                  <strong>{review.userName}</strong>
                  <span>{review.rating} ⭐</span>
                </div>
                <p className="mt-2">{review.content}</p>
                <small className="text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        )}

        {isAuthenticated && (
          <ReviewForm plantId={plant.id} onReviewSubmitted={fetchReviews} />
        )}
      </div>

      {/* Plantes similaires */}
      {similarPlants.length > 0 && (
        <div className={styles.similarSection}>
          <h2 className={styles.similarTitle}>Plantes similaires</h2>
          <div className={styles.similarGrid}>
            {similarPlants.map(sp => (
              <div
                key={sp.id}
                className={styles.similarCard}
                onClick={() => {
                  if (sp.id !== Number(id)) navigate(`/product/${sp.id}`);
                }}
              >
                <img
                  src={sp.images?.[0] ? `${process.env.REACT_APP_API_URL}${sp.images[0]}` : "/default.jpg"}
                  alt={sp.name}
                  className={styles.similarImage}
                />
                <h3 className={styles.similarName}>{sp.name}</h3>
                <p className={styles.similarPrice}>{sp.price} €</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;

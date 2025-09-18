import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from '../../styles/Products.module.css';


const Products = () => {
  const [plants, setPlants] = useState([]);
  const [error, setError] = useState(false);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const type = searchParams.get("type") || "";
  const searchParam = searchParams.get("search") || "";

  useEffect(() => {
    axios.get("/api/plants")
      .then((res) => setPlants(res.data))
      .catch((err) => {
        console.error("Erreur lors du chargement des plantes", err);
        setError(true);
      });
  }, []);

  useEffect(() => {
    setSearch(searchParam);
  }, [searchParam]);

  const filteredPlants = plants
    .filter((plant) =>
      (!type || plant.category?.name?.toLowerCase().includes(type.toLowerCase())) &&
      plant.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = sortBy === "name" ? a.name.toLowerCase() : Number(a[sortBy]);
      const bVal = sortBy === "name" ? b.name.toLowerCase() : Number(b[sortBy]);
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);
  const paginatedPlants = filteredPlants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (error) return <div className="text-red-500 p-4">Erreur lors du chargement des plantes.</div>;

  return (
    <>
      <div className={styles.filterBar}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Rechercher une plante..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.selectSort}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Nom</option>
          <option value="price">Prix</option>
          <option value="stock">Stock</option>
        </select>
        <button
          onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
          className={styles.sortButton}
        >
          {sortOrder === "asc" ? "Croissant ↑" : "Décroissant ↓"}
        </button>
      </div>

      <div className={styles.gridLayout}>
        {paginatedPlants.length > 0 ? paginatedPlants.map((plant) => (
          <div
            key={plant.id}
            className={styles.card}
            onClick={() => navigate(`/product/${plant.id}`)}
          >
            {plant.images?.[0] && (
              <img
                src={`${process.env.REACT_APP_API_URL}${plant.images[0]}`}
                alt={plant.name}
                className={styles.cardImage}
              />
            )}
            <h2 className={styles.cardTitle}>{plant.name}</h2>
            <p className={styles.cardPrice}>{plant.price} €</p>
          </div>
        )) : (
          <p className="text-center col-span-full">Aucune plante trouvée.</p>
        )}
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={styles.pageButton}
        >
          Précédent
        </button>
        <span className={styles.pageLabel}>Page {currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={styles.pageButton}
        >
          Suivant
        </button>
      </div>
    </>
  );
};

export default Products;

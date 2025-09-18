import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import plantImage from "../../assets/plant.webp";
import indoorImage from "../../assets/indoor.jpg";
import outdoorImage from "../../assets/outdoor.jpg";
import allPlantsImage from "../../assets/all-plants.jpg";
import CommunityCarousel from "../community/CommunityCarousel";
import ReviewsSection from "../../components/ReviewsSection";
import CategoryCard from "./CategoryCard";
import BlogCard from "../blog/BlogCard";
import BestSellers from "../plants/BestSellers"; 



const categories = [
  { name: "Plantes d'intérieur", image: indoorImage, link: "/products?type=intérieur" },
  { name: "Plantes d'extérieur", image: outdoorImage, link: "/products?type=extérieur" },
  { name: "Toutes les plantes", image: allPlantsImage, link: "/products" },
];

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [topPlants, setTopPlants] = useState([]);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error("Erreur chargement des blogs :", err));

    fetch("/api/plants/top")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((plant) => ({
          ...plant,
          image: plant.images?.length > 0 ? `${process.env.REACT_APP_API_URL}${plant.images[0]}` : "/default.jpg",
          tag: plant.category?.name || "",
        }));
        setTopPlants(formatted);
      })
      .catch((err) => console.error("Erreur chargement top ventes :", err));
  }, []);

  return (
   <>
      {/* HERO */}
      <section
        style={{ backgroundImage: `url(${plantImage})` }}
        className="relative bg-cover bg-center h-[80vh] text-white flex flex-col justify-center items-center text-center px-4 shadow-md"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Bienvenue chez Plantelys</h1>
        <h2 className="max-w-3xl">
          Le paradis des plantes d’intérieur. Vente, conseils et inspiration pour sublimer vos espaces de vie
        </h2>
        <Link
          to="/products"
          className="mt-4 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full text-lg transition duration-300"
        >
          Découvrir les plantes
        </Link>
      </section>

      {/* CATÉGORIES */}
      <section className="mb-12 px-4">
        <p className="text-lg font-normal max-w-3xl ml-4 text-left text-[#2E3B2B] mb-8">
          Bienvenue chez Plantelys, l’univers des amoureux des plantes ! Plantelys est ta boutique en ligne dédiée
          à tout ce qu’il faut pour chouchouter tes plantes.
        </p>
        <h2 className="text-3xl font-bold mb-6 text-center text-[#2E3B2B]">Nos Catégories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} {...cat} />
          ))}
        </div>
      </section>

      {/* CONSEILS */}
     <section className="bg-[#ECEDCA] py-16 px-6 text-center">
  <h3 className="text-3xl font-bold mb-4 text-[#2E3B2B]">
    Conseils Et Inspirations
  </h3>
  <p className="text-lg font-normal max-w-3xl ml-4  text-left text-[#2E3B2B]">
    Chez Plantelys, nous partageons avec vous tous nos conseils de plantation et d’entretien pour vous inspirer.
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
    {Array.isArray(blogs) && blogs.length > 0 ? (
      blogs
        .filter(
          (b) => b && b.title && b.description && typeof b.title === "string"
        )
        .map((blog) => (
          <div key={blog.id_blog} className="break-inside-avoid">
            <BlogCard blog={blog} />
          </div>
        ))
    ) : (
      <p className="col-span-full flex justify-center items-center min-h-[100px]">
        Aucun article pour le moment.
      </p>
    )}
  </div>
</section>


      {/* CARROUSEL */}
      <CommunityCarousel />

      {/*  BEST SELLERS */}
      <BestSellers products={topPlants} />

      {/* AVIS */}
      <ReviewsSection />
</>
  );
};

export default Home;

// Exemple composant HeroSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/plant.webp";

const HeroSection = () => (
  <section
    style={{ backgroundImage: `url(${heroImage})` }}
    className="relative bg-cover bg-center h-[80vh] text-white flex flex-col justify-center items-center text-center px-4 shadow-md"
  >
    <h1 className="text-4xl md:text-6xl font-bold mb-4">Bienvenue chez Plantelys</h1>
    <p className="max-w-3xl">
      Le paradis des plantes d’intérieur. Vente, conseils et inspiration pour sublimer vos espaces de vie.
    </p>
    <Link
      to="/products"
      className="mt-4 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full text-lg transition duration-300"
    >
      Découvrir les plantes
    </Link>
  </section>
);

export default HeroSection;

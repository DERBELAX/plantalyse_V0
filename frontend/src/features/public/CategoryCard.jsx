import { Link } from "react-router-dom";

const CategoryCard = ({ name, image, link }) => (
  <Link
    to={link}
    className="rounded-lg overflow-hidden shadow hover:shadow-lg transform hover:scale-105 transition"
  >
    <img src={image} alt={`Catégorie : ${name}`} className="w-full h-56 object-cover" />
    <div className="bg-white p-4 text-center font-medium text-lg">{name}</div>
  </Link>
);

export default CategoryCard;

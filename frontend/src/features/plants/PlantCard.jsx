import { Link } from "react-router-dom";

const PlantCard = ({ plant }) => {
  const imageUrl =
    plant.images && plant.images.length > 0
      ? `${process.env.REACT_APP_API_URL}${plant.images[0]}`
      : "/default.jpg";

  return (
    <Link to={`/product/${plant.id}`} className="block bg-white rounded shadow hover:shadow-lg transition">
      <img
        src={imageUrl}
        alt={plant.name}
        className="w-full h-48 object-cover rounded-t"
        onError={(e) => (e.target.src = "/default.jpg")}
      />
      <div className="p-4 text-left">
        <h3 className="font-semibold text-lg">{plant.name}</h3>
        <p className="text-green-700 font-bold">{plant.price?.toFixed(2)} €</p>
      </div>
    </Link>
  );
};

export default PlantCard;

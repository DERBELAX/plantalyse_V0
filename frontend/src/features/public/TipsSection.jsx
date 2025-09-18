import { Link } from "react-router-dom";
import blog1 from "../../assets/blog1.jpg";
import blog2 from "../../assets/blog2.avif";
import blog3 from "../../assets/blog3.avif";

const tips = [
  {
    title: "Plantes toxiques pour chiens et chats : les espèces à éviter",
    image: blog1,
    link: "#",
  },
  {
    title: "Quelles fleurs offrir pour remercier quelqu’un ?",
    image: blog2,
    link: "#",
  },
  {
    title: "Comment garder votre plante d'intérieur petite ?",
    image: blog3,
    link: "#",
  },
];

const TipsSection = () => {
  return (
    <section className="bg-[#ECEDCA] py-16 px-6 text-[#2E3B2B]">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold mb-6 text-center">
          Conseils & Inspirations 🌱
        </h3>
        <p className="text-center max-w-2xl mx-auto mb-12 text-lg">
          Chez Plantelys, nous partageons des conseils de plantation et d’entretien pour vous inspirer à créer votre coin de verdure, en intérieur comme en extérieur.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {tips.map((tip, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow hover:shadow-md transition">
              <img src={tip.image} alt={tip.title} className="w-full h-56 object-cover rounded-t-lg" />
              <div className="p-4">
                <h4 className="text-base font-semibold mb-2">{tip.title}</h4>
                <Link
                  to={tip.link}
                  className="text-sm text-green-800 underline hover:text-green-900"
                >
                  Lire l'article
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TipsSection;

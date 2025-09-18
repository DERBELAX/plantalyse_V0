import logo from "../../assets/logo.gif";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#373F36] text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Colonne 1 : Contact */}
        <div>
          <h2 className="text-3xl font-bold mb-4">PLANTÉLYS</h2>
          <p className="mb-1">contact@plantelys.fr</p>
          <p>+33 1 23 45 67 89</p>
        </div>

        {/* Colonne 2 : Liens de navigation */}
        <div className="md:col-start-3">
          <h3 className="text-lg font-semibold mb-2">Liens</h3>
          <ul className="space-y-1 text-sm text-gray-200">
            <li><Link to="/about" className="hover:text-[#B7BEA3]">À propos</Link></li>
            <li><Link to="/products" className="hover:text-[#B7BEA3]">Produits</Link></li>
            <li><Link to="/blog" className="hover:text-[#B7BEA3]">Blog</Link></li>
            <li><Link to="/cgu" className="hover:text-[#B7BEA3]">Mentions légales</Link></li>
          </ul>
        </div>

        {/* Colonne 3 : Réseaux sociaux */}
        <div className="flex md:col-span-1 items-start gap-4 mt-4 md:mt-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#B7BEA3]">
            <FaFacebookF size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#B7BEA3]">
            <FaInstagram size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#B7BEA3]">
            <FaLinkedinIn size={20} />
          </a>
        </div>
      </div>

      {/* Bas de page : Logo + Droits */}
      <div className="col-span-full mt-10 border-t border-[#ECEDCA] pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300 gap-4">
        <img src={logo} alt="Plantélys Logo" className="h-12" />
        <p>© 2025 Plantélys. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;

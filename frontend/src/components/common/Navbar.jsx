import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faMagnifyingGlass,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import logo from "../../assets/logo.gif";
import "../../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [search, setSearch] = useState("");

  const menuRef = useRef();
  const userMenuRef = useRef();
  const { isAuthenticated, role, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !e.target.closest(".mobile-toggle")
      ) setIsOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="max-w-7xl mx-auto nav-container text-[#2E3B2B]">
        <Link to="/" className="logo-wrapper">
          <div className="flex flex-col items-start sm:flex-row sm:items-center gap-0 sm:gap-2">
            <img
              src={logo}
              alt="Plantélys Logo"
              className="logo-image object-contain"
            />
            <span className="site-name text-base font-semibold ">
              Plantélys
            </span>
          </div>
        </Link>

        <ul className="hidden md:flex gap-6 text-sm font-medium desktop-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Produits</Link></li>
          <li><Link to="/about">À propos</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          {isAuthenticated && role === "USER" && <li><Link to="/dashboard">Mon espace</Link></li>}
          {isAuthenticated && role === "ADMIN" && <li><Link to="/admin">Dashboard Admin</Link></li>}
        </ul>

        <div className="flex items-center gap-4 text-xl md:gap-6 nav-right">
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-1 search-form">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Recherche..."
              className="text-sm px-2 py-1 border rounded"
            />
            <button type="submit" className="text-[#3C4F46]">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>

          <Link to="/cart">
            <FontAwesomeIcon icon={faBagShopping} className="cursor-pointer hover:text-[#3C4F46]" />
          </Link>

          {isAuthenticated && (
            <span className="hidden md:inline text-sm font-medium text-[#3C4F46]">
              Bienvenue, {user?.firstname || "Utilisateur"}
            </span>
          )}

          <div className="relative" ref={userMenuRef}>
            <FontAwesomeIcon
              icon={faUser}
              className="cursor-pointer hover:text-[#3C4F46]"
              onClick={() => {
                if (isAuthenticated) {
                  setShowUserMenu(prev => !prev);
                } else {
                  navigate("/login");
                }
              }}
            />
            {isAuthenticated && showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50"
                style={{ top: "calc(100% + 0.5rem)" }}
              >
                {role === "USER" && (
                  <div
                    onClick={() => {
                      navigate("/dashboard");
                      setShowUserMenu(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Mon espace
                  </div>
                )}
                {role === "ADMIN" && (
                  <div
                    onClick={() => {
                      navigate("/admin");
                      setShowUserMenu(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Admin Panel
                  </div>
                )}
                <div
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                    navigate("/");
                  }}
                  className="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                >
                  Déconnexion
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(prev => !prev)}
            className="md:hidden mobile-toggle"
            aria-label="Menu"
          >
            <FontAwesomeIcon icon={isOpen ? faXmark : faBars} className="text-2xl" />
          </button>
        </div>
      </div>

      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-[#f5f3eb] px-4 pb-4`}
      >
        <form onSubmit={handleSearchSubmit} className="flex gap-2 pb-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full text-sm px-2 py-1 border rounded"
          />
          <button type="submit" className="text-[#3C4F46]">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>

        <ul className="flex flex-col gap-4 text-sm font-medium pt-2">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Produits</Link></li>
          <li><Link to="/about">À propos</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          {isAuthenticated && <li>Bienvenue, {user?.firstname || "Utilisateur"}</li>}
          {isAuthenticated && role === "USER" && <li><Link to="/dashboard">Mon espace</Link></li>}
          {isAuthenticated && role === "ADMIN" && <li><Link to="/admin">Admin Panel</Link></li>}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

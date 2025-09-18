import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";


export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Erreur côté serveur");

      alert("Message envoyé avec succès !");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      alert("Échec de l'envoi. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen px-6 py-12 md:px-20 lg:px-40">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-green-800 mb-10 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Contactez-nous
        </motion.h1>

        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 grid md:grid-cols-2 gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Votre nom"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Votre email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Votre message"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Envoi..." : "Envoyer"}
            </button>
          </form>

          {/* Infos de contact */}
          <div className="space-y-6 text-green-900">
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 mt-1 text-green-700" />
              <div>
                <h3 className="font-semibold">Téléphone</h3>
                <p>+33 1 23 45 67 89</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 mt-1 text-green-700" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>contact@plantelys.fr</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 mt-1 text-green-700" />
              <div>
                <h3 className="font-semibold">Adresse</h3>
                <p>123 rue des Fougères, 75000 Paris</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

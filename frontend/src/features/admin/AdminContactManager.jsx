import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminContactManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const res = await axios.get("/api/admin/contact", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Erreur chargement messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) return <p className="p-6">Chargement des messages...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Messages reçus</h1>
      {messages.length === 0 ? (
        <p>Aucun message pour le moment.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li key={msg.id} className="bg-white p-4 rounded-xl shadow">
              <p><strong>De :</strong> {msg.name} ({msg.email})</p>
              <p><strong>Message :</strong> {msg.message}</p>
              <p className="text-sm text-gray-500">{new Date(msg.sentAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

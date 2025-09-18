import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

const AdminReminderManager = () => {
  const { token } = useContext(AuthContext);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await axios.get("/api/admin/reminders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReminders(res.data);
      } catch (err) {
        console.error("Erreur chargement rappels :", err);
      }
    };

    fetchReminders();
  }, [token]);

  const formatDate = (isoDateStr) => {
    const date = new Date(isoDateStr);
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Rappels d’arrosage</h2>
      {reminders.length === 0 ? (
        <p>Aucun rappel prévu.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>Plante</th>
              <th>Client</th>
              <th>Fréquence</th>
              <th>Prochain rappel</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((r, index) => (
              <tr key={index} className="border-t text-sm text-gray-800">
                <td>{r.plantName || "?"}</td>
                <td>
                  <div className="font-medium">{r.userName || "?"}</div>
                  <div className="text-gray-500">{r.userEmail || "?"}</div>
                </td>
                <td>{r.frequencyPerWeek}× / semaine</td>
                <td>{formatDate(r.nextReminder)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReminderManager;

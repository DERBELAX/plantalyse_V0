import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

const MyReminders = () => {
  const { token } = useContext(AuthContext);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
     console.log("Token utilisé pour les rappels :", token);

  if (!token) return;
    axios
      .get("/api/reminders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReminders(res.data))
      .catch((err) => console.error("Erreur chargement rappels", err));
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Mes rappels d’arrosage</h2>
      {reminders.length === 0 ? (
        <p>Aucun rappel prévu.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>Plante</th>
              <th>Fréquence</th>
              <th>Prochain rappel</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((r, i) => (
              <tr key={i} className="border-t">
                <td>{r.plantName}</td>
                <td>{r.frequencyPerWeek}× / semaine</td>
                <td>{new Date(r.nextReminder).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyReminders;

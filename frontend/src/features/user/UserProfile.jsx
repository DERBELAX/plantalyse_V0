import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  const [emailData, setEmailData] = useState({
    email: "",
    password: "",       // nouveau mot de passe
    oldPassword: "",    // mot de passe actuel requis
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Erreur lors de la récupération des infos utilisateur.");
        const data = await response.json();
        setUser({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          email: data.email || "",
        });
        setEmailData((prev) => ({ ...prev, email: data.email }));
      } catch (err) {
        setMessage(err.message);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour.");
      setMessage("Profil mis à jour !");
      setEditMode(false);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleEmailPasswordChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handleEmailPasswordUpdate = async () => {
    const token = localStorage.getItem("token");

    if (!emailData.oldPassword) {
      setUpdateMessage("Veuillez saisir votre mot de passe actuel.");
      return;
    }

    try {
      const res = await fetch("/api/users/update-email-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(emailData),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Erreur lors de la mise à jour.");
      }

      setUpdateMessage("Email ou mot de passe mis à jour !");
      setEmailData({ ...emailData, password: "", oldPassword: "" });
    } catch (err) {
      setUpdateMessage(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Profil personnel</h2>

      {message && <p className="text-sm text-red-600">{message}</p>}

      <div className="space-y-2">
        <label>Prénom</label>
        <input
          type="text"
          name="firstname"
          value={user.firstname}
          disabled={!editMode}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <label>Nom</label>
        <input
          type="text"
          name="lastname"
          value={user.lastname}
          disabled={!editMode}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <label>Email</label>
        <input
          type="email"
          value={user.email}
          disabled
          className="border p-2 rounded w-full bg-gray-100"
        />
      </div>

      <div className="flex gap-4 mt-4">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Modifier
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Sauvegarder
          </button>
        )}
      </div>

      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Modifier l’email ou le mot de passe</h3>

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={emailData.email}
          onChange={handleEmailPasswordChange}
          className="border p-2 rounded w-full"
        />

        <label className="mt-2">Nouveau mot de passe</label>
        <input
          type="password"
          name="password"
          value={emailData.password}
          onChange={handleEmailPasswordChange}
          className="border p-2 rounded w-full"
        />

        <label className="mt-2">Mot de passe actuel *</label>
        <input
          type="password"
          name="oldPassword"
          value={emailData.oldPassword}
          onChange={handleEmailPasswordChange}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleEmailPasswordUpdate}
          className="mt-3 bg-blue-600 text-white py-2 px-4 rounded"
        >
          Mettre à jour
        </button>

        {updateMessage && <p className="mt-2 text-sm text-green-600">{updateMessage}</p>}
      </div>
    </div>
  );
};

export default UserProfile;

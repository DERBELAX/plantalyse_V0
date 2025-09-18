import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

const AdminUserManager = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Utilisateurs chargés :", res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur chargement utilisateurs", err.response || err);
      alert(`Erreur chargement utilisateurs: ${err.response?.status}`);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [token, fetchUsers]);

  const resetForm = () => {
    setFirstname("");
    setLastname("");
    setEmail("");
    setRoles([]);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editId) return;

    const userPayload = {
      firstname,
      lastname,
      email,
      roles: roles.join(","),
    };

    try {
      await axios.put(
        `/api/admin/users/${editId}`,
        userPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Utilisateur modifié");
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error("Erreur modification utilisateur", err);
      alert("Erreur lors de la modification");
    }
  };

  const handleEdit = (user) => {
    setFirstname(user.firstname);
    setLastname(user.lastname);
    setEmail(user.email);
    setRoles(Array.isArray(user.roles) ? user.roles : [user.roles]);
    setEditId(user.id_user); 
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;

    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Erreur suppression utilisateur", err);
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) return <p className="text-center">Chargement...</p>;

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      {editId && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded p-4 space-y-4"
        >
          <h2 className="text-xl font-semibold">Modifier un utilisateur</h2>

          <input
            type="text"
            placeholder="Prénom"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Nom"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <select
            multiple
            value={roles}
            onChange={(e) =>
              setRoles(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
            className="w-full border p-2 rounded"
          >
            <option value="USER">Utilisateur</option>
            <option value="ADMIN">Administrateur</option>
          </select>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {Array.isArray(users) &&
          users.map((user) => (
            <div
              key={user.id_user} 
              className="bg-white shadow rounded p-4 flex flex-col gap-2"
            >
              <h3 className="font-semibold text-lg">
                {user.firstname} {user.lastname}
              </h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                Rôles :{" "}
                {Array.isArray(user.roles)
                  ? user.roles.join(", ")
                  : user.roles}
              </p>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-blue-600"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(user.id_user)} 
                  className="text-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminUserManager;

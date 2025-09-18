import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#00C49F", "#FF8042", "#0088FE", "#FFBB28", "#8884d8", "#a83279"];

function AdminDashboardOverview() {
  const [plantData, setPlantData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    axios.get("/api/plants").then((res) => {
      setPlantData(res.data);

      // Calcul des catégories
      const catMap = {};
      res.data.forEach((plant) => {
        const cat = plant.category?.name || "Non catégorisé";
        catMap[cat] = (catMap[cat] || 0) + 1;
      });

      const catArray = Object.keys(catMap).map((name, i) => ({
        name,
        value: catMap[name],
        color: COLORS[i % COLORS.length],
      }));

      setCategoryData(catArray);
    });
  }, []);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Stock par plante */}
      <div className="bg-white shadow-md rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4">Stock par plante</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={plantData}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stock" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Répartition par catégorie */}
      <div className="bg-white shadow-md rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4">Plantes par catégorie</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminDashboardOverview;

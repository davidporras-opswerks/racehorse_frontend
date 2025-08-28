import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Races() {
  const { fetchWithAuth, logout } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchWithAuth("/races/")
      .then((data) => setItems(data.results || data))
      .catch((err) => {
        console.error(err);
        logout(); // auto logout if refresh fails
      });
  }, [fetchWithAuth, logout]);

  return (
    <div>
      <h1>Races</h1>
      <ul>
        {items.map((race) => (
          <li key={race.id}>{race.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Races;

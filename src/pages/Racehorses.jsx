import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Racehorses() {
  const { fetchWithAuth, logout } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchWithAuth("/racehorses/")
      .then((data) => setItems(data.results || data))
      .catch((err) => {
        console.error(err);
        logout(); // auto logout if refresh fails
      });
  }, [fetchWithAuth, logout]);

  return (
    <div>
      <h1>Racehorses</h1>
      <ul>
        {items.map((horse) => (
          <li key={horse.id}>{horse.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Racehorses;

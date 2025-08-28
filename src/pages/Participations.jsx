import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Participations() {
  const { fetchWithAuth, logout } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchWithAuth("/participations/")
      .then((data) => setItems(data.results || data))
      .catch((err) => {
        console.error(err);
        logout(); // auto logout if refresh fails
      });
  }, [fetchWithAuth, logout]);

  return (
    <div>
      <h1>Participations</h1>
      <ul>
        {items.map((participation) => (
          <li key={participation.id}>{participation.racehorse_name} at {participation.race_name} - Position: {participation.position}</li>
        ))}
      </ul>
    </div>
  );
}

export default Participations;

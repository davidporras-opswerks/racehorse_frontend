import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Jockeys() {
  const { fetchWithAuth, logout } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchWithAuth("/jockeys/")
      .then((data) => setItems(data.results || data))
      .catch((err) => {
        console.error(err);
        logout(); // auto logout if refresh fails
      });
  }, [fetchWithAuth, logout]);

  return (
    <div>
      <h1>Jockeys</h1>
      <ul>
        {items.map((jockey) => (
          <li key={jockey.id}>{jockey.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Jockeys;

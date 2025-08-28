import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AddRacehorseModal from "../components/AddRacehorseModal";

function Racehorses() {
  const { fetchWithAuth, logout , user} = useAuth();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

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
      {user && (
        <button onClick={() => setShowModal(true)}>➕ Add Racehorse</button>
      )}
      <ul>
        {items.map((horse) => (
          <li key={horse.id}>{horse.name}</li>
        ))}
      </ul>
      {showModal && (
        <AddRacehorseModal
          onClose={() => setShowModal(false)}
          onSuccess={(newHorse) => {
            setItems([...items, newHorse]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

export default Racehorses;

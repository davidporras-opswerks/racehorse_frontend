import { createContext, useContext, useEffect, useState } from "react";
import { fetchWithAuth } from "../api/auth";
import { jwtDecode } from "jwt-decode"; // fixed import

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // will now include avatar
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.user_id;
        
        // fetch full user profile including avatar
        fetchWithAuth(`/users/${userId}/`)
          .then((data) => {
            setUser({ ...decoded, avatar: data.avatar || null });
          })
          .catch((err) => {
            console.error("Failed to fetch user profile", err);
            setUser(decoded); // fallback to token data
          });
      } catch (err) {
        console.error("Invalid token in localStorage", err);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Invalid credentials");

    const data = await res.json();
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    const decoded = jwtDecode(data.access);

    // fetch full user profile
    fetchWithAuth(`/users/${decoded.user_id}/`)
      .then((profile) => {
        setUser({ ...decoded, avatar: profile.avatar || null });
      })
      .catch(() => setUser(decoded));
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchWithAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

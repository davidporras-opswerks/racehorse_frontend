import { createContext, useContext, useEffect, useState } from "react";
import { fetchWithAuth } from "../api/auth";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // store decoded user info
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, check if we already have tokens
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // this contains user_id, is_admin, exp, etc.
        console.log(decoded)
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

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await res.json();
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    const decoded = jwtDecode(data.access);
    console.log(decoded)
    setUser(decoded); // store token claims (user_id, is_admin, etc.)
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

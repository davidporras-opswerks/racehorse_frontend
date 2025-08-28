// src/api/auth.js

const API_BASE = "http://127.0.0.1:8000/api";

export async function fetchWithAuth(endpoint, options = {}) {
  let token = localStorage.getItem("access");

  let res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  // If token expired, try refresh
  if (res.status === 401) {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
      throw new Error("No refresh token available");
    }

    const refreshRes = await fetch(`${API_BASE}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      localStorage.setItem("access", refreshData.access);

      // Retry original request with new token
      token = refreshData.access;
      res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });
    } else {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      throw new Error("Session expired, please log in again");
    }
  }

  return res.json();
}

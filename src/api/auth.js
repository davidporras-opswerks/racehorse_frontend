const API_BASE = "http://127.0.0.1:8000/api";

export async function fetchWithAuth(endpoint, options = {}) {
  let token = localStorage.getItem("access");

  // Start headers empty
  const headers = {
    ...options.headers,
  };

  // Only set JSON Content-Type if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log("Sending request with Bearer token:", token);
    console.log("Sending body:", options.body);
  }

  let res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Refresh handling unchanged
  if (token && res.status === 401) {
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

      token = refreshData.access;
      headers.Authorization = `Bearer ${token}`;

      res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });
    } else {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      throw new Error("Session expired, please log in again");
    }
  }

  return res.json();
}

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  if (!user?.is_admin) {
    return <p>⛔ You are not authorized to access this page.</p>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage("✅ User registered successfully!");
        setForm({ username: "", email: "", password: "" });
      } else {
        const errorData = await res.json();
        setMessage("❌ Error: " + JSON.stringify(errorData));
      }
    } catch (err) {
      setMessage("❌ Network error: " + err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Register New User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;

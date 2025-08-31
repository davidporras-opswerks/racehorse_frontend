import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

function Register() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "", // new field
    avatar: null,
  });
  const [message, setMessage] = useState("");

  if (!user?.is_admin) {
    return <p>⛔ You are not authorized to access this page.</p>;
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setForm({ ...form, avatar: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password match
    if (form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    const token = localStorage.getItem("access");

    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("password", form.password);
    if (form.avatar) formData.append("avatar", form.avatar);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setMessage("✅ User registered successfully!");
        setForm({ username: "", email: "", password: "", confirmPassword: "", avatar: null });
      } else {
        const errorData = await res.json();
        setMessage("❌ Error: " + JSON.stringify(errorData));
      }
    } catch (err) {
      setMessage("❌ Network error: " + err.message);
    }
  };

  return (
    <div className="register-page">
      <div className="form-container">
        <h2>Register New User</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
          <input type="file" name="avatar" accept="image/*" onChange={handleChange} />
          <button type="submit">Register</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Register;

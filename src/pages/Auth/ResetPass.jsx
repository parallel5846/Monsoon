import { useState } from "react";
import "./Auth.css";

export default function ResetPass() {
  const [form, setForm] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://monsoon-jqgy.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✓ Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        setForm({ username: "", oldPassword: "", newPassword: "" });
      } else {
        setMessage(`✗ ${data.message}`);
      }
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={form.username}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <input
          type="password"
          name="oldPassword"
          placeholder="Enter old password"
          value={form.oldPassword}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <input
          type="password"
          name="newPassword"
          placeholder="Enter new password"
          value={form.newPassword}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-links">
          <a href="/">Back to Login</a>
        </p>
      </form>
    </div>
  );
}
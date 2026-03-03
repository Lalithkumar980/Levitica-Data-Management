import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ROLES = [
  { value: "", label: "Select role" },
  { value: "admin", label: "Admin" },
  { value: "hr_management", label: "HR Management" },
  { value: "sales_Manager", label: "Sales Manager" },
  { value: "finance_management", label: "Finance Management" },
  { value: "sales_representative", label: "Sales Representative" },
];

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const isRoleSelected = formData.role !== "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If role changes → reset email & password
    if (name === "role") {
      setFormData({ role: value, email: "", password: "" });
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const roleEntry = ROLES.find((r) => r.value === formData.role);
    const roleLabel = roleEntry ? roleEntry.label : "Enterprise";
    try {
      localStorage.setItem("levitica_user_role", roleLabel);
    } catch (_) {}

    if (formData.role === "admin") return navigate("/admin");
    if (formData.role === "hr_management") return navigate("/dashboard");
    if (formData.role === "finance_management") return navigate("/finance");
    if (formData.role === "sales_Manager" || formData.role === "sales_representative") return navigate("/sales");

    console.log("Sign in", formData);
  };

  const handleChangeRole = () => {
    setFormData({ role: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* LOGO + TITLE */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/assets/logo.png"
            alt="Levitica"
            className="h-14 mb-3 object-contain"
          />
          <h1 className="text-xl font-semibold text-gray-800">
            Levitica Data Management
          </h1>
          <p className="text-sm text-gray-500">
            Data &amp; Analytics Platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* STEP 1 → ROLE SELECTION */}
          {!isRoleSelected && (
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value} disabled={!r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* STEP 2 → LOGIN FORM */}
          {isRoleSelected && (
            <>
              {/* CHANGE ROLE BUTTON */}
              <button
                type="button"
                onClick={handleChangeRole}
                className="text-xs text-gray-500 hover:underline"
              >
                ← Change Role
              </button>

              {/* EMAIL */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">
                  Password
                </label>

                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

             

              {/* SIGN IN BUTTON */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              >
                Sign In →
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
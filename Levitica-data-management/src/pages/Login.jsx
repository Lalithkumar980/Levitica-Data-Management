import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ROLES = [
  { value: "", label: "Select role" },
  { value: "admin", label: "Admin" },
  { value: "hr_management", label: "HR Management" },
  { value: "sales_representative", label: "Sales Representative" },
  { value: "finance_management", label: "Finance Management" },
];

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ role: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // When Admin logs in, open Admin CRM Dashboard (Sales Overview)
    if (formData.role === "admin") {
      navigate("/admin");
      return;
    }
    // When HR Management logs in, open HR Dashboard
    if (formData.role === "hr_management") {
      navigate("/dashboard");
      return;
    }
    // When Finance Management logs in, open Finance Dashboard
    if (formData.role === "finance_management") {
      navigate("/finance");
      return;
    }
    // When Sales Representative logs in, open Sales Dashboard
    if (formData.role === "sales_representative") {
      navigate("/sales");
      return;
    }
    // Placeholder: add your auth logic for other roles
    console.log("Sign in", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-light">
      {/* Login card - dvskillhub theme: white card, soft shadow, rounded */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-sm border border-gray-100 p-8 sm:p-10">
        {/* Logo + title - brand colors */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center text-white font-bold text-lg shadow-sm">
            LD
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-dark">Levitica Data Management</h1>
            <p className="text-xs text-body">
              Data &amp; Analytics Platform
            </p>
          </div>
        </div>

        {/* Form - dvskillhub-style: labels above, bg-blue-50 / brand-soft inputs, focus:ring-brand */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-medium text-body uppercase tracking-wider mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-brand-soft border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition appearance-none cursor-pointer"
              required
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value} disabled={!r.value} className="bg-white text-gray-900">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-body uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl bg-brand-soft border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-body uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl bg-brand-soft border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition pr-24"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-body hover:text-brand transition"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-brand font-semibold hover:text-brand-dark transition"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full h-12 px-8 rounded-xl bg-brand hover:bg-brand-dark text-white font-semibold shadow-sm transition flex items-center justify-center gap-2"
          >
            Sign In
            <span aria-hidden>→</span>
          </button>
        </form>
      </div>
    </div>
  );
}

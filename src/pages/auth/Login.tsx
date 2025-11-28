import React, { useState } from "react";
import { z } from "zod";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { roleName } from "../../utils/constants/env";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(2, "Username must be at least 2 characters"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type FormErrors = Partial<Record<keyof LoginFormData, string>>;

function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<
    Partial<Record<keyof LoginFormData, boolean>>
  >({});
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const fieldSchema = loginSchema.pick({ [name]: true as any });
    const result = fieldSchema.safeParse({
      [name]: formData[name as keyof LoginFormData],
    });

    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        [name]: result.error.issues[0]?.message || "Invalid input",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof LoginFormData;
        newErrors[path] = issue.message;
      });

      setErrors(newErrors);
      setTouched({
        username: true,
        password: true,
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const loggedInUser = await login(
        result.data.username,
        result.data.password
      );
      toast.success("Login successful!");

      if (loggedInUser && loggedInUser.role === roleName.admin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1A2F] to-[#10263F] flex items-center justify-center px-4 py-10 font-manrope relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -left-20 w-96 h-96 bg-[#1E88E5]/20 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-[#42A5F5]/20 blur-[150px] rounded-full"></div>
      </div>

      {/* Login Card */}
      <div className="relative bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="steam karnival" className="w-28 h-auto mb-4" />

          <h1 className="text-3xl font-extrabold text-white tracking-wide">
            Login
          </h1>

          <p className="text-gray-300 text-sm mt-1">
            Welcome back! Let's continue.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {/* USERNAME FLOATING LABEL */}
          <div className="relative">
            <input
              id="username"
              name="username"
              placeholder=" "
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              className={`w-full bg-white/5 border 
                ${
                  errors.username && touched.username
                    ? "border-red-500"
                    : "border-white/10"
                }
                text-white rounded-md px-4 py-3 peer
                focus:outline-none focus:ring-2 focus:ring-[#42A5F5]
                placeholder-transparent`}
            />

            <label
              htmlFor="username"
              className={`
                absolute left-3 pointer-events-none transition-all duration-200
                ${
                  formData.username
                    ? "top-[-14px] text-xs text-[#90CAF9]  px-2 py-[5px] rounded-md"
                    : "top-3 text-base text-gray-300"
                }
                peer-focus:top-[-14px] peer-focus:text-xs peer-focus:text-[#90CAF9]
                 peer-focus:px-2 peer-focus:py-[2px] peer-focus:rounded-md peer-focus:bg-[#0A1A2F]
              `}
            >
              Email
            </label>

            {errors.username && touched.username && (
              <p className="text-sm text-red-400 mt-1">{errors.username}</p>
            )}
          </div>

          {/* PASSWORD FLOATING LABEL */}
          <div className="relative">
            <input
              id="password"
              name="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              type="password"
              className={`w-full bg-white/5 border 
                ${
                  errors.password && touched.password
                    ? "border-red-500"
                    : "border-white/10"
                }
                text-white rounded-md px-4 py-3 peer
                focus:outline-none focus:ring-2 focus:ring-[#42A5F5]
                placeholder-transparent`}
            />

            <label
              htmlFor="password"
              className={`
                absolute left-3 pointer-events-none transition-all duration-200
                ${
                  formData.password
                    ? "top-[-14px] text-xs text-[#90CAF9] px-2 py-[5px] rounded-md"
                    : "top-3 text-base text-gray-300"
                }
                peer-focus:top-[-14px] peer-focus:text-xs peer-focus:text-[#90CAF9]
                peer-focus:bg-[#0A1A2F] peer-focus:px-2 peer-focus:py-[2px] peer-focus:rounded-md
              `}
            >
              Password
            </label>

            {errors.password && touched.password && (
              <p className="text-sm text-red-400 mt-1">{errors.password}</p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="
              w-full bg-[#1E88E5] hover:bg-[#42A5F5] 
              transition-all font-semibold text-white 
              rounded-xl py-3 shadow-lg shadow-[#1E88E5]/30 
              flex justify-center items-center gap-2
            "
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                Login...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <span className="text-sm text-gray-300">
            Don't have an account?{" "}
            <Link
              to={"/register"}
              className="text-[#42A5F5] font-semibold hover:underline"
            >
              Register Here
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;

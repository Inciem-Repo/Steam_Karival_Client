import React, { useState } from "react";
import { z } from "zod";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { roleName } from "../../utils/constants/env";

// Define the validation schema with Zod
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
      console.log({ loggedInUser });
      toast.success("Login successful!");
      if (loggedInUser && loggedInUser.role === roleName.admin) {
        navigate("/admin/dashboard");
      } else {
        loggedInUser?.isPaid ? navigate("/") : navigate("/payment");
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center p-4 font-manrope">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between my-8">
          <h1 className="text-2xl font-bold text-center text-black">Login</h1>
          <img src={logo} alt="steam karnival" className="w-30 h-20" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="username" className="block mb-2 font-body-semibold">
              Email
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter Your email"
              className={`w-full input ${
                errors.username && touched.username ? "border-red-500" : ""
              }`}
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.username && touched.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 font-body-semibold">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter Your Password"
              className={`w-full input ${
                errors.password && touched.password ? "border-red-500" : ""
              }`}
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && touched.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full btn flex justify-center items-center gap-2"
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

        <div className="text-center mt-6 font-body-regular">
          <span className="text-sm text-gray-600">
            Don't Have an Account?{" "}
            <Link to={"/register"} className="font-semibold hover:underline">
              Register Here
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;

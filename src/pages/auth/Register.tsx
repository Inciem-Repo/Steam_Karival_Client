import { useState } from "react";
import { z } from "zod";
import logo from "../../assets/images/logo.png";
import { useApi } from "../../hooks/useApi";
import { registerService } from "../../services/auth";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

// Define the validation schema with Zod
const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\d{10}$/, "Phone number must be 10 digits"),
    school: z
      .string()
      .min(1, "School is required")
      .min(2, "School name must be at least 2 characters")
      .regex(/^[A-Za-z\s]+$/, "School Name can only contain letters"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;
type FormErrors = Partial<Record<keyof RegisterFormData, string>>;

const Register = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    phone: "",
    school: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof RegisterFormData, boolean>>
  >({});
  const { callApi, loading } = useApi(registerService);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof RegisterFormData]) {
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
    const fieldSchema = registerSchema.pick({ [name]: true as any });
    const result = fieldSchema.safeParse({
      [name]: formData[name as keyof RegisterFormData],
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
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof RegisterFormData;
        newErrors[path] = issue.message;
      });

      setErrors(newErrors);
      setTouched({
        name: true,
        email: true,
        phone: true,
        school: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }
    setErrors({});
    const userData = {
      name: result.data.name,
      email_id: result.data.email,
      phone: result.data.phone.startsWith("+91-")
        ? result.data.phone
        : `+91-${result.data.phone.replace(/\D/g, "")}`,
      school: result.data.school,
      password: result.data.password,
      confirm_password: result.data.confirmPassword,
    };
    try {
      await callApi(userData);
      toast.success("Registration successful!");
      navigate("/login");
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-manrope">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between my-8">
          <h1 className="text-2xl font-bold text-center text-black">
            Register
          </h1>
          <img src={logo} alt="steam karnival" className="w-30 h-20" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="name" className="block mb-2 font-body-semibold">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter Your Name"
              className={`w-full input ${
                errors.name && touched.name ? "border-red-500" : ""
              }`}
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-body-semibold">
              Email ID
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter Your Email ID"
              className={`w-full input ${
                errors.email && touched.email ? "border-red-500" : ""
              }`}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block mb-2 font-body-semibold">
              Phone Number
            </label>
            <div className="flex gap-2">
              <div className="flex items-center input">
                <span className="text-sm text-gray-600">+91</span>
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter Your Phone Number"
                className={`flex-1 input ${
                  errors.phone && touched.phone ? "border-red-500" : ""
                }`}
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {errors.phone && touched.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="school" className="block mb-2 font-body-semibold">
              School
            </label>
            <input
              id="school"
              name="school"
              type="text"
              placeholder="Enter Your School"
              className={`w-full input ${
                errors.school && touched.school ? "border-red-500" : ""
              }`}
              value={formData.school}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.school && touched.school && (
              <p className="mt-1 text-sm text-red-600">{errors.school}</p>
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 font-body-semibold"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Your Password"
              className={`w-full input ${
                errors.confirmPassword && touched.confirmPassword
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="text-center mt-6 font-body-regular">
          <span className="text-sm text-gray-600">
            Already Have an Account?{" "}
            <Link to={"/login"} className="font-semibold hover:underline">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;

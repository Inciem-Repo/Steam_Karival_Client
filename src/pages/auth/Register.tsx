import { useState } from "react";
import { z } from "zod";
import { useApi } from "../../hooks/useApi";
import { registerService } from "../../services/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

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
      .regex(
        /^[A-Za-z\s'&\-.(),]+$/,
        "School name can only contain letters and allowed special characters"
      ),

    password: z
      .string()
      .min(1, "Password is required")
      .regex(/^\S+$/, "Password cannot contain spaces"),

    confirmPassword: z
      .string()
      .min(1, "Confirm password is required")
      .regex(/^\S+$/, "Password cannot contain spaces"),
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1A2F] to-[#10263F] flex items-center justify-center px-4 py-10 font-manrope relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#1E88E5]/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#42A5F5]/20 blur-3xl rounded-full"></div>
      </div>
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-wide">
            Create Your Account
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Join the competition and start your journey
          </p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit} noValidate>
          {/* NAME */}
          <div className="relative">
            <input
              id="name"
              name="name"
              placeholder=" "
              type="text"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-white/5 border 
              ${
                errors.name && touched.name
                  ? "border-red-500"
                  : "border-white/10"
              }
              text-white rounded-lg px-4 py-3 peer 
              focus:outline-none focus:ring-2 focus:ring-[#42A5F5] 
              placeholder-transparent`}
            />

            <label
              htmlFor="name"
              className={`
              absolute left-3 text-gray-300 transition-all duration-200 pointer-events-none
              ${
                formData.name
                  ? "top-[-9px] text-xs px-1 text-[#90CAF9]"
                  : "top-3 text-base"
              }
              peer-focus:top-[-9px] peer-focus:text-xs peer-focus:text-[#90CAF9] peer-focus:bg-[#0A1A2F] px-1
            `}
            >
              Name
            </label>

            {errors.name && touched.name && (
              <p className="text-sm text-red-400 mt-1">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div className="relative">
            <input
              id="email"
              name="email"
              placeholder=" "
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-white/5 border 
              ${
                errors.email && touched.email
                  ? "border-red-500"
                  : "border-white/10"
              }
              text-white rounded-lg px-4 py-3 peer 
              focus:outline-none focus:ring-2 focus:ring-[#42A5F5]
              placeholder-transparent`}
            />

            <label
              htmlFor="email"
              className={`
              absolute left-3 text-gray-300 transition-all duration-200 pointer-events-none
              ${
                formData.email
                  ? "top-[-9px] text-xs  px-1 text-[#90CAF9]"
                  : "top-3 text-base"
              }
              peer-focus:top-[-9px] peer-focus:text-xs peer-focus:text-[#90CAF9] peer-focus:bg-[#0A1A2F]  px-1
            `}
            >
              Email
            </label>

            {errors.email && touched.email && (
              <p className="text-sm text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* PHONE NUMBER */}
          <div className="flex gap-2">
            {/* COUNTRY CODE */}
            <div className="relative w-20">
              <input
                disabled
                value="+91"
                className="w-full bg-white/5 border border-white/10 text-gray-300 rounded-lg px-4 py-3"
              />
              <label className="absolute left-3 -top-2 text-xs text-gray-400  px-1">
                Code
              </label>
            </div>

            {/* MAIN PHONE FIELD */}
            <div className="relative flex-1">
              <input
                id="phone"
                name="phone"
                placeholder=" "
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-white/5 border 
                ${
                  errors.phone && touched.phone
                    ? "border-red-500"
                    : "border-white/10"
                }
                text-white rounded-lg px-4 py-3 peer 
                focus:outline-none focus:ring-2 focus:ring-[#42A5F5]
                placeholder-transparent`}
              />

              <label
                htmlFor="phone"
                className={`
                absolute left-3 text-gray-300 transition-all duration-200 pointer-events-none
                ${
                  formData.phone
                    ? "top-[-9px] text-xs  px-1 text-[#90CAF9]"
                    : "top-3 text-base"
                }
                peer-focus:top-[-9px] peer-focus:text-xs peer-focus:text-[#90CAF9] peer-focus:bg-[#0A1A2F]  px-1
              `}
              >
                Phone Number
              </label>

              {errors.phone && touched.phone && (
                <p className="text-sm text-red-400 mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* SCHOOL */}
          <div className="relative">
            <input
              id="school"
              name="school"
              placeholder=" "
              type="text"
              value={formData.school}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-white/5 border 
              ${
                errors.school && touched.school
                  ? "border-red-500"
                  : "border-white/10"
              }
              text-white rounded-lg px-4 py-3 peer 
              focus:outline-none focus:ring-2 focus:ring-[#42A5F5]
              placeholder-transparent`}
            />

            <label
              htmlFor="school"
              className={`
              absolute left-3 text-gray-300 transition-all duration-200 pointer-events-none
              ${
                formData.school
                  ? "top-[-9px] text-xs  px-1 text-[#90CAF9]"
                  : "top-3 text-base"
              }
              peer-focus:top-[-9px] peer-focus:text-xs peer-focus:text-[#90CAF9] peer-focus:bg-[#0A1A2F]  px-1
            `}
            >
              School
            </label>

            {errors.school && touched.school && (
              <p className="text-sm text-red-400 mt-1">{errors.school}</p>
            )}
          </div>

          {/* PASSWORD + CONFIRM PASSWORD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PASSWORD */}
            <div className="relative">
              <input
                id="password"
                name="password"
                placeholder=" "
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-white/5 border 
                ${
                  errors.password && touched.password
                    ? "border-red-500"
                    : "border-white/10"
                }
                text-white rounded-lg px-4 py-3 peer 
                focus:outline-none focus:ring-2 focus:ring-[#42A5F5]
                placeholder-transparent pr-10`}
              />

              <label
                htmlFor="password"
                className={`
                absolute left-3 text-gray-300 transition-all duration-200 pointer-events-none
                ${
                  formData.password
                    ? "top-[-9px] text-xs  px-1 text-[#90CAF9]"
                    : "top-3 text-base"
                }
                peer-focus:top-[-9px] peer-focus:text-xs peer-focus:text-[#90CAF9] peer-focus:bg-[#0A1A2F]  px-1
              `}
              >
                Password
              </label>

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 flex items-center transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              {errors.password && touched.password && (
                <p className="text-sm text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                placeholder=" "
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-white/5 border 
                ${
                  errors.confirmPassword && touched.confirmPassword
                    ? "border-red-500"
                    : "border-white/10"
                }
                text-white rounded-lg px-4 py-3 peer 
                focus:outline-none focus:ring-2 focus:ring-[#42A5F5]
                placeholder-transparent pr-10`}
              />

              <label
                htmlFor="confirmPassword"
                className={`
                absolute left-3 text-gray-300 transition-all duration-200 pointer-events-none
                ${
                  formData.confirmPassword
                    ? "top-[-9px] text-xs  px-1 text-[#90CAF9]"
                    : "top-3 text-base"
                }
                peer-focus:top-[-9px] peer-focus:text-xs peer-focus:text-[#90CAF9] peer-focus:bg-[#0A1A2F]  px-1
              `}
              >
                Confirm Password
              </label>

              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform flex items-center -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-[#1E88E5] flex items-center justify-center gap-3 hover:bg-[#42A5F5] transition-all font-semibold text-white rounded-xl py-3 shadow-lg shadow-[#1E88E5]/20"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                Please Wait...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-300 text-sm mt-6">
          Already registered?{" "}
          <a
            href="/login"
            className="text-[#90CAF9] font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;

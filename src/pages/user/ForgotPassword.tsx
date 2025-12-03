import React, { useState, useRef, useEffect } from "react";
import { z } from "zod";
import logo from "../../assets/images/logo.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Key } from "lucide-react";
import { useApi } from "../../hooks/useApi";
import {
  forgetPasswordSendOTP,
  updatePassword,
  verifySendOTP,
} from "../../services/auth";

// Validation schemas
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

const passwordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type EmailFormData = z.infer<typeof emailSchema>;
type OTPFormData = z.infer<typeof otpSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type EmailErrors = Partial<Record<keyof EmailFormData, string>>;
type OTPErrors = Partial<Record<keyof OTPFormData, string>>;
type PasswordErrors = Partial<Record<keyof PasswordFormData, string>>;

function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [emailFormData, setEmailFormData] = useState<EmailFormData>({
    email: "",
  });
  const [otpFormData, setOtpFormData] = useState<OTPFormData>({
    otp: "",
  });
  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>({
    password: "",
    confirmPassword: "",
  });
  const [emailErrors, setEmailErrors] = useState<EmailErrors>({});
  const [otpErrors, setOtpErrors] = useState<OTPErrors>({});
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{
    email?: boolean;
    otp?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
  }>({});
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { callApi: callSendOTP } = useApi(forgetPasswordSendOTP);
  const { callApi: callVerifyOTP } = useApi(verifySendOTP);
  const { callApi: callUpdatePassword } = useApi(updatePassword);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    otpInputRefs.current = otpInputRefs.current.slice(0, 6);
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (emailErrors[name as keyof EmailFormData]) {
      setEmailErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value) {
      const newOtp = otpFormData.otp.split("");
      newOtp[index] = value;
      const updatedOtp = newOtp.join("");
      setOtpFormData({ otp: updatedOtp });
      if (value && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const currentOtp = otpFormData.otp.split("");
      if (currentOtp[index]) {
        currentOtp[index] = "";
        setOtpFormData({ otp: currentOtp.join("") });
      } else if (index > 0) {
        otpInputRefs.current[index - 1]?.focus();
        currentOtp[index - 1] = "";
        setOtpFormData({ otp: currentOtp.join("") });
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      otpInputRefs.current[index + 1]?.focus();
    } else if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((pastedText) => {
        const pastedDigits = pastedText.replace(/\D/g, "").slice(0, 6);
        if (pastedDigits.length === 6) {
          setOtpFormData({ otp: pastedDigits });
          setTimeout(() => otpInputRefs.current[5]?.focus(), 0);
        }
      });
    }
  };
  const handleOtpFocus = (index: number) => {
    otpInputRefs.current[index]?.select();
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const pastedDigits = pastedText.replace(/\D/g, "").slice(0, 6);

    if (pastedDigits.length === 6) {
      setOtpFormData({ otp: pastedDigits });
      setTimeout(() => otpInputRefs.current[5]?.focus(), 0);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (passwordErrors[name as keyof PasswordFormData]) {
      setPasswordErrors((prev) => ({
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

    if (step === "email") {
      const fieldSchema = emailSchema.pick({ [name]: true as any });
      const result = fieldSchema.safeParse({
        [name]: emailFormData[name as keyof EmailFormData],
      });

      if (!result.success) {
        setEmailErrors((prev) => ({
          ...prev,
          [name]: result.error.issues[0]?.message || "Invalid input",
        }));
      } else {
        setEmailErrors((prev) => ({ ...prev, [name]: "" }));
      }
    } else if (step === "password") {
      const fieldSchema = passwordSchema.pick({ [name]: true as any });
      const result = fieldSchema.safeParse({
        [name]: passwordFormData[name as keyof PasswordFormData],
      });

      if (!result.success) {
        setPasswordErrors((prev) => ({
          ...prev,
          [name]: result.error.issues[0]?.message || "Invalid input",
        }));
      } else {
        setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleOtpBlur = () => {
    setTouched((prev) => ({
      ...prev,
      otp: true,
    }));

    const result = otpSchema.safeParse(otpFormData);
    if (!result.success) {
      setOtpErrors((prev) => ({
        ...prev,
        otp: result.error.issues[0]?.message || "Invalid OTP",
      }));
    } else {
      setOtpErrors((prev) => ({ ...prev, otp: "" }));
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = emailSchema.safeParse(emailFormData);

    if (!result.success) {
      const newErrors: EmailErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof EmailFormData;
        newErrors[path] = issue.message;
      });
      setEmailErrors(newErrors);
      setTouched({ email: true });
      return;
    }

    setLoading(true);
    try {
      const response = await callSendOTP(emailFormData);
      toast.success(response.message);
      setStep("otp");
      setCanResend(false);
      setResendTimer(30);
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = otpSchema.safeParse(otpFormData);

    if (!result.success) {
      const newErrors: OTPErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof OTPFormData;
        newErrors[path] = issue.message;
      });
      setOtpErrors(newErrors);
      setTouched({ otp: true });
      return;
    }

    setLoading(true);
    try {
      const response = await callVerifyOTP(
        emailFormData.email,
        otpFormData.otp
      );
      toast.success(response.message);
      setStep("password");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = passwordSchema.safeParse(passwordFormData);

    if (!result.success) {
      const newErrors: PasswordErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof PasswordFormData;
        newErrors[path] = issue.message;
      });
      setPasswordErrors(newErrors);
      setTouched({ password: true, confirmPassword: true });
      return;
    }

    setLoading(true);
    try {
      const response = await callUpdatePassword({
        email: emailFormData.email,
        new_password: passwordFormData.password,
      });
      toast.success(response.message);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      const response = await callSendOTP(emailFormData);
      toast.success(response.message);
      setCanResend(false);
      setResendTimer(30);
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtpFormData({ otp: "" });
    setOtpErrors({});
  };

  const handleBackToOtp = () => {
    setStep("otp");
    setPasswordFormData({ password: "", confirmPassword: "" });
    setPasswordErrors({});
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Get step titles and descriptions
  const getStepInfo = () => {
    switch (step) {
      case "email":
        return {
          title: "Forgot Password",
          description: "Enter your email to receive a password reset OTP",
        };
      case "otp":
        return {
          title: "Verify OTP",
          description: "Enter the 6-digit OTP sent to your email",
        };
      case "password":
        return {
          title: "Reset Password",
          description: "Create a new password for your account",
        };
      default:
        return {
          title: "Forgot Password",
          description: "",
        };
    }
  };
  const renderOtpInputs = () => {
    const otpDigits = otpFormData.otp.split("");
    const inputs = [];

    for (let i = 0; i < 6; i++) {
      inputs.push(
        <input
          key={i}
          ref={(el: any) => (otpInputRefs.current[i] = el)}
          name={`otp-${i}`}
          type="text"
          maxLength={1}
          value={otpDigits[i] || ""}
          onChange={(e) => handleOtpChange(e, i)}
          onKeyDown={(e) => handleOtpKeyDown(e, i)}
          onFocus={() => handleOtpFocus(i)}
          onPaste={handleOtpPaste}
          className={`
            w-12 h-12 text-center text-xl font-semibold
            bg-white/5 border border-white/10 rounded-lg
            text-white focus:outline-none focus:ring-2 focus:ring-[#42A5F5]
            ${otpErrors.otp && touched.otp ? "border-red-500" : ""}
            transition-colors duration-200
          `}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
        />
      );
    }

    return inputs;
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1A2F] to-[#10263F] flex items-center justify-center px-4 py-10 font-manrope relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -left-20 w-96 h-96 bg-[#1E88E5]/20 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-[#42A5F5]/20 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md">
        {/* Back button */}
        {(step === "otp" || step === "password") && (
          <button
            onClick={step === "otp" ? handleBackToEmail : handleBackToOtp}
            className="absolute top-6 left-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Back</span>
          </button>
        )}

        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="steam karnival" className="w-28 h-auto mb-4" />

          <h1 className="text-3xl font-extrabold text-white tracking-wide">
            {stepInfo.title}
          </h1>

          <p className="text-gray-300 text-sm mt-2 text-center">
            {stepInfo.description}
          </p>
        </div>

        {step === "email" ? (
          <form className="space-y-6" onSubmit={handleEmailSubmit} noValidate>
            {/* EMAIL FIELD */}
            <div>
              {/* Wrapper ONLY for input + label + icon */}
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  placeholder=" "
                  value={emailFormData.email}
                  onChange={handleEmailChange}
                  onBlur={handleBlur}
                  type="email"
                  className={`w-full bg-white/5 border 
          ${
            emailErrors.email && touched.email
              ? "border-red-500"
              : "border-white/10"
          }
          text-white rounded-md px-4 py-3 pl-12 peer
          focus:outline-none focus:ring-2 focus:ring-[#42A5F5]
          placeholder-transparent`}
                />

                {/* FIXED CENTERED MAIL ICON */}
                <Mail
                  size={20}
                  className="absolute left-4 inset-y-0 my-auto text-gray-400"
                />

                <label
                  htmlFor="email"
                  className={`
          absolute left-12 pointer-events-none transition-all duration-200
          ${
            emailFormData.email
              ? "top-[-14px] text-xs text-[#90CAF9] px-2 py-[5px] rounded-md"
              : "top-3 text-base text-gray-300"
          }
          peer-focus:top-[-14px] peer-focus:text-xs peer-focus:text-[#90CAF9]
          peer-focus:px-2 peer-focus:py-[2px] peer-focus:rounded-md
        `}
                >
                  Email Address
                </label>
              </div>

              {/* Error message OUTSIDE the wrapper */}
              {emailErrors.email && touched.email && (
                <p className="text-sm text-red-400 mt-2">{emailErrors.email}</p>
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={20} />
                  Send OTP
                </>
              )}
            </button>
          </form>
        ) : step === "otp" ? (
          <form className="space-y-6" onSubmit={handleOtpSubmit} noValidate>
            <div className="space-y-4">
              <div className="flex justify-center gap-3">
                {renderOtpInputs()}
              </div>
              <input
                type="hidden"
                name="otp"
                value={otpFormData.otp}
                onBlur={handleOtpBlur}
              />

              {otpErrors.otp && touched.otp && (
                <p className="text-sm text-red-400 text-center">
                  {otpErrors.otp}
                </p>
              )}

              <div className="text-center">
                <p className="text-gray-300 text-sm">
                  Enter the 6-digit code sent to{" "}
                  <span className="text-[#90CAF9] font-medium">
                    {emailFormData.email}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Tip: You can paste the entire OTP or use arrow keys to
                  navigate
                </p>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || loading}
                  className={`
                    text-sm transition-colors
                    ${
                      canResend
                        ? "text-[#42A5F5] hover:text-[#90CAF9] cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {canResend ? "Resend OTP" : `Resend OTP in ${resendTimer}s`}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="
                w-full bg-[#1E88E5] hover:bg-[#42A5F5] 
                transition-all font-semibold text-white 
                rounded-xl py-3 shadow-lg shadow-[#1E88E5]/30 
                flex justify-center items-center gap-2
              "
              disabled={loading || otpFormData.otp.length !== 6}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Verify OTP
                </>
              )}
            </button>
          </form>
        ) : (
          <form
            className="space-y-6"
            onSubmit={handlePasswordSubmit}
            noValidate
          >
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    placeholder=" "
                    value={passwordFormData.password}
                    onChange={handlePasswordChange}
                    onBlur={handleBlur}
                    type={showPassword ? "text" : "password"}
                    className={`w-full bg-white/5 border 
            ${
              passwordErrors.password && touched.password
                ? "border-red-500"
                : "border-white/10"
            }
            text-white rounded-md px-4 py-3 pl-12 pr-10 peer
            focus:outline-none focus:ring-2 focus:ring-[#42A5F5]
            placeholder-transparent`}
                  />

                  {/* Left Icon */}
                  <Lock
                    size={20}
                    className="absolute left-4 inset-y-0 my-auto text-gray-400"
                  />

                  {/* Label */}
                  <label
                    htmlFor="password"
                    className={`
            absolute left-12 pointer-events-none transition-all duration-200
            ${
              passwordFormData.password
                ? "top-[-14px] text-xs text-[#90CAF9] px-2 py-[5px] rounded-md"
                : "top-3 text-base text-gray-300"
            }
            peer-focus:top-[-14px] peer-focus:text-xs peer-focus:text-[#90CAF9]
            peer-focus:px-2 peer-focus:py-[2px] peer-focus:rounded-md
          `}
                  >
                    New Password
                  </label>

                  {/* Eye Icon - FIXED CENTER */}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Error below input */}
                {passwordErrors.password && touched.password && (
                  <p className="text-sm text-red-400 mt-2">
                    {passwordErrors.password}
                  </p>
                )}

                {/* Password strength message */}
                <p className="text-xs text-gray-400 mt-1">
                  {passwordFormData.password.length >= 6 ? (
                    <span className="text-green-400">
                      ✓ Password meets minimum length requirement
                    </span>
                  ) : (
                    `Password must be at least 6 characters (${passwordFormData.password.length}/6)`
                  )}
                </p>
              </div>

              <div>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder=" "
                    value={passwordFormData.confirmPassword}
                    onChange={handlePasswordChange}
                    onBlur={handleBlur}
                    type={showConfirmPassword ? "text" : "password"}
                    className={`w-full bg-white/5 border 
            ${
              passwordErrors.confirmPassword && touched.confirmPassword
                ? "border-red-500"
                : "border-white/10"
            }
            text-white rounded-md px-4 py-3 pl-12 pr-10 peer
            focus:outline-none focus:ring-2 focus:ring-[#42A5F5]
            placeholder-transparent`}
                  />

                  <Key
                    size={20}
                    className="absolute left-4 inset-y-0 my-auto text-gray-400"
                  />

                  <label
                    htmlFor="confirmPassword"
                    className={`
            absolute left-12 pointer-events-none transition-all duration-200
            ${
              passwordFormData.confirmPassword
                ? "top-[-14px] text-xs text-[#90CAF9] px-2 py-[5px] rounded-md"
                : "top-3 text-base text-gray-300"
            }
            peer-focus:top-[-14px] peer-focus:text-xs peer-focus:text-[#90CAF9]
            peer-focus:px-2 peer-focus:py-[2px] peer-focus:rounded-md
          `}
                  >
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {/* Errors */}
                {passwordErrors.confirmPassword && touched.confirmPassword && (
                  <p className="text-sm text-red-400 mt-2">
                    {passwordErrors.confirmPassword}
                  </p>
                )}

                {/* Match Indicator */}
                {passwordFormData.password &&
                  passwordFormData.confirmPassword &&
                  passwordFormData.password ===
                    passwordFormData.confirmPassword && (
                    <p className="text-sm text-green-400 mt-2">
                      ✓ Passwords match
                    </p>
                  )}
              </div>
            </div>
            <button
              type="submit"
              className="
      w-full bg-[#1E88E5] hover:bg-[#42A5F5] 
      transition-all font-semibold text-white 
      rounded-xl py-3 shadow-lg shadow-[#1E88E5]/30 
      flex justify-center items-center gap-2
    "
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  Resetting...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  Reset Password
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;

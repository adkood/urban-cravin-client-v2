"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { REGISTERURL } from "@/lib/urls";
import { toast } from "sonner";

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(25, "Password is too long"),
    
  })

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik<SignupFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(signupSchema),
    onSubmit: async (values) => {
      try {
        await axios.post(REGISTERURL, values, {
          headers: { "Content-Type": "application/json" },
        });
        toast.success("Registered Successfully");
        router.push("/login");
      } catch (error) {
        toast.error("Registration failed");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-md shadow-[0_6px_24px_rgba(0,0,0,0.08)] border border-gray-100 p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            URBAN{" "}
            <span className="text-[#9b1e22]">
              CRAVIN’
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Create your account to unlock the latest fits and exclusive drops.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              {...formik.getFieldProps("name")}
              placeholder="Enter your full name"
              className={`w-full px-4 py-3 text-sm border ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b1e22] transition-all placeholder:text-gray-400`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-xs text-red-600">{formik.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps("email")}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 text-sm border ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b1e22] transition-all placeholder:text-gray-400`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-red-600">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps("password")}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-12 text-sm border ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b1e22] transition-all placeholder:text-gray-400`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#9b1e22] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#9b1e22] text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-[#7d171b] active:scale-[0.98] transition-all duration-150"
          >
            Create Account
          </button>
        </form>

        <div className="my-6 h-px bg-gray-200" />

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#9b1e22] font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

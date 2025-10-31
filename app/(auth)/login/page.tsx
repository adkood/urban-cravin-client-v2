"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CLIENT_LOGINURL, LOGINURL } from "@/lib/urls";
import { toast } from "sonner";


const loginSchema = z.object({
  usernameOrEmail: z.string().min(8, "must be at least 2 characters")
    .max(25, "it is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(25, "Password is too long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik<LoginFormValues>({
    initialValues: { usernameOrEmail: "", password: "" },
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: async (values) => {
      try {
        const resp = await axios.post<{
          status : string
          message : string
        }>(CLIENT_LOGINURL, {
          usernameOrEmail : values.usernameOrEmail,
          password : values.password
         });
        if(resp.data.status.toLocaleLowerCase() == "success") {
          toast.success("Welcome back!");
          router.push("/");
        }
        else if (resp.data.status.toLocaleLowerCase() == "error"){
          toast.error("Invalid Credentails!!");
        }
      } catch (error) {
        toast.error("Something went wrong!!");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-md shadow-[0_6px_24px_rgba(0,0,0,0.08)] border border-gray-100 p-8 sm:p-10">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            URBAN{" "}
            <span className="text-[#9b1e22]">
              CRAVIN’
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Sign in to explore the latest drops and exclusive fits.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="usernameOrEmail"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="usernameOrEmail"
              type="text"
              {...formik.getFieldProps("usernameOrEmail")}
              className={`w-full px-4 py-3 text-sm border ${
                formik.touched.usernameOrEmail && formik.errors.usernameOrEmail
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b1e22] transition-all placeholder:text-gray-400`}
              placeholder="you@example.com"
            />
            {formik.touched.usernameOrEmail && formik.errors.usernameOrEmail && (
              <p className="mt-1 text-xs text-red-600">
                {formik.errors.usernameOrEmail}
              </p>
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
                className={`w-full px-4 py-3 text-sm border ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b1e22] transition-all placeholder:text-gray-400`}
                placeholder="••••••••"
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

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-[#9b1e22] font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#9b1e22] text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-[#7d171b] active:scale-[0.98] transition-all duration-150"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 h-px bg-gray-200" />

        {/* Sign up */}
        <p className="text-center text-sm text-gray-600">
          New here?{" "}
          <Link
            href="/register"
            className="text-[#9b1e22] font-semibold hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

"use client";

import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { forgotPassword } from "@/data/user"; 

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const router = useRouter();

  const formik = useFormik<ForgotPasswordValues>({
    initialValues: {
      email: "",
    },
    validationSchema: toFormikValidationSchema(forgotPasswordSchema),
    onSubmit: async (values) => {
      try {
        const response = await forgotPassword(values);

        if (response.success) {
          toast.success(response.data?.message || "Email sent successfully!");
          setTimeout(() => router.push("/login"), 2000);
        } else {
          toast.error(response.error || "Failed to send reset link");
        }
      } catch (error: any) {
        console.error("Forgot password error:", error);
        toast.error(
          error?.message || "An unexpected error occurred, please try again."
        );
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
            Enter your registered email to receive password reset instructions.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
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

          <button
            type="submit"
            className="w-full py-3 bg-[#9b1e22] text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-[#7d171b] active:scale-[0.98] transition-all duration-150"
          >
            Send Reset Link
          </button>
        </form>

        <div className="my-6 h-px bg-gray-200" />

        <p className="text-center text-sm text-gray-600">
          Remember your password?{" "}
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

export default ForgotPassword;

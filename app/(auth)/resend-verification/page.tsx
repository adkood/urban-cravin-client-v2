"use client";
import { useState, useTransition } from "react";
import { z } from "zod";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { resendVerificationEmail } from "@/data/user";
import { toast } from "sonner";
import Link from "next/link";

const resendSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof resendSchema>;

export default function ResendVerificationPage() {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: { email: "" },
    validationSchema: toFormikValidationSchema(resendSchema),
    onSubmit: async (values) => {
      startTransition(async () => {
        const result = await resendVerificationEmail({
            email : values.email
        });
        if (result.success) {
          toast.success(result.data.message);
          setSent(true);
        } else {
          toast.error(result.error);
        }
      });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-md shadow-[0_6px_24px_rgba(0,0,0,0.08)] border border-gray-100 p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            URBAN <span className="text-[#9b1e22]">CRAVIN’</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Didn’t receive your verification email? Enter your address below to resend it.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps("email")}
              className={`w-full px-4 py-3 text-sm border ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b1e22] transition-all placeholder:text-gray-400`}
              placeholder="you@example.com"
              disabled={isPending || sent}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-red-600">{formik.errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending || sent}
            className={`w-full py-3 text-sm font-semibold rounded-lg shadow-sm transition-all duration-150 ${
              sent
                ? "bg-green-500 text-white"
                : "bg-[#9b1e22] text-white hover:bg-[#7d171b] active:scale-[0.98]"
            } disabled:opacity-60`}
          >
            {isPending
              ? "Sending..."
              : sent
              ? "Verification Sent!"
              : "Resend Verification"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 h-px bg-gray-200" />

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-600">
          Back to{" "}
          <Link
            href="/login"
            className="text-[#9b1e22] font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

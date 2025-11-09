"use client"

import Footer from "@/components/common/footer"
import Header from "@/components/common/header"
import { useState } from "react"

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState<"privacy" | "shipping">("privacy")

  return (
    <div className="min-h-screen bg-white">
      <Header/>
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-semibold text-neutral-900">Policies</h1>
          <p className="text-neutral-600 text-sm mt-1">Last Updated: April 3, 2025</p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("privacy")}
              className={`py-4 font-medium text-sm transition-colors border-b-2 ${
                activeTab === "privacy"
                  ? "border-[#9b1e22] text-[#9b1e22]"
                  : "border-transparent text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`py-4 font-medium text-sm transition-colors border-b-2 ${
                activeTab === "shipping"
                  ? "border-[#9b1e22] text-[#9b1e22]"
                  : "border-transparent text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Shipping Policy
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {activeTab === "privacy" && (
          <div className="space-y-8 animate-fadeIn">
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Privacy Policy</h2>
              <p className="text-neutral-700 leading-relaxed mb-6">
                At UrbanCravin, we respect your privacy and are committed to protecting your personal data. This Privacy
                Policy explains how we collect, use, and safeguard your information.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Information We Collect</h3>
              <ul className="space-y-2 text-neutral-700">
                <li className="flex gap-3">
                  <span className="text-[#9b1e22] font-semibold flex-shrink-0">•</span>
                  <span>
                    <strong>Personal Information:</strong> Name, email, phone number, shipping/billing address, and
                    payment details.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#9b1e22] font-semibold flex-shrink-0">•</span>
                  <span>
                    <strong>Usage Information:</strong> IP address, browser type, and website interaction details for
                    analytics and security.
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">How We Use Your Information</h3>
              <ul className="space-y-2 text-neutral-700">
                <li className="flex gap-3">
                  <span className="text-[#9b1e22] font-semibold flex-shrink-0">•</span>
                  <span>To process and deliver your orders.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#9b1e22] font-semibold flex-shrink-0">•</span>
                  <span>To improve our website and customer experience.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#9b1e22] font-semibold flex-shrink-0">•</span>
                  <span>To send promotional offers (you can opt out anytime).</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#9b1e22] font-semibold flex-shrink-0">•</span>
                  <span>To comply with legal obligations.</span>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Data Security</h3>
              <p className="text-neutral-700 leading-relaxed">
                We implement industry-standard security measures to protect your data. However, no online transaction is
                100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Sharing of Information</h3>
              <ul className="space-y-2 text-neutral-700">
                <li className="flex gap-3">
                  <span className="text-[#9b1e22] font-semibold flex-shrink-0">•</span>
                  <span>We do not sell or rent your personal data.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#9b1e22] font-semibold flex-shrink-0">•</span>
                  <span>
                    We may share data with logistics partners for order delivery and with payment processors for
                    transactions.
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Your Rights</h3>
              <p className="text-neutral-700 leading-relaxed">
                You can request access, correction, or deletion of your data by contacting{" "}
                <a
                  href="mailto:support@beige-swallow-873243.hostingersite.com"
                  className="text-[#9b1e22] hover:underline"
                >
                  support@beige-swallow-873243.hostingersite.com
                </a>
                .
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Cookies and Tracking</h3>
              <p className="text-neutral-700 leading-relaxed">
                We use cookies to enhance your browsing experience. You can disable cookies in your browser settings.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Policy Updates</h3>
              <p className="text-neutral-700 leading-relaxed">
                We may update this policy periodically. Continued use of our website implies acceptance of any changes.
              </p>
            </section>

            <section className="pt-4 border-t border-neutral-200">
              <p className="text-neutral-600 text-sm">
                For any privacy concerns, contact{" "}
                <a
                  href="mailto:support@beige-swallow-873243.hostingersite.com"
                  className="text-[#9b1e22] hover:underline"
                >
                  support@beige-swallow-873243.hostingersite.com
                </a>
                .
              </p>
            </section>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-8 animate-fadeIn">
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Shipping Policy</h2>
              <p className="text-neutral-700 leading-relaxed mb-6">
                At UrbanCravin, we ensure timely and secure delivery of your orders.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Shipping Timeframe</h3>
              <ul className="space-y-2 text-neutral-700">
                <li className="flex gap-3">
                  <span className="text-[#9b1e22] font-semibold flex-shrink-0">•</span>
                  <span>Orders are processed within 5 to 7 working days before dispatch.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#9b1e22] font-semibold flex-shrink-0">•</span>
                  <span>The complete shipping process and delivery are completed within 7 to 15 working days.</span>
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Shipping Charges</h3>
              <p className="text-neutral-700 leading-relaxed">
                Shipping charges vary based on the delivery location and order value. The final shipping cost will be
                displayed at checkout.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Delivery Partners</h3>
              <p className="text-neutral-700 leading-relaxed">
                We work with multiple logistics providers to ensure efficient delivery.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Delayed Deliveries</h3>
              <p className="text-neutral-700 leading-relaxed">
                UrbanCravin is not responsible for delays due to natural disasters, courier issues, or other unforeseen
                circumstances.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Order Tracking</h3>
              <p className="text-neutral-700 leading-relaxed">
                Once your order is shipped, you will receive a tracking link via email or SMS.
              </p>
            </section>

            <section className="pt-4 border-t border-neutral-200">
              <p className="text-neutral-600 text-sm">
                For shipping-related queries, email us at{" "}
                <a
                  href="mailto:support@beige-swallow-873243.hostingersite.com"
                  className="text-[#9b1e22] hover:underline"
                >
                  support@beige-swallow-873243.hostingersite.com
                </a>
                .
              </p>
            </section>
          </div>
        )}
      </main>

      <Footer/>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>
    </div>
  )
}

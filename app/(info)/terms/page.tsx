import Footer from "@/components/common/footer";
import Header from "@/components/common/header";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2 text-foreground">Terms & Conditions</h2>
          <p className="text-gray-600">Last Updated: April 3, 2025</p>
        </div>

        {/* Intro */}
        <section className="mb-10">
          <p className="text-gray-700 leading-relaxed">
            Welcome to UrbanCravin! These Terms and Conditions outline the rules and regulations for using our website,
            www.urbancravin.com. By accessing or using our website, you agree to comply with these terms. If you do not
            agree, please refrain from using our services.
          </p>
        </section>

        {/* Sections */}
        <div className="space-y-8">
          {/* General Information */}
          <section>
            <h3 className="text-xl font-semibold mb-4" style={{ color: "#9b1e22" }}>
              General Information
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="font-semibold mt-1" style={{ color: "#9b1e22" }}>
                  •
                </span>
                <span>UrbanCravin sells clothing and accessories for men and women across India.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold mt-1" style={{ color: "#9b1e22" }}>
                  •
                </span>
                <span>
                  We reserve the right to modify or update these terms at any time without prior notice. Continued use
                  of our website implies acceptance of any revisions.
                </span>
              </li>
            </ul>
          </section>

          {/* Eligibility */}
          <section>
            <h3 className="text-xl font-semibold mb-4" style={{ color: "#9b1e22" }}>
              Eligibility
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="font-semibold mt-1" style={{ color: "#9b1e22" }}>
                  •
                </span>
                <span>You must be at least 18 years old to make purchases on our website.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold mt-1" style={{ color: "#9b1e22" }}>
                  •
                </span>
                <span>By placing an order, you confirm that all information provided is accurate and complete.</span>
              </li>
            </ul>
          </section>

          {/* Orders and Payments */}
          <section>
            <h3 className="text-xl font-semibold mb-4" style={{ color: "#9b1e22" }}>
              Orders and Payments
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="font-semibold mt-1" style={{ color: "#9b1e22" }}>
                  •
                </span>
                <span>All orders are subject to acceptance and availability.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold mt-1" style={{ color: "#9b1e22" }}>
                  •
                </span>
                <span>Prices listed on our website are final and inclusive of applicable taxes.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold mt-1" style={{ color: "#9b1e22" }}>
                  •
                </span>
                <span>We accept multiple payment methods, including UPI, debit/credit cards, and net banking.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold mt-1" style={{ color: "#9b1e22" }}>
                  •
                </span>
                <span>
                  UrbanCravin reserves the right to cancel orders due to stock unavailability, pricing errors, or
                  payment issues.
                </span>
              </li>
            </ul>
          </section>

          {/* Shipping and Delivery */}
          <section>
            <h3 className="text-xl font-semibold mb-4" style={{ color: "#9b1e22" }}>
              Shipping and Delivery
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="font-semibold mt-1" style={{ color: "#9b1e22" }}>
                  •
                </span>
                <span>We ship across India. The estimated delivery timeframe is between 7 to 15 working days.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold mt-1" style={{ color: "#9b1e22" }}>
                  •
                </span>
                <span>The complete shipping process takes 5 to 7 working days before dispatch.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold mt-1" style={{ color: "#9b1e22" }}>
                  •
                </span>
                <span>
                  Delays due to unforeseen circumstances (e.g., courier issues, natural disasters) are beyond our
                  control.
                </span>
              </li>
            </ul>
          </section>

          {/* Returns, Exchanges, and Refunds */}
          <section>
            <h3 className="text-xl font-semibold mb-4" style={{ color: "#9b1e22" }}>
              Returns, Exchanges, and Refunds
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="font-semibold mt-1" style={{ color: "#9b1e22" }}>
                  •
                </span>
                <span>We maintain a strict no-return and no-refund policy.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold mt-1" style={{ color: "#9b1e22" }}>
                  •
                </span>
                <span>
                  Exchanges are only allowed for size issues (subject to availability), defective or damaged items, or
                  incorrect products sent.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold mt-1" style={{ color: "#9b1e22" }}>
                  •
                </span>
                <span>
                  Customers must contact us within 3 days of receiving the order at
                  support@beige-swallow-873243.hostingersite.com with images of the issue.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold mt-1" style={{ color: "#9b1e22" }}>
                  •
                </span>
                <span>Customers are responsible for return shipping costs for exchanges.</span>
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h3 className="text-xl font-semibold mb-4" style={{ color: "#9b1e22" }}>
              Intellectual Property
            </h3>
            <p className="text-gray-700">
              All content on our website, including logos, images, and designs, is the property of UrbanCravin.
              Unauthorized use is strictly prohibited.
            </p>
          </section>

          {/* Privacy Policy */}
          <section>
            <h3 className="text-xl font-semibold mb-4" style={{ color: "#9b1e22" }}>
              Privacy Policy
            </h3>
            <p className="text-gray-700">
              Your personal data is handled as per our Privacy Policy, which explains how we collect, use, and protect
              your information.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h3 className="text-xl font-semibold mb-4" style={{ color: "#9b1e22" }}>
              Limitation of Liability
            </h3>
            <p className="text-gray-700">
              UrbanCravin is not liable for any indirect, incidental, or consequential damages resulting from website
              use or order fulfillment issues.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-12">
            <h3 className="text-lg font-semibold mb-3" style={{ color: "#9b1e22" }}>
              Questions?
            </h3>
            <p className="text-gray-700">
              For any queries, contact us at{" "}
              <a
                href="mailto:support@beige-swallow-873243.hostingersite.com"
                className="font-semibold hover:underline"
                style={{ color: "#9b1e22" }}
              >
                support@beige-swallow-873243.hostingersite.com
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer/>
    </div>
  )
}

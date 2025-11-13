import Footer from "@/components/common/footer";
import Header from "@/components/common/header";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header/>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
        {/* Title Section */}
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Return & Exchange Policy</h1>
          <p className="text-sm text-gray-500">Last Updated: April 3, 2025</p>
        </div>

        {/* Introduction */}
        <div className="mb-12 rounded-lg bg-gray-50 p-6">
          <p className="text-gray-700 leading-relaxed">
            At UrbanCravin, we prioritize customer satisfaction while maintaining a strict no-return policy.
          </p>
        </div>

        {/* Returns Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Returns</h2>
          <ul className="space-y-4">
            {[
              "Returns are accepted within 7 days of receiving your order.",
              "Items must be unused, unwashed, and in original packaging with tags attached.",
              "To initiate a return, please contact us at support@urbancravin.com with your order details.",
              "Return shipping costs will be borne by the customer unless the item is defective or incorrect.",
              "Please ensure you review your order carefully before confirming your purchase.",
            ].map((item, index) => (
              <li key={index} className="flex gap-4">
                <span className="mt-1 flex-shrink-0 text-lg font-semibold" style={{ color: "#9b1e22" }}>
                  {index + 1}.
                </span>
                <p className="text-gray-700 leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Exchange Policy Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Exchange Policy</h2>
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Exchanges are allowed only in the following cases:
            </h3>
            <ul className="space-y-3 pl-6">
              {[
                "Size issues (only if the requested size is available).",
                "Defective or damaged items received.",
                "Incorrect products sent by UrbanCravin.",
              ].map((item, index) => (
                <li key={index} className="flex gap-3 text-gray-700">
                  <span className="font-semibold" style={{ color: "#9b1e22" }}>
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Exchange Process Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Exchange Process</h2>
          <ul className="space-y-4">
            {[
              "Contact us at support@urbancravin.com within 3 days of delivery with order details and issue images.",
              "The item must be unused, unwashed, and with tags intact in its original packaging.",
              "Customers must bear the cost of shipping the item back for exchange.",
              "Once we receive and verify the returned item, we will process the exchange.",
              "The complete exchange process will be completed within 7–15 business days, including delivery of the exchanged product.",
            ].map((item, index) => (
              <li key={index} className="flex gap-4">
                <span className="mt-1 flex-shrink-0 text-lg font-semibold" style={{ color: "#9b1e22" }}>
                  {index + 1}.
                </span>
                <p className="text-gray-700 leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* No Refunds Section */}
        <section
          className="mb-12 rounded-lg border-l-4 px-6 py-6"
          style={{ borderColor: "#9b1e22", backgroundColor: "#fafafa" }}
        >
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">No Refunds</h2>
          <ul className="space-y-3">
            {[
              "If an exchange is not possible, store credit may be provided at our discretion.",
              "For exchange requests, contact support@urbancravin.com.",
              "Refunds are not provided under any circumstances.",
            ].map((item, index) => (
              <li key={index} className="flex gap-3 text-gray-700">
                <span className="font-semibold" style={{ color: "#9b1e22" }}>
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

       <Footer/>
    </div>
  )
}

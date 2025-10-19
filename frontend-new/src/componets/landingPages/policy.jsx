import React from "react";

const Policy = () => {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto bg-black/90 border border-white/10 rounded-2xl shadow-lg p-8 sm:p-12 backdrop-blur-md">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-2 text-center">
            Privacy Policy
          </h1>
          <p className="text-center text-gray-400 text-sm">
            Effective Date: October 2025
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-200 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p>
              Welcome to <span className="text-primary font-semibold">YourCompany</span>. 
              We are committed to protecting your personal information and your right to privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our website or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Personal details such as name, email, and contact number.</li>
              <li>Billing and shipping addresses.</li>
              <li>Order history and payment references (processed securely via Razorpay).</li>
              <li>Device and browser information for analytics and performance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Process and deliver your orders.</li>
              <li>Send order confirmations, updates, and notifications.</li>
              <li>Improve website performance and user experience.</li>
              <li>Ensure secure transactions and prevent fraud.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Payment Security</h2>
            <p>
              We use <span className="text-primary font-semibold">Razorpay</span> for payment processing. 
              All sensitive payment information is handled securely through their platform. 
              We do not store your card details on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Real-Time Updates</h2>
            <p>
              We may use <span className="text-primary font-semibold">WebSockets</span> or similar technologies to provide 
              real-time updates, such as price changes or payment confirmations, while you’re browsing. 
              These updates happen securely and automatically without refreshing the page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Data Protection</h2>
            <p>
              We implement strict security measures to protect your data against unauthorized access, 
              alteration, or disclosure. However, please note that no system is entirely secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information at any time. 
              To make a request, please contact us at{" "}
              <a
                href="mailto:support@yourcompany.com"
                className="text-blue-400 underline"
              >
                support@yourcompany.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. 
              The latest version will always be available on this page with an updated effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
            <p>
              For any questions or concerns about this Privacy Policy, please reach out at{" "}
              <a
                href="mailto:support@yourcompany.com"
                className="text-blue-400 underline"
              >
                support@yourcompany.com
              </a>.
            </p>
          </section>
        </div>

        <div className="text-center text-gray-500 text-sm mt-10">
          © {new Date().getFullYear()} YourCompany. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default Policy;

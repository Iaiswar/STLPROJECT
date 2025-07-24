

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      {/* 90% width container */}
      <div className="w-[90%] max-w-screen-xl bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 text-white py-8 px-8 rounded-t-2xl">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-blue-100 text-sm">Last Updated: July 12, 2025</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-10">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 mb-4">
              NL Technologies ("we", "our", or "us") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website at http://nltecsolutions.com (the "Site").
            </p>
            <p className="text-gray-700 mb-4">
              We are committed to protecting your data and being transparent about what we collect and how we use it.
            </p>
          </section>

          {/* Reusable Section Component */}
          {[
            {
              title: "1. What Information We Collect",
              content: [
                "We may collect the following types of personal data:",
              ],
              list: [
                "Contact Information: such as your name, email address, phone number, and company name when you contact us via forms or email.",
                "Technical Data: such as your IP address, browser type, device information, referring URLs, and usage patterns through cookies or analytics tools.",
                "Optional Submissions: if you sign up for newsletters, request demos, or apply for jobs, we may collect additional information such as preferences, resumes, etc.",
              ],
            },
            {
              title: "2. How We Use Your Information",
              content: [
                "We may use your information to:",
              ],
              list: [
                "Respond to inquiries and provide customer support.",
                "Improve and optimize our website.",
                "Monitor site performance and troubleshoot errors.",
                "Send you updates, news, or promotional content (only with your consent).",
                "Maintain security and prevent misuse or fraud.",
              ],
            },
            {
              title: "3. Sharing of Information",
              content: [
                "We do not sell your personal data.",
                "We may share your information only with:",
              ],
              list: [
                "Service providers who support our operations (such as hosting or analytics).",
                "Legal authorities if required by law, court order, or to enforce our Terms of Use.",
                "Partners or subsidiaries, where necessary for business functionality.",
              ],
              note: "All third parties are obligated to handle your data securely and in accordance with this policy.",
            },
            {
              title: "4. Your Rights and Choices",
              content: [
                "Depending on your location, you may have the right to:",
              ],
              list: [
                "Access or request a copy of the personal data we hold.",
                "Request correction or deletion of your data.",
                "Object to or restrict certain uses of your data.",
                "Withdraw consent, if processing was based on consent.",
              ],
              note: "To exercise your rights, please contact us using the details below.",
            },
            {
              title: "5. Cookies and Tracking Technologies",
              content: [
                "We use cookies and similar technologies to enhance user experience, track website usage, and gather analytics.",
                "You can control cookies via your browser settings.",
              ],
            },
            {
              title: "6. Data Security",
              content: [
                "We use reasonable physical, electronic, and administrative safeguards to protect your personal data. However, no method of transmission over the Internet is 100% secure.",
              ],
            },
            {
              title: "7. Data Retention",
              content: [
                "We retain your information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required by law.",
              ],
            },
            {
              title: "8. Children's Privacy",
              content: [
                "Our website is not intended for use by children under the age of 13. We do not knowingly collect personal data from children.",
              ],
            },
            {
              title: "9. Third-Party Links",
              content: [
                "Our Site may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. Please read their privacy policies separately.",
              ],
            },
            {
              title: "10. International Users",
              content: [
                "If you access the Site from outside India, you do so on your own initiative and are responsible for compliance with local laws. Your information may be stored and processed in India or other countries where we or our service providers operate.",
              ],
            },
            {
              title: "11. Updates to This Privacy Policy",
              content: [
                "We may update this Privacy Policy from time to time. The latest version will always be posted on this page with the updated date. We encourage you to review it periodically.",
              ],
            },
            {
              title: "12. Contact Us",
              content: [
                "If you have any questions, concerns, or requests related to this Privacy Policy, please contact:",
                "NL Technologies",
              ],
            },
          ].map((section, i) => (
            <section key={i}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">{section.title}</h2>
              {section.content.map((para, j) => (
                <p key={j} className="text-gray-700 mb-4">{para}</p>
              ))}
              {section.list && (
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  {section.list.map((item, k) => (
                    <li key={k}>{item}</li>
                  ))}
                </ul>
              )}
              {section.note && (
                <p className="text-gray-700 mt-2 italic">{section.note}</p>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
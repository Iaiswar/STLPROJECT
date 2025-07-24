
const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      {/* 90% width container */}
      <div className="w-[90%] max-w-screen-xl bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 text-white py-8 px-8 rounded-t-2xl">
          <h1 className="text-3xl font-bold">Terms and Conditions of Use</h1>
          <p className="mt-2 text-blue-100 text-sm">Effective Date: 14 / July / 2025</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-10">
          {/* Reusable Section Component */}
          {[
            {
              title: "Ownership of Site; Agreement to Terms of Use",
              content: [
                `These Terms and Conditions of Use (the "Terms") apply to the NL Technologies website located at http://nltecsolutions.com, and all associated sites linked to it by NL Technologies, its subsidiaries, and affiliates (collectively, the "Site"). The Site is the property of NL Technologies ("NLT").`,
                `BY USING THIS SITE, YOU AGREE TO THESE TERMS. IF YOU DO NOT AGREE, DO NOT USE THIS SITE.`,
                `NLT reserves the right, at its sole discretion, to change, modify, add or remove any part of these Terms at any time. It is your responsibility to check these Terms periodically for changes. Your continued use of the Site following changes means you accept and agree to the changes.`,
              ],
            },
            {
              title: "Content",
              content: [
                `All content on the Site—such as text, graphics, logos, images, audio, video, software code, layout and design—is the property of NLT or its licensors and is protected by copyright, trademark, and other intellectual property laws.`,
                `You may not reproduce, republish, distribute, display, transmit, or otherwise use any Content without prior written permission from NLT, except for personal, non-commercial use.`,
              ],
            },
            {
              title: "Use of Site",
              content: [
                `You agree to use this Site only for lawful purposes and in accordance with these Terms. You may not:`,
              ],
              list: [
                "Attempt unauthorized access to any part of the Site, server, or network.",
                "Use any automated system (bots, scrapers, etc.) to access the Site.",
                "Interfere with the functioning of the Site or any activities conducted on it.",
                "Impersonate any person or misrepresent your identity.",
              ],
              note: `NLT reserves the right to block access to the Site for any user suspected of violating these Terms.`,
            },
            {
              title: "Accounts and Security",
              content: [
                `Some services on the Site may require account creation. You are responsible for maintaining the confidentiality of your account credentials. You agree to notify NLT immediately of any unauthorized use of your account.`,
                `NLT is not liable for any loss or damage resulting from your failure to protect your account information.`,
              ],
            },
            {
              title: "Privacy",
              content: [
                `Your use of the Site is also governed by our Privacy Policy, which is incorporated into these Terms by reference.`,
              ],
            },
            {
              title: "Third-Party Links",
              content: [
                `This Site may contain links to external websites ("Linked Sites"). NLT has no control over Linked Sites and is not responsible for their content, practices, or availability. Access these links at your own risk.`,
              ],
            },
            {
              title: "Disclaimers",
              content: [
                `NLT DOES NOT GUARANTEE THAT THE SITE OR ITS CONTENT WILL BE ERROR-FREE OR UNINTERRUPTED. THE SITE IS PROVIDED "AS IS" AND "AS AVAILABLE." NLT DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.`,
                `You assume full responsibility for your use of the Site and any Linked Sites.`,
              ],
            },
            {
              title: "Limitation of Liability",
              content: [
                `To the maximum extent allowed by law, NLT shall not be liable for any direct, indirect, incidental, special or consequential damages resulting from your use of the Site or reliance on any information presented.`,
              ],
            },
            {
              title: "Indemnification",
              content: [
                `You agree to indemnify and hold harmless NL Technologies, its employees, directors, agents, and affiliates from any claims or liabilities arising from your use of the Site or your violation of these Terms.`,
              ],
            },
            {
              title: "Termination",
              content: [
                `NLT may, at its discretion and without notice, suspend or terminate your access to the Site if you violate these Terms or engage in conduct that NLT deems harmful.`,
              ],
            },
            {
              title: "Governing Law and Jurisdiction",
              content: [
                `These Terms are governed by the laws of India. You agree to submit to the exclusive jurisdiction of the courts located in [Your City, State] for resolution of any disputes.`,
              ],
            },
            {
              title: "International Use",
              content: [
                `NLT makes no representation that the Site or its content is appropriate or available for use outside of India. Access from countries where content is illegal is prohibited.`,
              ],
            },
            {
              title: "Miscellaneous",
              content: [
                `If any provision of these Terms is found unenforceable, that provision will be modified to reflect the intent of the parties, and the rest of the Terms will remain in full effect.`,
                `These Terms constitute the entire agreement between you and NLT regarding your use of the Site and supersede any prior agreements.`,
              ],
            },
            {
              title: "Feedback and Contact",
              content: [
                `Any feedback submitted via this Site shall be deemed non-confidential. NLT is free to use such information without restriction.`,
                `If you have any questions about these Terms, please contact:`,
                `NL Technologies`,
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

export default TermsAndConditions;

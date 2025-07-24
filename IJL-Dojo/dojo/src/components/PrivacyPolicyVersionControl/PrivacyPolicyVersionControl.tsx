

const PrivacyPolicyVersionControl = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      {/* 90% width container */}
      <div className="w-[90%] max-w-screen-xl bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 text-white py-8 px-8 rounded-t-2xl">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <div className="mt-4 space-y-1">
            <p className="text-blue-100 text-sm">Version: 01 02 00 00 B</p>
            <p className="text-blue-100 text-sm">Effective Date: July 12, 2025</p>
            <p className="text-blue-100 text-sm">Last Updated: July 12, 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-10">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 mb-4">
              NL Technologies ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information...
            </p>
          </section>

          {/* Policy Updates and Version History Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">📌 Policy Updates and Version History</h2>
            <p className="text-gray-700 mb-4">
              We may revise this Privacy Policy from time to time. Each version will be identified at the top of the page by its version number and effective date. We encourage users to review this page periodically for the latest information on our privacy practices.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Version History:</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Version: 01 02 00 00 B</strong> — July 12, 2025: Initial release of our Privacy Policy.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyVersionControl;
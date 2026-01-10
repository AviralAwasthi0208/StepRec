import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <button 
            onClick={() => navigate('/')}
            className="mb-6 flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy for StepRec</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: {currentDate}</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
              <p>
                StepRec ("we", "our", or "the extension") is a productivity tool designed to help users record their own interactions and generate step-by-step workflow documentation.
              </p>
              <p className="mt-2">
                We take user privacy seriously. This Privacy Policy explains what data is collected, how it is used, and how it is protected.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Data We Collect</h2>
              <p className="mb-3">
                StepRec collects only the minimum data required to perform its single purpose: generating step-by-step guides.
              </p>
              
              <h3 className="font-medium text-gray-900 mb-2">2.1 User Activity (When Recording Is Enabled)</h3>
              <p className="mb-2">When the user explicitly starts recording, StepRec may collect:</p>
              <ul className="list-disc pl-5 space-y-1 mb-3">
                <li>Mouse clicks</li>
                <li>Keyboard input events (structure only, not sensitive values)</li>
                <li>Page navigation events</li>
                <li>Tab switches during recording</li>
              </ul>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-800">
                ⚠️ Recording does NOT occur unless the user manually starts it.
              </div>

              <h3 className="font-medium text-gray-900 mt-4 mb-2">2.2 Website Content (Optional Screenshots)</h3>
              <p className="mb-2">When recording is active, StepRec may capture:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Screenshots of the visible webpage</li>
                <li>Highlighted regions related to user actions</li>
              </ul>
              <p className="mt-2 text-sm italic">This data is used only to visually represent recorded steps.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data We Do NOT Collect</h2>
              <p className="mb-2">StepRec does not collect:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Personally identifiable information (name, email, address)</li>
                <li>Passwords, credentials, or authentication data</li>
                <li>Financial or payment information</li>
                <li>Health-related information</li>
                <li>Personal communications (emails, messages, chats)</li>
                <li>Location data (GPS or IP-based)</li>
                <li>Browsing history outside of an active recording session</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. How Data Is Used</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-green-700 mb-2">Collected data is used only for:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Generating step-by-step workflow documentation</li>
                    <li>Displaying recorded steps to the user</li>
                    <li>Exporting guides (e.g., PDF)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-red-700 mb-2">Data is never used for:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Advertising</li>
                    <li>Tracking</li>
                    <li>Profiling</li>
                    <li>Analytics unrelated to the extension's purpose</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Storage</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>All recorded data is stored locally on the user's device</li>
                <li>StepRec does not upload data to external servers by default</li>
                <li>Users can clear or delete recorded data at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Sharing</h2>
              <p className="mb-2">We do not:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Sell user data</li>
                <li>Share user data with third parties</li>
                <li>Transfer user data outside the extension</li>
              </ul>
              <p className="mt-2 font-medium">All data remains under the user's control.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Permissions Explanation</h2>
              <p className="mb-3">StepRec uses the following permissions strictly for its functionality:</p>
              <ul className="space-y-2 text-sm">
                <li><code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600 font-mono">activeTab</code> – to capture interactions on the currently active tab after recording starts</li>
                <li><code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600 font-mono">tabs</code> – to detect tab changes during a recording session</li>
                <li><code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600 font-mono">scripting</code> – to inject content scripts for detecting user actions</li>
                <li><code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600 font-mono">storage</code> – to store recorded steps locally</li>
                <li><code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600 font-mono">sidePanel</code> – to display the StepRec interface</li>
                <li><code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600 font-mono">host permissions</code> – to operate on user-selected pages during recording only</li>
              </ul>
              <p className="mt-3 text-sm italic">No permissions are used for background monitoring or hidden data collection.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. User Control</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Recording starts and stops only when initiated by the user</li>
                <li>Recorded steps can be reviewed before export</li>
                <li>Data can be deleted at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Security</h2>
              <p>We implement reasonable safeguards to ensure that:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Data remains local</li>
                <li>No unauthorized access occurs</li>
                <li>No background data collection happens</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy as the product evolves. Any changes will be reflected on this page.
              </p>
            </section>

            <section className="pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact</h2>
              <p className="mb-2">If you have any questions or concerns about privacy, you can contact us at:</p>
              <a 
                href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=aviralawasthi0208@gmail.com&su=Privacy%20Inquiry" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center"
              >
                📧 aviralawasthi0208@gmail.com
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

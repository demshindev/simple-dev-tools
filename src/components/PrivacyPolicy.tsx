import { FiX } from 'react-icons/fi'
import { APP_NAME, WEBSITE_URL } from '../constants'

interface PrivacyPolicyProps {
  isOpen: boolean
  onClose: () => void
}

export default function PrivacyPolicy({ isOpen, onClose }: PrivacyPolicyProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-1.5 sm:p-2">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-2 sm:px-3 py-2 sm:py-3 flex items-center justify-between z-10 gap-1.5 sm:gap-2">
          <h2 className="text-lg font-bold text-gray-800 truncate">
            Privacy Policy
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
            aria-label="Close"
          >
            <FiX size={20} className="text-gray-600" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-2 sm:px-3 py-3 sm:py-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 mb-3 text-xs">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            <section className="mb-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                1. General Information
              </h3>
              <p className="text-gray-600 mb-2 text-xs leading-relaxed">
                {APP_NAME} ("we", "our", or "service") respects your privacy and is committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, and protect information when you use our website.
              </p>
            </section>

            <section className="mb-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                2. Use of Cookies
              </h3>
              <p className="text-gray-600 mb-2 text-xs leading-relaxed">
                We use cookies to improve the functionality of our website and provide you with a personalized experience. 
                Cookies are small text files that are stored on your device when you visit a website.
              </p>
              
              <h4 className="text-sm font-semibold text-gray-700 mb-2 mt-3">
                Types of cookies we use:
              </h4>
              <ul className="list-disc pl-5 text-gray-600 mb-2 space-y-1.5 text-xs">
                <li>
                  <strong>Essential cookies:</strong> These cookies are necessary for the website to function and cannot be disabled in our systems. 
                  They are usually set in response to your actions, such as setting privacy preferences, logging in, or filling out forms.
                </li>
                <li>
                  <strong>Functional cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization. 
                  They may be set by us or by third-party service providers whose services we have added to our pages.
                </li>
                <li>
                  <strong>Analytics cookies:</strong> These cookies allow us to count visits and traffic sources 
                  so we can measure and improve the performance of our site.
                </li>
              </ul>

              <p className="text-gray-600 mb-2 text-xs leading-relaxed">
                You can manage cookie settings through your browser settings. 
                However, disabling some types of cookies may affect the functionality of the website.
              </p>
            </section>

            <section className="mb-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                3. Information Collection and Use
              </h3>
              <p className="text-gray-600 mb-2 text-xs leading-relaxed">
                {APP_NAME} is a fully client-side application that runs in your browser. 
                We do not collect or transmit your personal information to our servers. 
                All data is processed locally on your device.
              </p>
              <p className="text-gray-600 mb-2 text-xs leading-relaxed">
                We may only collect technical information to improve service performance:
              </p>
              <ul className="list-disc pl-5 text-gray-600 mb-2 space-y-1.5 text-xs">
                <li>Information about your browser and device</li>
                <li>IP address (for visit statistics)</li>
                <li>Cookie consent information</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                4. Data Storage
              </h3>
              <p className="text-gray-600 mb-2 text-xs leading-relaxed">
                All data you enter into the tools on our website is processed exclusively in your browser. 
                We do not store or transmit this data to our servers or third parties.
              </p>
            </section>

            <section className="mb-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                5. Your Rights
              </h3>
              <p className="text-gray-600 mb-2 text-xs leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc pl-5 text-gray-600 mb-2 space-y-1.5 text-xs">
                <li>Manage cookie settings through your browser</li>
                <li>Delete stored cookies at any time</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                6. Changes to Privacy Policy
              </h3>
              <p className="text-gray-600 mb-2 text-xs leading-relaxed">
                We may update our Privacy Policy from time to time. 
                We will notify you of any changes by posting the new Privacy Policy on this page 
                and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                7. Contact Information
              </h3>
              <p className="text-gray-600 mb-2 text-xs leading-relaxed">
                If you have any questions about this Privacy Policy, 
                please contact us through our{' '}
                <a
                  href={WEBSITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 underline font-medium"
                >
                  website
                </a>
                .
              </p>
            </section>
          </div>
        </div>
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-3 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

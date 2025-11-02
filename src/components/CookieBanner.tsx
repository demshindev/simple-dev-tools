import { useState, useEffect } from 'react'
import { FiShield } from 'react-icons/fi'

interface CookieBannerProps {
  onPrivacyClick: () => void
}

export default function CookieBanner({ onPrivacyClick }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 min-w-[300px]">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-2xl border border-gray-200 p-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="flex-shrink-0 mt-0.5">
              <FiShield className="text-primary-600" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                We use cookies
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We use cookies to improve site functionality and personalize content. 
                By continuing to use the site, you agree to our{' '}
                <button
                  onClick={onPrivacyClick}
                  className="text-primary-600 hover:text-primary-700 underline font-medium inline"
                >
                  Privacy Policy
                </button>
                .
              </p>
            </div>
          </div>
          <div className="w-full">
            <button
              onClick={handleAccept}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium text-sm"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

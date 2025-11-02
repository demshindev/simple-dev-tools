import { FiGithub, FiGlobe } from 'react-icons/fi'
import { WEBSITE_URL, APP_NAME, GITHUB_REPO, LICENSE_URL } from '../constants'

interface FooterProps {
  onPrivacyClick: () => void
}

export default function Footer({ onPrivacyClick }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-gray-300 bg-transparent">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <div className="text-center sm:text-left">
              Created by{' '}
              <a
                href={WEBSITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium transition"
              >
                {WEBSITE_URL.replace('https://', '')}
              </a>
            </div>
            <span className="hidden sm:inline text-gray-400">•</span>
            <div className="text-center sm:text-left">
              © {currentYear} {APP_NAME}
            </div>
            <span className="hidden sm:inline text-gray-400">•</span>
            <button
              onClick={onPrivacyClick}
              className="text-center sm:text-left text-primary-600 hover:text-primary-700 transition"
            >
              Privacy Policy
            </button>
            <span className="hidden sm:inline text-gray-400">•</span>
            <div className="text-center sm:text-left">
              Licensed under{' '}
              <a
                href={LICENSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 transition"
              >
                MIT License
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition"
              aria-label="GitHub repository"
            >
              <FiGithub size={18} />
            </a>
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition"
              aria-label={WEBSITE_URL.replace('https://', '')}
            >
              <FiGlobe size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}


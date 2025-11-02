import { FiGithub, FiGlobe } from 'react-icons/fi'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-gray-300 bg-transparent">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <div className="text-center sm:text-left">
              Created by{' '}
              <a
                href="https://demshin.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium transition"
              >
                demshin.dev
              </a>
            </div>
            <span className="hidden sm:inline text-gray-400">•</span>
            <div className="text-center sm:text-left">
              © {currentYear} SimpleDevTools
            </div>
            <span className="hidden sm:inline text-gray-400">•</span>
            <div className="text-center sm:text-left">
              Licensed under{' '}
              <a
                href="https://github.com/demshindev/simple-dev-tools/blob/main/LICENSE"
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
              href="https://github.com/demshindev/simple-dev-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition"
              aria-label="GitHub repository"
            >
              <FiGithub size={18} />
            </a>
            <a
              href="https://demshin.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition"
              aria-label="demshin.dev"
            >
              <FiGlobe size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}


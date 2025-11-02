import { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'

export default function CaseConverter() {
  const [input, setInput] = useState('')
  const [caseType, setCaseType] = useState<'lower' | 'upper' | 'title' | 'camel' | 'snake' | 'kebab'>('lower')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const convertCase = () => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    let result = ''
    switch (caseType) {
      case 'lower':
        result = input.toLowerCase()
        break
      case 'upper':
        result = input.toUpperCase()
        break
      case 'title':
        result = input
          .toLowerCase()
          .split(/\s+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        break
      case 'camel':
        result = input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase()
        }).replace(/\s+/g, '')
        break
      case 'snake':
        result = input.replace(/\s+/g, '_').toLowerCase()
        break
      case 'kebab':
        result = input.replace(/\s+/g, '-').toLowerCase()
        break
    }
    setOutput(result)
  }

  const copyToClipboard = async () => {
    if (output) {
      try {
        await navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (e) {
        if (import.meta.env.DEV) {
          console.error('Failed to copy to clipboard:', e)
        }
      }
    }
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Case Converter</h2>
      
      <div className="mb-3 sm:mb-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Conversion type:</label>
        <select
          value={caseType}
          onChange={(e) => setCaseType(e.target.value as typeof caseType)}
          className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="lower">lowercase</option>
          <option value="upper">UPPERCASE</option>
          <option value="title">Title Case</option>
          <option value="camel">camelCase</option>
          <option value="snake">snake_case</option>
          <option value="kebab">kebab-case</option>
        </select>
      </div>

      <div className="mb-3 sm:mb-4">
        <button
          onClick={convertCase}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Convert
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Input text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter text..."
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Result
            </label>
            {output && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-xs sm:text-sm text-primary-600 hover:text-primary-700"
              aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
            >
              {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm bg-gray-50 focus:outline-none"
            placeholder="Result will appear here..."
          />
        </div>
      </div>
    </div>
  )
}


import { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'

export default function UrlEncoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input))
      } else {
        setOutput(decodeURIComponent(input))
      }
    } catch (e) {
      setOutput('Error: invalid format')
    }
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
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">URL Encoder/Decoder</h2>
      
      <div className="mb-4 sm:mb-6">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Mode:</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode('encode')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
              mode === 'encode'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Encode (Text → URL)
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
              mode === 'decode'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Decode (URL → Text)
          </button>
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <button
          onClick={handleConvert}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            {mode === 'encode' ? 'Text to encode' : 'URL string'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder={mode === 'encode' ? 'Enter text...' : 'Enter URL string...'}
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


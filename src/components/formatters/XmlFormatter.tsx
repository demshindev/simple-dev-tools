import { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'

function formatXML(xml: string): string {
  let formatted = ''
  let indent = 0
  const tab = '  '

  xml.split(/>\s*</).forEach((node) => {
    if (node.match(/^\//)) {
      indent--
    }
    formatted += tab.repeat(Math.max(0, indent)) + '<' + node + '>\n'
    if (node.match(/^[^\/!]/) && !node.match(/\/$/)) {
      indent++
    }
  })

  return formatted.trim()
}

function minifyXML(xml: string): string {
  return xml.replace(/>\s+</g, '><').trim()
}

export default function XmlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const format = () => {
    setError('')
    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      setOutput(formatXML(input))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid XML')
      setOutput('')
    }
  }

  const minify = () => {
    setError('')
    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      setOutput(minifyXML(input))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid XML')
      setOutput('')
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
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">XML Formatter</h2>
      
      <div className="mb-3 sm:mb-4 flex flex-wrap gap-2">
        <button
          onClick={format}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Format
        </button>
        <button
          onClick={minify}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Minify
        </button>
      </div>

      {error && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 text-xs sm:text-sm bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Input XML
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder='<root><item>Value</item></root>'
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


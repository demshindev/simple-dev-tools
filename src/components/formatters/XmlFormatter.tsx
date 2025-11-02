import { useState, useEffect, useRef } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'

const parser = new XMLParser({ ignoreAttributes: false, preserveOrder: false })
const builder = new XMLBuilder({ 
  ignoreAttributes: false,
  format: true,
  indentBy: '  '
})

function formatXML(xml: string): string {
  try {
    const obj = parser.parse(xml)
    return builder.build(obj)
  } catch (e) {
    throw new Error('Invalid XML')
  }
}

function minifyXML(xml: string): string {
  try {
    const obj = parser.parse(xml)
    const minBuilder = new XMLBuilder({ 
      ignoreAttributes: false,
      format: false
    })
    return minBuilder.build(obj)
  } catch (e) {
    throw new Error('Invalid XML')
  }
}

export default function XmlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'format' | 'minify'>('format')
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      return
    }

    try {
      setError('')
      if (mode === 'format') {
        setOutput(formatXML(input))
      } else {
        setOutput(minifyXML(input))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid XML')
      setOutput('')
    }
  }, [input, mode])

  const copyToClipboard = async () => {
    if (output) {
      try {
        await navigator.clipboard.writeText(output)
        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current)
        }
        setCopied(true)
        copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
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
      
      <div className="mb-3 sm:mb-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Mode:</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode('format')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
              mode === 'format'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Format
          </button>
          <button
            onClick={() => setMode('minify')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
              mode === 'minify'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Minify
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 text-xs sm:text-sm bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
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


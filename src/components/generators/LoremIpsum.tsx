import { useState, useEffect, useRef } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'
import { loremIpsum } from 'lorem-ipsum'

function generateLoremIpsum(type: 'words' | 'sentences' | 'paragraphs', count: number): string {
  return loremIpsum({
    count,
    units: type === 'words' ? 'words' : type === 'sentences' ? 'sentences' : 'paragraphs',
    format: 'plain'
  })
}

export default function LoremIpsum() {
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs')
  const [count, setCount] = useState(3)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  const handleGenerate = () => {
    setOutput(generateLoremIpsum(type, count))
  }

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
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Lorem Ipsum Generator</h2>
      
      <div className="mb-3 sm:mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="words">Words</option>
            <option value="sentences">Sentences</option>
            <option value="paragraphs">Paragraphs</option>
          </select>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Count:</label>
          <input
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <button
          onClick={handleGenerate}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Generate
        </button>
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
          className="w-full h-64 sm:h-96 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm bg-gray-50 focus:outline-none"
          placeholder="Generated text will appear here..."
        />
      </div>
    </div>
  )
}


import { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'

function formatSQL(sql: string): string {
  let formatted = sql
    .replace(/\s+/g, ' ')
    .trim()

  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER',
    'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'GROUP', 'BY', 'ORDER',
    'HAVING', 'AS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'INSERT',
    'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
    'ALTER', 'DROP', 'INDEX', 'UNION', 'ALL', 'DISTINCT', 'LIMIT',
    'OFFSET', 'INTERSECT', 'EXCEPT'
  ]

  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
    formatted = formatted.replace(regex, keyword)
  })

  formatted = formatted
    .replace(/\bSELECT\b/gi, '\nSELECT')
    .replace(/\bFROM\b/gi, '\nFROM')
    .replace(/\bWHERE\b/gi, '\nWHERE')
    .replace(/\bJOIN\b/gi, '\nJOIN')
    .replace(/\bINNER\s+JOIN\b/gi, '\nINNER JOIN')
    .replace(/\bLEFT\s+JOIN\b/gi, '\nLEFT JOIN')
    .replace(/\bRIGHT\s+JOIN\b/gi, '\nRIGHT JOIN')
    .replace(/\bON\b/gi, '\n  ON')
    .replace(/\bAND\b/gi, '\n  AND')
    .replace(/\bOR\b/gi, '\n  OR')
    .replace(/\bGROUP\s+BY\b/gi, '\nGROUP BY')
    .replace(/\bORDER\s+BY\b/gi, '\nORDER BY')
    .replace(/\bHAVING\b/gi, '\nHAVING')

  return formatted.trim()
}

export default function SqlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput('')
      return
    }
    setOutput(formatSQL(input))
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
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">SQL Formatter</h2>
      
      <div className="mb-3 sm:mb-4">
        <button
          onClick={handleFormat}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Format
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Input SQL
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="SELECT * FROM users WHERE id = 1"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Formatted SQL
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


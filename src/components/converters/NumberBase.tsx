import { useState, useEffect, useRef } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'

export default function NumberBase() {
  const [input, setInput] = useState('')
  const [base, setBase] = useState<'decimal' | 'binary' | 'hex' | 'octal'>('decimal')
  const [targetBase, setTargetBase] = useState<'decimal' | 'binary' | 'hex' | 'octal'>('hex')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
      return
    }

    try {
      const trimmedInput = input.trim()

      if (base === targetBase) {
        switch (base) {
          case 'decimal':
            if (!/^-?\d+$/.test(trimmedInput)) {
              setOutput('Error: invalid number format')
              return
            }
            setOutput(trimmedInput)
            return
          case 'binary':
            if (!/^[01]+$/.test(trimmedInput)) {
              setOutput('Error: invalid number format')
              return
            }
            setOutput(trimmedInput)
            return
          case 'hex':
            if (!/^[0-9A-Fa-f]+$/.test(trimmedInput)) {
              setOutput('Error: invalid number format')
              return
            }
            setOutput(trimmedInput.toUpperCase())
            return
          case 'octal':
            if (!/^[0-7]+$/.test(trimmedInput)) {
              setOutput('Error: invalid number format')
              return
            }
            setOutput(trimmedInput)
            return
        }
      }

      let decimal: number

      switch (base) {
        case 'decimal':
          if (!/^-?\d+$/.test(trimmedInput)) {
            setOutput('Error: invalid number format')
            return
          }
          decimal = parseInt(trimmedInput, 10)
          break
        case 'binary':
          if (!/^[01]+$/.test(trimmedInput)) {
            setOutput('Error: invalid number format')
            return
          }
          decimal = parseInt(trimmedInput, 2)
          break
        case 'hex':
          if (!/^[0-9A-Fa-f]+$/.test(trimmedInput)) {
            setOutput('Error: invalid number format')
            return
          }
          decimal = parseInt(trimmedInput, 16)
          break
        case 'octal':
          if (!/^[0-7]+$/.test(trimmedInput)) {
            setOutput('Error: invalid number format')
            return
          }
          decimal = parseInt(trimmedInput, 8)
          break
      }

      if (isNaN(decimal)) {
        setOutput('Error: invalid number format')
        return
      }

      let result: string
      switch (targetBase) {
        case 'decimal':
          result = decimal.toString(10)
          break
        case 'binary':
          result = decimal.toString(2)
          break
        case 'hex':
          result = decimal.toString(16).toUpperCase()
          break
        case 'octal':
          result = decimal.toString(8)
          break
      }

      setOutput(result)
    } catch (e) {
      setOutput('Conversion error')
    }
  }, [input, base, targetBase])

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

  const baseLabels = {
    decimal: 'Decimal (10)',
    binary: 'Binary (2)',
    hex: 'Hexadecimal (16)',
    octal: 'Octal (8)',
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Number Base Converter</h2>

      <div className="mb-3 sm:mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Source base:</label>
          <select
            value={base}
            onChange={(e) => setBase(e.target.value as typeof base)}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {Object.entries(baseLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Target base:</label>
          <select
            value={targetBase}
            onChange={(e) => setTargetBase(e.target.value as typeof targetBase)}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {Object.entries(baseLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Input number:</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder={base === 'binary' ? '1010' : base === 'hex' ? 'FF' : base === 'octal' ? '17' : '255'}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">Result:</label>
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
          <input
            type="text"
            value={output}
            readOnly
            className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg font-mono bg-gray-50 focus:outline-none"
            placeholder="Result will appear here..."
          />
        </div>
      </div>
    </div>
  )
}


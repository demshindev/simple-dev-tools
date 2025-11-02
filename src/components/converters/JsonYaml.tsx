import { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'

function jsonToYaml(jsonStr: string): string {
  try {
    const obj = JSON.parse(jsonStr)
    return convertToYaml(obj, 0)
  } catch (e) {
    return 'Error: invalid JSON'
  }
}

function convertToYaml(obj: unknown, indent: number): string {
  const indentStr = '  '.repeat(indent)
  let result = ''

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === 'object' && item !== null) {
        result += `${indentStr}- ${convertToYaml(item, indent + 1).trimStart()}\n`
      } else {
        result += `${indentStr}- ${formatValue(item)}\n`
      }
    }
  } else if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result += `${indentStr}${key}:\n${convertToYaml(value, indent + 1)}`
      } else if (Array.isArray(value)) {
        result += `${indentStr}${key}:\n${convertToYaml(value, indent + 1)}`
      } else {
        result += `${indentStr}${key}: ${formatValue(value)}\n`
      }
    }
  }

  return result
}

function formatValue(value: unknown): string {
  if (typeof value === 'string') {
    if (value.includes('\n') || value.includes('"') || value.includes("'")) {
      return `"${value.replace(/"/g, '\\"')}"`
    }
    return value
  }
  if (value === null) return 'null'
  if (typeof value === 'boolean') return value.toString()
  return String(value)
}

function yamlToJson(yamlStr: string): string {
  try {
    const lines = yamlStr.split('\n')
    const obj = parseYaml(lines)
    return JSON.stringify(obj, null, 2)
  } catch (e) {
    return 'Error: invalid YAML'
  }
}

function parseYaml(lines: string[]): Record<string, unknown> | unknown[] {
  let result: Record<string, unknown> | unknown[] = {}
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line || line.startsWith('#')) {
      i++
      continue
    }

    if (line.startsWith('- ')) {
      if (!Array.isArray(result)) {
        const arr: unknown[] = []
        for (const [k, v] of Object.entries(result)) {
          arr.push({ [k]: v })
        }
        result = arr
      }
      const value = line.substring(2).trim()
      if (Array.isArray(result)) {
        result.push(parseValue(value))
      }
      i++
    } else {
      if (Array.isArray(result)) {
        result = {}
      }
      const colonIndex = line.indexOf(':')
      if (colonIndex === -1) {
        i++
        continue
      }

      const key = line.substring(0, colonIndex).trim()
      const value = line.substring(colonIndex + 1).trim()

      if (i + 1 < lines.length && lines[i + 1].match(/^\s+[-]/)) {
        if (!Array.isArray(result)) {
          result[key] = parseArray(lines, i + 1)
        }
        while (i + 1 < lines.length && lines[i + 1].match(/^\s+[-]/)) {
          i++
        }
      } else if (value) {
        if (!Array.isArray(result)) {
          result[key] = parseValue(value)
        }
      } else {
        if (!Array.isArray(result)) {
          result[key] = {}
        }
      }
      i++
    }
  }

  return result
}

function parseArray(lines: string[], startIndex: number): unknown[] {
  const arr: unknown[] = []
  let i = startIndex
  const baseIndent = lines[i].match(/^\s*/)?.[0].length || 0

  while (i < lines.length) {
    const line = lines[i]
    const indent = line.match(/^\s*/)?.[0].length || 0

    if (indent < baseIndent) break
    if (line.trim().startsWith('- ')) {
      arr.push(parseValue(line.trim().substring(2)))
    }
    i++
  }

  return arr
}

function parseValue(value: string): unknown {
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'null') return null
  if (/^-?\d+$/.test(value)) return parseInt(value, 10)
  if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value)
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }
  return value
}

export default function JsonYaml() {
  const [mode, setMode] = useState<'json-yaml' | 'yaml-json'>('json-yaml')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const convert = () => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    if (mode === 'json-yaml') {
      setOutput(jsonToYaml(input))
    } else {
      setOutput(yamlToJson(input))
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
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">JSON ↔ YAML Converter</h2>

      <div className="mb-4 sm:mb-6">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Conversion mode:</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode('json-yaml')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
              mode === 'json-yaml'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            JSON → YAML
          </button>
          <button
            onClick={() => setMode('yaml-json')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
              mode === 'yaml-json'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            YAML → JSON
          </button>
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <button
          onClick={convert}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Convert
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            {mode === 'json-yaml' ? 'JSON' : 'YAML'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder={mode === 'json-yaml' ? '{"key": "value"}' : 'key: value'}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              {mode === 'json-yaml' ? 'YAML' : 'JSON'}
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


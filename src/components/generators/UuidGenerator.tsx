import { useState } from 'react'
import { FiCopy, FiCheck, FiRefreshCw } from 'react-icons/fi'

function generateUUID(version: 4 | 1): string {
  if (version === 4) {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  } else {
    const now = Date.now()
    const random = Math.random() * 0xffffffff
    return 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = c === 'x' ? (now + random) % 16 : ((Math.random() * 16) | 0x8)
      return r.toString(16)
    })
  }
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [version, setVersion] = useState<4 | 1>(4)
  const [copied, setCopied] = useState(false)

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => generateUUID(version))
    setUuids(newUuids)
  }

  const copyToClipboard = async () => {
    if (uuids.length > 0) {
      try {
        await navigator.clipboard.writeText(uuids.join('\n'))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (e) {
        if (import.meta.env.DEV) {
          console.error('Failed to copy to clipboard:', e)
        }
      }
    }
  }

  const copySingle = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error('Failed to copy to clipboard:', e)
      }
    }
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">UUID/GUID Generator</h2>
      
      <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700">Count:</label>
          <input
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
            className="w-16 sm:w-20 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700">Version:</label>
          <select
            value={version}
            onChange={(e) => setVersion(Number(e.target.value) as 4 | 1)}
            className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value={4}>UUID v4 (Random)</option>
            <option value={1}>UUID v1 (Time-based)</option>
          </select>
        </div>
        <button
          onClick={generate}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <FiRefreshCw size={16} />
          <span>Generate</span>
        </button>
        {uuids.length > 0 && (
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            aria-label={copied ? 'Copied all to clipboard' : 'Copy all to clipboard'}
          >
            {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy all'}</span>
          </button>
        )}
      </div>

      {uuids.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Generated UUIDs:
          </label>
          <div className="border border-gray-300 rounded-lg p-2 sm:p-4 bg-gray-50 max-h-64 sm:max-h-96 overflow-y-auto">
            {uuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-1.5 sm:p-2 hover:bg-gray-100 rounded mb-1 group"
              >
                <code className="text-xs sm:text-sm font-mono text-gray-800 break-all">{uuid}</code>
                <button
                  onClick={() => copySingle(uuid)}
                  className="opacity-0 group-hover:opacity-100 transition text-primary-600 hover:text-primary-700 ml-2 flex-shrink-0"
                  aria-label="Copy UUID to clipboard"
                  title="Copy"
                >
                  <FiCopy size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

